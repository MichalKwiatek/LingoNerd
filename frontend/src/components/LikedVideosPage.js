import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getCurrectUserId } from '../Redux/User/selectors'
import { fetchLikedVideos } from '../Redux/Video/actions'
import {
  getAreLikedVideosLoading,
  getLikedVideos,
  getLikedVideosPage,
  getAreMoreLikedVideos,
} from '../Redux/Video/selectors'
import getYoutubeVideoId from '../utils/getYoutubeVideoId'
import mixpanel from 'mixpanel-browser'

function LikedVideosPage() {
  const dispatch = useDispatch()
  const isMobile = useMediaQuery('(max-width:768px)')
  const navigate = useNavigate()

  const currentUserId = useSelector(getCurrectUserId)
  const videos = useSelector(getLikedVideos)
  const videosPage = useSelector(getLikedVideosPage)
  const areVideosLoading = useSelector(getAreLikedVideosLoading)
  const areMoreVideos = useSelector(getAreMoreLikedVideos)

  useEffect(() => {
    mixpanel.track('LIKED_VIDEOS_PAGE_SHOWN')
  }, [])

  useEffect(() => {
    if (videosPage === null && currentUserId) {
      dispatch(fetchLikedVideos(0))
    }
  }, [currentUserId])

  const handleScroll = (e) => {
    if (
      e.target.scrollHeight - e.target.scrollTop <
      e.target.clientHeight + 10
    ) {
      if (!areVideosLoading && areMoreVideos) {
        dispatch(fetchLikedVideos(videosPage + 1))
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
      {videos.length > 0 &&
        videos.map(({ id, title, url }) => {
          return (
            <div
              key={id}
              style={{
                marginRight: 15,
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() => navigate(`/video/${id}`)}
            >
              <img
                src={`https://img.youtube.com/vi/${getYoutubeVideoId(
                  url
                )}/0.jpg`}
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
      {videos.length === 0 && (
        <div style={{ display: 'flex' }}>
          <Typography variant="h6" component="h2">
            You haven't liked any videos yet
          </Typography>
        </div>
      )}
    </div>
  )
}

export default LikedVideosPage
