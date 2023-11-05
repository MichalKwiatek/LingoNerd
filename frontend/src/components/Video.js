import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player/youtube'
import '../styles/video-page.css'
import { getContext, getVideoContextsWithTranslations } from '../Redux/Context/selectors'
import { useSelector, useDispatch } from 'react-redux'
import useMediaQuery from '@mui/material/useMediaQuery'
import Popover from 'react-tiny-popover'
import { getWords } from '../Redux/Word/selectors'
import { partsOfSpeech, tenseLabels } from '../utils/conjugationRules'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import { createTranslations, getContextTranslation } from '../Redux/Context/actions'
import conjugateTranslation from '../utils/getVerbLabel'
import { getVideo } from '../Redux/Video/selectors'
import ClipLikes from './ClipLikes'
import VideoLikes from './VideoLikes'
import DoneIcon from '@mui/icons-material/Done'
import Divider from '@mui/material/Divider'
import { v4 as uuidv4 } from 'uuid'
import { Auth } from 'aws-amplify'
import AccountNeededModal from './AccountNeededModal'
import { getIsAuthorized } from '../Redux/User/selectors'
import InfoModal from './InfoModal'
import mixpanel from 'mixpanel-browser'
import ShareButton from './ShareButton'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import AudioPlayer from './AudioPlayer'

function renderWord (word, mainFont, smallerFont, rootVerb) {
  if (!word) {
    return <CircularProgress></CircularProgress>
  }

  if (word.partOfSpeech === 'verb') {
    return (
      <div>
        {(!!rootVerb && word.rootWordId !== word.id) &&
          <div style={{ fontSize: smallerFont, marginBottom: 5 }}>
            {rootVerb.lemma} - {rootVerb.translation}
          </div>}
        <div style={{ fontSize: smallerFont, marginBottom: 5 }}>
          {partsOfSpeech[word.partOfSpeech]} | {tenseLabels[word.tense] || 'infinitive'}
        </div>
        <div style={{ fontSize: mainFont }}>
          {word.lemma} - {conjugateTranslation(word)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ fontSize: smallerFont }}>{partsOfSpeech[word.partOfSpeech]}</div>
      <div style={{ fontSize: mainFont }}>{word.lemma} - {word.translation}</div>
    </div>
  )
}

function renderWordPopup (subtitle, words, violations, possibleTranslations, isMobile, onChooseTranslation) {
  const { translation } = subtitle

  const mainFont = isMobile ? 20 : 30
  const smallerFont = isMobile ? 15 : 20

  if (translation === undefined && possibleTranslations.length === 0) {
    return (<div style={{ backgroundColor: 'white', padding: 10, borderRadius: 4 }}>
      <CircularProgress></CircularProgress>
    </div>)
  }

  if (!translation && possibleTranslations.length > 0) {
    return (
      <div
        style={{
          maxHeight: 150,
          overflow: 'auto',
          marginLeft: violations.left,
          marginRight: violations.right,
          backgroundColor: 'white',
          padding: 10
        }}
      >
        <div style={{ fontSize: smallerFont, paddingBottom: 10 }}>Choose correct translation:</div>
        {possibleTranslations
          .sort((wordX, wordY) => wordY.frequency - wordX.frequency)
          .map((word, index) => (
            <>
              <div key={word.id} style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
                paddingTop: 10,
                paddingBottom: 10
              }}>
                {renderWord(word, mainFont, smallerFont)}
                <IconButton style={{
                  marginLeft: 10,
                  border: '1px solid rgba(0, 0, 0, 0.5)'
                }}
                  onClick={() => onChooseTranslation(subtitle, word)}
                >
                  <DoneIcon />
                </IconButton>
              </div>
              {(index + 1) < possibleTranslations.length && <Divider />}
            </>
          ))}
      </div>
    )
  }

  if (translation.wordId === 'NOT_A_WORD') {
    return (
      <div style={{ backgroundColor: 'white', padding: 10, borderRadius: 4 }}>
        <div style={{ fontSize: mainFont, marginBottom: 5 }}>Not a spanish word / Unknown</div>
      </div>
    )
  }

  const word = words.find(w => w.id === translation.wordId)
  const rootVerb = words.find(w => w.id === word?.rootWordId)

  return (
    <div style={{
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 4,
      marginLeft: violations.left,
      marginRight: violations.right
    }}>
      <div style={{ marginBottom: 10 }}>
        {!!word && <AudioPlayer id={word?.id} buttonVariant={'outlined'} />}
      </div>
      {renderWord(word, mainFont, smallerFont, rootVerb)}
    </div>
  )
}

