import { RESET_MODELS } from '../selectors'
import {
  ADD_TO_HISTORY, FETCH_LEARNING_HISTORY, SET_CONTEXT_AS_SEEN, SET_WORD_AS_LEARNT, SET_WORD_AS_PRESENTED, SET_WORD_AS_SEEN
} from './constants/actions'

const initialState = {
  history: {},
  isLearningHistoryLoaded: false,
  wordsPresented: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case RESET_MODELS:
      return initialState
    case FETCH_LEARNING_HISTORY:
      return {
        ...state,
        history: action.history,
        shownContexts: JSON.parse(localStorage.getItem('shownContexts')) || [],
        isLearningHistoryLoaded: true
      }
    case SET_WORD_AS_LEARNT:
      return {
        ...state,
        history: {
          ...state.history,
          [action.learntWord.wordId]: action.learntWord
        }
      }
    case SET_WORD_AS_SEEN:
      return {
        ...state,
        history: {
          ...state.history,
          [action.wordId]: {
            ...state.history[action.wordId],
            timesSeen: action.timesSeen,
            lastSeenTimestamp: action.timestamp
          }
        }
      }
    case ADD_TO_HISTORY:
      return {
        ...state,
        history: {
          ...state.history,
          [action.wordId]: [
            ...state.history[action.wordId] || [],
            {
              wordId: action.wordId,
              answer: action.answer,
              timestamp: action.timestamp
            }]
        }
      }
    case SET_CONTEXT_AS_SEEN: {
      const newState = {
        ...state,
        shownContexts: [...state.shownContexts, { wordId: action.wordId, contextId: action.contextId }]
      }
      localStorage.setItem('shownContexts', JSON.stringify(newState.shownContexts))
      return newState
    }
    case SET_WORD_AS_PRESENTED: {
      const newState = {
        ...state,
        wordsPresented: [...state.wordsPresented, action.wordId]
      }
      return newState
    }
    default:
      return state
  }
}
