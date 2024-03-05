import { Dialog, type DialogProps } from '@mui/material'
import React from 'react'

const Modal = (props: DialogProps): JSX.Element => {
  const { children, ...restProps } = props
  return <Dialog {...restProps}>{children}</Dialog>
}

export default Modal
