import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

function AccountNeededModal(props) {
  const navigate = useNavigate()

  return (
    <Modal
      open={props.isModalOpen}
      onClose={() => props.setIsModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{ marginBottom: 20 }}
        >
          To perform this action you need an account
        </Typography>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button variant="contained" onClick={() => navigate('/login')}>
            Login
          </Button>

          <Button variant="contained" onClick={() => navigate('/signup')}>
            Create an account
          </Button>
        </div>
      </Box>
    </Modal>
  )
}

export default AccountNeededModal
