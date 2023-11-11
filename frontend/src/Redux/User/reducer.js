import { FETCH_LEARNING_HISTORY } from '../LearningHistory/constants/actions'
import { RESET_MODELS } from '../selectors'
import {
  ADD_KNOWN_WORD,
  SELECT_LEVEL,
  SET_CURRENT_USER_ID,
  SET_IS_AUTHORIZED,
} from './constants/actions'

const initialState = {
  currentUserId: null,
  isAuthorized: false,
  previouslyKnownWords: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_AUTHORIZED:
      return {
        ...state,
        isAuthorized: action.isAuthorized,
      }
    case RESET_MODELS:
      return initialState
    case SET_CURRENT_USER_ID:
      return {
        ...state,
        currentUserId: action.currentUserId,
      }
    case FETCH_LEARNING_HISTORY:
      return {
        ...state,
        previouslyKnownWords: action.previouslyKnownWords || [],
        selectedLevel: action.selectedLevel,
      }
    case SELECT_LEVEL:
      return {
        ...state,
        selectedLevel: action.selectedLevel,
      }
    case ADD_KNOWN_WORD:
      return {
        ...state,
        previouslyKnownWords: [
          ...(state.previouslyKnownWords || []),
          action.wordId,
        ],
      }
    default:
      return state
  }
}
