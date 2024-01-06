import { Delete, Edit, RemoveRedEyeSharp } from '@mui/icons-material'
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
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { type ErrorResponse, Link } from 'react-router-dom'
import type { LabelType, Stock } from 'src/Models'
import { getBgColor } from 'src/Models/constants'
import { Label, Loader } from 'src/components/MUIComponents'
import {
  useDeleteCurrentStockMutation,
  useGetCurrentStocksQuery
} from 'src/services/stocks.services'
import { useAppDispatch, useAppSelector } from 'src/store'
import { refetchStocks } from 'src/store/slices/stockSlice'
import { formatVND, ratio } from 'src/utils'

export const getStatusLabel = (status: string): JSX.Element => {
  return <Typography>123</Typography>
}

const TableCurrent = (): JSX.Element => {
  const [deleteCurrentStock] = useDeleteCurrentStockMutation()
  const dispatch = useAppDispatch()
  const { isRefetchStock } = useAppSelector((state) => state.Stocks)
  const [data, setData] = useState<Stock[]>([])
  const [editData, setEditData] = useState<Stock>()

  const {
    data: currentStockData,
    isLoading,
    refetch
  } = useGetCurrentStocksQuery({}, { refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (currentStockData?.data?.data) {
      setData(
        currentStockData.data.data.map((item: Stock) => ({
          ...item,
          orderPrice: Number(item.orderPrice?.toFixed(2)),
          investedValue: Number((item?.investedValue ?? 0).toFixed(2))
        }))
      )
    }
  }, [currentStockData])

  useEffect(() => {
    if (isRefetchStock) {
      refetch()
        .unwrap()
        .then(() => dispatch(refetchStocks(false)))
        .catch((error: ErrorResponse) => console.log(error))
    }
  }, [isRefetchStock])

  const onEdit = (row: Stock): void => {
    setEditData((prev: Stock | undefined) => {
      if (prev?.code) {
        const data = {
          _id: '',
          code: '',
          date: moment(Date.now()).format('DD/MM/YYYY'),
          volume: 0,
          orderPrice: 0,
          marketPrice: 0,
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
        investedValue:
          name === 'volume'
            ? (value as number) * Number(editData?.marketPrice)
            : name === 'marketPrice'
              ? (value as number) * editData.volume
              : editData.investedValue,
        ratio: name === 'marketPrice' ? ratio(value as number, editData.orderPrice) : editData.ratio
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
          <TableCell>Volume</TableCell>
          <TableCell>Average</TableCell>
          <TableCell>Market Price</TableCell>
          <TableCell align='center'>Profit/Loss</TableCell>
          <TableCell align='center'>Invested Value</TableCell>
          <TableCell align='center'>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell width='10%'>{row.code}</TableCell>
                <TableCell width='10%'>{row.volume}</TableCell>
                <TableCell width='10%'>{row.averagePrice}</TableCell>
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
                      name='marketPrice'
                      value={editData?.marketPrice ?? 0}
                      onChange={(e) => onChangeRow(e)}
                      type='number'
                      autoFocus
                      inputProps={{
                        step: 1
                      }}
                    />
                  ) : (
                    row?.marketPrice
                  )}
                </TableCell>
                <TableCell width='10%'>{renderLabel(Number(row?.ratio) * 100)}</TableCell>
                <TableCell width='15%'>
                  {renderLabel(Number(row.investedValue?.toFixed(2)), 'gain')}
                </TableCell>
                <TableCell width='10%'>
                  <Box display='flex' alignItems='center' justifyContent='center' gap={0.5}>
                    <Button
                      sx={{ width: '40px', minWidth: 'unset', borderRadius: '100%' }}
                      onClick={() => {
                        onView(row)
                      }}
                    >
                      <Link
                        to={`/stock/${row.code}`}
                        style={{ display: 'flex', alignItems: 'center' }}
                        target='_blank'
                      >
                        <RemoveRedEyeSharp color='primary' />
                      </Link>
                    </Button>
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
                      onClick={async () => {
                        await onDelete(row)
                      }}
                    >
                      <Delete color='error' />
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
    </Table>
  )
}

export default TableCurrent
