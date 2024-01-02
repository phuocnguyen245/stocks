import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import type { LabelType, Stock } from 'src/Models'
import { formatVND, ratio, removeDuplicatesByKey } from 'src/utils'
import { Delete, Edit, RemoveRedEyeSharp } from '@mui/icons-material'
import moment from 'moment'
import {
  useDeleteCurrentStockMutation,
  useGetCurrentStocksQuery
} from 'src/services/stocks.services'
import { Label } from 'src/components/MUIComponents'
import { getBgColor } from 'src/Models/constants'
import { useAppDispatch, useAppSelector } from 'src/store'
import { refetchCurrentStocks } from 'src/store/slices/stockSlice'

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
  const [deleteCurrentStock] = useDeleteCurrentStockMutation()
  const dispatch = useAppDispatch()
  const { isRefetchCurrentStock } = useAppSelector((state) => state.Stocks)
  const [data, setData] = useState<Stock[]>([])
  const [editData, setEditData] = useState<Stock>()

  const { data: currentStockData, refetch } = useGetCurrentStocksQuery(
    {},
    { refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    if (currentStockData?.data?.data) {
      setData(
        currentStockData.data.data.map((item: Stock) => ({
          ...item,
          purchasePrice: Number(item.purchasePrice?.toFixed(2)),
          actualGain: Number((item?.actualGain ?? 0).toFixed(2))
        }))
      )
    }
  }, [currentStockData])

  useEffect(() => {
    if (isRefetchCurrentStock) {
      refetch()
        .unwrap()
        .then(() => dispatch(refetchCurrentStocks(false)))
        .catch((error) => console.log(error))
    }
  }, [isRefetchCurrentStock])

  // useEffect(() => {
  //   if (rawData.length) {
  //     const filterBuyStocks = rawData.filter((item) => item.status === 'Buy')
  //     const combinedStocks = filterBuyStocks.map((item) => {
  //       const filterByCode = filterBuyStocks.filter((filterITem) => item.code === filterITem.code)
  //       if (filterByCode.length >= 1) {
  //         const quantity = filterByCode.reduce((acc, cur) => acc + cur.quantity, 0)
  //         const averagePrice =
  //           filterByCode.reduce((acc, cur) => acc + cur.purchasePrice * cur.quantity, 0) / quantity

  //         return {
  //           ...item,
  //           quantity,
  //           purchasePrice: Number(averagePrice.toFixed(2)),
  //           ratio: ratio(item?.currentPrice ?? 0, averagePrice),
  //           actualGain: Number(
  //             (quantity * ((item?.currentPrice ?? 0) - item.purchasePrice)).toFixed(2)
  //           )
  //         }
  //       }
  //       return { ...item, ratio: ratio(item?.currentPrice ?? 0, item.purchasePrice) }
  //     })

  //     const removedDuplicateCode = removeDuplicatesByKey(combinedStocks, 'code')
  //     setData(removedDuplicateCode)
  //   } else {
  //     setData([])
  //   }
  // }, [rawData])

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

  const onView = (row: Stock): void => {}

  const onDelete = async (row: Stock): Promise<void> => {
    await deleteCurrentStock({ code: row.code })
      .unwrap()
      .then(async () => await refetch())
  }

  const renderLabel = useCallback((number: number, type?: string) => {
    const labelType: LabelType = number === 0 ? 'warning' : number > 0 ? 'success' : 'error'
    const symbol = number > 0 ? '+' : ''
    return type ? (
      <Typography color={getBgColor(labelType)} textAlign='center' fontWeight={600}>
        {symbol}
        {formatVND(number * 1000)}
      </Typography>
    ) : (
      <Label type={labelType}>{number.toFixed(2)}%</Label>
    )
  }, [])

  return (
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell>Code</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Average </TableCell>
          <TableCell>Current Price</TableCell>
          <TableCell align='center'>Ratio</TableCell>
          <TableCell align='center'>Earn</TableCell>
          <TableCell align='center'>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell width='10%'>{row.code}</TableCell>
            <TableCell width='10%'>{row.quantity}</TableCell>
            <TableCell width='10%'>{row.average}</TableCell>
            <TableCell width='15%'>
              {editData?.code?.toUpperCase() === row?.code?.toUpperCase() ? (
                <TextField
                  sx={[
                    {
                      '& .MuiInputBase-root': {
                        height: '36px'
                      }
                    }
                  ]}
                  name='currentPrice'
                  value={editData?.currentPrice ?? 0}
                  onChange={(e) => onChangeRow(e)}
                  type='number'
                  autoFocus
                  inputProps={{
                    step: 1
                  }}
                />
              ) : (
                row?.currentPrice
              )}
            </TableCell>
            <TableCell width='10%'>{renderLabel(Number(row?.ratio) * 100)}</TableCell>
            <TableCell width='15%'>
              {renderLabel(Number(row.actualGain?.toFixed(2)), 'gain')}
            </TableCell>
            <TableCell width='10%'>
              <Box display='flex' alignItems='center' justifyContent='center' gap={0.5}>
                <Button
                  color='info'
                  sx={{ width: '40px', minWidth: 'unset', borderRadius: '100%' }}
                  onClick={() => {
                    onEdit(row)
                  }}
                >
                  <Edit />
                </Button>
                <Button
                  sx={{ width: '40px', minWidth: 'unset', borderRadius: '100%' }}
                  onClick={() => {
                    onView(row)
                  }}
                >
                  <RemoveRedEyeSharp />
                </Button>
                <Button
                  sx={{ width: '40px', minWidth: 'unset', borderRadius: '100%' }}
                  onClick={async () => {
                    await onDelete(row)
                  }}
                >
                  <Delete />
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableCurrent
