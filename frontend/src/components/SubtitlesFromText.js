import Button from '@mui/material/Button'
import { TextareaAutosize } from '@mui/base/TextareaAutosize'
import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import TimeInput from './TimeInput'
import { v4 as uuidv4 } from 'uuid'
import '../styles/subtitles-from-text.css'
import InfoModal from './InfoModal'

function SubtitlesFromText(props) {
  const [videoTime, setVideoTime] = useState(0)
  const [localSubtitles, setLocalSubtitles] = useState([])
  const [text, setText] = useState('')
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  const setSubtitleTime = (id) => {
    setLocalSubtitles(
      localSubtitles.map((sub) => {
        if (sub.id === id) {
          return {
            ...sub,
            startTime: videoTime,
          }
        }

        return { ...sub }
      })
    )
  }

  const removeSubtitle = (id) => {
    setLocalSubtitles(localSubtitles.filter((sub) => sub.id !== id))
  }

  const loadSubtitles = () => {
    const lines = text.split('\n')
    setLocalSubtitles(
      lines.filter(Boolean).map((line) => ({
        id: uuidv4(),
        startTime: null,
        subtitle: line,
      }))
    )

    const wasInfoShown = localStorage.getItem('CLICK_ON_SUBTITLES_SHOWN')
    if (!wasInfoShown) {
      setIsInfoModalOpen(true)
      localStorage.setItem('CLICK_ON_SUBTITLES_SHOWN', true)
    }
  }

  const reviewSubtitles = () => {
    props.setSubtitles(
      localSubtitles
        .sort((x, y) => x.startTime - y.startTime)
        .map((s, index, array) => ({
          id: s.id,
          startTime: s.startTime,
          subtitle: s.subtitle,
        }))
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <InfoModal
        isModalOpen={isInfoModalOpen}
        setIsModalOpen={setIsInfoModalOpen}
        description={
          'Start the video and click on subtitle at the right moment to set its time'
        }
      />
      <div>
        <div
          style={{
            width: 500,
            height: 400,
            overflow: 'auto',
            marginRight: 100,
          }}
        >
          {localSubtitles.length === 0 && (
            <div
              style={{ marginTop: 20, display: 'flex', alignItems: 'flex-end' }}
            >
              <TextareaAutosize
                placeholder={'Paste text here'}
                minRows={3}
                style={{ width: 600 }}
                onChange={(e) => setText(e.target.value)}
              />
              <Button
                style={{ marginLeft: 10, height: 50 }}
                variant={'contained'}
                onClick={loadSubtitles}
                disabled={!text}
              >
                Load subtitles
              </Button>
            </div>
          )}
          {localSubtitles.length > 0 &&
            localSubtitles.map((subtitle) => (
              <div
                key={subtitle.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 5,
                }}
              >
                <div
                  className={'subtitle'}
                  style={{ width: 350 }}
                  onClick={() => setSubtitleTime(subtitle.id)}
                >
                  {subtitle.subtitle}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: 20,
                  }}
                >
                  <TimeInput
                    style={{ width: 70, padding: 5, marginBottom: 5 }}
                    time={subtitle.startTime}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <IconButton onClick={() => removeSubtitle(subtitle.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <Button
          style={{ marginTop: 30 }}
          variant="contained"
          color="primary"
          onClick={reviewSubtitles}
          disabled={localSubtitles.some((s) => s.startTime === null)}
        >
          review subtitles
        </Button>
      </div>
      <div>
        <TimeInput time={videoTime} editable={false} />
        <ReactPlayer
          url={props.url}
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
          onProgress={(e) => setVideoTime(e.playedSeconds)}
          progressInterval={100}
        />
        <div
          style={{
            width: 500,
            marginTop: 10,
            padding: 10,
            fontSize: 20,
          }}
        >
          {
            localSubtitles
              .filter((s) => s.startTime <= videoTime)
              .sort((x, y) => y.startTime - x.startTime)[0]?.subtitle
          }
        </div>
      </div>
    </div>
  )
}

export default SubtitlesFromText
