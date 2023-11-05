import conjugationRules from './frenchConjugationRules'

const verbTypes = {
  ER: 'er',
  RE: 're',
  IR: 'ir'
}

function getVerbType (infinitive) {
  return infinitive.endsWith('re')
    ? verbTypes.RE
    : infinitive.endsWith('er')
      ? verbTypes.ER
      : verbTypes.IR
}

function getFrenchConjugationRules (infinitiveRaw, conjugatedWordRaw) {
  const infinitive = infinitiveRaw.toLowerCase()
  const conjugatedWord = conjugatedWordRaw.toLowerCase()

  const verbType = getVerbType(infinitive)

  if (infinitive === conjugatedWord) {
    return [{
      tense: 'Infinitivo',
      verbType
    }]
  }

  const root = infinitive.slice(0, -2)

  const conjugations = []
  const tenses = Object.keys(conjugationRules)

  for (let index = 0; index < tenses.length; index++) {
    const tenseName = tenses[index]
    const tense = conjugationRules[tenseName]
    const { type } = tense

    const personsRules = tense.all || tense[verbType]

    if (personsRules.all) {
      const conjugationRoot = type === 'ROOT' ? root : infinitive
      if (conjugationRoot + personsRules.all.ending === conjugatedWord) {
        conjugations.push({
          tense: tenseName
        })
      }
    } else {
      for (let person = 1; person <= 6; person++) {
        const { ending } = personsRules[person]

        const conjugationRoot = type === 'ROOT' ? root : infinitive
        if (conjugationRoot + ending === conjugatedWord) {
          conjugations.push({
            tense: tenseName,
            person
          })
        }
      }
    }
  }

  return conjugations
}

export default getFrenchConjugationRules
