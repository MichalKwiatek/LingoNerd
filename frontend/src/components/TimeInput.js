import React, { useEffect, useState } from 'react'

function getNumberDisplay(number) {
  const positive = Math.abs(number)

  if (positive === 0) {
    return '00'
  }

  if (positive < 10) {
    return '0' + positive
  }

  return positive
}

function secondsToHms(d) {
  const positive = Math.abs(d)

  const h = Math.floor(positive / 3600)
  const m = Math.floor((positive % 3600) / 60)
  const s = Math.floor((positive % 3600) % 60)
  const ms = (positive % 1).toFixed(2).split('.')[1]

  return (
    (d < 0 ? '-' : '') +
    getNumberDisplay(h) +
    ':' +
    getNumberDisplay(m) +
    ':' +
    getNumberDisplay(s) +
    ',' +
    ms
  )
}

function parseTimeDisplayToTime(display) {
  try {
    const parts = display.split(':')

    const isNegative = parts[0].startsWith('-')

    const h = parseInt(parts[0].slice(isNegative ? 1 : 0))
    const m = parseInt(parts[1])
    const s = parseInt(parts[2])
    const ms = parseFloat('0.' + display.split(',')[1])

    if (parts.length !== 3 || isNaN(h) || isNaN(m) || isNaN(s) || isNaN(ms)) {
      return 0
    }

    return (isNegative ? -1 : 1) * (h * 3600 + m * 60 + s + ms)
  } catch (error) {
    return 0
  }
}

function TimeInput(props) {
  const [timeLocal, setTimeLocal] = useState(secondsToHms(props.time))

  useEffect(() => {
    setTimeLocal(secondsToHms(props.time))
  }, [props.time])

  const onBlur = () => {
    const newTime = parseTimeDisplayToTime(timeLocal)

    if (newTime === null) {
      setTimeLocal(secondsToHms(props.time))
    } else {
      const cleanTime = Math.min(
        Math.max(newTime, props.minTime || -1000000000),
        props.maxTime || 1000000000
      )
      props.setTime(cleanTime)
    }
  }

  return props.editable ? (
    <input
      style={props.style}
      value={timeLocal}
      onChange={(event) => setTimeLocal(event.target.value)}
      onBlur={onBlur}
    />
  ) : (
    <div>{timeLocal}</div>
  )
}

export default TimeInput
