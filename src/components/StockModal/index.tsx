import { Box, Button, Divider, Modal, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import React, { useState } from 'react'
import type { StockProps } from '../../Models'
import { v4 as uuid } from 'uuid'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  py: 2
}

interface StockModalProps {
  open: boolean
  handleClose: () => void
  addData: (data: StockProps) => void
}

const StockModal = ({ open, handleClose, addData }: StockModalProps): JSX.Element => {
  const [row, setRow] = useState<StockProps>({
    id: uuid(),
    code: '',
    date: moment(Date.now()).format('DD/MM/YYYY'),
    quantity: 0,
    purchasePrice: 0,
    currentPrice: 0,
    status: 'Buy',
    ratio: 0
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRow((prev: StockProps) => ({
      ...prev,
      [e.target.name]: e.target.name === 'code' ? e.target.value : Number(e.target.value)
    }))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeDate = (date: any): void => {
    setRow((prev) => ({
      ...prev,
      date: moment(date).format('DD/MM/YYYY')
    }))
  }

  const handleSave = (): void => {
    addData({
      ...row
    })
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box paddingBottom={2} paddingX={4}>
          <Typography>Add Stock</Typography>
        </Box>
        <Divider />
        <Box paddingX={4} paddingY={1}>
          <TextField
            label='Code'
            name='code'
            fullWidth
            onChange={onChange}
            sx={{ margin: '8px 0' }}
          />
          <DatePicker
            label='Date'
            sx={{ width: '100%', margin: '8px 0' }}
            onChange={onChangeDate}
            defaultValue={moment(Date.now())}
          />
          <TextField
            label='Quantity'
            name='quantity'
            fullWidth
            sx={{ margin: '8px 0' }}
            onChange={onChange}
            type='number'
          />
          <TextField
            label='Purchase Price'
            name='purchasePrice'
            fullWidth
            sx={{ margin: '8px 0' }}
            onChange={onChange}
            type='number'
          />
          <TextField
            label='Current Price'
            name='currentPrice'
            fullWidth
            sx={{ margin: '8px 0' }}
            onChange={onChange}
            type='number'
          />
        </Box>
        <Divider />
        <Box textAlign='end' paddingX={4} paddingTop={2}>
          <Button color='error' variant='contained' onClick={handleClose}>
            Cancel
          </Button>
          <Button color='success' variant='contained' sx={{ marginLeft: 2 }} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default StockModal
