import { GET_CONTEXT_TRANSLATION } from '../Context/constants/actions'
import { RESET_MODELS } from '../selectors'
import { FETCH_WORDS, FETCH_ALL_WORDS_LOADING, ADD_WORD } from './constants/actions'

const initialState = {
  words: [],

  areWordsLoaded: false,
  isAllWordsLoading: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case RESET_MODELS:
      return initialState
    case FETCH_WORDS:
      return {
        ...state,
        words: action.words,
        areWordsLoaded: true
      }
    case GET_CONTEXT_TRANSLATION: {
      const combinedWords = [...state.words, ...action.words]
      const uniqWords = combinedWords
        .filter((obj, index) => combinedWords.findIndex((item) => item.id === obj.id) === index)
      return {
        ...state,
        words: uniqWords
      }
    }
    case FETCH_ALL_WORDS_LOADING:
      return {
        ...state,
        isAllWordsLoading: true
      }
    case ADD_WORD:
      return {
        ...state,
        words: [
          ...state.words,
          action.word
        ]
      }
    default:
      return state
  }
}
