import getFrenchConjugationRules from './getFrenchConjugationRules'
import getSpanishConjugationRules from './getSpanishConjugationRules'

function getConjugationRules(infinitiveRaw, conjugatedWordRaw, language) {
  if (language === 'ESP') {
    return getSpanishConjugationRules(infinitiveRaw, conjugatedWordRaw)
  }

  if (language === 'FR') {
    return getFrenchConjugationRules(infinitiveRaw, conjugatedWordRaw)
  }

  return []
}

export default getConjugationRules
