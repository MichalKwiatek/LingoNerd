import React, { useRef, useEffect, useState } from 'react'
import '../styles/timeline.css'

const subs = [
  {
    id: '1',
    startTime: 0,
    endTime: 15,
    subtitle: 'entendí que no es culpa mía limpiando'
  },
  {
    id: '2',
    startTime: 16,
    endTime: 25,
    subtitle: 'me volviste más dura las mujeres ya nome volviste más dura las mujeres ya nome volviste más dura las mujeres ya nome volviste más dura las mujeres ya nome volviste más dura las mujeres ya nome volviste más dura las mujeres ya nome volviste más dura las mujeres ya no'
  }
]

const duration = 70
const width = 1000

const Timeline = (props) => {
  const droppable = useRef()
  const [subtitles, setSubtitles] = useState(subs)

  const [draggedId, setDraggedId] = useState(null)
  const [draggingOffsetX, setDraggingOffsetX] = useState(null)

  const [isResizing, setIsResizing] = useState(false)
  const [resizingSide, setResizingSide] = useState(null)
  const [resizingId, setResizingId] = useState(null)
  const [resizingOffsetX, setResizingOffsetX] = useState(null)
  const [resizingInitialStartTime, setResizingInitialStartTime] = useState(null)
  const [resizingInitialEndTime, setResizingInitialEndTime] = useState(null)

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isResizing) {
        if (resizingSide === 'LEFT') {
          const resizedPixels = event.clientX - resizingOffsetX
          const s = (resizedPixels) / 1000 * 70

          const resized = subtitles.find(s => s.id === resizingId)
          if (!resized) {
            return
          }

          const max = resized.endTime - 0.1
          const prevSubs = subtitles
            .filter(sub => sub.endTime < resizingInitialStartTime)
            .map(sub => sub.endTime)
          const min = prevSubs.length > 0 ? (Math.max(...prevSubs) + 0.1) : 0
          const newTime = Math.min(Math.max(resizingInitialStartTime + s, min), max)

          setSubtitles(subtitles.map(sub => {
            if (sub.id === resizingId) {
              return {
                ...sub,
                startTime: newTime
              }
            }

            return { ...sub }
          }))
        }

        if (resizingSide === 'RIGHT') {
          const resizedPixels = event.clientX - resizingOffsetX
          const s = (resizedPixels) / 1000 * 70

          const resized = subtitles.find(s => s.id === resizingId)
          if (!resized) {
            return
          }

          const nextSubs = subtitles
            .filter(sub => sub.startTime > resizingInitialEndTime)
            .map(sub => sub.startTime)
          const max = nextSubs.length > 0 ? (Math.min(...nextSubs) - 0.1) : duration
          const min = resized.startTime + 0.1

          const newTime = Math.min(Math.max(resizingInitialEndTime + s, min), max)

          setSubtitles(subtitles.map(sub => {
            if (sub.id === resizingId) {
              return {
                ...sub,
                endTime: newTime
              }
            }

            return { ...sub }
          }))
        }
      }
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isResizing, resizingId, subtitles])

  useEffect(() => {
    const handleMouseUp = (event) => {
      setIsResizing(false)
      setResizingId(null)
      setResizingOffsetX(null)
      setResizingInitialStartTime(null)
    }

    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const onDrop = (event) => {
    const s = (event.clientX - draggingOffsetX) / 1000 * 70
    const dragged = subtitles.find(s => s.id === draggedId)

    if (!dragged) {
      return
    }

    const max = duration - dragged.endTime
    const min = -dragged.startTime
    const seconds = Math.min(Math.max(s, min), max)

    const newStartTime = dragged.startTime + seconds
    const newEndTime = dragged.endTime + seconds

    const conflicting = subtitles
      .filter(sub => sub.id !== draggedId)
      .find(sub => (sub.startTime <= newStartTime && sub.endTime >= newStartTime) ||
        (sub.startTime <= newEndTime && sub.endTime >= newEndTime) ||
        (sub.startTime >= newStartTime && sub.endTime <= newEndTime))

    if (conflicting) {
      return
    }

    setSubtitles(subtitles.map(sub => {
      if (sub.id === draggedId) {
        return {
          ...sub,
          startTime: newStartTime,
          endTime: newEndTime
        }
      }

      return { ...sub }
    }))

    setDraggedId(null)
    setDraggingOffsetX(null)
  }

  const onDragStart = (id, event) => {
    setDraggedId(id)
    setDraggingOffsetX(event.clientX)
  }

  const onDragOver = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }

  const onLeftMouseDown = (id, event) => {
    const sub = subtitles.find(s => s.id === id)
    if (!sub) {
      return
    }

    setResizingId(id)
    setIsResizing(true)
    setResizingOffsetX(event.clientX)
    setResizingInitialStartTime(sub.startTime)
    setResizingSide('LEFT')
  }

  const onRightMouseDown = (id, event) => {
    const sub = subtitles.find(s => s.id === id)
    if (!sub) {
      return
    }

    setResizingId(id)
    setIsResizing(true)
    setResizingOffsetX(event.clientX)
    setResizingInitialEndTime(sub.endTime)
    setResizingSide('RIGHT')
  }

  return (<div
    ref={droppable}
    onDrop={onDrop}
    onDragOver={onDragOver}
    onDragEnter={onDragOver}
    style={{
      width,
      height: 100,
      backgroundColor: '#444',
      position: 'relative'
    }}
  >
    {subtitles.map(({ id, startTime, endTime, subtitle }) => {
      return (<div
        key={id}
        style={{
          backgroundColor: '#fff',
          position: 'absolute',
          height: 90,
          top: 5,
          width: (endTime - startTime) / duration * width,
          left: startTime / duration * width,
          overflow: 'hidden'
        }}
      >
        <div className={'leftSide'} onMouseDown={(event) => onLeftMouseDown(id, event)}></div>
        <div
          style={{
            height: '100%'
          }}
          draggable
          onDragStart={(event) => onDragStart(id, event)}
        >
          {subtitle}
        </div>
        <div className={'rightSide'} onMouseDown={(event) => onRightMouseDown(id, event)}></div>
      </div>)
    })}
  </div>)
}

export default Timeline
