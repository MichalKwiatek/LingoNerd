import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
import useMediaQuery from '@mui/material/useMediaQuery'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getWords } from '../Redux/Word/selectors'
import '../styles/placement.css'
import Typography from '@mui/material/Typography'
import { selectLevelAction } from '../Redux/User/actions'
import { getIsInitialLoadingFinished } from '../Redux/selectors'

import { getCurrectUserSelectedLevel } from '../Redux/User/selectors'
import conjugateTranslation from '../utils/getVerbLabel'

const DEFAULT_VALUE = 0
const WORDS_TO_SHOW = 10

function Placement () {
  const isMobile = useMediaQuery('(max-width:768px)')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const words = useSelector(getWords)
  const isInitialLoadingFinished = useSelector(getIsInitialLoadingFinished)
  const selectedLevel = useSelector(getCurrectUserSelectedLevel)
  const [value, setValue] = useState(selectedLevel
    ? (words.map(word => word.frequency).indexOf(selectedLevel))
    : DEFAULT_VALUE)

  useEffect(() => {
    if (isInitialLoadingFinished) {
      setValue(selectedLevel
        ? (words.map(word => word.frequency).indexOf(selectedLevel))
        : DEFAULT_VALUE)
    }
  }, [isInitialLoadingFinished])

  const onSelectLevel = () => {
    dispatch(selectLevelAction(words[value].frequency, navigate))
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div
      className={'placement'}
      style={isMobile ? { padding: 30 } : { padding: 50, width: '80%', marginLeft: isMobile ? '10%' : 240 }}
    >
      <Typography variant="h5" style={{ marginBottom: 30 }}>
        Move the slider below to change your initial level
      </Typography>
      <Typography className={'value-info'} variant="h9" sx={{ flexGrow: 1 }}>
        Level: {value + 1}/{words.length + 1}
      </Typography>
      {isInitialLoadingFinished && <Slider
        defaultValue={selectedLevel ? (words.map(word => word.frequency).indexOf(selectedLevel)) : DEFAULT_VALUE}
        min={0}
        max={words.length}
        onChange={handleChange}
      />}
      <Typography style={{ marginTop: 10, fontWeight: 600 }}>
        Words to learn on the level:
      </Typography>
      <div className={'word-list'}>
        {words.slice(value, value + WORDS_TO_SHOW).map(word => (
          <Typography key={word.id} className={'word'} sx={{ flexGrow: 1 }}>
            {word.lemma} - {conjugateTranslation(word)}
          </Typography>
        ))}
      </div>
      <Button
        color="primary"
        variant="contained"
        onClick={onSelectLevel}
      >
        Choose level
      </Button>
    </div>
  )
}

export default Placement
