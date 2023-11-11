import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import '../styles/signUp.css'
import mixpanel from 'mixpanel-browser'

import Alert from '@mui/material/Alert'
import { setCurrentUserId, setIsAuthorized } from '../Redux/User/actions'
import { fetchWords } from '../Redux/Word/actions'
import { fetchLearningHistory } from '../Redux/LearningHistory/actions'
import { Auth } from 'aws-amplify'
import * as Sentry from '@sentry/react'
import { resetModels } from '../Redux/selectors'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)

  useEffect(() => {
    mixpanel.track('SIGN_IN_OPENED')
  }, [])

  function onEmailChange(event) {
    setEmail(event.target.value)
  }

  function onPasswordChange(event) {
    setPassword(event.target.value)
  }

  async function onButtonClick() {
    mixpanel.track('SIGN_IN_BUTTON_CLICKED')

    setEmailError(null)
    setPasswordError(null)

    try {
      const user = await Auth.signIn(email.trim(), password)
      dispatch(resetModels())
      dispatch(setCurrentUserId(user.attributes['custom:userId']))
      dispatch(setIsAuthorized(true))
      navigate('/')
      dispatch(fetchWords)
      dispatch(fetchLearningHistory)
    } catch (error) {
      console.error('error signing in', error)

      if (error.code === 'UserNotConfirmedException') {
        setEmailError(
          'Email address not confirmed, please click on the link in the email message'
        )
      } else if (error.code === 'NotAuthorizedException') {
        setEmailError('Incorrect email or password')
      } else {
        Sentry.captureException(error)
        Sentry.captureException(new Error('unhandled Login error', error))
      }
    }
  }

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        onButtonClick()
      }
    }

    document.addEventListener('keydown', keyDownHandler)

    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [email, password])

  return (
    <div className="sign-up-page">
      {new URLSearchParams(window.location.search).get('verify') === 'true' && (
        <Alert style={{ marginBottom: 20 }} severity="info">
          Before logging in click on the verification link sent in an email
          message (might be in the SPAM folder)
        </Alert>
      )}
      <div className="sign-up-form">
        <Link to={'/signup'}>No account yet? Click here to register</Link>
        <Typography variant="h5" component="h5" style={{ marginTop: 15 }}>
          Log in
        </Typography>
        <div className="sign-up-email-input">
          <TextField
            label="Email"
            variant="outlined"
            onChange={onEmailChange}
            value={email}
            type="email"
            name="email"
            style={{ marginBottom: 10 }}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Hasło"
            variant="outlined"
            onChange={onPasswordChange}
            value={password}
            type="password"
            name="password"
            style={{ marginBottom: 10 }}
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button
            variant="contained"
            disabled={email.length === 0}
            onClick={onButtonClick}
          >
            Log in
          </Button>
          <Link to={'/forgot-password'} style={{ marginTop: 15 }}>
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
