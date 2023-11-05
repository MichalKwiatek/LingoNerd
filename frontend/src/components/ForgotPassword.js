import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import '../styles/signUp.css'
import mixpanel from 'mixpanel-browser'

import { Auth } from 'aws-amplify'

function ForgotPassword () {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(null)

  useEffect(() => {
    mixpanel.track('FORGOT_PASSWORD_OPENED')
  }, [])

  function onEmailChange (event) {
    setEmail(event.target.value)
  }

  async function onButtonClick () {
    try {
      setEmailError(null)
      await Auth.forgotPassword(email)
      navigate('/new-password')
    } catch (error) {
      console.error('error signing in', error)
      setEmailError('Przepraszamy, coś poszło nie tak')
    }
  }

  return (
    <div className='sign-up-page'>
      <div className='sign-up-form'>
        <Link to={'/login'}>
          Back to log in
        </Link>
        <Typography variant="h5" component="h5" style={{ marginTop: 15 }}>
          Reset password
      </Typography>
        <div className='sign-up-email-input'>
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
          <Button
            variant="contained"
            disabled={email.length === 0}
            onClick={onButtonClick}
          >
            Request password change
            </Button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
