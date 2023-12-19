import { Edit, Delete } from '@mui/icons-material'
import { TableHead, TableRow, TableCell, TableBody, TextField, Button, Table } from '@mui/material'
import React from 'react'
import type { Stock } from '../../Models'
import moment from 'moment'

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
    const value = name === 'code' ? e.target.value.toUpperCase() : Number(e.target.value)
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
          <TableCell>Actions</TableCell>
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
                row.status
              )}
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
                <Delete
                  color='error'
                  onClick={() => {
                    onDelete(row._id)
                  }}
                />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableDetail
