import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getWordNextContexts } from '../Redux/LearningHistory/selectors'
import { setWordContextAsSeen } from '../Redux/LearningHistory/actions'
import Video from './Video'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import '../styles/context.css'

import { getAreContextsForWordLoaded } from '../Redux/Context/selectors'
import WordVideoList from './WordVideoList'
import mixpanel from 'mixpanel-browser'

function Context(props) {
  const dispatch = useDispatch()
  const isMobile = useMediaQuery('(max-width:768px)')
  const isSmall = useMediaQuery('(max-width:1600px)')

  const sortedContexts = useSelector(getWordNextContexts(props.wordId))
  const [contextIndex, setContextIndex] = useState(0)
  const [context, setContext] = useState(sortedContexts[contextIndex])
  const [contexts, setContexts] = useState([])
  const areLoaded = useSelector(getAreContextsForWordLoaded(props.wordId))

  useEffect(() => {
    if (areLoaded) {
      setContexts(sortedContexts)
      setContext(sortedContexts[0])
      setContextIndex(0)
    }
  }, [props.wordId, areLoaded])

  function onClickContext(contextId) {
    mixpanel.track('ANOTHER_VIDEO_CHOSEN_FROM_LIST', {
      contextId,
    })

    const newIndex = contexts.findIndex((c) => c.id === contextId)

    setContext(contexts[newIndex])
    setContextIndex(newIndex)
  }

  function onNextVideo() {
    mixpanel.track('ANOTHER_VIDEO')

    dispatch(setWordContextAsSeen(props.wordId, context.id))
    const newIndex = contextIndex + 1 >= contexts.length ? 0 : contextIndex + 1

    setContext(contexts[newIndex])
    setContextIndex(newIndex)
  }

  function onClick() {
    mixpanel.track('NEXT_WORD')

    dispatch(setWordContextAsSeen(props.wordId, context.id))
    props.onGoNext()
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'flex-end',
        marginLeft: isMobile ? 0 : 240,
        height: '100%',
      }}
    >
      <div
        className="context"
        style={{
          width: isMobile ? '100%' : 'calc(100% - 300px)',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div
          className={'content'}
          style={{
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <Video
            id={context?.id}
            videoId={context?.videoId}
            wordId={props.wordId}
          ></Video>
        </div>
        <div className={'content-button-container'}>
          <Button
            variant="contained"
            style={{ marginTop: 20, marginBottom: 30, marginRight: 20 }}
            color="secondary"
            onClick={onNextVideo}
            disabled={contexts.length === 1}
          >
            other video
          </Button>
          <Button
            variant="contained"
            style={{ marginTop: 20, marginBottom: 30 }}
            color="primary"
            onClick={onClick}
          >
            Next
          </Button>
        </div>
      </div>
      {!isSmall && (
        <WordVideoList wordId={props.wordId} onClickContext={onClickContext} />
      )}
    </div>
  )
}

export default Context
