import { API_URL } from '../../constants'
import {
  FETCH_MY_VIDEOS,
  FETCH_VIDEOS,
  SET_MY_VIDEOS_LOADING,
  SET_VIDEOS_LOADING,
  LIKE_VIDEO,
  LIKE_CLIP,
  SET_LIKED_VIDEOS_LOADING,
  FETCH_LIKED_VIDEOS,
} from './constants/actions'
import { getCurrectUserId } from '../User/selectors'
import { getCurrentDate } from '../../utils/dateUtils'
import { parseVideo } from './utils'
import mixpanel from 'mixpanel-browser'

export const fetchAllVideos = (page) => (dispatch) => {
  dispatch({
    type: SET_VIDEOS_LOADING,
    areLoading: true,
  })

  fetch(`${API_URL}/getAllVideos?language=ESP&page=` + page * 20)
    .then((res) => res.json())
    .then((data) => {
      const { videos } = data
      const areMoreVideos = videos.length === 20

      const videoMap = {}
      videos.map(parseVideo).forEach((video) => {
        videoMap[video.id] = video
      })

      dispatch({
        type: FETCH_VIDEOS,
        videos: videoMap,
        page,
        areMoreVideos,
      })
    })
}

export const fetchMyVideos = (page) => (dispatch, getState) => {
  const userId = getCurrectUserId(getState())

  dispatch({
    type: SET_MY_VIDEOS_LOADING,
    areLoading: true,
  })

  fetch(
    `${API_URL}/getAllVideos?language=ESP&page=${page * 20}&user_id=${userId}`
  )
    .then((res) => res.json())
    .then((data) => {
      const { videos } = data
      const areMoreVideos = videos.length === 20

      const videoMap = {}
      videos.map(parseVideo).forEach((video) => {
        videoMap[video.id] = video
      })

      dispatch({
        type: FETCH_MY_VIDEOS,
        videos: videoMap,
        page,
        areMoreVideos,
      })
    })
}

export const fetchLikedVideos = (page) => (dispatch, getState) => {
  const userId = getCurrectUserId(getState())

  dispatch({
    type: SET_LIKED_VIDEOS_LOADING,
    areLoading: true,
  })

  fetch(
    `${API_URL}/getLikedVideos?language=ESP&page=${page * 20}&user_id=${userId}`
  )
    .then((res) => res.json())
    .then((data) => {
      const { videos } = data
      const areMoreVideos = videos.length === 20

      const videoMap = {}
      videos.map(parseVideo).forEach((video) => {
        videoMap[video.id] = video
      })

      dispatch({
        type: FETCH_LIKED_VIDEOS,
        videos: videoMap,
        page,
        areMoreVideos,
      })
    })
}

export const likeClip =
  (videoId, value, wordId, contextId, token) => (dispatch, getState) => {
    const timestamp = getCurrentDate().getTime()

    mixpanel.track('LIKE_CLIP', {
      videoId,
      value,
      wordId,
      contextId,
    })

    dispatch({
      type: LIKE_CLIP,
      videoId,
      contextId,
      wordId,
      value,
      timestamp,
    })

    if (value === 1) {
      dispatch({
        type: LIKE_VIDEO,
        videoId,
        value,
        timestamp,
      })
    }

    fetch(`${API_URL}/likeClip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        videoId,
        value,
        wordId,
        contextId,
        timestamp,
      }),
    }).then((res) => {
      console.log(res)
      if (res.status !== 200) {
        console.error('error', res)
      }
    })
  }

export const likeVideo = (videoId, value, token) => (dispatch, getState) => {
  const timestamp = getCurrentDate().getTime()

  mixpanel.track('LIKE_VIDEO', {
    videoId,
    value,
  })

  dispatch({
    type: LIKE_VIDEO,
    videoId,
    value,
    timestamp,
  })

  fetch(`${API_URL}/likeVideo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      videoId,
      value,
      timestamp,
    }),
  }).then((res) => {
    console.log(res)
    if (res.status !== 200) {
      console.error('error', res)
    }
  })
}
