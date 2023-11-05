import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import '../styles/placement.css'
import Typography from '@mui/material/Typography'

import ReactPlayer from 'react-player'
import ClearIcon from '@mui/icons-material/Clear'
import '../styles/add-video.css'
import { addVideo } from '../Redux/Context/actions'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import mixpanel from 'mixpanel-browser'

// const languages = [
//   {
//     id: 'FR',
//     label: 'French'
//   },
//   {
//     id: 'ESP',
//     label: 'Spanish'
//   }
// ]

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

function AddVideo () {
  const isMobile = useMediaQuery('(max-width:768px)')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const [language, setLanguage] = useState('ESP')
  const language = 'ESP'
  const [link, setLink] = useState('')
  const [title, setTitle] = useState('')

  const [isFailureModalOpen, setIsFailureModalOpen] = useState('')

  useEffect(() => {
    mixpanel.track('ADD_VIDEO_SHOWN')
  }, [])

  const onFailure = () => {
    setIsFailureModalOpen(true)
  }

  const onSuccess = (id) => {
    redirectToAddingSubtitles(id)
  }

  const onAddVideo = () => {
    const id = uuidv4()
    Auth.currentSession().then(data => {
      const token = data.getIdToken().getJwtToken()

      dispatch(addVideo(id, title, link, language, onSuccess, onFailure, token))
    })
  }

  const redirectToAddingSubtitles = (id) => {
    navigate('/add-subtitles/' + id)
  }

  return (
    <div style={{ padding: 20, position: 'relative' }}>
      <Modal
        open={isFailureModalOpen}
        onClose={() => setIsFailureModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Creating the video failed
          </Typography>
          <Button variant="contained" onClick={() => setIsFailureModalOpen(false)}>
            Close
          </Button>
        </Box>
      </Modal>

      <Typography id="modal-modal-title" variant="h5" component="h2" style={{ marginTop: 15 }}>
        Add a YouTube video:
          </Typography>
      {/* <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={language}
        onChange={handleChangeLanguage}
        style={{ marginTop: 10 }}
      >
        {languages.map(lang => <MenuItem key={lang.id} value={lang.id}>{lang.label}</MenuItem>)}
      </Select> */}
      <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', marginTop: 20 }}>
        <TextField
          label="Title"
          variant="outlined"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
        />
      </div>
      <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'row', marginTop: 20 }}>
        <TextField
          label="Youtube video link"
          variant="outlined"
          onChange={(e) => setLink(e.target.value)}
          value={link}
          type="text"
          name="link"
        />
        <Button onClick={() => setLink('')}>
          <ClearIcon />
        </Button>
      </div>
      {link && <ReactPlayer
        url={link}
        controls={true}
        config={{
          youtube: {
            playerVars: { autoplay: 1, cc_load_policy: 1 }
          }
        }}
        width={isMobile ? '100%' : 1000}
        height={isMobile ? 270 : 600}
      />}

      <Button
        variant="contained"
        style={{ marginTop: 20, marginBottom: 30 }}
        color="primary"
        onClick={onAddVideo}
        disabled={!title || !link}
      >
        Add video
      </Button>
    </div>
  )
}

export default AddVideo