function getSubtitles (text, translations) {
  const foundWords = [...text.toLowerCase().matchAll(/[a-záéíóúüñ]+/g)]
  const subtitles = []
  let lastIndex = 0

  foundWords
    .sort((x, y) => x.index - y.index)
    .forEach((foundWord, index) => {
      const textStart = foundWord.index
      const textEnd = foundWord.index + foundWord[0].length - 1

      if (textStart !== lastIndex) {
        subtitles.push({
          id: `${textStart}_${textEnd}`,
          text: text.substring(lastIndex, textStart),
          type: 'filler'
        })
      }

      const translation = translations.find(t => t.textStart === textStart && t.textEnd === textEnd)
      subtitles.push({
        id: `${textStart}_${textEnd}`,
        text: text.substring(textStart, textEnd + 1),
        translation,
        type: 'translation'
      })

      lastIndex = textEnd + 1
    })

  if (lastIndex < text.length) {
    subtitles.push(({
      text: text.substring(lastIndex, text.length),
      type: 'filler'
    }))
  }

  return subtitles
}

function removeTime (originalUrl) {
  if (!originalUrl) {
    return ''
  }

  const url = new URL(originalUrl)
  url.searchParams.delete('t')
  return url.toString()
}

function Video (props) {
  const dispatch = useDispatch()
  const isMobile = useMediaQuery('(max-width:768px)')

  const words = useSelector(getWords)
  const context = useSelector(getContext(props.id))
  const videoContexts = useSelector(getVideoContextsWithTranslations(props.videoId))
  const video = useSelector(getVideo(props.videoId))

  const startingTime = Math.max(Math.floor(context?.startTime - 1), 0)

  const isAuthorized = useSelector(getIsAuthorized)
  const [isForbiddenModalOpen, setIsForbiddenModalOpen] = useState(false)
  const [isSubtitleInfoModalOpen, setIsSubtitleInfoModalOpen] = useState(false)

  const [currentContextId, setCurrentContextId] = useState(getContextIdWithTime(startingTime))
  const [possibleTranslations, setPossibleTranslations] = useState([])

  const [isPopoverOpen, setIsPopoverOpen] = useState({})
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [isNewVideo, setIsNewVideo] = useState(false)
  const boxContainerRef = useRef()
  const timer = useRef(null)
  const currentContext = videoContexts.find(c => c.id === currentContextId)
  const currentContextIndex = videoContexts.findIndex(c => c.id === currentContextId)
  const videoElement = useRef()

  useEffect(() => {
    const wasSubtitleInfoShown = localStorage.getItem('SUBTITLE_INFO_SHOWN')

    if (!wasSubtitleInfoShown) {
      setIsSubtitleInfoModalOpen(true)

      localStorage.setItem('SUBTITLE_INFO_SHOWN', true)
    }
  }, [])

  useEffect(() => {
    if (video?.url || context?.url) {
      mixpanel.track('VIDEO_PLAYED', {
        url: video?.url || context?.url
      })
    }
  }, [video?.url || context?.url])

  useEffect(() => {
    clearInterval(timer.current)
    setIsNewVideo(true)
    setIsPlaying(true)
    setCurrentContextId(getContextIdWithTime(startingTime))
  }, [props.id])

  useEffect(() => {
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  const onPossibleTranslations = (translations) => {
    setPossibleTranslations(translations)
  }

  const setPopover = (translationId, isOpen) => {
    setPossibleTranslations([])
    const [textStart, textEnd] = translationId.split('_').map(n => parseInt(n))

    const text = currentContext.subtitle.slice(textStart, textEnd + 1)

    dispatch(getContextTranslation({ textStart, textEnd, contextId: currentContextId, text, onPossibleTranslations }))
    setIsPlaying(false)
    setIsPopoverOpen({ [translationId]: isOpen })
  }

  function getContextIdWithTime (time) {
    const availableContexts = videoContexts
      .filter(context => context.startTime < time)

    if (availableContexts.length === 0) {
      return null
    }

    return availableContexts.reduce(function (prev, curr) {
      return (prev.startTime > curr.startTime) ? prev : curr
    }).id
  }

  function onStart () {
    setIsNewVideo(true)

    timer.current = setTimeout(() => setIsNewVideo(false), 3000)
  }

  const onTimeChanged = (time) => {
    const current = getContextIdWithTime(time)

    if (current !== currentContextId) {
      setIsPopoverOpen({})
    }
    setCurrentContextId(current)
  }

  const onChooseTranslation = (subtitle, word) => {
    const [textStart, textEnd] = subtitle.id.split('_').map(n => parseInt(n))

    const translation = {
      id: uuidv4(),
      videoId: props.videoId,
      contextId: currentContextId,

      text: subtitle.text,
      textStart,
      textEnd,

      wordId: word.id,
      rootWordId: word.rootWordId,
      flashcardWordId: word.flashcardWordId
    }

    if (!isAuthorized) {
      setIsForbiddenModalOpen(true)
      return
    }

    Auth.currentSession().then(data => {
      const token = data.getIdToken().getJwtToken()

      dispatch(createTranslations([translation], [word], () => { }, () => { }, token))
    })
  }

  const onPreviousSubtitle = () => {
    setIsPlaying(false)
    const newContext = videoContexts[currentContextIndex - 1]
    videoElement.current.seekTo(Math.floor(newContext.startTime + 1))
  }

  const onNextSubtitle = () => {
    setIsPlaying(false)
    const newContext = videoContexts[currentContextIndex + 1]
    videoElement.current.seekTo(Math.floor(newContext.startTime + 1))
  }

  const onFirstSubtitle = () => {
    const newContext = videoContexts
      .sort((x, y) => x.startTime - y.startTime)[0]

    if (!newContext) {
      return
    }

    videoElement.current.seekTo(newContext.startTime)
  }

  return (
    <div
      className="video-page"
      style={{
        paddingTop: isMobile ? 0 : 30,
        width: isMobile ? '100%' : 'initial',
        flexDirection: 'column'
      }}>
      <InfoModal
        isModalOpen={isSubtitleInfoModalOpen}
        setIsModalOpen={setIsSubtitleInfoModalOpen}
        description={'Remember you can click on subtitles to find out the meaning of each word'}
      />
      <AccountNeededModal isModalOpen={isForbiddenModalOpen} setIsModalOpen={setIsForbiddenModalOpen} />
      <div
        className='video'
        style={{ position: 'relative' }}
        onMouseOver={() => setIsHovering(true)}
        onMouseOut={() => setIsHovering(false)}
      >
        <ReactPlayer
          ref={videoElement}
          url={`${removeTime(video?.url || context?.url)}?start=${startingTime}`}
          controls={true}
          playing={isPlaying}
          config={{
            youtube: {
              playerVars: { autoplay: 1, cc_load_policy: 0, rel: 0 }
            }
          }}
          onProgress={e => onTimeChanged(e.playedSeconds)}
          width={isMobile ? '100%' : 1000}
          height={(window.innerHeight - 230)}
          progressInterval={100}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onStart={onStart}
        />
        <div
          ref={boxContainerRef}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            bottom: (isHovering || !isPlaying || isNewVideo)
              ? (isMobile ? 60 : 50)
              : 3,
            transition: 'bottom 0.10s ease 0s'
          }}
        >
          <div style={{
            fontSize: isMobile ? 20 : 30,
            marginTop: 15,
            backgroundColor: 'rgba(0, 0, 0, .9)',
            padding: 5,
            color: '#fff',
            textAlign: 'center'
          }}>
            {!currentContext && !isNewVideo && videoContexts.length > 0 && <div
              style={{ cursor: 'pointer' }}
              onClick={onFirstSubtitle}
            >Click to fast-forward to the first subtitle</div>}
            {currentContext && currentContextIndex !== 0 &&
              <ArrowBackIosIcon
                style={isMobile ? { cursor: 'pointer', height: 15 } : { cursor: 'pointer', height: 19 }}
                onClick={onPreviousSubtitle} />}
            {currentContext &&
              getSubtitles(currentContext.subtitle, (currentContext.translations || []))
                .map((subtitle, index) => (
                  <React.Fragment key={index}>
                    {
                      subtitle.type === 'filler'
                        ? <span>{subtitle.text}</span>
                        : (
                          <Popover
                            isOpen={isPopoverOpen[subtitle.id]}
                            positions={['top']}
                            content={({ violations, nudgedLeft, nudgedTop }) => {
                              return renderWordPopup(subtitle, words, violations, possibleTranslations, isMobile, onChooseTranslation)
                            }}
                            parentElement={boxContainerRef.current ?? undefined}
                            reposition={true}
                            onClickOutside={() => { setIsPlaying(true); setIsPopoverOpen({}) }}
                          >
                            <span
                              style={(props.wordId && subtitle.translation?.flashcardWordId === props.wordId)
                                ? { color: 'orange', cursor: 'pointer' }
                                : { cursor: 'pointer', height: 19 }}
                              onClick={() => setPopover(subtitle.id, true)}
                            >
                              {subtitle.text}
                            </span>
                          </Popover>
                          )
                    }
                  </React.Fragment>
                ))}
            {currentContext && currentContextIndex !== (videoContexts.length - 1) &&
              <ArrowForwardIosIcon
                style={isMobile ? { cursor: 'pointer', height: 15 } : { cursor: 'pointer', height: 19 }}
                onClick={onNextSubtitle} />}
          </div>
        </div>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 10
      }}>
        {
          props.id
            ? (<ClipLikes
              videoId={props.videoId}
              contextId={props.id}
              wordId={props.wordId}
            />)
            : <VideoLikes videoId={props.videoId} />
        }
        <ShareButton videoId={props.videoId} />
      </div>
    </div>
  )
}

export default Video
