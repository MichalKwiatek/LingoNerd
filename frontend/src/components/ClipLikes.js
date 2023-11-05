import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getClipLike } from '../Redux/Video/selectors'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import { Auth } from 'aws-amplify'
import { likeClip } from '../Redux/Video/actions'
import AccountNeededModal from './AccountNeededModal'
import { getIsAuthorized } from '../Redux/User/selectors'

function ClipLikes (props) {
  const dispatch = useDispatch()

  const isAuthorized = useSelector(getIsAuthorized)
  const [isForbiddenModalOpen, setIsForbiddenModalOpen] = useState(false)

  const like = useSelector(getClipLike(props.wordId, props.contextId))

  const onLike = () => {
    if (!isAuthorized) {
      setIsForbiddenModalOpen(true)
      return
    }

    Auth.currentSession().then(data => {
      const token = data.getIdToken().getJwtToken()

      const newValue = like === 1 ? 0 : 1
      dispatch(likeClip(props.videoId, newValue, props.wordId, props.contextId, token))
    })
  }

  const onDislike = () => {
    if (!isAuthorized) {
      setIsForbiddenModalOpen(true)
      return
    }

    Auth.currentSession().then(data => {
      const token = data.getIdToken().getJwtToken()

      const newValue = like === -1 ? 0 : -1
      dispatch(likeClip(props.videoId, newValue, props.wordId, props.contextId, token))
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <AccountNeededModal isModalOpen={isForbiddenModalOpen} setIsModalOpen={setIsForbiddenModalOpen} />
      <Typography
        style={{
          marginRight: 10,
          fontSize: 20
        }}
      >
        Rate clip:
      </Typography>
      <div style={{
        width: 80,
        border: '2px solid #777',
        borderRadius: 20,
        padding: '0px 10px'
      }}>
        <IconButton onClick={onLike}>
          <ThumbUpIcon sx={like === 1 ? { fill: 'green' } : {}} />
        </IconButton>
        <IconButton onClick={onDislike}>
          <ThumbDownIcon sx={like === -1 ? { fill: 'red' } : {}} />
        </IconButton>
      </div>
    </div>
  )
}

export default ClipLikes
