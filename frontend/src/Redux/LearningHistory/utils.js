export function parseLearntWord (dbLearntWord) {
  return {
    wordId: dbLearntWord.word_id,
    timesSeen: dbLearntWord.times_seen,
    learntTimestamp: parseInt(dbLearntWord.learnt_timestamp),
    lastSeenTimestamp: parseInt(dbLearntWord.last_seen_timestamp)
  }
}

export function parseClipLike (dbClipLike) {
  return {
    wordId: dbClipLike.word_id,
    contextId: dbClipLike.context_id,
    timestamp: dbClipLike.timestamp,
    value: dbClipLike.value,
    videoId: dbClipLike.video_id
  }
}

export function parseVideoLike (dbVideoLike) {
  return {
    timestamp: dbVideoLike.timestamp,
    value: dbVideoLike.value,
    videoId: dbVideoLike.video_id
  }
}
