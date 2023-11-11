import { API_URL } from '../../constants'
import { getCurrentDate } from '../../utils/dateUtils'
import { getCurrectUserId } from '../User/selectors'
import {
  FETCH_LEARNING_HISTORY,
  SET_CONTEXT_AS_SEEN,
  SET_WORD_AS_LEARNT,
  SET_WORD_AS_PRESENTED,
  SET_WORD_AS_SEEN,
} from './constants/actions'
import { getWordTimesSeen } from './selectors'
// import { parseClipLike, parseLearntWord, parseVideoLike } from './utils'

export const setWordContextAsSeen =
  (wordId, contextId) => (dispatch, getState) => {
    dispatch({
      type: SET_CONTEXT_AS_SEEN,
      wordId,
      contextId,
    })
  }

export const setWordAsPresented = (wordId) => (dispatch, getState) => {
  dispatch({
    type: SET_WORD_AS_PRESENTED,
    wordId,
  })
}

export const fetchLearningHistory = (dispatch, getState) => {
  // const userId = getCurrectUserId(getState())

  dispatch({
    type: FETCH_LEARNING_HISTORY,
    history,
    previouslyKnownWords: [],
    selectedLevel: 0,
    clipLikes: {},
    videoLikes: {},
  })

  // fetch(`${API_URL}/getLearningHistory?userId=${userId}`)
  //   .then((res) => res.json())
  //   .then((data) => {
  //     console.log(data)
  //     const learningHistory = data.learningHistory.map(parseLearntWord)
  //     const videoLikes = data.videoLikes.map(parseVideoLike)
  //     const clipLikes = data.clipLikes.map(parseClipLike)

  //     const history = {}
  //     learningHistory.forEach((learntWord) => {
  //       history[learntWord.wordId] = learntWord
  //     })

  //     const videoLikesMap = {}
  //     videoLikes.forEach((videoLike) => {
  //       videoLikesMap[videoLike.videoId] = videoLike
  //     })

  //     const clipLikesMap = {}
  //     clipLikes.forEach((clipLike) => {
  //       clipLikesMap[`${clipLike.wordId}||${clipLike.contextId}`] = clipLike
  //     })

  //     dispatch({
  //       type: FETCH_LEARNING_HISTORY,
  //       history,
  //       previouslyKnownWords: data.knownWords,
  //       selectedLevel: data.selectedLevel,
  //       clipLikes: clipLikesMap,
  //       videoLikes: videoLikesMap,
  //     })
  //   })
}

export const setWordAsSeen = (wordId) => (dispatch, getState) => {
  const userId = getCurrectUserId(getState())
  const timesSeen = getWordTimesSeen(wordId)(getState())
  const timestamp = getCurrentDate().getTime()

  dispatch({
    type: SET_WORD_AS_SEEN,
    wordId,
    timesSeen: timesSeen + 1,
    timestamp,
  })

  fetch(`${API_URL}/word-seen`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      wordId,
      timesSeen: timesSeen + 1,
      timestamp,
    }),
  }).then((res) => {
    if (res.status !== 200) {
      console.error('error', res)
    }
  })
}

export const setWordAsLearnt = (wordId) => (dispatch, getState) => {
  const userId = getCurrectUserId(getState())
  const learntTimestamp = getCurrentDate().getTime()

  const learntWord = {
    userId,
    wordId,
    learntTimestamp,
    lastSeenTimestamp: learntTimestamp,
  }

  dispatch({
    type: SET_WORD_AS_LEARNT,
    learntWord,
  })

  fetch(`${API_URL}/set-word-as-learnt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(learntWord),
  }).then((res) => {
    if (res.status !== 200) {
      console.error('error', res)
    }
  })
}
