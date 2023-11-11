import useMediaQuery from '@mui/material/useMediaQuery'
import mixpanel from 'mixpanel-browser'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchVideo } from '../Redux/Context/actions'
import { fetchAllVideos } from '../Redux/Video/actions'
import { getVideo, getVideosPage } from '../Redux/Video/selectors'
import SuggestedVideoList from './SuggestedVideoList'
import Video from './Video'

function VideoPage() {
  const isMobile = useMediaQuery('(max-width:768px)')
  const { videoId } = useParams()
  const dispatch = useDispatch()
  const video = useSelector(getVideo(videoId))

  const videosPage = useSelector(getVideosPage)

  useEffect(() => {
    dispatch(fetchVideo(videoId))
  }, [videoId])

  useEffect(() => {
    if (videosPage === null) {
      dispatch(fetchAllVideos(0))
    }
  }, [videosPage])

  useEffect(() => {
    mixpanel.track('VIDEO_PAGE_SHOWN', {
      videoId,
    })
  }, [])

  if (!video) {
    return null
  }

  return (
    <div
      style={{
        width: isMobile ? '100%' : 'calc(100% - 300px)',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        marginLeft: isMobile ? 0 : 270,
      }}
    >
      <Video videoId={video.id} />
      {!isMobile && <SuggestedVideoList />}
    </div>
  )
}

export default VideoPage
