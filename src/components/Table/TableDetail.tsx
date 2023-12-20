import { Edit, Delete } from '@mui/icons-material'
import {
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Table,
  Box
} from '@mui/material'
import React from 'react'
import type { Stock } from '../../Models'
import moment from 'moment'
import { Label } from '../MUIComponents'

interface TableDetailProps {
  data: Stock[]
  editData?: Stock
  setEditData: (data: ((prev: Stock | undefined) => Stock) | Stock) => void
  setData: (data: Stock[]) => void
}

const TableDetail = ({ data, editData, setEditData, setData }: TableDetailProps): JSX.Element => {
  const onEdit = (row: Stock): void => {
    setEditData((prev: Stock | undefined) => {
      if (prev?._id) {
        const data = {
          _id: '',
          code: '',
          date: moment(Date.now()).format('DD/MM/YYYY'),
          quantity: 0,
          purchasePrice: 0,
          currentPrice: 0,
          status: 'Buy',
          ratio: 0
        }
        return data as Stock
      }
      return row
    })
  }

  const onChangeRow = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const name = e.target.name
    const value =
      name === 'code' || name === 'status' ? e.target.value.toUpperCase() : Number(e.target.value)
    if (editData?._id) {
      const newEditData: Stock = {
        ...editData,
        [name]: value
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
  const onDelete = (id: string): void => {
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
            <TableCell>
              {editData?._id === row._id ? (
                <TextField name='code' value={row.code} onChange={(e) => onChangeRow(e)} />
              ) : (
                row.code
              )}
            </TableCell>
            <TableCell>
              {editData?._id === row._id ? (
                <TextField name='date' value={row.date} onChange={(e) => onChangeRow(e)} />
              ) : (
                row.date
              )}
            </TableCell>
            <TableCell>
              {editData?._id === row._id ? (
                <TextField name='quantity' value={row.quantity} onChange={(e) => onChangeRow(e)} />
              ) : (
                row.quantity
              )}
            </TableCell>
            <TableCell>
              {editData?._id === row._id ? (
                <TextField
                  name='purchasePrice'
                  value={row.purchasePrice}
                  onChange={(e) => onChangeRow(e)}
                />
              ) : (
                row.purchasePrice
              )}
            </TableCell>
            <TableCell>
              {editData?._id === row._id ? (
                <TextField name='status' value={row.status} onChange={(e) => onChangeRow(e)} />
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
                  onClick={() => {
                    onEdit(row)
                  }}
                >
                  <Edit />
                </Button>
                <Button sx={{ width: '40px', minWidth: 'unset' }}>
                  <Delete
                    color='error'
                    onClick={() => {
                      onDelete(row._id)
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
