import IconButton from '@mui/material/IconButton'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getVideoLike } from '../Redux/Video/selectors'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import { Auth } from 'aws-amplify'
import { likeVideo } from '../Redux/Video/actions'
import AccountNeededModal from './AccountNeededModal'
import { getIsAuthorized } from '../Redux/User/selectors'

function VideoLikes(props) {
  const dispatch = useDispatch()

  const isAuthorized = useSelector(getIsAuthorized)
  const [isForbiddenModalOpen, setIsForbiddenModalOpen] = useState(false)

  const like = useSelector(getVideoLike(props.videoId))

  const onLike = () => {
    if (!isAuthorized) {
      setIsForbiddenModalOpen(true)
      return
    }

    Auth.currentSession().then((data) => {
      const token = data.getIdToken().getJwtToken()

      const newValue = like === 1 ? 0 : 1
      dispatch(likeVideo(props.videoId, newValue, token))
    })
  }

  const onDislike = () => {
    if (!isAuthorized) {
      setIsForbiddenModalOpen(true)
      return
    }

    Auth.currentSession().then((data) => {
      const token = data.getIdToken().getJwtToken()

      const newValue = like === -1 ? 0 : -1
      dispatch(likeVideo(props.videoId, newValue, token))
    })
  }

  return (
    <div
      style={{
        width: 80,
        border: '2px solid #777',
        borderRadius: 20,
        padding: '0px 10px',
      }}
    >
      <AccountNeededModal
        isModalOpen={isForbiddenModalOpen}
        setIsModalOpen={setIsForbiddenModalOpen}
      />
      <IconButton onClick={onLike}>
        <ThumbUpIcon sx={like === 1 ? { fill: 'green' } : {}} />
      </IconButton>
      <IconButton onClick={onDislike}>
        <ThumbDownIcon sx={like === -1 ? { fill: 'red' } : {}} />
      </IconButton>
    </div>
  )
}

export default VideoLikes
