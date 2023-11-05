export function parseVideo (dbVideo) {
  return {
    id: dbVideo.id,
    creationTimestamp: dbVideo.creation_timestamp,
    title: dbVideo.title,
    url: dbVideo.url,
    creatorId: dbVideo.creator_id
  }
}
