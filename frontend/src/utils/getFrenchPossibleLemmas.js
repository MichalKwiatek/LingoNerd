const adjectiveSingleMasculine = {
  elle: ['el'],
  ère: ['er'],
  gue: ['g'],
  enne: ['en'],
  onne: ['on'],
  euse: ['eur'],
  ve: ['f'],
  sse: ['x'],
  se: ['x'],
  ce: ['x'],
  que: ['c'],
  cque: ['c'],
  che: ['c'],
  tte: ['t'],
  ète: ['et'],
  îche: ['is'],
  es: ['e', ''],
  e: [''],
  s: ['']
}
// gras grasse

const nounSingleMasculine = {
  s: '',
  x: ''
}

function getFrenchPossibleLemmas (text) {
  const possibleLemmas = []

  if (text === 's') {
    return [{ lemma: 'se' }, { lemma: 'si' }]
  }

  if (text === 'qu') {
    return [{ lemma: 'que' }]
  }

  if (text === 'une') {
    return [{ lemma: 'un' }]
  }

  if (text === 'm') {
    return [{ lemma: 'me' }]
  }

  if (text === 'd' || text === 'des') {
    return [{ lemma: 'de' }]
  }

  if (text === 'j') {
    return [{ lemma: 'je' }]
  }

  if (text === 'n') {
    return [{ lemma: 'ne' }]
  }

  if (text === 'cette' || text === 'ces' || text === 'cett' || text === 'cet' || text === 'c') {
    return [{ lemma: 'ce' }]
  }

  if (text === 'toute' || text === 'tous' || text === 'toutes') {
    return [{ lemma: 'tout' }]
  }

  if (text === 'les') {
    return [{ lemma: 'le' }, { lemma: 'les' }]
  }

  if (text === 't') {
    return [{ lemma: 'tu' }, { lemma: 'te' }]
  }

  if (text === 'l') {
    return [{ lemma: 'la' }, { lemma: 'le' }]
  }

  if (text === 'celle' || text === 'ceux' || text === 'celles') {
    return [{ lemma: 'celui' }]
  }

  if (text === 'ils') {
    return [{ lemma: 'il' }]
  }

  if (text === 'jusqu') {
    return [{ lemma: 'jusque' }]
  }

  if (text === 'puisqu') {
    return [{ lemma: 'puisque' }]
  }

  if (text === 'mêmes') {
    return [{ lemma: 'même' }]
  }

  if (text === 'coeur' || text === 'coeurs') {
    return [{ lemma: 'cœur' }]
  }

  if (text === 'll') {
    return [{ lemma: 'il' }]
  }

  if (text === 'quelques') {
    return [{ lemma: 'quelque' }]
  }

  if (text === 'aucune') {
    return [{ lemma: 'aucun' }]
  }

  if (text === 'quelle') {
    return [{ lemma: 'quel' }]
  }

  if (text === 'soeur') {
    return [{ lemma: 'sœur' }]
  }

  if (text === 'folle') {
    return [{ lemma: 'fou' }]
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
    possibleLemmas.push({
      lemma: text.substring(0, text.length - nounEnding.length) + nounSingleMasculine[nounEnding],
      partOfSpeech: 'n'
    })
  }

  return possibleLemmas
}

export default getFrenchPossibleLemmas
