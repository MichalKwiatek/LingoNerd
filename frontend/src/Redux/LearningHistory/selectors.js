import { getCurrentDate, MS_PER_DAY } from '../../utils/dateUtils'
import { getWordContexts } from '../Context/selectors'
import { getCurrectUserSelectedLevel, getPreviouslyKnownWords } from '../User/selectors'
import { getWords } from '../Word/selectors'
import { learningHistoryModuleName } from './constants/actions'

export const getNumberOfWordsInProgress = (state) => {
  const presentedWords = getPresentedWords(state)
  const knownWordsIds = getPreviouslyKnownWords(state)
  const learntWordsIds = getLearntWordIds(state)

  return presentedWords
    .filter(wordId => !knownWordsIds.includes(wordId))
    .filter(wordId => !learntWordsIds.includes(wordId))
    .length
}

export const getNumberOfLearntWords = (state) => {
  return getLearntWordIds(state).length
}

export const getCurrentLevel = (state) => {
  const wordsToLearn = getWordsToLearn(state)
  const words = getWords(state)
    .filter(w => w.numberOfVideos > 0)
    .filter(w => w.id !== 'NOT_A_WORD')

  return words.length - wordsToLearn.length
}

export const getWordsToReviewToday = (state) => {
  const { history } = state[learningHistoryModuleName]
  const currentDate = getCurrentDate()

  const wordIds = Object.keys(history)
  const wordsToReviewToday = wordIds.filter(wordId => {
    const learntWord = history[wordId]
    const { timesSeen, lastSeenTimestamp } = learntWord

    const lastSeenTs = new Date(lastSeenTimestamp).setHours(0, 0, 0, 0)
    const dayToLearnTS = lastSeenTs + (2 ** timesSeen) * MS_PER_DAY

    const todayTs = currentDate.setHours(0, 0, 0, 0)

    return dayToLearnTS <= todayTs
  })

  return wordsToReviewToday
}

export const getWordTimesSeen = (wordId) => (state) => {
  const { history } = state[learningHistoryModuleName]

  return history[wordId]?.timesSeen || 0
}

export const getIsLearningHistoryLoaded = (state) => {
  const { isLearningHistoryLoaded } = state[learningHistoryModuleName]

  return isLearningHistoryLoaded
}

export const getSeenContexts = (state) => {
  const { shownContexts } = state[learningHistoryModuleName]

  return shownContexts || []
}

export const getWordSeenContexts = (wordId) => (state) => {
  const seenContexts = getSeenContexts(state)

  return seenContexts.filter((c) => c.wordId === wordId)
}

export const getWordNextContexts = (wordId) => (state) => {
  const wordContexts = getWordContexts(wordId)(state)

  const wordSeenContexts = getWordSeenContexts(wordId)(state)
  const wordSeenContextIds = wordSeenContexts.map(seenContext => seenContext.contextId)

  const sorted = wordContexts.sort((a, b) => {
    if (wordSeenContextIds.includes(a.id) && !wordSeenContextIds.includes(b.id)) {
      return 1
    }

    if (!wordSeenContextIds.includes(a.id) && wordSeenContextIds.includes(b.id)) {
      return -1
    }

    return 0
  })

  return sorted
}

export const getLearntWordIds = (state) => {
  const { history } = state[learningHistoryModuleName]

  return Object.keys(history)
}

export const getWordsToLearn = (state) => {
  const learntWordsIds = getLearntWordIds(state)

  const knownWordsIds = getPreviouslyKnownWords(state)

  const words = getWords(state)
    .filter(w => w.numberOfVideos > 0)

  const selectedLevel = getCurrectUserSelectedLevel(state) || 100000000

  return words
    .filter((word) => word.frequency <= selectedLevel)
    .filter(word => !knownWordsIds.includes(word.id))
    .filter(word => !learntWordsIds.includes(word.id))
    .map(word => word.id)
}

export const getPresentedWords = (state) => {
  const { wordsPresented } = state[learningHistoryModuleName]

  return wordsPresented || []
}

export const getNotPresentedWordsToLearn = (state) => {
  const wordsToLearn = getWordsToLearn(state)
  const wordsPresented = getPresentedWords(state)

  return wordsToLearn
    .filter(wordId => !wordsPresented.includes(wordId))
}

export const getPresentedWordsToLearn = (state) => {
  const wordsToLearn = getWordsToLearn(state)
  const wordsPresented = getPresentedWords(state)

  return wordsToLearn
    .filter(wordId => wordsPresented.includes(wordId))
}
