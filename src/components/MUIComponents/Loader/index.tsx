import React, { useEffect } from 'react'
import NProgress from 'nprogress'
import { Box, CircularProgress, useTheme } from '@mui/material'

const Loader = (): JSX.Element => {
  const theme = useTheme()
  useEffect(() => {
    NProgress.start()

    return () => {
      NProgress.done()
    }
  }, [])

  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      width='100%'
      height='100%'
      position='absolute'
      left={0}
      top={0}
      bgcolor={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)'}
    >
      <CircularProgress disableShrink thickness={3} color='primary' />
    </Box>
  )
}

export default Loader
