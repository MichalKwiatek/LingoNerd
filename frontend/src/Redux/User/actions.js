import { API_URL } from '../../constants'
import {
  ADD_KNOWN_WORD,
  SET_CURRENT_USER_ID,
  SELECT_LEVEL,
  SET_IS_AUTHORIZED
} from './constants/actions'
import { getCurrectUserId } from './selectors'
import { v4 as uuidv4 } from 'uuid'
import mixpanel from 'mixpanel-browser'

export const selectLevelAction = (frequency, navigate) => (dispatch, getState) => {
  const userId = getCurrectUserId(getState())

  fetch(`${API_URL}/selectFrequency`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      frequency
    })
  })
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: SELECT_LEVEL,
        selectedLevel: frequency
      })
      navigate('/')
    })
}

export const addKnownWord = (wordId) => (dispatch, getState) => {
  const userId = getCurrectUserId(getState())

  fetch(`${API_URL}/addPreviouslyKnownWord`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      wordId
    })
  })
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: ADD_KNOWN_WORD,
        wordId
      })
    })
}

export const setCurrentUserId = (currentUserId) => {
  localStorage.setItem('CURRENT_USER_ID', currentUserId)
  mixpanel.identify(currentUserId)
  mixpanel.people.set({ $id: currentUserId })

  return {
    type: SET_CURRENT_USER_ID,
    currentUserId
  }
}

export const setIsAuthorized = (isAuthorized) => {
  return {
    type: SET_IS_AUTHORIZED,
    isAuthorized
  }
}

export const addToWaitingList = (email, language, onSuccess) => (dispatch, getState) => {
  const userId = uuidv4()

  fetch(`${API_URL}/addToWaitingList`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: userId,
      language,
      email
    })
  })
    .then((res) => res.json())
    .then((data) => {
      onSuccess()
    })
}
