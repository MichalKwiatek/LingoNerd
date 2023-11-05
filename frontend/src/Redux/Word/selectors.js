import { wordModuleName } from './constants/actions'

export const getWord = (wordId) => (state) => {
  const { words } = state[wordModuleName]

  return words.find(word => word.id === wordId)
}

export const getWords = (state) => {
  const { words } = state[wordModuleName] || []

  const sortedWords = words
    .sort((a, b) => b.frequency - a.frequency)
    .filter(w => w.id !== 'NOT_A_WORD')
  return sortedWords
}

export const getNumberOfWords = (state) => {
  const words = getWords(state)
    .filter(w => w.numberOfVideos > 0)
    .filter(w => w.id !== 'NOT_A_WORD')
  return words.length
}

export const getAreWordsLoaded = (state) => {
  const { areWordsLoaded } = state[wordModuleName]

  return areWordsLoaded
}

export const getAllWords = (language) => (state) => {
  const { allWords } = state[wordModuleName]

  return allWords[language] || []
}

export const getIsAllWordsLoading = (state) => {
  const { isAllWordsLoading } = state[wordModuleName]

  return isAllWordsLoading
}
