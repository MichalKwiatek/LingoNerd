import React, { useEffect, useState } from 'react'
import '../styles/loader.css'
import CircularProgress from '@mui/material/CircularProgress'

function Loader (props) {
  const [isLoaderShown, setIsLoaderShown] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoaderShown(true)
    }, 400)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="loader">
      {isLoaderShown && <CircularProgress />}
    </div>
  )
}

export default Loader
