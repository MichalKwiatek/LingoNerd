import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'

const AudioPlayer = ({ id, buttonVariant = 'contained' }) => {
  const url = encodeURI(`https://115951336075-audio.s3.eu-west-1.amazonaws.com/ESP/${id}.mp3`)
  const [audio, setAudio] = useState(null)

  useEffect(() => {
    const newAudio = new Audio(url)
    setAudio(newAudio)
    newAudio.play()

    return () => {
      newAudio.pause()
    }
  }, [url])

  const play = (e) => {
    e.stopPropagation()
    audio.currentTime = 0
    audio.play()
  }

  return (
    <Button variant={buttonVariant} onClick={play}>
      <VolumeUpIcon />
    </Button>
  )
}

export default AudioPlayer
