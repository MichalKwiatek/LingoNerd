import React from 'react'
import { useSelector } from 'react-redux'
import { getWord } from '../Redux/Word/selectors'
import AudioPlayer from './AudioPlayer'
import Paper from '@mui/material/Paper'
import '../styles/flashcard.css'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import mixpanel from 'mixpanel-browser'
import { getCurrectUserId } from '../Redux/User/selectors'
import useMediaQuery from '@mui/material/useMediaQuery'

function FlashcardBack (props) {
  const word = useSelector(getWord(props.id))

  const currentUserId = useSelector(getCurrectUserId)

  const isMobile = useMediaQuery('(max-width:768px)')

  function onWrongAnswer (e) {
    e.stopPropagation()

    mixpanel.track('WRONG_ANSWER', {
      userId: currentUserId,
      wordId: word.id,
      wordFront: word.lemma
    })

    props.onWrongAnswer()
  }

  function onCorrectAnswer (e) {
    e.stopPropagation()

    mixpanel.track('CORRECT_ANSWER', {
      userId: currentUserId,
      wordId: word.id,
      wordFront: word.lemma
    })

    props.onCorrectAnswer()
  }

  return (
    <div
      className="flashcard-back"
    >
      <Paper
        style={{
          width: isMobile ? '90%' : '40%',
          height: '95%',
          display: 'flex',
          justifyContent: 'space-around',
          flexDirection: 'column',
          cursor: 'pointer',
          alignItems: 'center'
        }}
        onClick={props.onClick}
      >
        <AudioPlayer id={word.id} />
        <Typography variant="h5" component="h5">
          {word.lemma}
        </Typography>
        <div className='flashcard-ctas'>
          <Button
            color="error"
            variant="contained"
            onClick={onWrongAnswer}
            style={{ margin: 10 }}
          >
            Incorrect answer
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={onCorrectAnswer}
            style={{ margin: 10 }}
          >
            Correct answer
          </Button>
        </div>
      </Paper>
    </div >
  )
}

export default FlashcardBack
