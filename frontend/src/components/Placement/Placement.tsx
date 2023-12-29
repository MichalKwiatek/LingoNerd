import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import './placement.css'
import useGetInitialLevel from './useGetInitialLevel'
import Loader from '../Loader'
import useGetAmountOfLevels from './useGetAmountOfLevels'

const WORDS_TO_SHOW = 10
const words = [Array.from(Array(1000).keys())].map((i) => ({
  id: i.toString(),
  lemma: `lemma${i}`,
  translation: `translation${i}`,
}))

function Placement() {
  const isMobile = useMediaQuery('(max-width:768px)')

  const { initialLevel, requestStatus: levelRequestStatus } = useGetInitialLevel()
  const { count: levelsCount, requestStatus: levelsCountRequestStatus } = useGetAmountOfLevels()

  const [value, setValue] = useState(initialLevel)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (levelRequestStatus === 'success') {
      setValue(initialLevel)
    }
  }, [initialLevel, levelRequestStatus])

  useEffect(() => {
    if (levelRequestStatus === 'success' && levelsCountRequestStatus === 'success') {
      setIsLoading(false)
    }
  }, [levelRequestStatus, levelsCountRequestStatus])

  const onSelectLevel = () => {
    // dispatch(selectLevelAction(words[value].frequency, navigate))
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div
      className={'placement'}
      style={isMobile ? { padding: 30 } : { padding: 50, width: 'calc(100% - 240px)', marginLeft: 240 }}
    >
      {isLoading && <Loader />}
      <Typography variant="h5" style={{ marginBottom: 30 }}>
        Move the slider below to change your initial level
      </Typography>
      <Typography className={'value-info'} variant="h5" sx={{ flexGrow: 1 }}>
        Level: {value + 1}/{levelsCount}
      </Typography>
      {!isLoading && <Slider defaultValue={initialLevel} min={0} max={levelsCount - 1} onChange={handleChange} />}
      <Typography style={{ marginTop: 10, fontWeight: 600 }}>Words to learn on the level:</Typography>
      <div className={'word-list'}>
        {words.slice(value, value + WORDS_TO_SHOW).map((word) => (
          <React.Fragment key={word.id}>
            <Typography className={'word'} sx={{ flexGrow: 1 }}>
              {word.lemma} - {word.translation}
            </Typography>
          </React.Fragment>
        ))}
      </div>
      <Button color="primary" variant="contained" onClick={onSelectLevel}>
        Choose level
      </Button>
    </div>
  )
}

export default Placement
