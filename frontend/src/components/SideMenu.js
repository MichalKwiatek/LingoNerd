import React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import useMediaQuery from '@mui/material/useMediaQuery'
import SchoolIcon from '@mui/icons-material/School'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import TranslateIcon from '@mui/icons-material/Translate'
import { getWordsToReviewToday } from '../Redux/LearningHistory/selectors'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import VideoSettingsIcon from '@mui/icons-material/VideoSettings'
import FavoriteIcon from '@mui/icons-material/Favorite'

const drawerWidth = 240

const urls = {
  learn: ['', 'new-words-learning', 'new-words-presentation'],
  'daily-review': ['daily-flashcards'],
  videos: ['videos', 'video'],
  'my-videos': ['my-videos'],
  'liked-videos': ['liked-videos'],
}

function getIcon(id) {
  if (id === 'learn') {
    return <TranslateIcon />
  }

  if (id === 'daily-review') {
    return <SchoolIcon />
  }

  if (id === 'videos') {
    return <PlayCircleIcon />
  }

  if (id === 'my-videos') {
    return <VideoSettingsIcon />
  }

  if (id === 'liked-videos') {
    return <FavoriteIcon />
  }
}

function SideMenu(props) {
  const isMobile = useMediaQuery('(max-width:768px)')
  const navigate = useNavigate()
  const location = useLocation()
  const route = location.pathname.split('/')[1]

  const wordsToReviewToday = useSelector(getWordsToReviewToday)

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={props.isSideMenuOpen}
      onClose={props.onSideMenuClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: isMobile ? 56 : 64,
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {[
            { id: 'learn', url: '/', label: 'Learn' },
            { id: 'videos', url: '/videos', label: 'Videos' },
          ].map(({ id, url, label }, index) => (
            <ListItem
              key={url}
              disablePadding
              selected={urls[id].includes(route)}
            >
              <ListItemButton onClick={() => navigate(url)}>
                <ListItemIcon>{getIcon(id)}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {[
            { id: 'liked-videos', url: '/liked-videos', label: 'Liked videos' },
            { id: 'my-videos', url: '/my-videos', label: 'My videos' },
            {
              id: 'daily-review',
              url: '/daily-flashcards',
              label: 'Daily review',
            },
          ].map(({ id, url, label }) => (
            <ListItem
              key={url}
              disablePadding
              selected={urls[id].includes(route)}
            >
              <ListItemButton
                disabled={
                  id === 'daily-review' && wordsToReviewToday.length === 0
                }
                onClick={() => navigate(url)}
              >
                <ListItemIcon>{getIcon(id)}</ListItemIcon>
                <ListItemText
                  primary={
                    id === 'daily-review'
                      ? `${label} (${wordsToReviewToday.length})`
                      : label
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default SideMenu
