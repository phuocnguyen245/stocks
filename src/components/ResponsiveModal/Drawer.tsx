import { Drawer, type DrawerProps } from '@mui/material'
import React from 'react'

const DrawerComponent = (props: DrawerProps): JSX.Element => {
  const { children, ...restProps } = props
  return <Drawer {...restProps}>{children}</Drawer>
}

export default DrawerComponent
