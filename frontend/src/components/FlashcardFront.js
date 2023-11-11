import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Paper from '@mui/material/Paper'
import { getWord } from '../Redux/Word/selectors'
import '../styles/flashcard.css'
import Typography from '@mui/material/Typography'
import mixpanel from 'mixpanel-browser'
import { getCurrectUserId } from '../Redux/User/selectors'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import conjugateTranslation from '../utils/getVerbLabel'

function FlashcardFront(props) {
  const word = useSelector(getWord(props.id))

  const currentUserId = useSelector(getCurrectUserId)

  const isMobile = useMediaQuery('(max-width:768px)')

  useEffect(() => {
    if (currentUserId && word) {
      mixpanel.track('FLASHCARD_SHOWN', {
        userId: currentUserId,
        wordId: word.id,
        wordFront: word.lemma,
      })
    }
  }, [currentUserId, word])

  return (
    <div className="flashcard-front">
      <Paper
        style={{
          width: isMobile ? '90%' : '40%',
          height: '95%',
          display: 'flex',
          justifyContent: 'space-around',
          flexDirection: 'column',
          cursor: 'pointer',
          alignItems: 'center',
          padding: 5,
        }}
        onClick={props.onClick}
      >
        <Typography variant="h5" component="h5" style={{ marginBottom: 20 }}>
          Remember this word in spanish?
        </Typography>
        <Typography variant="h5" component="h5">
          {conjugateTranslation(word)}
        </Typography>
        <Button color="secondary" variant="contained">
          See the answer
        </Button>
      </Paper>
    </div>
  )
}

export default FlashcardFront
