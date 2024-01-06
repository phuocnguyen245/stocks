import React, { useEffect } from 'react'
import NProgress from 'nprogress'
import { Box, CircularProgress } from '@mui/material'

const Loader = (): JSX.Element => {
  useEffect(() => {
    NProgress.start()

    return () => {
      NProgress.done()
    }
  }, [])

  return (
    <Box display='flex' alignItems='center' justifyContent='center'>
      <CircularProgress disableShrink thickness={3} />
    </Box>
  )
}

export default Loader
