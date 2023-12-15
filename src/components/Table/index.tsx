import { Box, Button } from '@mui/material'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import React, { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { Status, StockProps } from '../../Models'
import useModal from '../../hooks/useModals'
import { ratio } from '../../utils'
import StockModal from '../StockModal'
import TableDetail from './TableDetail'

const BasicTable = (): JSX.Element => {
  const { open, toggle } = useModal()
  const [editData, setEditData] = useState<StockProps>()
  const [data, setData] = useState<StockProps[]>([])

  useEffect(() => {
    setData(
      [
        {
          id: uuid(),
          code: 'DIG',
          date: '123123',
          quantity: 100,
          purchasePrice: 1,
          currentPrice: 1.05,
          ratio: 1,
          actualGain: 1,
          status: 'Buy' as Status
        }
      ].map((item) => ({
        ...item,
        ratio: ratio(item.currentPrice, item.purchasePrice),
        actualGain: item.quantity * item.currentPrice
      }))
    )
  }, [])

  const addData = (row: StockProps): void => {
    setData((prev) => [
      ...prev,
      {
        ...row,
        actualGain: row.quantity * row.currentPrice,
        ratio: ratio(row.currentPrice, row.purchasePrice)
      }
    ])
    toggle()
  }

  return (
    <TableContainer component={Paper}>
      <Box textAlign='right' p={4}>
        <Button variant='contained' onClick={toggle}>
          Create
        </Button>
      </Box>
      <TableDetail data={data} editData={editData} setEditData={setEditData} setData={setData} />
      <StockModal open={open} handleClose={toggle} addData={addData} />
    </TableContainer>
  )
}
export default BasicTable
