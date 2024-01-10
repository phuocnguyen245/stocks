/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReAuth } from './baseQuery'
import type { ResponseType, ResponsePagination, Payments } from '../Models'

export const PaymentService = createApi({
  reducerPath: 'PaymentService',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getPayment: builder.query<ResponseType<ResponsePagination<Payments[]>>, any>({
      query: (params) => ({
        url: '/payment',
        params
      })
    }),
    createPayment: builder.mutation<ResponseType<any>, Payments>({
      query: (body) => ({
        url: '/payment',
        body,
        method: 'POST'
      })
    }),
    updatePayment: builder.mutation<ResponseType<any>, any>({
      query: (body) => ({
        url: `/payment/${body._id}`,
        body,
        method: 'PATCH'
      })
    }),
    deletePayment: builder.mutation<ResponseType<any>, any>({
      query: ({ _id }) => ({
        url: `/payment/${_id}`,
        method: 'Delete'
      })
    }),
    getAsset: builder.query<ResponseType<any>, any>({
      query: (params) => ({
        url: '/asset',
        params
      })
    })
  })
})

export const {
  useGetPaymentQuery,
  useCreatePaymentMutation,
  useDeletePaymentMutation,
  useUpdatePaymentMutation,
  useGetAssetQuery
} = PaymentService
