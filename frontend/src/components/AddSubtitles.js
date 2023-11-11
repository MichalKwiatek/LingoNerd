import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import { TextareaAutosize } from '@mui/base/TextareaAutosize'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import '../styles/placement.css'
import Typography from '@mui/material/Typography'

import ReactPlayer from 'react-player'
import '../styles/add-video.css'
import { addContexts, fetchVideo } from '../Redux/Context/actions'
import srtParser2 from 'srt-parser-2'
import { getVideo } from '../Redux/Video/selectors'
import SubtitleList from './SubtitleList'
import { v4 as uuidv4 } from 'uuid'
import { getVideoContexts } from '../Redux/Context/selectors'
import { Auth } from 'aws-amplify'
import SubtitlesFromText from './SubtitlesFromText'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

function AddVideo() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { videoId } = useParams()

  const video = useSelector(getVideo(videoId))
  const videoSubtitles = useSelector(getVideoContexts(video?.id))

  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false)
  const [srt, setSRT] = useState(null)
  const [mode, setMode] = useState(null)
  const [subtitles, setSubtitles] = useState([])

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  useEffect(() => {
    if (videoId) {
      dispatch(fetchVideo(videoId))
    }
  }, [videoId])

  useEffect(() => {
    if (video && videoSubtitles.length > 0) {
      setSubtitles(videoSubtitles)
      setMode('MANUAL')
    }
  }, [!!video, videoSubtitles.length])

  const onSuccess = () => {
    setIsSuccessModalOpen(true)
  }

  const onFailure = () => {
    setIsFailureModalOpen(true)
  }

  const loadSRT = () => {
    const parser = new srtParser2()
    const srtArray = parser.fromSrt(srt)

    if (srtArray.length > 0) {
      const subs = srtArray.map((srt) => ({
        id: uuidv4(),
        startTime: srt.startSeconds,
        subtitle: srt.text,
      }))
      setSubtitles(subs)
      setMode('MANUAL')
    } else {
      setIsFailureModalOpen(true)
    }
  }

  const saveSubtitles = () => {
    if (!video) {
      return
    }

    Auth.currentSession().then((data) => {
      const token = data.getIdToken().getJwtToken()

      dispatch(
        addContexts(
          video.id,
          video.language,
          subtitles,
          onSuccess,
          onFailure,
          token
        )
      )
    })
  }

  return (
    <div style={{ padding: 20, position: 'relative', paddingTop: 20 }}>
      <Modal
        open={isFailureModalOpen}
        onClose={() => setIsFailureModalOpen(false)}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Parsing SRT failed. Are you sure the subtitles are correct?
          </Typography>
          <Button
            variant="contained"
            onClick={() => setIsFailureModalOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>

      <Modal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Would you like to choose translations for the subtitles?
          </Typography>
          <div style={{ marginTop: 10, display: 'flex' }}>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => navigate(`/video/${videoId}`)}
              style={{ marginRight: 30 }}
            >
              go to video
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => navigate(`/check-subtitles/${videoId}`)}
            >
              translate
            </Button>
          </div>
        </Box>
      </Modal>

      <Typography
        id="modal-modal-title"
        variant="h5"
        component="h2"
        style={{ marginTop: 15, marginBottom: 40 }}
      >
        Add subtitles to the video:
      </Typography>

      {!mode && (
        <>
          <ReactPlayer
            url={video?.url}
            controls={true}
            config={{
              youtube: {
                playerVars: {
                  autoplay: 0,
                  cc_load_policy: 1,
                  cc_lang_pref: 'es-419',
                },
              },
            }}
            width={500}
            height={300}
          />
          <div style={{ marginTop: 20 }}>
            <Button
              style={{ marginRight: 20 }}
              variant={'contained'}
              onClick={() => setMode('SRT')}
            >
              From SRT
            </Button>
            <Button
              style={{ marginRight: 20 }}
              variant={'contained'}
              onClick={() => setMode('TEXT')}
            >
              from text
            </Button>
            <Button variant={'contained'} onClick={() => setMode('MANUAL')}>
              Manual
            </Button>
          </div>
        </>
      )}

      {mode === 'SRT' && subtitles.length === 0 && (
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'flex-end' }}>
          <TextareaAutosize
            placeholder={'Paste subtitles in SRT format here'}
            minRows={3}
            style={{ width: 600 }}
            onChange={(e) => setSRT(e.target.value)}
          />
          <Button
            style={{ marginLeft: 10, height: 50 }}
            variant={'contained'}
            onClick={loadSRT}
            disabled={!srt}
          >
            add subtitles from SRT
          </Button>
        </div>
      )}

      {(mode === 'MANUAL' || subtitles.length > 0) && (
        <SubtitleList
          id={video?.id}
          url={video?.url}
          subtitles={subtitles}
          setSubtitles={setSubtitles}
        />
      )}

      {mode === 'TEXT' && subtitles.length === 0 && (
        <SubtitlesFromText
          id={video?.id}
          url={video?.url}
          subtitles={subtitles}
          setSubtitles={setSubtitles}
        />
      )}

      {subtitles.length > 0 && (
        <Button
          style={{ marginTop: 30 }}
          variant="contained"
          color="primary"
          onClick={saveSubtitles}
        >
          save subtitles
        </Button>
      )}
    </div>
  )
}

export default AddVideo
