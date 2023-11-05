import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { getCurrentLevel, getNumberOfLearntWords } from '../Redux/LearningHistory/selectors'
import ManageToolbar from './ManageToolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { getNumberOfWords } from '../Redux/Word/selectors'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import AccountNeededModal from './AccountNeededModal'
import { getIsAuthorized } from '../Redux/User/selectors'

function WordCounters (props) {
  const isMobile = useMediaQuery('(max-width:768px)')
  const navigate = useNavigate()

  const nbOfLearntWords = useSelector(getNumberOfLearntWords)
  const currentLevel = useSelector(getCurrentLevel)
  const numberOfWords = useSelector(getNumberOfWords)

  const isAuthorized = useSelector(getIsAuthorized)
  const [isForbiddenModalOpen, setIsForbiddenModalOpen] = useState(false)

  const onClickAddVideo = () => {
    if (!isAuthorized) {
      setIsForbiddenModalOpen(true)
      return
    }

    navigate('add-video')
  }

  return (
    <Box>
      <AccountNeededModal isModalOpen={isForbiddenModalOpen} setIsModalOpen={setIsForbiddenModalOpen} />
      <AppBar position="fixed">
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          {!isMobile
            ? (<>
            <Typography variant="h4" component="h4" sx={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/')}>
              LingoNerd
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography variant="h6" component="div">
                Words learnt: {nbOfLearntWords}
              </Typography>
              <Typography variant="h6" component="div" style={{ marginLeft: 50 }}>
                Level: {`${currentLevel + 1}/${numberOfWords + 1}`}
              </Typography>
              <Button style={{ color: 'white', padding: 0, marginLeft: 50, marginRight: 10 }} onClick={onClickAddVideo}>
                <AddCircleOutlineIcon className={'add-icon'} />
                {isMobile ? '' : 'Add a video'}
              </Button>
              <ManageToolbar />
            </div>
          </>)
            : (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={props.handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Words learnt: {nbOfLearntWords}
                  </Typography>
                  <Divider orientation="vertical" flexItem style={{ margin: '0 10px' }} /> */}
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Level: {`${currentLevel + 1}/${numberOfWords + 1}`}
                  </Typography>
                </div>
                <ManageToolbar />
              </>
              )
          }
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default WordCounters
