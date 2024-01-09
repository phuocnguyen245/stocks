import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'
import { Box } from '@mui/material'

const Layout = (): JSX.Element => {
  return (
    <Box>
      <Header />
      <Outlet />
    </Box>
  )
}

export default Layout
