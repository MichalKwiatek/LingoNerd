import { personLabels } from './conjugationRules'

const { default: englishConjugation } = require('./englishConjugation')

const presentEnglishConj = {
  be: {
    1: 'am',
    2: 'are',
    3: 'is',
    '1,3': 'is',
    4: 'are',
    5: 'are',
    6: 'are'
  },
  have: {
    1: 'have',
    2: 'have',
    3: 'has',
    '1,3': 'has',
    4: 'have',
    5: 'have',
    6: 'have'
  },
  do: {
    1: 'do',
    2: 'do',
    3: 'does',
    '1,3': 'does',
    4: 'do',
    5: 'do',
    6: 'do'
  },
  go: {
    1: 'go',
    2: 'go',
    3: 'goes',
    '1,3': 'goes',
    4: 'go',
    5: 'go',
    6: 'go'
  }
}

const tenseTranslations = {
  'indicative present': 'PRESENT',
  'subjunctive present': 'PRESENT',
  'indicative future': 'FUTURE',
  'indicative imperfect': 'PAST',
  'subjunctive imperfect': 'PAST',
  'indicative preterite': 'PAST',
  'past participle': 'PAST_PARTICIPLE',
  conditional: 'CONDITIONAL',
  imperative: 'IMPERATIVE',
  gerund: 'GERUND'
}

const gerundConjugation = {
  be: 'being'
}

function conjugate (infinitive, tense, person) {
  const englishTense = tenseTranslations[tense]

  if (englishTense === 'PAST_PARTICIPLE') {
    const pastForm = englishConjugation[infinitive]
      ? englishConjugation[infinitive].pastParticiple
      : `${infinitive}${infinitive.endsWith('e') ? '' : 'e'}d`

    return `${pastForm}`
  }

  if (englishTense === 'GERUND') {
    const root = infinitive.endsWith('e') ? infinitive.slice(0, -1) : infinitive
    const gerundForm = gerundConjugation[infinitive]
      ? gerundConjugation[infinitive]
      : `${root}ing`

    return gerundForm
  }

  if (englishTense === 'CONDITIONAL') {
    return `(${personLabels[person]}) would ${infinitive}`
  }

  if (englishTense === 'PRESENT') {
    if (presentEnglishConj[infinitive]) {
      return `(${personLabels[person]}) ${presentEnglishConj[infinitive][person]}`
    }

    if (person === '3' || person === '1,3') {
      return `(${personLabels[person]}) ${infinitive}s`
    }

    return `(${personLabels[person]}) ${infinitive}`
  }

  if (englishTense === 'PAST') {
    const pastForm = englishConjugation[infinitive]
      ? englishConjugation[infinitive].pastSimple
      : `${infinitive}${infinitive.endsWith('e') ? '' : 'e'}d`

    return `(${personLabels[person]}) ${pastForm}`
  }

  if (englishTense === 'FUTURE') {
    return `(${personLabels[person]}) will ${infinitive}`
  }

  if (englishTense === 'IMPERATIVE') {
    if (person === '4') {
      return `Let's ${infinitive}!`
    }

    return `${infinitive}!`
  }

  return infinitive
}

function conjugateTranslation (word) {
  if (word.id === 'NOT_A_WORD') {
    return 'Not a Spanish word'
  }

  const translations = word.translation.split(/[,;](?![^(]*\))/)

  if (!word.tense || !translations[0].startsWith('to ') || word.partOfSpeech !== 'verb') {
    return word.translation
  }
  console.log(translations)
  return translations
    .map(tr => {
      const startsWithTo = tr.trim().startsWith('to ')
      const [verb, ...rest] = tr.trim().substring(startsWithTo ? 3 : 0).split(' ')

      return `${conjugate(verb, word.tense, word.person)} ${rest.join(' ').split('(')[0]} `
    }).join(', ')
}

export default conjugateTranslation
