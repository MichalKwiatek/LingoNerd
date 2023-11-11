import useMediaQuery from '@mui/material/useMediaQuery'
import mixpanel from 'mixpanel-browser'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAllVideos } from '../Redux/Video/actions'
import {
  getAreVideosLoading,
  getVideos,
  getVideosPage,
  getAreMoreVideos,
} from '../Redux/Video/selectors'
import getYoutubeVideoId from '../utils/getYoutubeVideoId'

function VideosPage() {
  const dispatch = useDispatch()
  const isMobile = useMediaQuery('(max-width:768px)')
  const navigate = useNavigate()

  const videos = useSelector(getVideos)
  const videosPage = useSelector(getVideosPage)
  const areVideosLoading = useSelector(getAreVideosLoading)
  const areMoreVideos = useSelector(getAreMoreVideos)

  useEffect(() => {
    mixpanel.track('VIDEOS_PAGE_SHOWN')
  }, [])

  useEffect(() => {
    if (videosPage === null) {
      dispatch(fetchAllVideos(0))
    }
  }, [])

  const handleScroll = (e) => {
    if (
      e.target.scrollHeight - e.target.scrollTop <
      e.target.clientHeight + 10
    ) {
      if (!areVideosLoading && areMoreVideos) {
        dispatch(fetchAllVideos(videosPage + 1))
      }
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: isMobile ? 20 : 310,
        marginTop: 80,
        height: '100%',
        overflow: 'auto',
      }}
      onScroll={handleScroll}
    >
      {videos.map(({ id, title, url }) => {
        return (
          <div
            key={id}
            style={{
              marginRight: 15,
              cursor: 'pointer',
            }}
            onClick={() => navigate(`/video/${id}`)}
          >
            <img
              src={`https://img.youtube.com/vi/${getYoutubeVideoId(url)}/0.jpg`}
              style={{
                borderRadius: 20,
                width: 305,
                height: 200,
              }}
            />
            <div
              style={{
                width: 280,
                marginTop: 10,
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              {title}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default VideosPage
