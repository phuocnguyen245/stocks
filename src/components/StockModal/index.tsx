import { Box, Button, Container, Divider, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { Stock } from '../../Models'
import { useCreateStockMutation } from '../../services/stocks.services'

interface StockModalProps {
  open: boolean
  handleClose: () => void
  addData: (data: Stock) => void
}

const StockModal = ({ open, handleClose, addData }: StockModalProps): JSX.Element => {
  const textFieldRef = useRef(null)
  const [createStock] = useCreateStockMutation()

  const [row, setRow] = useState<Stock>({
    _id: uuid(),
    code: '',
    date: moment(Date.now()).format('DD/MM/YYYY'),
    quantity: 0,
    purchasePrice: 0,
    currentPrice: 0,
    status: 'Buy',
    ratio: 0
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRow((prev: Stock) => ({
      ...prev,
      [e.target.name]:
        e.target.name === 'code' ? e.target.value.toUpperCase() : Number(e.target.value)
    }))
  }

  useEffect(() => {
    if (open && textFieldRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(textFieldRef.current as any).focus()
    }
  }, [open])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeDate = (date: any): void => {
    setRow((prev) => ({
      ...prev,
      date: moment(date).format('DD/MM/YYYY')
    }))
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleSave = async () => {
    try {
      const { _id, ...rest } = row
      const response = await createStock({ ...rest }).unwrap()
      if (response.data) {
        return addData({
          ...response.data
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box
      position='absolute'
      top='0'
      width='100%'
      height='100%'
      overflow='hidden'
      bgcolor='rgba(0,0,0,.2)'
      display={open ? 'block' : 'none'}
    >
      <Container
        maxWidth='sm'
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100
        }}
      >
        <Box bgcolor='#fff'>
          <Box py={2} px={1}>
            <Box paddingBottom={2} paddingX={4}>
              <Typography>Add Stock</Typography>
            </Box>
            <Divider />
            <Box paddingX={4} paddingY={1} component='form'>
              <TextField
                label='Code'
                name='code'
                value={row.code}
                autoFocus
                inputProps={{ autoFocus: true }}
                fullWidth
                onChange={onChange}
                sx={{ margin: '8px 0' }}
                inputRef={textFieldRef}
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
              <Button color='warning' variant='contained' onClick={handleClose}>
                Cancel
              </Button>
              <Button variant='contained' sx={{ marginLeft: 2 }} onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default StockModal
