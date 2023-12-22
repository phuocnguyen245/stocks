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
import type { Stock } from '../../Models'
import moment from 'moment'
import { Label } from '../MUIComponents'
import { useDeleteStockMutation, useUpdateStockMutation } from '../../services/stocks.services'

interface TableDetailProps {
  data: Stock[]
  editData?: Stock
  setEditData: (data: ((prev: Stock | undefined) => Stock) | Stock) => void
  setData: (data: Stock[]) => void
}

const TableDetail = ({ data, editData, setEditData, setData }: TableDetailProps): JSX.Element => {
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
        ratio: 0
      }
      await updateStocks(row).unwrap()
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

  const onDelete = async (id: string): Promise<void> => {
    await deleteStocks({ _id: id })
    return setData(data.filter((item) => item._id !== id))
  }

  return (
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell>Code</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Purchase Price</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align='center'>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.code}</TableCell>
            <TableCell>{row.date}</TableCell>
            <TableCell width='100px'>
              {editData?._id === row._id ? (
                <TextField
                  sx={[
                    { width: '90px', padding: '0' },
                    {
                      '& .MuiInputBase-root': {
                        height: '32px'
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
            <TableCell width='160px'>
              {editData?._id === row._id ? (
                <TextField
                  sx={[
                    { width: '120px', padding: '0' },
                    {
                      '& .MuiInputBase-root': {
                        height: '32px'
                      }
                    }
                  ]}
                  name='purchasePrice'
                  value={row.purchasePrice}
                  onChange={(e) => onChangeRow(e)}
                  type='number'
                  inputProps={{ step: '0.1' }}
                />
              ) : (
                row.purchasePrice
              )}
            </TableCell>
            <TableCell width='92px'>
              {editData?._id === row._id ? (
                <Switch
                  sx={{ height: '32px' }}
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
            <TableCell>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Button
                  sx={{ width: '40px', minWidth: 'unset' }}
                  color='info'
                  onClick={async () => await onEdit(row)}
                >
                  <Edit />
                </Button>
                <Button sx={{ width: '40px', minWidth: 'unset' }}>
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
