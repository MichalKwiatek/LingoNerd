import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createWord } from '../Redux/Word/actions'
import {
  genders,
  partsOfSpeech,
  personLabels,
  tenseLabels,
} from '../utils/conjugationRules'
import WordPicker from './WordPicker'

function AddNewWord(props) {
  const dispatch = useDispatch()

  const [lemma, setLemma] = useState(props.lemma || '')
  const [translation, setTranslation] = useState('')
  const [partOfSpeech, setPartOfSpeech] = useState(null)
  const [gender, setGender] = useState(null)
  const [tense, setTense] = useState(null)
  const [person, setPerson] = useState(null)
  const [rootVerbId, setRootVerbId] = useState(null)

  const onSuccess = (word) => {
    setGender(null)
    setTense(null)
    setPerson(null)
    setPartOfSpeech(null)
    setTranslation('')

    props.onSuccess(word)
  }

  const addWord = () => {
    dispatch(
      createWord({
        lemma,
        translation,
        partOfSpeech,
        gender,
        isIrregular: partOfSpeech === 'v' && tense !== 'Infinitivo',
        tense,
        person,
        rootVerbId,
        language: props.language,
        onSuccess,
      })
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Add a new word
      </Typography>
      <TextField
        label="Word:"
        variant="outlined"
        onChange={(event) => setLemma(event.target.value)}
        value={lemma}
        type="text"
        style={{ marginBottom: 10 }}
      />

      <TextField
        label="Translation:"
        variant="outlined"
        onChange={(event) => setTranslation(event.target.value)}
        value={translation}
        type="text"
        style={{ marginBottom: 10 }}
      />

      <Select
        value={partOfSpeech}
        label="Part of speech"
        onChange={(event) => setPartOfSpeech(event.target.value)}
      >
        {Object.keys(partsOfSpeech).map((id) => (
          <MenuItem value={id} key={id}>
            {partsOfSpeech[id]}
          </MenuItem>
        ))}
      </Select>

      {partOfSpeech === 'n' && (
        <Select
          value={gender}
          label="Noun gender"
          onChange={(event) => setGender(event.target.value)}
        >
          {Object.keys(genders).map((id) => (
            <MenuItem value={id} key={id}>
              {genders[id]}
            </MenuItem>
          ))}
        </Select>
      )}

      {partOfSpeech === 'v' && (
        <>
          <Select
            value={tense}
            label="Tense"
            onChange={(event) => setTense(event.target.value)}
          >
            {Object.keys(tenseLabels).map((id) => (
              <MenuItem key={id} value={id}>
                {tenseLabels[id]}
              </MenuItem>
            ))}
          </Select>
          {tense !== 'PastParticiple' &&
            tense !== 'Infinitivo' &&
            tense !== 'Gerundio' && (
              <Select
                value={person}
                label="Person"
                onChange={(event) => setPerson(event.target.value)}
              >
                {Object.keys(personLabels).map((id) => (
                  <MenuItem key={id} value={id}>
                    {personLabels[id]}
                  </MenuItem>
                ))}
              </Select>
            )}
        </>
      )}

      {partOfSpeech === 'v' && tense && tense !== 'Infinitivo' && (
        <>
          <WordPicker
            onSelectOption={(verb) => setRootVerbId(verb.id)}
            language={props.language}
          ></WordPicker>
        </>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={addWord}
        disabled={
          !lemma ||
          !translation ||
          !partOfSpeech ||
          (partOfSpeech === 'n' && !gender) ||
          (partOfSpeech === 'v' &&
            !person &&
            tense !== 'Gerundio' &&
            tense !== 'PastParticiple' &&
            tense !== 'Infinitivo') ||
          (partOfSpeech === 'v' && !tense) ||
          (partOfSpeech === 'v' &&
            tense &&
            tense !== 'Infinitivo' &&
            !rootVerbId)
        }
      >
        Add a new word
      </Button>
    </div>
  )
}

export default AddNewWord
