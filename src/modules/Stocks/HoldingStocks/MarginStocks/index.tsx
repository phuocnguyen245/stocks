import { RemoveRedEye, Sell } from '@mui/icons-material'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useNavigate, type ErrorResponse } from 'react-router-dom'
import { ConfirmPopup, Table } from 'src/components'
import type { DefaultPagination, TableHeaderBody } from 'src/components/Table/type'
import { useAlert } from 'src/hooks'
import type { Stock } from 'src/models'
import {
  useDeleteCurrentStockMutation,
  useDeleteStockMutation,
  useGetCurrentStocksQuery
} from 'src/services/stocks.services'
import { useAppDispatch, useAppSelector } from 'src/store'
import { onSellStock, refetchStocks } from 'src/store/slices/stockSlice'
import { countDays, formatVND, ratio } from 'src/utils'
import StockLabel from '../components/StockLabel'

const CurrentStocks = (): JSX.Element => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isRefetchStock } = useAppSelector((state) => state.Stocks)

  const alert = useAlert()
  const [deleteCurrentStock, { isSuccess, isLoading }] = useDeleteCurrentStockMutation()
  const [deleteStock, { isSuccess: isDeleteStockSuccess, isLoading: isLoadingDeleteStock }] =
    useDeleteStockMutation()
  const [data, setData] = useState<Stock[]>([])
  const [subData, setSubData] = useState<Stock[]>([])
  const [editData, setEditData] = useState<Stock>()
  const [pagination, setPagination] = useState<DefaultPagination>({
    page: 0,
    size: 10,
    search: '',
    sortBy: '',
    sortDirection: undefined
  })

  const {
    data: currentStockData,
    isFetching,
    refetch
  } = useGetCurrentStocksQuery(pagination, { refetchOnMountOrArgChange: true })

  useEffect(() => {
    const stocks = currentStockData?.data?.data ?? []
    if (stocks) {
      setData(
        stocks.map((item: Stock) => ({
          ...item,
          orderPrice: Number(item.orderPrice?.toFixed(2)),
          investedValue: Number((item?.investedValue ?? 0).toFixed(2))
        }))
      )
      setSubData(
        Object.values(stocks).map(
          (item: Stock) =>
            item?.stocks?.map((stock: Stock) => ({
              ...stock,
              t: countDays(stock.date)
            }))
        ) as unknown as Stock[]
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

  const onDelete = async (row: Stock): Promise<void> => {
    try {
      const response = await deleteCurrentStock({ code: row.code }).unwrap()
      if (response) {
        alert({ message: response?.message, variant: 'success' })
        await refetch()
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert({ message: error?.data?.message, variant: 'error' })
    }
  }

  const onDeleteSubData = async (row: Stock): Promise<void> => {
    try {
      const response = await deleteStock({ _id: row._id }).unwrap()
      if (response) {
        alert({ message: response?.message, variant: 'success' })
        await refetch()
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert({ message: error?.data?.message, variant: 'error' })
    }
  }

  const onView = (row: Stock): void => {
    navigate(`/charts/${row.code}`)
  }

  const table: Array<TableHeaderBody<Stock>> = [
    {
      name: 'code',
      title: <FormattedMessage id='label.code' />,
      render: (row) => (
        <Typography fontWeight={600} fontSize={14} lineHeight={1}>
          {row.code}
        </Typography>
      )
    },
    {
      name: 'volume',
      title: <FormattedMessage id='label.total.volume' />
    },
    {
      name: 'availableVol',
      title: <FormattedMessage id='label.available.vol' />
    },
    {
      name: 'unavailableVol',
      title: <FormattedMessage id='label.unavailable.vol' />
    },
    {
      name: 'averagePrice',
      title: <FormattedMessage id='label.average' />
    },
    {
      name: 'marketPrice',
      title: <FormattedMessage id='label.market.price' />,
      render: (row) => {
        let color = 'error.main'
        const marketPrice = row.marketPrice ?? 0
        const averagePrice = row.averagePrice ?? 0
        if (marketPrice === averagePrice) {
          color = 'warning.main'
        }
        if (marketPrice > averagePrice) {
          color = 'success.main'
        }

        return (
          <StockLabel type='default' color={color}>
            {Number(row.marketPrice?.toFixed(2))}
          </StockLabel>
        )
      }
    },
    {
      name: 'ratio',
      title: <FormattedMessage id='label.profit.loss' />,
      render: (row) => (
        <Box width={80}>
          <StockLabel number={Number(row?.ratio)}>
            {(Number(row?.ratio) * 100).toFixed(2)}%
          </StockLabel>
        </Box>
      )
    },
    {
      name: 'investedValue',
      title: <FormattedMessage id='label.profit.loss.value' />,
      align: 'left',
      render: (row) => (
        <StockLabel number={Number(row?.investedValue)}>
          {formatVND(Number(row.investedValue?.toFixed(2)) * 1000)}
        </StockLabel>
      )
    },
    {
      name: '',
      title: '',
      align: 'center',
      width: '100px',
      render: (row) => {
        return (
          <Box display='flex' flexWrap='nowrap'>
            <Tooltip title='View' onClick={() => onView(row)}>
              <IconButton color='primary' onClick={() => onSell(row)}>
                <RemoveRedEye fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Sell'>
              <IconButton color='info' onClick={() => onSell(row)}>
                <Sell fontSize='small' />
              </IconButton>
            </Tooltip>

            <ConfirmPopup
              row={row}
              isLoading={isLoading}
              isSuccess={isSuccess}
              onConfirm={() => onDelete(row)}
            />
          </Box>
        )
      }
    }
  ]

  const onSell = (row: Stock): void => {
    dispatch(onSellStock(row))
  }

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
        return <>{row.t ?? 0}</>
      }
    },
    {
      name: '',
      title: 'Take 1',
      render: (row) => {
        return <>{row?.take?.[0]?.price}</>
      }
    },
    {
      name: '',
      title: 'Take 2',
      render: (row) => {
        return <>{row?.take?.[1]?.price || 0}</>
      }
    },
    {
      name: '',
      title: 'Stop 1',
      render: (row) => {
        return <>{row?.stop?.[0]?.price || 0}</>
      }
    },
    {
      name: '',
      title: 'Stop 2',
      render: (row) => {
        return <>{row?.stop?.[1]?.price || 0}</>
      }
    },
    {
      name: '',
      title: <FormattedMessage id='label.delete' />,
      align: 'center',
      width: '100px',
      render: (row) => {
        return (
          <ConfirmPopup
            row={row}
            isLoading={isLoadingDeleteStock}
            isSuccess={isDeleteStockSuccess}
            onConfirm={() => onDeleteSubData(row)}
          />
        )
      }
    }
  ]

  const onSort = (pagination: DefaultPagination): void => {
    setPagination(pagination)
  }

  return (
    <Table
      data={data}
      table={table}
      isLoading={isFetching}
      totalItems={currentStockData?.data?.totalItems ?? 0}
      onSort={onSort}
      pagination={pagination}
      onSetPagination={setPagination}
      subTable={subTable}
      subData={subData}
    />
  )
}

export default CurrentStocks