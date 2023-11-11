import React, { useEffect, useState } from 'react'
import FlashcardBack from './FlashcardBack'
import FlashcardFront from './FlashcardFront'
import { useSelector } from 'react-redux'
import mixpanel from 'mixpanel-browser'
import { getCurrectUserId } from '../Redux/User/selectors'

function Test(props) {
  const currentUserId = useSelector(getCurrectUserId)

  const [flashcardState, setFlashcardState] = useState('front')

  useEffect(() => {
    if (currentUserId) {
      mixpanel.track('TEST_SHOWN', {
        userId: currentUserId,
      })
    }
  }, [currentUserId])

  if (!props.wordId) {
    return null
  }

  function onClickFront() {
    setFlashcardState('back')
  }

  function onClickBack() {
    setFlashcardState('front')
  }

  return (
    <>
      {flashcardState === 'front' && (
        <FlashcardFront id={props.wordId} onClick={onClickFront} />
      )}
      {flashcardState === 'back' && (
        <FlashcardBack
          id={props.wordId}
          onClick={onClickBack}
          onCorrectAnswer={props.onCorrectAnswer}
          onWrongAnswer={props.onWrongAnswer}
        />
      )}
    </>
  )
}

export default Test
