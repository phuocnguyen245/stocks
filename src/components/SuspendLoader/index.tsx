import React, { useEffect } from 'react'
import NProgress from 'nprogress'
import { Box, CircularProgress, Paper } from '@mui/material'

const SuspendLoader = (): JSX.Element => {
  useEffect(() => {
    NProgress.start()

    return () => {
      NProgress.done()
    }
  }, [])

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh'
      }}
      display='flex'
      alignItems='center'
      justifyContent='center'
      component={Paper}
    >
      <CircularProgress size={64} disableShrink thickness={3} />
    </Box>
  )
}

export default SuspendLoader
