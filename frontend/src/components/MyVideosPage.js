import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getCurrectUserId } from '../Redux/User/selectors'
import { fetchMyVideos } from '../Redux/Video/actions'
import { getAreMyVideosLoading, getMyVideos, getMyVideosPage, getAreMoreMyVideos } from '../Redux/Video/selectors'
import getYoutubeVideoId from '../utils/getYoutubeVideoId'
import EditIcon from '@mui/icons-material/Edit'

function MyVideosPage () {
  const dispatch = useDispatch()
  const isMobile = useMediaQuery('(max-width:768px)')
  const navigate = useNavigate()

  const currentUserId = useSelector(getCurrectUserId)
  const videos = useSelector(getMyVideos)
  const videosPage = useSelector(getMyVideosPage)
  const areVideosLoading = useSelector(getAreMyVideosLoading)
  const areMoreVideos = useSelector(getAreMoreMyVideos)

  useEffect(() => {
    if (videosPage === null && currentUserId) {
      dispatch(fetchMyVideos(0))
    }
  }, [currentUserId])

  const handleScroll = (e) => {
    if (e.target.scrollHeight - e.target.scrollTop < (e.target.clientHeight + 10)) {
      if (!areVideosLoading && areMoreVideos) {
        dispatch(fetchMyVideos(videosPage + 1))
      }
    }
  }

  const onEdit = (event, id) => {
    event.stopPropagation()
    event.preventDefault()
    navigate('/add-subtitles/' + id)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginLeft: isMobile ? 20 : 310,
      marginTop: 80,
      height: '100%',
      overflow: 'auto'
    }}
      onScroll={handleScroll}
    >
      {
        videos.length > 0 && videos.map(({ id, title, url }) => {
          return (<div
            key={id}
            style={{
              marginRight: 15,
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={() => navigate(`/video/${id}`)}
          >
            <IconButton
              style={{ position: 'absolute', top: 5, right: 5, background: '#fff' }}
              onClick={(event) => onEdit(event, id)}
            >
              <EditIcon />
            </IconButton>
            <img src={`https://img.youtube.com/vi/${getYoutubeVideoId(url)}/0.jpg`}
              style={{
                borderRadius: 20,
                width: 305,
                height: 200
              }}
            />
            <div
              style={{
                width: 280,
                marginTop: 10,
                marginBottom: 20,
                fontWeight: 600
              }}
            >
              {title}
            </div>
          </div>)
        })
      }
      {videos.length === 0 && (
        <div style={{ display: 'flex' }}>
          <Typography variant="h6" component="h2">
            You haven't added any videos yet
          <Button
              onClick={() => navigate('/add-video')}
              variant="contained"
              color="primary"
              style={{ height: 40, marginLeft: 15 }}
            >
              Add a video!
        </Button>
          </Typography>
        </div>
      )}
    </div >
  )
}

export default MyVideosPage
