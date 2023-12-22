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
    }),
    createStock: builder.mutation<ResponseType<Stock>, any>({
      query: (body) => ({
        url: '/stocks',
        body,
        method: 'POST'
      })
    }),
    updateStock: builder.mutation<ResponseType<ResponsePagination<[number[]]>>, any>({
      query: ({ _id, ...rest }) => ({
        url: `/stocks/${_id}`,
        body: rest,
        method: 'PATCH'
      })
    }),
    deleteStock: builder.mutation<ResponseType<ResponsePagination<[number[]]>>, any>({
      query: ({ _id }) => ({
        url: `/stocks/${_id}`,
        method: 'Delete'
      })
    })
  })
})

export const {
  useGetStocksQuery,
  useGetCurrentStocksQuery,
  useGetStockStatisticQuery,
  useCreateStockMutation,
  useUpdateStockMutation,
  useDeleteStockMutation
} = StockService
