import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import '../styles/signUp.css'
import mixpanel from 'mixpanel-browser'

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Auth } from 'aws-amplify'
import * as Sentry from '@sentry/react'
import { v4 as uuidv4 } from 'uuid'
import { getCurrectUserId } from '../Redux/User/selectors'

const TERMS = 'https://www.termsandconditionsgenerator.com/live.php?token=pguQHJYFvasNIwy44EthJaj7FydT9vzY'
const PRIVACY_POLICY = 'https://docs.google.com/document/d/1Vz2jOO0k2BpxAYssvxCHntbv1MKZeDNguWBc2Z3GJ9g/edit?usp=sharing'

function SignUp () {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false)
  const [isPolicyErrorShown, setIsPolicyErrorShown] = useState(false)
  const currentUserId = useSelector(getCurrectUserId)

  useEffect(() => {
    mixpanel.track('SIGN_UP_OPENED')
  }, [])

  function onEmailChange (event) {
    setEmail(event.target.value)
  }

  function onPasswordChange (event) {
    setPassword(event.target.value)
  }

  async function onButtonClick () {
    mixpanel.track('SIGN_UP_BUTTON_CLICKED')

    setEmailError(null)
    setPasswordError(null)
    setIsPolicyErrorShown(false)

    if (!isPolicyAccepted) {
      return setIsPolicyErrorShown(true)
    }
    try {
      await Auth.signUp({
        username: email.trim(),
        password,
        attributes: {
          'custom:userId': currentUserId || uuidv4()
        }
        // autoSignIn: { // optional - enables auto sign in after user is confirmed
        //   enabled: true,
        // }
      })
      navigate('/login?verify=true')
    } catch (error) {
      console.error(error)

      if (error.code === 'InvalidParameterException') {
        setEmailError('Email incorrect')
      } else if (error.code === 'UsernameExistsException') {
        setEmailError('Email already used')
      } else if (error.code === 'InvalidPasswordException') {
        setPasswordError('Password too short (min 8 letters) or without a digit')
      } else {
        Sentry.captureException(error)
        Sentry.captureException(new Error('unhandled Signup error', error))
      }
    }
  }

  useEffect(() => {
    const keyDownHandler = event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        onButtonClick()
      }
    }

    document.addEventListener('keydown', keyDownHandler)

    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [email, password, isPolicyAccepted])

  return (
    <div className='sign-up-page'>
      <div className='sign-up-form'>
        <Link to={'/login'}>
          Already have an account? Click here to log in
        </Link>
        <Typography variant="h5" component="h5" style={{ marginTop: 15 }}>
          Registration
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
          <FormControlLabel
            onChange={(e) => setIsPolicyAccepted(e.target.checked)}
            control={<Checkbox />}
            style={{ marginBottom: isPolicyErrorShown ? 0 : 10 }}
            label={<>
              I accept <a href={TERMS}
                target="_blank" rel="noreferrer"
              >the Terms of Service</a> and <a href={PRIVACY_POLICY}
                target="_blank" rel="noreferrer"
              >the Privacy Policy</a>
            </>} />
          {isPolicyErrorShown && <Typography style={{ marginBottom: 10, fontSize: 12, color: 'red' }}>
            Please accept the Terms of Service and the Privacy Policy
              </Typography>}
          <Button
            variant="contained"
            disabled={email.length === 0}
            onClick={onButtonClick}
          >
            Create an account
            </Button>
        </div>
      </div>
    </div>
  )
}

export default SignUp
