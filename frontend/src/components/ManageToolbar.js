import React from 'react'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import '../styles/account-dropdown.css'
import { useNavigate } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentUserId, setIsAuthorized } from '../Redux/User/actions'
import { v4 as uuidv4 } from 'uuid'
import { resetModels } from '../Redux/selectors'
import { fetchLearningHistory } from '../Redux/LearningHistory/actions'
import { fetchWords } from '../Redux/Word/actions'
import { getIsAuthorized } from '../Redux/User/selectors'

function ManageToolbar(props) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const dispatch = useDispatch()
  const isAuthorized = useSelector(getIsAuthorized)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onChangeLevel = () => {
    navigate('/placement')
  }

  const onLogOut = async () => {
    try {
      await Auth.signOut()
      dispatch(resetModels())
      dispatch(setIsAuthorized(false))
      dispatch(setCurrentUserId(uuidv4()))
      navigate('/login')
      dispatch(fetchWords)
      dispatch(fetchLearningHistory)
    } catch (error) {
      console.error('error signing out: ', error)
    }
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <>
      <Button aria-describedby={'account-popover'} onClick={handleClick}>
        <ManageAccountsIcon className={'account-icon'} />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography
          onClick={onChangeLevel}
          style={{ cursor: 'pointer' }}
          sx={{ p: 2 }}
        >
          Change level
        </Typography>
        {isAuthorized && (
          <Typography
            onClick={onLogOut}
            style={{ cursor: 'pointer' }}
            sx={{ p: 2 }}
          >
            Log out
          </Typography>
        )}

        {!isAuthorized && (
          <>
            <Typography
              onClick={() => navigate('/login')}
              style={{ cursor: 'pointer' }}
              sx={{ p: 2 }}
            >
              Log in
            </Typography>
            <Typography
              onClick={() => navigate('/signup')}
              style={{ cursor: 'pointer' }}
              sx={{ p: 2 }}
            >
              Register
            </Typography>
          </>
        )}
      </Popover>
    </>
  )
}

export default ManageToolbar
