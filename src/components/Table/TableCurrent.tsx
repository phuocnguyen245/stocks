import React, { useEffect, useState } from 'react'
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material'
import type { StockProps } from '../../Models'
import { ratio, removeDuplicatesByKey } from '../../utils'
import { Edit } from '@mui/icons-material'
import moment from 'moment'

interface TableDetailProps {
  data: StockProps[]
  editData?: StockProps
  setEditData: (data: ((prev: StockProps | undefined) => StockProps) | StockProps) => void
  setData: (data: StockProps[]) => void
}

const TableCurrent = ({ data: rawData }: TableDetailProps): JSX.Element => {
  const [data, setData] = useState<StockProps[]>([])
  const [editData, setEditData] = useState<StockProps>()

  useEffect(() => {
    if (rawData.length) {
      const filterBuyStocks = rawData.filter((item) => item.status === 'Buy')
      const combinedStocks = filterBuyStocks.map((item) => {
        const filterByCode = filterBuyStocks.filter((filterITem) => item.code === filterITem.code)
        if (filterByCode.length > 1) {
          const quantity = filterByCode.reduce((acc, cur) => acc + cur.quantity, 0)
          const averagePrice = Number(
            (
              filterByCode.reduce((acc, cur) => acc + cur.purchasePrice, 0) / filterByCode.length
            ).toFixed(2)
          )
          return {
            ...item,
            quantity,
            purchasePrice: averagePrice,
            ratio: ratio(item?.currentPrice ?? 0, averagePrice)
          }
        }
        return { ...item, ratio: ratio(item?.currentPrice ?? 0, item.purchasePrice) }
      })

      const removedDuplicateCode = removeDuplicatesByKey(combinedStocks, 'code')
      setData(removedDuplicateCode)
    }
  }, [rawData])

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
    const value = name === 'code' ? e.target.value.toUpperCase() : Number(e.target.value)
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

  return (
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell>Code</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Average Price</TableCell>
          <TableCell>Current Price</TableCell>
          <TableCell>Ratio</TableCell>
          <TableCell>Actual Gain</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.code}</TableCell>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.quantity}</TableCell>
            <TableCell>{row.purchasePrice}</TableCell>
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
              <Button
                onClick={() => {
                  onEdit(row)
                }}
              >
                <Edit />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableCurrent
