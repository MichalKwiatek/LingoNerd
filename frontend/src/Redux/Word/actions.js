import { API_URL } from '../../constants'
import {
  FETCH_WORDS,
  ADD_WORD
} from './constants/actions'
import { v4 as uuidv4 } from 'uuid'
import { getCurrectUserId } from '../User/selectors'
import { parseWord } from './utils'

export const fetchWords = (dispatch) => {
  fetch(`${API_URL}/getWords?language=ESP`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      dispatch({
        type: FETCH_WORDS,
        words: data.words.map(word => parseWord(word))
      })
    })
}

export const createWord = ({
  lemma,
  translation,
  gender,
  isIrregular,
  tense,
  person,
  partOfSpeech,
  rootVerbId,
  language,
  onSuccess
}) => (dispatch, getState) => {
  const id = uuidv4()
  const userId = getCurrectUserId(getState())

  const word = {
    id,
    lemma,
    translation,
    gender,
    isIrregular,
    tense,
    person,
    partOfSpeech,
    userId,
    rootVerbId,
    language
  }

  fetch(`${API_URL}/addWord`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(word)
  })
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: ADD_WORD,
        word
      })
      onSuccess(word)
    })
    .catch(err => console.error(err))
}

export const translate = ({
  textParts,
  fullText,
  videoId,
  language
}) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        textParts,
        fullText,
        videoId,
        language
      })
    })
      .then((res) => res.json())
      .then((data) => {
        const parsedData = JSON.parse(data.body)
        const result = {}
        const texts = Object.keys(parsedData)
        texts.forEach((text) => {
          result[text] = parsedData[text]
            .map(word => parseWord(word))
        })
        resolve(result)
      })
      .catch(err => {
        console.error(err)
        reject(err)
      })
  })
}

export const searchWord = ({
  search, language
}) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_URL}/searchWord`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ search, language })
    })
      .then((res) => res.json())
      .then((data) => {
        const parsedData = JSON.parse(data.body)
        resolve(parsedData.map(word => parseWord(word)))
      })
      .catch(err => {
        console.error(err)
        reject(err)
      })
  })
}
