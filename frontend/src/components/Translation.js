import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useEffect, useState } from 'react'
import { TextareaAutosize } from '@mui/base/TextareaAutosize'
import ClearIcon from '@mui/icons-material/Clear'
import { v4 as uuidv4 } from 'uuid'
import AddNewWord from './AddNewWord'
import { translate } from '../Redux/Word/actions'
import WordPicker from './WordPicker'
import getPossibleLemmas from '../utils/getPossibleLemmas'
import DoneIcon from '@mui/icons-material/Done'
import conjugateTranslation from '../utils/getVerbLabel'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

function Translation(props) {
  const [isAddNewWordModalOpen, setIsAddNewWordModalOpen] = useState(false)
  const [focusedTextTranslation, setFocusedTextTranslation] = useState(null)

  const [textLocal, setTextLocal] = useState(props.text)
  const [textLocalContextId, setTextLocalContextId] = useState(props.contextId)

  useEffect(() => {
    setTextLocal(props.text)
    setTextLocalContextId(props.contextId)
  }, [props.text])

  // eslint-disable-next-line no-unused-vars
  const addNewWord = (textTranslation) => {
    setFocusedTextTranslation(textTranslation)
    setIsAddNewWordModalOpen(true)
  }

  const getLanguageLetters = (language) => {
    if (language === 'ESP') {
      return /[a-záéíóúüñ]+/g
    }

    if (language === 'FR') {
      return /[a-àâæçéèêëîïôœùûüÿ]+/g
    }

    console.error('Language Letters not supported')
  }

  const transformText = async () => {
    const foundWords = [
      ...props.text.toLowerCase().matchAll(getLanguageLetters(props.language)),
    ]
    const textParts = foundWords.map((w) => ({
      id: uuidv4(),
      videoId: props.videoId,
      contextId: props.contextId,

      text: w[0],
      textStart: w.index,
      textEnd: w.index + w[0].length - 1,

      possibleLemmas: getPossibleLemmas(w[0], props.language),
    }))

    const translatedWords = await translate({
      textParts,
      fullText: props.text,
      videoId: props.videoId,
      language: props.language,
    })

    const videoWords = textParts.map((textPart) => ({
      id: textPart.id,
      videoId: textPart.videoId,
      contextId: textPart.contextId,

      text: textPart.text,
      textStart: textPart.textStart,
      textEnd: textPart.textEnd,

      possibleWords: translatedWords[textPart.id].sort(
        (wordX, wordY) => wordY.frequency - wordX.frequency
      ),
    }))

    props.setSelectedWords(videoWords)
  }

  const removeWord = (
    textTranslationId,
    wordId,
    partOfSpeech,
    tense,
    person
  ) => {
    const newSelectedWords = props.selectedWords.map((textTranslation) => {
      if (textTranslation.id !== textTranslationId) {
        return textTranslation
      }

      return {
        ...textTranslation,
        possibleWords: textTranslation.possibleWords.filter((word) => {
          return !(
            word.id === wordId &&
            word.partOfSpeech === partOfSpeech &&
            word.tense === tense &&
            word.person === person
          )
        }),
      }
    })

    props.setSelectedWords(newSelectedWords)
  }

  const setWordAsChosen = (
    textTranslationId,
    wordId,
    partOfSpeech,
    tense,
    person
  ) => {
    const newSelectedWords = props.selectedWords.map((textTranslation) => {
      if (textTranslation.id !== textTranslationId) {
        return textTranslation
      }

      return {
        ...textTranslation,
        possibleWords: textTranslation.possibleWords.filter((word) => {
          return (
            word.id === wordId &&
            word.partOfSpeech === partOfSpeech &&
            word.tense === tense &&
            word.person === person
          )
        }),
      }
    })

    props.setSelectedWords(newSelectedWords)
  }

  const onSelectWordChange = (word, textTranslationId) => {
    addWord(textTranslationId, [word])
  }

  const addWord = (textTranslationId, words) => {
    const newSelectedWords = props.selectedWords.map((textTranslation) => {
      if (textTranslation.id !== textTranslationId) {
        return textTranslation
      }

      return {
        ...textTranslation,
        possibleWords: words,
      }
    })
    props.setSelectedWords(newSelectedWords)
  }

  const onNewWordAdded = (word) => {
    addWord(focusedTextTranslation.id, [word])
    setIsAddNewWordModalOpen(false)
  }

  return (
    <div>
      <Modal
        open={isAddNewWordModalOpen}
        onClose={() => setIsAddNewWordModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddNewWord
            lemma={focusedTextTranslation?.text}
            onSuccess={onNewWordAdded}
            language={props.language}
          />
        </Box>
      </Modal>

      {props.selectedWords.map((textTranslation) => (
        <div
          key={textTranslation.id}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <div style={{ marginLeft: 15, marginRight: 25 }}>
            {textTranslation.text}
          </div>

          {textTranslation.possibleWords.length > 0 ? (
            textTranslation.possibleWords.map((word, index) => (
              <React.Fragment
                key={`${word.id} ${word.partOfSpeech} ${word.tense} ${word.person}`}
              >
                <div>
                  {word.lemma} - {conjugateTranslation(word)}{' '}
                  {word.partOfSpeech}
                </div>
                {textTranslation.possibleWords.length > 1 && (
                  <Button
                    style={{ minWidth: 0, padding: 3 }}
                    onClick={() =>
                      setWordAsChosen(
                        textTranslation.id,
                        word.id,
                        word.partOfSpeech,
                        word.tense,
                        word.person
                      )
                    }
                  >
                    <DoneIcon />
                  </Button>
                )}
                <Button
                  style={{ minWidth: 0, padding: 3 }}
                  onClick={() =>
                    removeWord(
                      textTranslation.id,
                      word.id,
                      word.partOfSpeech,
                      word.tense,
                      word.person
                    )
                  }
                >
                  <ClearIcon />
                </Button>
                {index + 1 === textTranslation.possibleWords.length || (
                  <div style={{ marginLeft: 20, marginRight: 20 }}>OR</div>
                )}
              </React.Fragment>
            ))
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <WordPicker
                textTranslationId={textTranslation.id}
                onSelectOption={onSelectWordChange}
                language={props.language}
              />
              <div style={{ marginLeft: 15, marginRight: 15 }}>OR</div>
              <Button
                variant="contained"
                color="secondary"
                onClick={() =>
                  addWord(textTranslation.id, [
                    {
                      id: 'NOT_A_WORD',
                      rootWordId: 'NOT_A_WORD',
                      flashcardWordId: 'NOT_A_WORD',
                    },
                  ])
                }
              >
                Not a spanish word
              </Button>
            </div>
          )}
        </div>
      ))}
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <TextareaAutosize
          value={textLocal}
          minRows={3}
          style={{ width: 600 }}
          onChange={(e) => setTextLocal(e.target.value)}
        />
        {props.text === textLocal || props.contextId !== textLocalContextId ? (
          <Button
            variant="contained"
            style={{ height: 50, marginLeft: 20 }}
            color="secondary"
            onClick={() => transformText(true)}
            disabled={!props.text}
          >
            Convert text to words
          </Button>
        ) : (
          <Button
            variant="contained"
            style={{ height: 50, marginLeft: 20 }}
            color="secondary"
            onClick={() => props.updateSubtitleText(textLocal)}
            disabled={!textLocal}
          >
            Update subtitle
          </Button>
        )}
      </div>
    </div>
  )
}

export default Translation
