import Button from '@mui/material/Button'
import { TextareaAutosize } from '@mui/base/TextareaAutosize'
import React, { useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import TimeInput from './TimeInput'
import { v4 as uuidv4 } from 'uuid'

function getMinStartTime (subtitles, subtitle) {
  const prevSubtitles = subtitles
    .filter(s => s.id !== subtitle.id)
    .filter(s => s.startTime < subtitle.startTime)

  if (prevSubtitles.length === 0) {
    return 0
  }

  return Math.max(...prevSubtitles.map(s => s.startTime)) + 0.01
}

function SubtitleList (props) {
  const [duration, setDuration] = useState(null)
  const [videoTime, setVideoTime] = useState(0)
  const [moveTime, setMoveTime] = useState(0)
  const videoElement = useRef()

  const updateSubtitle = (id, value, key) => {
    props.setSubtitles(props.subtitles.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          [key]: value
        }
      }

      return { ...sub }
    }))
  }

  const moveSubtitles = () => {
    props.setSubtitles(props.subtitles.map(sub => {
      return {
        ...sub,
        startTime: Math.max(Math.min(sub.startTime + moveTime, duration), 0)
      }
    }))

    setMoveTime(0)
  }

  const removeSubtitle = (id) => {
    props.setSubtitles(props.subtitles.filter(sub => sub.id !== id))
  }

  const onAddNewSubtitle = (subtitle) => {
    const newSubtitle = {
      id: uuidv4(),
      startTime: subtitle.startTime + 0.01,
      subtitle: ''
    }

    props.setSubtitles([...props.subtitles, newSubtitle])
  }

  const addFirstSubtitle = () => {
    const newSubtitle = {
      id: uuidv4(),
      startTime: 0,
      subtitle: ''
    }

    props.setSubtitles([...props.subtitles, newSubtitle])
  }

  function getIsMinimalSubtitle () {
    const firstSubtitle = props.subtitles
      .sort((x, y) => x.startTime - y.startTime)[0]

    if (!firstSubtitle) {
      return false
    }

    return firstSubtitle.startTime === 0
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <div style={{
        width: 500,
        height: 400,
        overflow: 'auto',
        marginRight: 100
      }}>
        <Button disabled={getIsMinimalSubtitle()} onClick={() => addFirstSubtitle()}>
          Add subtitle <AddIcon />
        </Button>
        {props.subtitles
          .sort((x, y) => x.startTime - y.startTime)
          .map(subtitle => (
            <div
              key={subtitle.id}
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 5
              }}>
              <TextareaAutosize
                value={subtitle.subtitle}
                minRows={7}
                maxRows={7}
                style={{ width: 350 }}
                onChange={(e) => updateSubtitle(subtitle.id, e.target.value, 'subtitle')}
              />
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 20
              }}>
                <TimeInput
                  style={{ width: 70, padding: 5, marginBottom: 5 }}
                  time={subtitle.startTime}
                  setTime={(time) => updateSubtitle(subtitle.id, time, 'startTime')}
                  minTime={getMinStartTime(props.subtitles, subtitle)}
                  maxTime={duration}
                  editable
                />
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end'
                }}>
                  <IconButton onClick={() => removeSubtitle(subtitle.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    disabled={duration <= subtitle.startTime}
                    onClick={() => onAddNewSubtitle(subtitle)}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div>
        <TimeInput
          time={videoTime}
          editable={false}
        />
        <ReactPlayer
          url={props.url}
          controls={true}
          config={{
            youtube: {
              playerVars: { autoplay: 0, cc_load_policy: 1, cc_lang_pref: 'es-419' }
            }
          }}
          width={500}
          height={300}
          ref={videoElement}
          onReady={() => setDuration(videoElement.current.getDuration())}
          onProgress={e => setVideoTime(e.playedSeconds)}
          progressInterval={100}
        />
        <div style={{
          width: 500,
          marginTop: 10,
          padding: 10,
          fontSize: 20
        }}>
          {props.subtitles
            .filter((s) => s.startTime <= videoTime)
            .sort((x, y) => y.startTime - x.startTime)[0]?.subtitle
          }
        </div>
        <div>
          Move subtitles by:
          <TimeInput time={moveTime} setTime={setMoveTime} editable />
          <Button disabled={moveTime === 0} onClick={moveSubtitles}>
            Move
        </Button>
        </div>
      </div>
    </div>
  )
}

export default SubtitleList
