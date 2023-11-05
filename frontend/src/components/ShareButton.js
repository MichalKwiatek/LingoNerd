import React, { useState } from 'react'
import ShareIcon from '@mui/icons-material/Share'
import Button from '@mui/material/Button'
import Popover from 'react-tiny-popover'

function ShareButton (props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const onShare = () => {
    navigator.clipboard.writeText(`https://lingonerd.com/video/${props.videoId}`)

    setIsPopoverOpen(true)
  }

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={['top']}
      content={({ violations, nudgedLeft, nudgedTop }) => {
        return <div style={{ padding: 15, backgroundColor: 'white' }}>Link copied to clipboard!</div>
      }}
      onClickOutside={() => setIsPopoverOpen(false)}
    >
      <Button variant="outlined" style={{ marginLeft: 10 }} onClick={onShare}>
        <ShareIcon style={{ marginRight: 5 }} /> Share
      </Button>
    </Popover>
  )
}

export default ShareButton
