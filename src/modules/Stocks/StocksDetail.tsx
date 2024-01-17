import { Switch, TextField } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { type ErrorResponse } from 'react-router-dom'
import type { LabelType, Stock } from 'src/models'
import { Label } from 'src/components/MUIComponents'
import Table from 'src/components/Table'
import type { DefaultPagination, TableHeaderBody } from 'src/components/Table/type'
import {
  useDeleteStockMutation,
  useGetStocksQuery,
  useUpdateStockMutation
} from 'src/services/stocks.services'
import { useAppDispatch, useAppSelector } from 'src/store'
import { refetchStocks } from 'src/store/slices/stockSlice'
import { countDays } from 'src/utils'

const StocksDetail = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { isRefetchStock } = useAppSelector((state) => state.Stocks)
  const [updateStocks] = useUpdateStockMutation()
  const [deleteStocks] = useDeleteStockMutation()

  const [data, setData] = useState<Stock[]>([])
  const [editData, setEditData] = useState<Stock>()
  const [pagination, setPagination] = useState<DefaultPagination>({
    page: 0,
    size: 10
  })

  const {
    data: stocksData,
    isLoading,
    refetch
  } = useGetStocksQuery({ ...pagination }, { refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (stocksData?.data?.data?.length) {
      const data = stocksData?.data?.data.map((item) => ({
        ...item,
        t: countDays(item.date)
      }))
      setData(data)
    }
  }, [stocksData])

  useEffect(() => {
    if (isRefetchStock) {
      refetch()
        .unwrap()
        .then(() => dispatch(refetchStocks(false)))
        .catch((error: ErrorResponse) => console.log(error))
    }
  }, [isRefetchStock])

  const onEdit = async (row: Stock): Promise<void> => {
    if (editData?._id) {
      const defaultRow: Stock = {
        _id: '',
        code: '',
        date: moment(Date.now()).format('DD/MM/YYYY'),
        volume: 0,
        orderPrice: 0,
        marketPrice: 0,
        status: 'Buy',
        ratio: 0,
        sellPrice: 0
      }

      await updateStocks(row)
        .unwrap()
        .then(() => dispatch(refetchStocks(true)))
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

  const onDelete = async (row: Stock): Promise<void> => {
    await deleteStocks({ _id: row._id })
      .unwrap()
      .then(async () => {
        dispatch(refetchStocks(true))
        await refetch()
      })
    return setData(data.filter((item) => item._id !== row._id))
  }

  const table: Array<TableHeaderBody<Stock>> = [
    {
      name: 'code',
      title: <FormattedMessage id='label.code' />,
      width: '10%'
    },
    {
      name: 'date',
      title: <FormattedMessage id='label.date' />,
      width: '10%',
      render: (row) => <>{moment(row.date).format('DD/MM/YYYY')}</>
    },
    {
      name: 'volume',
      title: <FormattedMessage id='label.volume' />,
      width: '15%',
      render: (row) => {
        return (
          <>
            {editData?._id === row._id ? (
              <TextField
                sx={[
                  {
                    '& .MuiInputBase-root': {
                      height: '36px'
                    }
                  }
                ]}
                name='volume'
                value={row.volume}
                onChange={(e) => onChangeRow(e)}
                type='number'
                fullWidth
                inputProps={{
                  step: 1
                }}
              />
            ) : (
              row.volume
            )}
          </>
        )
      }
    },
    {
      name: 'orderPrice',
      title: <FormattedMessage id='label.order' />,
      width: '15%',
      render: (row) => (
        <>
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
              name='orderPrice'
              value={row.orderPrice}
              onChange={(e) => onChangeRow(e)}
              type='number'
              inputProps={{ step: '0.1' }}
              autoFocus
              fullWidth
            />
          ) : (
            row.orderPrice
          )}
        </>
      )
    },
    {
      name: 'sellPrice',
      title: <FormattedMessage id='label.sell' />,
      width: '10%'
    },
    {
      name: 'status',
      title: <FormattedMessage id='label.status' />,
      width: '50px',
      render: (row) => {
        return (
          <>
            {editData?._id === row._id ? (
              <Switch
                sx={{ height: '36px' }}
                name='status'
                color='secondary'
                checked={row.status === 'Buy'}
                onChange={(e) => onChangeRow(e)}
              />
            ) : (
              <Label
                type={row.status.toUpperCase() === 'BUY' ? 'success' : 'primary'}
                fontSize={14}
              >
                {row.status}
              </Label>
            )}
          </>
        )
      }
    },
    {
      name: '',
      title: 'T+',
      align: 'center',
      render: (row) => {
        return <>{row.t}</>
      }
    },
    {
      name: '',
      title: <FormattedMessage id='label.available' />,
      align: 'center',
      width: '100px',
      render: (row) => {
        const options = {
          available: {
            type: 'success',
            message: <FormattedMessage id='label.available' />
          },
          un: {
            type: 'warning',
            message: <FormattedMessage id='label.unavailable' />
          }
        }
        const isAvailable = (row?.t ?? 0) >= 2.5 ? 'available' : 'un'

        return (
          <Label
            type={options[`${isAvailable}`]?.type as LabelType}
            whiteSpace='nowrap'
            fontSize={14}
          >
            {options[`${isAvailable}`]?.message}
          </Label>
        )
      }
    }
  ]

  return (
    <Table
      data={data}
      table={table}
      isLoading={isLoading}
      totalItems={stocksData?.data?.totalItems ?? 0}
      onDelete={onDelete}
      onEdit={onEdit}
      pagination={pagination}
      onSetPagination={setPagination}
    />
  )
}

export default StocksDetail
