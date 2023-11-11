import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Paper from '@mui/material/Paper'
import { getWord } from '../Redux/Word/selectors'
import '../styles/flashcard.css'
import Typography from '@mui/material/Typography'
import mixpanel from 'mixpanel-browser'
import { getCurrectUserId } from '../Redux/User/selectors'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import AudioPlayer from './AudioPlayer'
import { addKnownWord } from '../Redux/User/actions'
import { setWordAsPresented } from '../Redux/LearningHistory/actions'
import { tenseLabels } from '../utils/conjugationRules'
import conjugateTranslation from '../utils/getVerbLabel'

function Presentation(props) {
  const dispatch = useDispatch()
  const word = useSelector(getWord(props.id))
  const rootVerb = useSelector(getWord(word.rootWordId))

  const currentUserId = useSelector(getCurrectUserId)

  const isMobile = useMediaQuery('(max-width:768px)')

  function onKnownWord(e) {
    e.stopPropagation()

    mixpanel.track('WORD_ALREADY_KNOWN', {
      userId: currentUserId,
      wordId: word.id,
      wordFront: word.lemma,
    })

    dispatch(addKnownWord(word.id))
    props.onKnownWord(word.id)
  }

  useEffect(() => {
    if (currentUserId && word) {
      mixpanel.track('PRESENTATION_SHOWN', {
        userId: currentUserId,
        wordId: word.id,
        wordFront: word.lemma,
      })
    }
  }, [currentUserId, word])

  function onClickNext() {
    mixpanel.track('LEARN_WORD_CLICKED', {
      userId: currentUserId,
      wordId: word.id,
      wordFront: word.lemma,
    })

    dispatch(setWordAsPresented(props.id))
    props.onClickNext()
  }

  const examples = (word.examples || '')
    .split('***')
    .map((example) => {
      const parts = example.split('|||')
      return {
        sentence: parts[0],
        translation: parts[1],
      }
    })
    .filter((example) => example.sentence && example.translation)

  return (
    <div className="flashcard-front">
      <Paper
        style={{
          width: isMobile ? '90%' : '40%',
          height: '95%',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '120px 20px',
        }}
      >
        <AudioPlayer id={word.id} />
        <Typography variant="h5" component="h5" style={{ fontWeight: 500 }}>
          {word.lemma} -{' '}
          {word.partOfSpeech === 'verb'
            ? conjugateTranslation(word)
            : word.translation}
        </Typography>
        {!!rootVerb && !!word.tense && (
          <div>
            <Typography
              variant="h5"
              component="h5"
              style={{ marginBottom: 10 }}
            >
              Infinitive: {rootVerb.lemma} - {rootVerb.translation}
            </Typography>
            <Typography variant="h5" component="h5">
              Tense: {tenseLabels[word.tense]}
            </Typography>
          </div>
        )}
        {examples.length > 0 && (
          <div>
            {examples.map((example, index) => (
              <Typography
                variant="h6"
                component="h6"
                style={{ marginBottom: 10 }}
                key={index}
              >
                {example.sentence} - {example.translation}
              </Typography>
            ))}
          </div>
        )}
        <div>
          <Button
            color="error"
            variant="contained"
            onClick={onKnownWord}
            style={{ marginRight: 30 }}
          >
            known
          </Button>
          <Button color="success" variant="contained" onClick={onClickNext}>
            Learn!
          </Button>
        </div>
      </Paper>
    </div>
  )
}

export default Presentation
