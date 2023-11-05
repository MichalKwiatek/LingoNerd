import { FETCH_VIDEO } from '../Context/constants/actions'
import { FETCH_LEARNING_HISTORY } from '../LearningHistory/constants/actions'
import { RESET_MODELS } from '../selectors'
import { FETCH_MY_VIDEOS, FETCH_VIDEOS, SET_MY_VIDEOS_LOADING, SET_VIDEOS_LOADING, LIKE_VIDEO, LIKE_CLIP, SET_LIKED_VIDEOS_LOADING, FETCH_LIKED_VIDEOS } from './constants/actions'

const initialState = {
  videos: {},

  videoLikes: {},
  clipLikes: {},

  videosPage: null,
  areMoreVideos: true,
  areVideosLoading: false,

  myVideosPage: null,
  areMoreMyVideos: true,
  areMyVideosLoading: false,

  likedVideosPage: null,
  areMoreLikedVideos: true,
  areLikedVideosLoading: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case RESET_MODELS:
      return initialState
    case FETCH_VIDEOS:
      return {
        ...state,
        videos: { ...state.videos, ...action.videos },
        videosPage: action.page,
        areMoreVideos: action.areMoreVideos,
        areVideosLoading: false
      }

    case FETCH_MY_VIDEOS:
      return {
        ...state,
        videos: { ...action.videos, ...state.videos },
        myVideosPage: action.page,
        areMoreMyVideos: action.areMoreVideos,
        areMyVideosLoading: false
      }
    case SET_MY_VIDEOS_LOADING:
      return {
        ...state,
        areMyVideosLoading: action.areLoading
      }

    case FETCH_LIKED_VIDEOS:
      return {
        ...state,
        videos: { ...action.videos, ...state.videos },
        likedVideosPage: action.page,
        areMoreLikedVideos: action.areMoreVideos,
        areLikedVideosLoading: false
      }
    case SET_LIKED_VIDEOS_LOADING:
      return {
        ...state,
        areLikedVideosLoading: action.areLoading
      }

    case FETCH_VIDEO:
      return {
        ...state,
        videos: {
          ...state.videos,
          [action.video.id]: { ...state.videos[action.video.id], ...action.video }
        }
      }
    case SET_VIDEOS_LOADING:
      return {
        ...state,
        areVideosLoading: action.areLoading
      }

    case LIKE_VIDEO:
      return {
        ...state,
        videoLikes: {
          ...state.videoLikes,
          [action.videoId]: {
            videoId: action.videoId,
            value: action.value,
            timestamp: action.timestamp
          }
        }
      }

    case LIKE_CLIP:
      return {
        ...state,
        clipLikes: {
          ...state.clipLikes,
          [`${action.wordId}||${action.contextId}`]: {
            wordId: action.wordId,
            contextId: action.contextId,
            videoId: action.videoId,
            value: action.value,
            timestamp: action.timestamp
          }
        }
      }

    case FETCH_LEARNING_HISTORY:
      return {
        ...state,
        clipLikes: action.clipLikes,
        videoLikes: action.videoLikes
      }
    default:
      return state
  }
}
