/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from '@reduxjs/toolkit/query/react'
import type { ResponseType, User, UserWithToken } from '../Models'
import { baseQueryWithReAuth } from './baseQuery'

export const UserService = createApi({
  reducerPath: 'UserService',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    login: builder.mutation<ResponseType<UserWithToken>, any>({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body
      })
    }),
    register: builder.mutation<ResponseType<UserWithToken>, any>({
      query: (body) => ({
        url: '/users/register',
        method: 'POST',
        body
      })
    }),
    getUser: builder.mutation<ResponseType<User>, any>({
      query: ({ _id }) => ({
        url: `/users/${_id}`
      })
    }),
    checkEmail: builder.mutation({
      query: (body) => ({
        url: '/users/send-mail',
        method: 'POST',
        body
      })
    }),
    updatePassword: builder.mutation({
      query: (body) => ({
        url: '/users/password',
        method: 'PUT',
        body
      })
    })
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserMutation,
  useCheckEmailMutation,
  useUpdatePasswordMutation
} = UserService
