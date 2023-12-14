import { Delete, Edit } from '@mui/icons-material'
import { Box, Button, TextField } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useEffect, useState, useCallback } from 'react'
import type { StockProps, Status } from '../Models'
import useModal from '../hooks/useModals'
import StockModal from './StockModal'
import { v4 as uuid } from 'uuid'
import moment from 'moment'

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

  const ratio = useCallback(
    (current: number, init: number): number => {
      return Number((((current - init) / init) * 100).toFixed(2))
    },
    [data]
  )

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

  const onEdit = (row: StockProps): void => {
    setEditData((prev: StockProps | undefined) => {
      if (prev?.id) {
        return {
          id: '',
          code: '',
          date: moment(Date.now()).format('DD/MM/YYYY'),
          quantity: 0,
          purchasePrice: 0,
          currentPrice: 0,
          status: 'Buy',
          ratio: 0
        }
      }
      return row
    })
  }

  return (
    <TableContainer component={Paper}>
      <Box textAlign='right' p={4}>
        <Button variant='contained' onClick={toggle}>
          Create
        </Button>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Purchase Price</TableCell>
            <TableCell>Current Price</TableCell>
            <TableCell>Ratio</TableCell>
            <TableCell>Actual Gain</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                {editData?.id === row.id ? <TextField /> : row.code}
              </TableCell>
              <TableCell>
                {editData?.id === row.id ? <TextField /> : row.date}
              </TableCell>
              <TableCell>
                {editData?.id === row.id ? <TextField /> : row.quantity}
              </TableCell>
              <TableCell>
                {editData?.id === row.id ? <TextField /> : row.purchasePrice}
              </TableCell>
              <TableCell>
                {editData?.id === row.id ? <TextField /> : row.currentPrice}
              </TableCell>
              <TableCell>{`${row.ratio ?? 0}%`}</TableCell>
              <TableCell>
                {editData?.id === row.id ? <TextField /> : row.actualGain}
              </TableCell>
              <TableCell>
                {editData?.id === row.id ? <TextField /> : row.status}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    onEdit(row)
                  }}
                >
                  <Edit />
                </Button>
                <Button>
                  <Delete color='error' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <StockModal open={open} handleClose={toggle} addData={addData} />
    </TableContainer>
  )
}
export default BasicTable
