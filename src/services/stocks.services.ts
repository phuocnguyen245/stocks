/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReAuth } from './baseQuery'
import type { ResponseType, ResponsePagination, Stock } from '../Models'

export const StockService = createApi({
  reducerPath: 'StockService',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getStocks: builder.query<ResponseType<ResponsePagination<Stock[]>>, any>({
      query: (params) => ({
        url: '/stocks',
        params
      })
    }),
    getCurrentStocks: builder.query<ResponseType<ResponsePagination<Stock[]>>, any>({
      query: (params) => ({
        url: '/stocks/current',
        params
      })
    }),
    getStockStatistic: builder.query<ResponseType<ResponsePagination<[number[]]>>, any>({
      query: ({ code, params }) => ({
        url: `/stocks/statistic/${code}`,
        params
      })
    })
  })
})

export const { useGetStocksQuery, useGetCurrentStocksQuery, useGetStockStatisticQuery } =
  StockService
