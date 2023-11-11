import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import '../styles/signUp.css'
import mixpanel from 'mixpanel-browser'

import Alert from '@mui/material/Alert'
import { Auth } from 'aws-amplify'
import * as Sentry from '@sentry/react'

function NewPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [code, setCode] = useState('')

  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)

  useEffect(() => {
    mixpanel.track('NEW_PASSWORD_OPENED')
  }, [])

  function onEmailChange(event) {
    setEmail(event.target.value)
  }

  function onCodeChange(event) {
    setCode(event.target.value)
  }

  function onPasswordChange(event) {
    setPassword(event.target.value)
  }

  async function onButtonClick() {
    mixpanel.track('NEW_PASSWORD_CLICKED')

    setEmailError(null)
    setPasswordError(null)

    try {
      await Auth.forgotPasswordSubmit(email.trim(), code, password)
      navigate('/login')
    } catch (error) {
      console.error('error signing in', error)

      if (error.code === 'UserNotConfirmedException') {
        setEmailError(
          'Email address not confirmed, please click on the link in the email message'
        )
      } else if (error.code === 'NotAuthorizedException') {
        setEmailError('Email or password incorrect')
      } else if (error.code === 'InvalidPasswordException') {
        setPasswordError(
          'Password too short (min 8 letters) or without a digit'
        )
      } else if (error.code === 'CodeMismatchException') {
        setPasswordError('Code incorrect')
      } else {
        setEmailError("We're sorry, something went wrong")
        Sentry.captureException(error)
        Sentry.captureException(new Error('unhandled Login error', error))
      }
    }
  }

  return (
    <div className="sign-up-page">
      <Alert style={{ marginBottom: 20 }} severity="info">
        In the "Code" field please type the code received in an email message
      </Alert>
      <div className="sign-up-form">
        <Link to={'/login'}>Back to log in</Link>
        <Typography variant="h5" component="h5" style={{ marginTop: 15 }}>
          Choose new password
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
            label="Code"
            variant="outlined"
            onChange={onCodeChange}
            value={code}
            type="text"
            name="code"
            style={{ marginBottom: 10 }}
          />
          <TextField
            label="Password"
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
            Change password
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewPassword
