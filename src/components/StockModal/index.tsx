import { Box, Modal, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import React, { useState } from 'react'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

interface StockModalProps {
  open: boolean
  handleClose: () => void
  addData: (data: any) => void
}

const StockModal = ({ open, handleClose }: StockModalProps): JSX.Element => {
  const [row, setRow] = useState({
    code: 'DIG',
    date: '123123',
    quantity: 100,
    purchasePrice: 1,
    currentPrice: 1.05
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRow((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const onChangeDate = (e: any): void => {
    console.log(e)
  }
  console.log(row)

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <TextField
          label='Code'
          name='code'
          fullWidth
          margin='normal'
          onChange={onChange}
        />
        <DatePicker
          label='Date'
          sx={{ width: '100%', margin: '8px 0' }}
          onChange={onChangeDate}
        />
        <TextField
          label='Quantity'
          name='quantity'
          fullWidth
          margin='normal'
          onChange={onChange}
          type='number'
        />
        <TextField
          label='Purchase Price'
          name='purchasePrice'
          fullWidth
          margin='normal'
          onChange={onChange}
          type='number'
        />
        <TextField
          label='Current Price'
          name='currentPrice'
          fullWidth
          margin='normal'
          onChange={onChange}
          type='number'
        />
      </Box>
    </Modal>
  )
}

export default StockModal
