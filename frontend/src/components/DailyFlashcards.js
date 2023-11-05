import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getWordsToReviewToday } from '../Redux/LearningHistory/selectors'
import { getIsInitialLoadingFinished } from '../Redux/selectors'
import mixpanel from 'mixpanel-browser'
import { getCurrectUserId } from '../Redux/User/selectors'
import Context from './Context'
import { setWordAsSeen } from '../Redux/LearningHistory/actions'
import { getAreContextsForWordLoaded } from '../Redux/Context/selectors'
import { fetchContexts } from '../Redux/Context/actions'

function DailyFlashcards () {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const currentUserId = useSelector(getCurrectUserId)

  const wordsToReviewToday = useSelector(getWordsToReviewToday)
  const isInitialLoadingFinished = useSelector(getIsInitialLoadingFinished)

  const [flashcardId, setFlascardId] = useState(null)
  const [wordsQueue, setWordsQueue] = useState(wordsToReviewToday)
  const areLoaded = useSelector(getAreContextsForWordLoaded(flashcardId))

  useEffect(() => {
    if (!areLoaded && flashcardId) {
      dispatch(fetchContexts(flashcardId))
      dispatch(fetchContexts(flashcardId, 5, 1))
    }
  }, [flashcardId, areLoaded])

  useEffect(() => {
    if (isInitialLoadingFinished) {
      setFlascardId(wordsToReviewToday[0])
      setWordsQueue(wordsToReviewToday)
    }
  }, [isInitialLoadingFinished])

  useEffect(() => {
    if (currentUserId) {
      mixpanel.track('DAILY_FLASHCARDS_SHOWN', {
        userId: currentUserId
      })
    }
  }, [currentUserId])

  if (!flashcardId) {
    return null
  }

  function onGoNext () {
    dispatch(setWordAsSeen(flashcardId))

    const newQueue = wordsQueue.filter(wordId => wordId !== flashcardId)

    if (newQueue.length === 0) {
      navigate('/')
      return
    }

    setWordsQueue(newQueue)
    setFlascardId(newQueue[0])
  }

  return (
    <>
      <Context onGoNext={onGoNext} wordId={flashcardId} />
    </>
  )
}

export default DailyFlashcards
