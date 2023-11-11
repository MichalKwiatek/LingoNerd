import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'

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

function InfoModal(props) {
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
          {props.description}
        </Typography>
        <Button variant="contained" onClick={() => props.setIsModalOpen(false)}>
          close
        </Button>
      </Box>
    </Modal>
  )
}

export default InfoModal
