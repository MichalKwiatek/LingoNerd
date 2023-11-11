import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import DailyFlashcards from './components/DailyFlashcards'
import SignUp from './components/SignUp'
import Loader from './components/Loader'
import WordCounters from './components/WordCounters'
import mixpanel from 'mixpanel-browser'
import NewWordsPresentation from './components/NewWordsPresentation'
import NewWordsLearning from './components/NewWordsLearning'
import Placement from './components/Placement'
import Login from './components/Login'
import AddVideo from './components/AddVideo'
import { getIsInitialLoadingFinished } from './Redux/selectors'
import { setCurrentUserId, setIsAuthorized } from './Redux/User/actions'
import { fetchWords } from './Redux/Word/actions'
import { fetchLearningHistory } from './Redux/LearningHistory/actions'
import { getCurrectUserId } from './Redux/User/selectors'
import { Amplify, Auth } from 'aws-amplify'
import awsconfig from './awsConfig'
import NewPassword from './components/NewPassword'
import ForgotPassword from './components/ForgotPassword'
import AddSubtitles from './components/AddSubtitles'
import { v4 as uuidv4 } from 'uuid'
import CheckSubtitles from './components/CheckSubtitles'
import SideMenu from './components/SideMenu'
import VideosPage from './components/VideosPage'
import VideoPage from './components/VideoPage'
import MyVideosPage from './components/MyVideosPage'
import LikedVideosPage from './components/LikedVideosPage'

export const AUTH_ROUTES = [
  '/signup',
  '/login',
  '/new-password',
  '/forgot-password',
]
export const CONTENT_ROUTES = ['add-video', 'add-subtitles', 'check-subtitles']

Amplify.configure(awsconfig)

function App() {
  const dispatch = useDispatch()
  const location = useLocation()

  const currentUserId = useSelector(getCurrectUserId)
  const isInitialLoadingFinished = useSelector(getIsInitialLoadingFinished)

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        dispatch(setCurrentUserId(user.attributes['custom:userId']))
        dispatch(setIsAuthorized(true))
        initModels()
      })
      .catch((err) => {
        const userId = localStorage.getItem('CURRENT_USER_ID') || uuidv4()

        dispatch(setCurrentUserId(userId))
        initModels()
      })
  }, [])

  function initModels() {
    dispatch(fetchWords)
    dispatch(fetchLearningHistory)
  }

  useEffect(() => {
    if (currentUserId) {
      mixpanel.track('APP_LOADED', {
        userId: currentUserId,
      })
    }
  }, [currentUserId])

  const route = location.pathname.split('/')[1]

  return (
    <div className="App">
      {!isInitialLoadingFinished && <Loader />}
      {!AUTH_ROUTES.includes(location.pathname) && (
        <WordCounters
          isSideMenuOpen={isSideMenuOpen}
          handleDrawerToggle={() => setIsSideMenuOpen(!isSideMenuOpen)}
        />
      )}
      {!AUTH_ROUTES.includes(location.pathname) &&
        !CONTENT_ROUTES.includes(route) && (
          <SideMenu
            isSideMenuOpen={isSideMenuOpen}
            onSideMenuClose={() => setIsSideMenuOpen(false)}
          />
        )}
      <Routes>
        <Route path="/" element={<NewWordsPresentation />} />
        <Route path="/daily-flashcards" element={<DailyFlashcards />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/new-words-presentation"
          element={<NewWordsPresentation />}
        />
        <Route path="/new-words-learning" element={<NewWordsLearning />} />
        <Route path="/placement" element={<Placement />} />
        <Route path="/add-video" element={<AddVideo />} />
        <Route path="/add-subtitles/:videoId" element={<AddSubtitles />} />
        <Route path="/check-subtitles/:videoId" element={<CheckSubtitles />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/video/:videoId" element={<VideoPage />} />
        <Route path="/my-videos" element={<MyVideosPage />} />
        <Route path="/liked-videos" element={<LikedVideosPage />} />
      </Routes>
    </div>
  )
}

export default App
