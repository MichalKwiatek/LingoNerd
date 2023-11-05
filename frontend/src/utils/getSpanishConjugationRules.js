import conjugationRules from './conjugationRules'

const verbTypes = {
  IR: 'ir',
  AR: 'ar',
  ER: 'er'
}

const indirectAndDirectPronouns = ['me', 'tela', 'te', 'la', 'lo', 'nos', 'os', 'los', 'las', 'le', 'les', 'se']

function conjugator (infinitiveRaw, conjugatedWordRaw) {
  const infinitive = infinitiveRaw.toLowerCase()
  const conjugatedWord = conjugatedWordRaw.toLowerCase()

  const verbType = infinitive.endsWith('ar')
    ? verbTypes.AR
    : infinitive.endsWith('er')
      ? verbTypes.ER
      : verbTypes.IR

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

function getSpanishConjugationRules (infinitive, conjugated) {
  const conjugationRules = conjugator(infinitive, conjugated)

  if (conjugationRules.length > 0) {
    return conjugationRules
  }

  const pronounEnding = indirectAndDirectPronouns.find(pronoun => conjugated.endsWith(pronoun))
  if (!pronounEnding) {
    return []
  }

  return conjugator(
    infinitive,
    conjugated.substring(0, conjugated.length - pronounEnding.length)
  )
}

export default getSpanishConjugationRules
