import { Switch, TextField, Typography } from '@mui/material'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { type ErrorResponse } from 'react-router-dom'
import type { LabelType, Stock } from 'src/models'
import { getBgColor } from 'src/models/constants'
import { Label } from 'src/components/MUIComponents'
import Table from 'src/components/Table'
import type { DefaultPagination, TableHeaderBody } from 'src/components/Table/type'
import {
  useDeleteCurrentStockMutation,
  useGetCurrentStocksQuery
} from 'src/services/stocks.services'
import { useAppDispatch, useAppSelector } from 'src/store'
import { refetchStocks } from 'src/store/slices/stockSlice'
import { countDays, formatVND, ratio } from 'src/utils'

const CurrentStocks = (): JSX.Element => {
  const [deleteCurrentStock] = useDeleteCurrentStockMutation()
  const dispatch = useAppDispatch()
  const { isRefetchStock } = useAppSelector((state) => state.Stocks)
  const [data, setData] = useState<Stock[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subData, setSubData] = useState<any[]>([])
  const [editData, setEditData] = useState<Stock>()
  const [pagination, setPagination] = useState<DefaultPagination>({
    page: 0,
    size: 10
  })

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
      setSubData(
        Object.values(currentStockData.data.data).map(
          (item: Stock) =>
            item.stocks?.map((stock) => ({
              ...stock,
              t: countDays(stock.date)
            }))
        )
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
      <Typography color={getBgColor(labelType)} fontWeight={600} fontSize={14}>
        {symbol}
        {formatVND(number * 1000)}
      </Typography>
    ) : (
      <Label type={labelType} fontSize={14}>
        {number.toFixed(2)}%
      </Label>
    )
  }, [])

  const table: Array<TableHeaderBody<Stock>> = [
    {
      name: 'code',
      title: <FormattedMessage id='label.code' />,
      width: '10%'
    },
    {
      name: 'volume',
      title: <FormattedMessage id='label.volume' />,
      width: '15%'
    },
    {
      name: 'averagePrice',
      title: <FormattedMessage id='label.average' />,
      width: '15%'
    },
    {
      name: 'marketPrice',
      title: <FormattedMessage id='label.market.price' />,
      width: '15%',
      render: (row) => (
        <>
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
        </>
      )
    },
    {
      name: 'ratio',
      title: <FormattedMessage id='label.profit.loss' />,
      width: '10%',
      render: (row) => <>{renderLabel(Number(row?.ratio) * 100)}</>
    },
    {
      name: 'investedValue',
      title: <FormattedMessage id='label.profit.loss.value' />,
      align: 'left',
      width: '20%',
      render: (row) => <> {renderLabel(Number(row.investedValue?.toFixed(2)), 'gain')}</>
    }
  ]

  const subTable: Array<TableHeaderBody<Stock>> = [
    {
      name: 'volume',
      title: <FormattedMessage id='label.volume' />
    },
    {
      name: 'orderPrice',
      title: <FormattedMessage id='label.order' />
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
      title: 'Take 1',
      render: (row) => {
        return <>{row.take[0].price}</>
      }
    },
    {
      name: '',
      title: 'Take 2',
      render: (row) => {
        return <>{row.take[1]?.price || 0}</>
      }
    },
    {
      name: '',
      title: 'Stop 1',
      render: (row) => {
        return <>{row.stop[0]?.price || 0}</>
      }
    },
    {
      name: '',
      title: 'Stop 2',
      render: (row) => {
        return <>{row.stop[1]?.price || 0}</>
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
      totalItems={currentStockData?.data?.totalItems ?? 0}
      // onDelete={onDelete}
      // onEdit={onEdit}
      pagination={pagination}
      onSetPagination={setPagination}
      onView={onView}
      subTable={subTable}
      subData={subData}
    />
  )
}

export default CurrentStocks
