import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import mixpanel from 'mixpanel-browser'
import { getCurrectUserId } from '../Redux/User/selectors'
import { getIsInitialLoadingFinished } from '../Redux/selectors'
import Context from './Context'
import { getPresentedWordsToLearn } from '../Redux/LearningHistory/selectors'
import { setWordAsLearnt } from '../Redux/LearningHistory/actions'

function NewWordsLearning() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const currentUserId = useSelector(getCurrectUserId)
  const isInitialLoadingFinished = useSelector(getIsInitialLoadingFinished)

  const newWordsToLearn = useSelector(getPresentedWordsToLearn)
  const [wordId, setWordId] = useState(null)
  const [newWordsToLearnQueue, setNewWordsToLearnQueue] = useState([
    ...newWordsToLearn,
  ])

  useEffect(() => {
    if (isInitialLoadingFinished) {
      setNewWordsToLearnQueue([...newWordsToLearn])
      setWordId(newWordsToLearn[0])
    }
  }, [isInitialLoadingFinished])

  useEffect(() => {
    if (newWordsToLearn.length === 0 && isInitialLoadingFinished) {
      navigate('/new-words-presentation')
    }
  }, [isInitialLoadingFinished])

  useEffect(() => {
    if (currentUserId) {
      mixpanel.track('NEW_WORDS_LEARNING', {
        userId: currentUserId,
      })
    }
  }, [currentUserId])

  if (!wordId) {
    return null
  }

  function onAfterContext() {
    dispatch(setWordAsLearnt(wordId))

    const newQueue = newWordsToLearnQueue.slice(1)

    if (newQueue.length === 0) {
      navigate('/new-words-presentation')
    }

    setNewWordsToLearnQueue(newQueue)
    setWordId(newQueue[0])
  }

  return (
    <>
      {/* {componentType === 'test' && <>
        <Test
          wordId={wordId}
          onCorrectAnswer={onCorrectAnswer}
          onWrongAnswer={onWrongAnswer}
        ></Test>
      </>} */}
      <Context wordId={wordId} onGoNext={onAfterContext} />
    </>
  )
}

export default NewWordsLearning
