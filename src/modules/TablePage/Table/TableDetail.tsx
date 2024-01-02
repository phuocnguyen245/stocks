import { Edit, Delete } from '@mui/icons-material'
import {
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Table,
  Box,
  Switch
} from '@mui/material'
import React from 'react'
import type { Stock } from 'src/Models'
import moment from 'moment'
import { Label } from 'src/components/MUIComponents'
import { useDeleteStockMutation, useUpdateStockMutation } from 'src/services/stocks.services'
import { useAppDispatch } from 'src/store'
import { refetchCurrentStocks } from 'src/store/slices/stockSlice'

interface TableDetailProps {
  data: Stock[]
  editData?: Stock
  refetch: () => void
  setEditData: (data: ((prev: Stock | undefined) => Stock) | Stock) => void
  setData: (data: Stock[]) => void
}

const TableDetail = ({
  data,
  editData,
  setEditData,
  setData,
  refetch
}: TableDetailProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const [updateStocks] = useUpdateStockMutation()
  const [deleteStocks] = useDeleteStockMutation()

  const onEdit = async (row: Stock): Promise<void> => {
    if (editData?._id) {
      const defaultRow: Stock = {
        _id: '',
        code: '',
        date: moment(Date.now()).format('DD/MM/YYYY'),
        quantity: 0,
        purchasePrice: 0,
        currentPrice: 0,
        status: 'Buy',
        ratio: 0,
        sellPrice: 0
      }
      await updateStocks(row)
        .unwrap()
        .then(() => dispatch(refetchCurrentStocks(true)))
      return setEditData(defaultRow)
    }
    return setEditData(row)
  }

  const onChangeRow = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const name = e.target.name
    const value = e.target.value

    let convertedValue: string | number = ''
    switch (name) {
      case 'code':
        convertedValue = value.toUpperCase()
        break
      case 'status':
        convertedValue = (e.target as HTMLInputElement).checked ? 'Buy' : 'Sell'
        break
      default:
        convertedValue = Number(value)
    }

    if (editData?._id) {
      const newEditData: Stock = {
        ...editData,
        [name]: convertedValue
      }

      setEditData(newEditData)
      return setData(
        data.map((item) => {
          if (item._id === newEditData._id) {
            return { ...newEditData }
          }
          return { ...item }
        })
      )
    }
  }

  const onDelete = async (_id: string): Promise<void> => {
    await deleteStocks({ _id })
      .unwrap()
      .then(() => {
        dispatch(refetchCurrentStocks(true))
        refetch()
      })
    return setData(data.filter((item) => item._id !== _id))
  }

  return (
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell>Code</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Purchase</TableCell>
          <TableCell>Selling</TableCell>
          <TableCell align='center'>Status</TableCell>
          <TableCell align='center'>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell width='10%'>{row.code}</TableCell>
            <TableCell width='10%'>{row.date}</TableCell>
            <TableCell width='20%'>
              {editData?._id === row._id ? (
                <TextField
                  sx={[
                    {
                      '& .MuiInputBase-root': {
                        height: '36px'
                      }
                    }
                  ]}
                  name='quantity'
                  value={row.quantity}
                  onChange={(e) => onChangeRow(e)}
                  type='number'
                  inputProps={{
                    step: 1
                  }}
                />
              ) : (
                row.quantity
              )}
            </TableCell>
            <TableCell width='25%'>
              {editData?._id === row._id ? (
                <TextField
                  sx={[
                    { width: '120px', padding: '0' },
                    {
                      '& .MuiInputBase-root': {
                        height: '36px'
                      }
                    }
                  ]}
                  name='purchasePrice'
                  value={row.purchasePrice}
                  onChange={(e) => onChangeRow(e)}
                  type='number'
                  inputProps={{ step: '0.1' }}
                  autoFocus
                />
              ) : (
                row.purchasePrice
              )}
            </TableCell>
            <TableCell width='25%'>{row.sellPrice}</TableCell>
            <TableCell width='15%'>
              {editData?._id === row._id ? (
                <Switch
                  sx={{ height: '36px' }}
                  name='status'
                  color='secondary'
                  checked={row.status === 'Buy'}
                  onChange={(e) => onChangeRow(e)}
                />
              ) : (
                <Label type={row.status.toUpperCase() === 'BUY' ? 'success' : 'primary'}>
                  {row.status}
                </Label>
              )}
            </TableCell>
            <TableCell width='15%'>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Button
                  sx={{ width: '40px', minWidth: 'unset', borderRadius: '100%' }}
                  color='info'
                  onClick={async () => await onEdit(row)}
                >
                  <Edit />
                </Button>
                <Button sx={{ width: '40px', minWidth: 'unset', borderRadius: '100%' }}>
                  <Delete
                    color='error'
                    onClick={async () => {
                      await onDelete(row._id)
                    }}
                  />
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableDetail
