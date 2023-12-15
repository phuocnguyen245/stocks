import { Edit, Delete } from '@mui/icons-material'
import { TableHead, TableRow, TableCell, TableBody, TextField, Button, Table } from '@mui/material'
import React from 'react'
import type { StockProps } from '../../Models'
import moment from 'moment'
import { ratio } from '../../utils'

interface TableDetailProps {
  data: StockProps[]
  editData?: StockProps
  setEditData: (data: ((prev: StockProps | undefined) => StockProps) | StockProps) => void
  setData: (data: StockProps[]) => void
}

const TableDetail = ({ data, editData, setEditData, setData }: TableDetailProps): JSX.Element => {
  const onEdit = (row: StockProps): void => {
    setEditData((prev: StockProps | undefined) => {
      if (prev?.id) {
        const data = {
          id: '',
          code: '',
          date: moment(Date.now()).format('DD/MM/YYYY'),
          quantity: 0,
          purchasePrice: 0,
          currentPrice: 0,
          status: 'Buy',
          ratio: 0
        }
        return data as StockProps
      }
      return row
    })
  }

  const onChangeRow = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const name = e.target.name
    const value = name === 'code' ? e.target.value : Number(e.target.value)
    if (editData?.id) {
      const newEditData: StockProps = {
        ...editData,
        [name]: value,
        actualGain:
          name === 'quantity'
            ? (value as number) * Number(editData?.currentPrice)
            : name === 'currentPrice'
              ? (value as number) * editData.quantity
              : editData.actualGain,
        ratio:
          name === 'currentPrice' ? ratio(value as number, editData.purchasePrice) : editData.ratio
      }
      setEditData(newEditData)
      return setData(
        data.map((item) => {
          if (item.id === newEditData.id) {
            return { ...newEditData }
          }
          return { ...item }
        })
      )
    }
  }
  const onDelete = (id: string): void => {
    return setData(data.filter((item) => item.id !== id))
  }

  return (
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
              {editData?.id === row.id ? (
                <TextField name='code' value={row.code} onChange={(e) => onChangeRow(e)} />
              ) : (
                row.code
              )}
            </TableCell>
            <TableCell>
              {editData?.id === row.id ? (
                <TextField name='date' value={row.date} onChange={(e) => onChangeRow(e)} />
              ) : (
                row.date
              )}
            </TableCell>
            <TableCell>
              {editData?.id === row.id ? (
                <TextField name='quantity' value={row.quantity} onChange={(e) => onChangeRow(e)} />
              ) : (
                row.quantity
              )}
            </TableCell>
            <TableCell>
              {editData?.id === row.id ? (
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
              {editData?.id === row.id ? (
                <TextField
                  name='currentPrice'
                  value={row.currentPrice}
                  onChange={(e) => onChangeRow(e)}
                />
              ) : (
                row.currentPrice
              )}
            </TableCell>
            <TableCell>{`${row.ratio ?? 0}%`}</TableCell>
            <TableCell>{row.actualGain}</TableCell>
            <TableCell>
              {editData?.id === row.id ? (
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
                    onDelete(row.id)
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
