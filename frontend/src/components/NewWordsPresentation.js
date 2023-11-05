import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import mixpanel from 'mixpanel-browser'
import { getCurrectUserId, getCurrectUserSelectedLevel } from '../Redux/User/selectors'
import { getIsInitialLoadingFinished } from '../Redux/selectors'
import Presentation from './Presentation'
import Context from './Context'
import { getNotPresentedWordsToLearn, getWordsToReviewToday, getPresentedWordsToLearn } from '../Redux/LearningHistory/selectors'

import { fetchContexts } from '../Redux/Context/actions'
import { getAreContextsForWordLoaded } from '../Redux/Context/selectors'
import { getCurrentDate, isToday } from '../utils/dateUtils'
import { AUTH_ROUTES } from '../App'

const WORDS_SET_TO_LEARN = 3

function NewWordsPresentation () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const currentUserId = useSelector(getCurrectUserId)
  const isInitialLoadingFinished = useSelector(getIsInitialLoadingFinished)

  const presentedWordsToLearn = useSelector(getPresentedWordsToLearn)

  const newWordsToLearn = useSelector(getNotPresentedWordsToLearn)
  const [wordId, setWordId] = useState(null)
  const [componentType, setComponentType] = useState('presentation')
  const areLoaded = useSelector(getAreContextsForWordLoaded(wordId))
  const wordsToReviewToday = useSelector(getWordsToReviewToday)
  const selectedLevel = useSelector(getCurrectUserSelectedLevel)

  useEffect(() => {
    if (isInitialLoadingFinished && !selectedLevel && !AUTH_ROUTES.includes(location.pathname)) {
      navigate('/placement')
    }
  }, [isInitialLoadingFinished, location.pathname, selectedLevel])

  useEffect(() => {
    const lastShownTs = localStorage.getItem('DAILY_FLASHCARDS_SHOWN_TS')
    const wasShownToday = lastShownTs && isToday(parseInt(lastShownTs))
    if (isInitialLoadingFinished && wordsToReviewToday.length > 0 && selectedLevel && !wasShownToday) {
      const currentTs = getCurrentDate().getTime()
      localStorage.setItem('DAILY_FLASHCARDS_SHOWN_TS', currentTs)

      navigate('/daily-flashcards')
    }
  }, [isInitialLoadingFinished, wordsToReviewToday.length])

  useEffect(() => {
    if (!areLoaded && wordId) {
      dispatch(fetchContexts(wordId))
      dispatch(fetchContexts(wordId, 5, 1))
    }
  }, [wordId, areLoaded])

  useEffect(() => {
    if (isInitialLoadingFinished) {
      setWordId(newWordsToLearn[0])
    }
  }, [isInitialLoadingFinished])

  useEffect(() => {
    if (currentUserId) {
      mixpanel.track('NEW_WORDS_PRESENTATION', {
        userId: currentUserId
      })
    }
  }, [currentUserId])

  if (!wordId) {
    return null
  }

  function onAfterPresentation () {
    setComponentType('context')
  }

  function onAfterContext () {
    if (presentedWordsToLearn.length >= WORDS_SET_TO_LEARN) {
      navigate('/new-words-learning')
    }

    const index = newWordsToLearn.indexOf(wordId)
    const newIndex = index + 1

    if (newIndex >= newWordsToLearn.length) {
      navigate('/new-words-learning')
      return
    }

    setComponentType('presentation')
    setWordId(newWordsToLearn[newIndex])
  }

  function onKnownWord () {
    const index = newWordsToLearn.indexOf(wordId)
    const newIndex = index + 1

    setComponentType('presentation')
    setWordId(newWordsToLearn[newIndex])
  }

  return (
    <>
      {componentType === 'presentation' && <>
        <Presentation
          id={wordId}
          onClickNext={onAfterPresentation}
          onKnownWord={onKnownWord}
        ></Presentation>
      </>}
      {componentType === 'context' && <>
        <Context wordId={wordId} onGoNext={onAfterContext} />
      </>}
    </>
  )
}

export default NewWordsPresentation
