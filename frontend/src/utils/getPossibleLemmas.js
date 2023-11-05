import getSpanishPossibleLemmas from './getSpanishPossibleLemmas'
import getFrenchPossibleLemmas from './getFrenchPossibleLemmas'

function getPossibleLemmas (text, language) {
  const cleanText = text.toLowerCase()

  if (language === 'ESP') {
    return getSpanishPossibleLemmas(cleanText)
  }

  if (language === 'FR') {
    return getFrenchPossibleLemmas(cleanText)
  }
}

export default getPossibleLemmas
