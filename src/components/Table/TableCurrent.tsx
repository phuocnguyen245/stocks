import React, { useEffect, useState } from 'react'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import type { Stock } from '../../Models'
import { ratio, removeDuplicatesByKey } from '../../utils'
import { Edit } from '@mui/icons-material'
import moment from 'moment'
import { useGetCurrentStocksQuery } from '../../services/stocks.services'

interface TableDetailProps {
  data: Stock[]
  editData?: Stock
  setEditData: (data: ((prev: Stock | undefined) => Stock) | Stock) => void
  setData: (data: Stock[]) => void
}

export const getStatusLabel = (status: string): JSX.Element => {
  return <Typography>123</Typography>
}

const TableCurrent = ({ data: rawData }: TableDetailProps): JSX.Element => {
  const [data, setData] = useState<Stock[]>([])
  const [editData, setEditData] = useState<Stock>()

  const { data: currentStockData } = useGetCurrentStocksQuery({})

  useEffect(() => {
    if (currentStockData?.data?.data) {
      setData(currentStockData.data.data)
    }
  }, [currentStockData])

  useEffect(() => {
    if (rawData.length) {
      const filterBuyStocks = rawData.filter((item) => item.status === 'Buy')
      const combinedStocks = filterBuyStocks.map((item) => {
        const filterByCode = filterBuyStocks.filter((filterITem) => item.code === filterITem.code)
        if (filterByCode.length >= 1) {
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
            ratio: ratio(item?.currentPrice ?? 0, averagePrice),
            actualGain: quantity * (item.currentPrice ?? 0)
          }
        }
        return { ...item, ratio: ratio(item?.currentPrice ?? 0, item.purchasePrice) }
      })

      const removedDuplicateCode = removeDuplicatesByKey(combinedStocks, 'code')
      setData(removedDuplicateCode)
    } else {
      setData([])
    }
  }, [rawData])

  const onEdit = (row: Stock): void => {
    setEditData((prev: Stock | undefined) => {
      if (prev?.code) {
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

    if (editData?.code) {
      const newEditData: Stock = {
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
      setData(
        data.map((item) => {
          if (item.code.toUpperCase() === newEditData.code.toUpperCase()) {
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
            <TableCell>{row.quantity}</TableCell>
            <TableCell>{row.purchasePrice}</TableCell>
            <TableCell>
              {editData?.code.toUpperCase() === row.code.toUpperCase() ? (
                <TextField
                  name='currentPrice'
                  value={editData.currentPrice ?? 0}
                  onChange={(e) => onChangeRow(e)}
                  type='number'
                  autoFocus
                />
              ) : (
                row.currentPrice
              )}
            </TableCell>
            <TableCell>{`${row.ratio?.toFixed(2) ?? 0}%`}</TableCell>
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
