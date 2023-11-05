import { API_URL } from '../../constants'
import {
  FETCH_CONTEXTS,
  GET_CONTEXT_TRANSLATION,
  FETCH_VIDEO,
  UPDATE_SUBTITLE
} from './constants/actions'
import { getCurrentDate } from '../../utils/dateUtils'
import { parseContext, parseTranslation } from './utils'
import { parseWord } from '../Word/utils'
import getPossibleLemmas from '../../utils/getPossibleLemmas'
import { Auth } from 'aws-amplify'

export const addContexts = (videoId, language, subtitles, onSuccess, onFailure, token) => (dispatch, getState) => {
  const creationTimestamp = getCurrentDate().getTime()

  const contexts = subtitles.map(s => ({
    ...s,
    creationTimestamp,
    videoId,
    language
  }))

  fetch(`${API_URL}/createContext`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify({
      contexts
    })
  })
    .then((res) => {
      console.log(res)
      if (res.status !== 200) {
        console.error('error', res)
        onFailure()
      } else {
        onSuccess()
      }
    })
}

export const createTranslations = (translations, words, onSuccess, onFailure, token) => (dispatch, getState) => {
  dispatch({
    type: GET_CONTEXT_TRANSLATION,
    translation: translations[0],
    words
  })

  fetch(`${API_URL}/createTranslations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify({
      translations
    })
  })
    .then((res) => {
      console.log(res)
      if (res.status !== 200) {
        console.error('error', res)
        onFailure()
      } else {
        onSuccess()
      }
    })
}

export const updateSubtitle = (contextId, text, onSuccess) => (dispatch, getState) => {
  Auth.currentSession().then(data => {
    const token = data.getIdToken().getJwtToken()

    fetch(`${API_URL}/updateSubtitle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        contextId,
        text
      })
    })
      .then((res) => {
        console.log(res)
        if (res.status !== 200) {
          console.error('error', res)
        } else {
          onSuccess(contextId, text)
          dispatch({
            type: UPDATE_SUBTITLE,
            contextId,
            text
          })
        }
      })
  })
}

export const addVideo = (id, title, url, language, onSuccess, onFailure, token) => (dispatch, getState) => {
  const creationTimestamp = getCurrentDate().getTime()

  const video = {
    id,
    creationTimestamp,
    title,
    url,
    language
  }

  fetch(`${API_URL}/createVideo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify({
      video
    })
  })
    .then((res) => {
      console.log(res)
      if (res.status !== 200) {
        console.log(res)
        onFailure(res.statusCode, res?.body?.id)
      } else {
        onSuccess(id)
      }
    })
}

export const fetchContexts = (wordId, limit = 1) => (dispatch) => {
  fetch(`${API_URL}/getVideos?language=ESP&wordId=${encodeURI(wordId)}&limit=${limit}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)

      const contextsMap = {}
      const contexts = data.contexts
        .map(context => parseContext(context))
      contexts.forEach(context => { contextsMap[context.id] = context })

      const translationsMap = {}
      const translations = data.translations
        .map(translation => parseTranslation(translation))
      translations.forEach(translation => { translationsMap[translation.id] = translation })

      const videoContexts = {}

      contexts.forEach(context => {
        if (videoContexts.hasOwnProperty(context.videoId)) {
          videoContexts[context.videoId] = [...videoContexts[context.videoId], context.id]
        } else {
          videoContexts[context.videoId] = [context.id]
        }
      })

      const contextTranslations = {}
      const wordTranslations = {}

      translations.forEach(translation => {
        if (contextTranslations.hasOwnProperty(translation.contextId)) {
          contextTranslations[translation.contextId] = [...contextTranslations[translation.contextId], translation.id]
        } else {
          contextTranslations[translation.contextId] = [translation.id]
        }

        if (wordTranslations.hasOwnProperty(translation.flashcardWordId)) {
          wordTranslations[translation.flashcardWordId] = [...wordTranslations[translation.flashcardWordId], translation.id]
        } else {
          wordTranslations[translation.flashcardWordId] = [translation.id]
        }
      })

      dispatch({
        type: FETCH_CONTEXTS,
        contexts: contextsMap,
        translations: translationsMap,
        videoContexts,
        contextTranslations,
        wordTranslations,
        wordId,
        page: limit
      })
    })
}

export const fetchVideo = (videoId) => (dispatch) => {
  fetch(`${API_URL}/getVideo?id=` + videoId)
    .then((res) => res.json())
    .then((res) => {
      const { video, subtitles } = res
      console.log(subtitles)
      const contexts = subtitles.map(context => parseContext(context))
      const contextsMap = {}
      contexts.forEach(context => { contextsMap[context.id] = context })

      const videoContexts = { [video.id]: contexts.map(c => c.id) }

      dispatch({
        type: FETCH_VIDEO,
        video,
        contexts: contextsMap,
        videoContexts
      })
    })
}

export const getContextTranslation = ({ textStart, textEnd, contextId, text, onPossibleTranslations }) => (dispatch) => {
  fetch(`${API_URL}/get-context-translation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      textStart,
      textEnd,
      contextId,
      possibleLemmas: getPossibleLemmas(text, 'ESP'),
      language: 'ESP'
    })
  })
    .then((res) => res.json())
    .then((data) => {
      const { translation, words, possibleTranslations } = JSON.parse(data.body)

      if (translation) {
        dispatch({
          type: GET_CONTEXT_TRANSLATION,
          translation: parseTranslation(translation),
          words: words.map(word => parseWord(word))
        })
      } else {
        onPossibleTranslations(possibleTranslations.map(word => parseWord(word)))
      }
    })
}
