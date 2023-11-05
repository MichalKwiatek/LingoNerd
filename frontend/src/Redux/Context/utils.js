export function parseContext (dbContext) {
  return {
    id: dbContext.id,
    creationTimestamp: dbContext.creation_timestamp,
    creatorId: dbContext.creator_id,
    language: dbContext.language,
    startTime: dbContext.start_time,
    subtitle: dbContext.subtitle,
    url: dbContext.url,
    videoId: dbContext.video_id,
    title: dbContext.title
  }
}

export function parseTranslation (dbTranslation) {
  return {
    id: dbTranslation.id,
    contextId: dbTranslation.context_id,
    isIrregular: dbTranslation.is_irregular,
    person: dbTranslation.person,
    tense: dbTranslation.tense,
    text: dbTranslation.text,
    textEnd: dbTranslation.text_end,
    textStart: dbTranslation.text_start,
    wordId: dbTranslation.word_id,
    strength: dbTranslation.strength,
    flashcardWordId: dbTranslation.flashcard_word_id,
    videoId: dbTranslation.video_id
  }
}
