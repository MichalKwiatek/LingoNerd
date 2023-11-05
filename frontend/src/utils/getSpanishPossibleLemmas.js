const adjectiveSingleMasculine = {
  ces: ['z'],
  ita: ['a', 'o', 'ito', ''],
  itas: ['a', 'o', 'ito', ''],
  ito: ['o', 'ito', ''],
  itos: ['o', 'ito', ''],
  a: ['o'],
  es: ['e', ''],
  as: ['o'],
  os: ['o']
}

const nounSingleMasculine = {
  // clearly not changing -o to -a
  anes: ['án', 'an', 'ane'],
  enes: ['én', 'en', 'ene'],
  ines: ['ín', 'in', 'ine'],
  ones: ['ón', 'on', 'one'],
  unes: ['ún', 'un', 'une'],
  ases: ['ás', 'as', 'ase'],
  eses: ['és', 'es', 'ese'],
  ises: ['ís', 'is', 'ise'],
  oses: ['ós', 'os', 'ose'],
  uses: ['ús', 'us', 'use'],
  cita: ['za'],
  citas: ['za'],
  ces: ['z'],
  es: ['', 'e'],

  // clearly masculine
  os: ['o'],
  ito: ['o'],
  itos: ['o', 'ito'],
  quito: ['co'],
  quitos: ['co'],

  // masculine/feminine
  quitas: ['co', 'ca'],
  quita: ['co', 'ca'],
  ita: ['o', 'a'],
  itas: ['o', 'a'],
  as: ['o', 'a'],
  a: ['o'],

  s: ['']
}

const masculineAndFeminineEndings = ['quitas', 'quita', 'ita', 'itas', 'as', 'a']

const indirectAndDirectPronouns = ['mela', 'melo', 'me', 'tela', 'telo', 'te', 'la', 'lo', 'nos', 'os', 'los', 'las', 'le', 'les', 'se']

function getSpanishPossibleLemmas (text) {
  const possibleLemmas = []

  if (text === 'al') {
    return [{ lemma: 'a' }]
  }

  if (text === 'del') {
    return [{ lemma: 'de' }]
  }

  if (text === 'una') {
    return [{ lemma: 'un' }]
  }

  if (text === 'unas') {
    return [{ lemma: 'un' }, { lemma: 'unas' }]
  }

  if (text === 'mía' || text === 'míos' || text === 'mio') {
    return [{ lemma: 'mío' }]
  }

  if (text === 'estas') {
    return [{ lemma: 'este', partOfSpeech: 'det' }, { lemma: 'estás' }]
  }

  if (text === 'este') {
    return [{ lemma: 'este' }, { lemma: 'esté' }]
  }

  if (text === 'esta') {
    return [{ lemma: 'este', partOfSpeech: 'det' }, { lemma: 'está' }]
  }

  if (text === 'esto' || text === 'estos') {
    return [{ lemma: 'este', partOfSpeech: 'det' }]
  }

  if (text === 'tus') {
    return [{ lemma: 'tu' }]
  }

  if (text === 'mis') {
    return [{ lemma: 'mi' }]
  }

  if (text === 'esa' || text === 'esos' || text === 'esas' || text === 'eso' || text === 'ese') {
    return [{ lemma: 'ese', partOfSpeech: 'det' }]
  }

  if (text === 'tu') {
    return [{ lemma: 'tu' }, { lemma: 'tú' }]
  }

  if (text === 'el') {
    return [{ lemma: 'el' }, { lemma: 'él' }]
  }

  if (text === 'solo') {
    return [{ lemma: 'solo' }, { lemma: 'sólo' }]
  }

  if (text === 'para') {
    return [{ lemma: 'para' }]
  }

  if (text === 'mas') {
    return [{ lemma: 'mas' }, { lemma: 'más' }]
  }

  if (text === 'sus') {
    return [{ lemma: 'su' }]
  }

  if (text === 'se') {
    return [{ lemma: 'se' }, { lemma: 'sé' }]
  }

  if (text === 'mi') {
    return [{ lemma: 'mi' }, { lemma: 'mí' }]
  }

  if (text === 'tuya') {
    return [{ lemma: 'tuyo' }]
  }

  if (text === 'que') {
    return [{ lemma: 'qué' }, { lemma: 'que' }]
  }

  if (text === 'to') {
    return [{ lemma: 'todo' }]
  }

  if (text === 'pa' || text === 'pal') {
    return [{ lemma: 'para', partOfSpeech: 'prep' }]
  }

  if (text === 'ninguna' || text === 'ningunas' || text === 'ningunos' || text === 'ningún') {
    return [{ lemma: 'ninguno' }]
  }

  if (text === 'aquellas' || text === 'aquella' || text === 'aquellos') {
    return [{ lemma: 'aquel' }]
  }

  if (text === 'cualquier' || text === 'cualquieras') {
    return [{ lemma: 'cualquiera' }]
  }

  if (text === 'poquito') {
    return [{ lemma: 'poco' }]
  }

  if (text === 'cuanto') {
    return [{ lemma: 'cuánto' }, { lemma: 'cuanto' }]
  }

  if (text === 'aun') {
    return [{ lemma: 'aún' }, { lemma: 'aun' }]
  }

  if (text === 'vamonos') {
    return [{ lemma: 'vamos' }]
  }

  if (text === 'eramos') {
    return [{ lemma: 'éramos' }]
  }

  if (text === 'gran') {
    return [{ lemma: 'grande' }]
  }

  if (text === 'sólo') {
    return [{ lemma: 'solo' }]
  }

  if (text === 'si') {
    return [{ lemma: 'sí' }, { lemma: 'si' }]
  }

  if (text === 'na') {
    return [{ lemma: 'nada', partOfSpeech: 'noun' }]
  }

  if (text === 'como') {
    return [{ lemma: 'como' }, { lemma: 'cómo' }]
  }

  possibleLemmas.push({ lemma: text })

  const adjectiveEnding = Object.keys(adjectiveSingleMasculine).find(ending => text.endsWith(ending))
  if (adjectiveEnding && text.length > 2) {
    const singleMasculineEndings = adjectiveSingleMasculine[adjectiveEnding] || []
    singleMasculineEndings.forEach(singleMasculineEnding => {
      possibleLemmas.push({
        lemma: text.substring(0, text.length - adjectiveEnding.length) + singleMasculineEnding,
        partOfSpeech: 'adj'
      })
    })
  }

  const nounEnding = Object.keys(nounSingleMasculine).find(ending => text.endsWith(ending))
  if (nounEnding && text.length > 2) {
    const singleMasculineEndings = nounSingleMasculine[nounEnding] || []
    singleMasculineEndings.forEach(singleMasculineEnding => {
      const isMF = masculineAndFeminineEndings.includes(nounEnding) && singleMasculineEnding.endsWith('o')

      possibleLemmas.push({
        lemma: text.substring(0, text.length - nounEnding.length) + singleMasculineEnding,
        partOfSpeech: 'noun',
        gender: isMF ? 'm/f' : null
      })
    })
  }

  const verbEnding = indirectAndDirectPronouns.find(ending => text.endsWith(ending))
  if (verbEnding && text.length > 2) {
    possibleLemmas.push({
      lemma: text.substring(0, text.length - verbEnding.length),
      partOfSpeech: 'verb'
    })
  }

  return possibleLemmas
}

export default getSpanishPossibleLemmas
