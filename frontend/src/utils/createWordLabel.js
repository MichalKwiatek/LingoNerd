const createWordLabel = (word) => {
  if (word.id === 'NOT_A_WORD') {
    return 'Not a Spanish word'
  }

  const shortTranslation = word.translation
    .split('(')[0]
    .split(/[,;]+/).slice(0, 2).join(',')

  return `${word.lemma} - ${shortTranslation}`
}

export default createWordLabel
