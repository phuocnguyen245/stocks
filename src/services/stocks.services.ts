/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReAuth } from './baseQuery'
import type {
  ResponseType,
  ResponsePagination,
  Stock,
  WatchList,
  Indicator,
  Board
} from '../models'

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
        url: '/current-stocks',
        params
      })
    }),
    getIndicator: builder.query<ResponseType<Indicator>, { code: string }>({
      query: ({ code }) => ({
        url: `/stocks/indicators/${code}`
      })
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getWatchList: builder.query<ResponseType<WatchList[]>, void>({
      query: () => ({
        url: '/stocks/watch-lists'
      })
    }),
    getBoard: builder.query<ResponseType<ResponsePagination<Board[]>>, any>({
      query: ({ search, ...rest }) => ({
        url: `/stocks/board?search=${search}`,
        params: { ...rest }
      })
    }),
    getRecommended: builder.query<ResponseType<Indicator[]>, any>({
      query: (params) => ({
        url: `stocks/recommended?q=${params}`
      })
    }),
    deleteCurrentStock: builder.mutation<ResponseType<{ message: string }>, any>({
      query: ({ code }) => ({
        url: `/current-stocks/${code}`,
        method: 'Delete'
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
    refreshStocks: builder.mutation<ResponseType<{ date: string }>, any>({
      query: () => ({
        url: '/stocks/refresh',
        method: 'POST'
      })
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    refreshTime: builder.query<ResponseType<{ date: string }>, void>({
      query: () => ({
        url: '/stocks/refresh'
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
  useGetIndicatorQuery,
  useGetBoardQuery,
  useRefreshStocksMutation,
  useCreateStockMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
  useDeleteCurrentStockMutation,
  useGetWatchListQuery,
  useGetRecommendedQuery,
  useRefreshTimeQuery
} = StockService
