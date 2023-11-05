import combineMaps from '../../utils/combineMaps'
import { RESET_MODELS } from '../selectors'
import { FETCH_CONTEXTS, GET_CONTEXT_TRANSLATION, FETCH_VIDEO, UPDATE_SUBTITLE } from './constants/actions'

const initialState = {
  videoContexts: {},
  contexts: {},
  contextTranslations: {},
  translations: {},
  wordTranslations: {},
  wordsContextsLoaded: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case RESET_MODELS:
      return initialState
    case FETCH_CONTEXTS:
      return {
        ...state,
        contexts: { ...state.contexts, ...action.contexts },
        translations: { ...state.translations, ...action.translations },
        contextTranslations: combineMaps(state.contextTranslations, action.contextTranslations),
        videoContexts: combineMaps(state.videoContexts, action.videoContexts),
        wordTranslations: combineMaps(state.wordTranslations, action.wordTranslations),
        wordsContextsLoaded: {
          ...state.wordsContextsLoaded,
          [action.wordId]: Math.max(state.wordsContextsLoaded[action.wordId] || 0, action.page)
        }
      }
    case FETCH_VIDEO:
      return {
        ...state,
        contexts: { ...state.contexts, ...action.contexts },
        videoContexts: combineMaps(state.videoContexts, action.videoContexts)
      }
    case GET_CONTEXT_TRANSLATION: {
      return {
        ...state,
        translations: { ...state.translations, [action.translation.id]: action.translation },
        contextTranslations: combineMaps(
          state.contextTranslations,
          { [action.translation.contextId]: [action.translation.id] }
        )
      }
    }

    case UPDATE_SUBTITLE:
      return {
        ...state,
        contexts: {
          ...state.contexts,
          [action.contextId]: {
            ...state.contexts[action.contextId],
            subtitle: action.text
          }
        }
      }

    default:
      return state
  }
}
