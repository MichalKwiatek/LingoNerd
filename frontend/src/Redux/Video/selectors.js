import { getCurrectUserId } from '../User/selectors'
import { videoModuleName } from './constants/actions'

export const getVideos = (state) => {
  const { videos } = state[videoModuleName]

  return Object.values(videos).sort((x, y) => y.creationTimestamp - x.creationTimestamp)
}

export const getVideo = (id) => (state) => {
  const { videos } = state[videoModuleName]

  return videos[id]
}

export const getVideosPage = (state) => {
  const { videosPage } = state[videoModuleName]

  return videosPage
}

export const getAreVideosLoading = (state) => {
  const { areVideosLoading } = state[videoModuleName]

  return areVideosLoading
}

export const getAreMoreVideos = (state) => {
  const { areMoreVideos } = state[videoModuleName]

  return areMoreVideos
}

export const getMyVideosPage = (state) => {
  const { myVideosPage } = state[videoModuleName]

  return myVideosPage
}

export const getAreMyVideosLoading = (state) => {
  const { areMyVideosLoading } = state[videoModuleName]

  return areMyVideosLoading
}

export const getAreMoreMyVideos = (state) => {
  const { areMoreMyVideos } = state[videoModuleName]

  return areMoreMyVideos
}

export const getMyVideos = (state) => {
  const currentUserId = getCurrectUserId(state)
  const videos = getVideos(state)

  return videos
    .filter(v => v.creatorId === currentUserId)
}

export const getClipLike = (wordId, contextId) => (state) => {
  const { clipLikes } = state[videoModuleName]

  return clipLikes[`${wordId}||${contextId}`]?.value
}

export const getVideoLike = (videoId) => (state) => {
  const { videoLikes } = state[videoModuleName]

  return videoLikes[videoId]?.value
}

export const getLikedVideosPage = (state) => {
  const { likedVideosPage } = state[videoModuleName]

  return likedVideosPage
}

export const getAreLikedVideosLoading = (state) => {
  const { areLikedVideosLoading } = state[videoModuleName]

  return areLikedVideosLoading
}

export const getAreMoreLikedVideos = (state) => {
  const { areMoreLikedVideos } = state[videoModuleName]

  return areMoreLikedVideos
}

export const getLikedVideos = (state) => {
  const videos = getVideos(state)

  const { videoLikes } = state[videoModuleName]
  const likedVideoIds = Object.keys(videoLikes)

  return videos
    .filter(v => likedVideoIds.includes(v.id) && videoLikes[v.id].value === 1)
    .sort((v1, v2) => videoLikes[v2.id].timestamp - videoLikes[v1.id].timestamp)
}
