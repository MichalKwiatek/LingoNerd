import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import useMediaQuery from '@mui/material/useMediaQuery'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import '../styles/placement.css'
import Typography from '@mui/material/Typography'

import ReactPlayer from 'react-player'
import '../styles/add-video.css'
import { createTranslations, fetchVideo, updateSubtitle } from '../Redux/Context/actions'
import Translation from './Translation'
import { v4 as uuidv4 } from 'uuid'
import { getVideo } from '../Redux/Video/selectors'
import { getVideoContexts } from '../Redux/Context/selectors'
import { Auth } from 'aws-amplify'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

function CheckSubtitles () {
  const isMobile = useMediaQuery('(max-width:768px)')
  const dispatch = useDispatch()
  const { videoId } = useParams()

  const video = useSelector(getVideo(videoId))
  const videoSubtitles = useSelector(getVideoContexts(video?.id))
  const [language, setLanguage] = useState(null)
  const [link, setLink] = useState('')

  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false)

  const [subtitles, setSubtitles] = useState([])
  const [subtitlesIndex, setSubtitlesIndex] = useState(-1)

  const [selectedWords, setSelectedWords] = useState([])

  useEffect(() => {
    if (videoId) {
      dispatch(fetchVideo(videoId))
    }
  }, [videoId])

  useEffect(() => {
    if (video) {
      setLink(video.url)
      setLanguage(video.language)
      setSubtitles(videoSubtitles.sort((sX, sY) => sX.startTime - sY.startTime))
      setSubtitlesIndex(0)
    }
  }, [video])

  const onSuccess = () => {
    const subtitleText = subtitles[subtitlesIndex].subtitle
    const contextsWithSameTextIds = subtitles
      .filter(s => s.subtitle === subtitleText)
      .map(s => s.id)

    setSubtitles(subtitles.filter((s, index) => !contextsWithSameTextIds.includes(s.id) ||
      index <= subtitlesIndex))

    setSelectedWords([])
  }

  const onFailure = () => {
    setIsFailureModalOpen(true)
  }

  const onUpdateSuccess = (contextId, text) => {
    setSubtitles(subtitles
      .map(s => {
        if (s.id === contextId) {
          return {
            ...s,
            subtitle: text
          }
        }

        return { ...s }
      }))
  }

  const updateSubtitleText = (text) => {
    dispatch(updateSubtitle(subtitles[subtitlesIndex]?.id, text, onUpdateSuccess))
  }

  const onAddTranslations = () => {
    if (selectedWords.some(translation => translation.possibleWords.length !== 1)) {
      return
    }

    const subtitleText = subtitles[subtitlesIndex].subtitle
    const contextsWithSameTextIds = subtitles
      .filter(s => s.subtitle === subtitleText)
      .map(s => s.id)

    const translations = contextsWithSameTextIds.map(contextId =>
      selectedWords.map(translation => ({
        id: uuidv4(),
        videoId: translation.videoId,
        contextId,

        text: translation.text,
        textStart: translation.textStart,
        textEnd: translation.textEnd,

        wordId: translation.possibleWords[0].id,
        rootWordId: translation.possibleWords[0].rootWordId,
        flashcardWordId: translation.possibleWords[0].flashcardWordId
      }))
    ).flat()

    Auth.currentSession().then(data => {
      const token = data.getIdToken().getJwtToken()

      dispatch(createTranslations(translations, [], onSuccess, onFailure, token))
    })
  }

  return (
    <div style={{ padding: 20, position: 'relative' }}>
      <Modal
        open={isFailureModalOpen}
        onClose={() => setIsFailureModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Adding subtitle failed
          </Typography>
          <Button variant="contained" onClick={() => setIsFailureModalOpen(false)}>
            Close
          </Button>
        </Box>
      </Modal>
      <Typography id="modal-modal-title" variant="h5" component="h2" style={{ marginTop: 15 }}>
        Generate translations:
      </Typography>

      {link && <ReactPlayer
        url={link}
        controls={true}
        config={{
          youtube: {
            playerVars: { autoplay: 0, cc_load_policy: 1, cc_lang_pref: 'es-419' }
          }
        }}
        width={isMobile ? '100%' : 1000}
        height={isMobile ? 270 : 400}
      />}

      {(subtitles.length > 0) && (
        <div style={{ marginTop: 20 }}>
          <Translation
            selectedWords={selectedWords}
            setSelectedWords={setSelectedWords}
            text={subtitles[subtitlesIndex]?.subtitle || ''}
            videoId={videoId}
            contextId={subtitles[subtitlesIndex]?.id}
            language={language}
            updateSubtitleText={updateSubtitleText}
          />
          <>
            <Button
              variant={'contained'}
              onClick={() => setSubtitlesIndex(subtitlesIndex - 1)}
              disabled={subtitlesIndex === 0}
            >
              Previous subtitle
            </Button>
            <Button
              variant={'contained'}
              onClick={() => setSubtitlesIndex(subtitlesIndex + 1)}
              disabled={subtitlesIndex === subtitles.length - 1}
              style={{ marginLeft: 20 }}
            >
              Next subtitle
            </Button>
          </>
        </div>
      )}
      <div>
        <Button
          variant="contained"
          style={{ marginTop: 20, marginBottom: 30 }}
          color="secondary"
          onClick={onAddTranslations}
          disabled={selectedWords.length === 0 ||
            selectedWords.some(translation => translation.possibleWords.length !== 1)}
        >
          Add translations
      </Button>
      </div>
    </div>
  )
}

export default CheckSubtitles
