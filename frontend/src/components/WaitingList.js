import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@mui/material/Modal'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToWaitingList } from '../Redux/User/actions'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

function WaitingList (props) {
  const dispatch = useDispatch()
  const [language, setLanguage] = useState('EN')
  const [email, setEmail] = useState('')
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const handleChangeLanguage = (event) => {
    setLanguage(event.target.value)
  }

  function onEmailChange (event) {
    setEmail(event.target.value)
  }

  function handleClick () {
    dispatch(addToWaitingList(email, language, () => setIsSuccessModalOpen(true)))
  }

  return (
    <div style={{ maxWidth: '100%', paddingBottom: 20, marginTop: 20 }}>
      <Typography variant="h6" component="h2" >Want to know when a language course will be released? Leave your email:</Typography>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 10 }}>
        <Typography>Language you want to learn:</Typography>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={language}
          onChange={handleChangeLanguage}
          style={{ marginTop: 10 }}
        >
          {props.languages.map(lang => <MenuItem key={lang.id} value={lang.id}>{lang.label}</MenuItem>)}
        </Select>

        <TextField
          label="Email"
          variant="outlined"
          onChange={onEmailChange}
          value={email}
          type="email"
          name="email"
          style={{ marginTop: 10 }}
        />
        <Button
          variant="contained"
          style={{ marginLeft: 10 }}
          color="secondary"
          disabled={!email}
          onClick={handleClick}
        >
          Add me to the waiting list
          </Button>
      </div>

      <Modal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Thanks for leaving your email!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{ marginBottom: 10 }}>
            I'll email you when the course is ready!
          </Typography>
          <Button variant="contained" onClick={() => setIsSuccessModalOpen(false)}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  )
}

export default WaitingList
