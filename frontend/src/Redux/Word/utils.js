export function parseWord (dbWord) {
  const [translation1, translation2] = dbWord.translation.split(/[,;](?![^(]*\))/)
  return {
    id: dbWord.id,
    lemma: dbWord.lemma,
    translation: [translation1, translation2].filter(Boolean).join(', '),
    isRegular: dbWord.is_regular,
    tense: dbWord.tense,
    person: dbWord.person,
    partOfSpeech: dbWord.part_of_speech,
    gender: dbWord.gender,
    rootWordId: dbWord.root_word_id,
    frequency: dbWord.frequency,
    flashcardWordId: dbWord.flashcard_word_id,
    numberOfVideos: dbWord.number_of_videos,
    examples: dbWord.examples
  }
}
