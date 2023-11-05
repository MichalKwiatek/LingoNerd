import { getIsLearningHistoryLoaded } from './LearningHistory/selectors'
import { getAreWordsLoaded } from './Word/selectors'

export const getIsInitialLoadingFinished = (state) => {
  return (getAreWordsLoaded(state) &&
    getIsLearningHistoryLoaded(state))
}

export const RESET_MODELS = 'RESET_MODELS'

export const resetModels = () => {
  return {
    type: RESET_MODELS
  }
}
