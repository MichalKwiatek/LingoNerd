import { contextModuleName } from './constants/actions'

export const getContext = (contextId) => (state) => {
  const { contexts } = state[contextModuleName]

  return contexts[contextId]
}

export const getVideoContexts = (id) => (state) => {
  const { videoContexts } = state[contextModuleName]

  if (!videoContexts[id]) {
    return []
  }

  return videoContexts[id].map((contextId) => getContext(contextId)(state))
}

export const getVideoContextsWithTranslations = (id) => (state) => {
  const { translations } = state[contextModuleName]
  const { contextTranslations } = state[contextModuleName]

  const contexts = getVideoContexts(id)(state)

  return contexts.map((c) => ({
    ...c,
    translations: (contextTranslations[c.id] || []).map(
      (id) => translations[id]
    ),
  }))
}

export const getWordContexts = (wordId) => (state) => {
  const { wordTranslations } = state[contextModuleName]
  const { translations } = state[contextModuleName]
  const { contexts } = state[contextModuleName]

  const sortedTranslations = (wordTranslations[wordId] || [])
    .map((id) => translations[id])
    .sort((a, b) => parseFloat(b.strength || 0) - parseFloat(a.strength || 0))

  return sortedTranslations
    .filter(
      (obj, index) =>
        sortedTranslations.findIndex((item) => item.videoId === obj.videoId) ===
        index
    )
    .map((t) => contexts[t.contextId])
}

export const getAreContextsForWordLoaded = (wordId) => (state) => {
  const { wordsContextsLoaded } = state[contextModuleName]

  return wordsContextsLoaded[wordId]
}
