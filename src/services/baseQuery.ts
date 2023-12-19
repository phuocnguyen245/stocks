import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError
} from '@reduxjs/toolkit/query'

export const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_API_URL}`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('tokens')
    if (token) {
      const tokenParse = JSON.parse(token)
      const {
        token: { accessToken }
      } = tokenParse
      headers.set('Authorization', `Bearer ${accessToken}`)
    }
    return headers
  }
})

export const baseQueryWithoutToken = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_API_URL}`
})

export const baseQueryWithReAuth: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    const token = localStorage.getItem('tokens')
    if (token) {
      const refreshArgs = {
        url: '/get-refresh-token',
        body: {
          refreshToken: JSON.parse(token).token.refreshToken
        },
        method: 'POST'
      }
      try {
        const refreshResult = await baseQuery(refreshArgs, api, extraOptions)
        localStorage.setItem('tokens', JSON.stringify({ token: refreshResult.data }))
        result = await baseQuery(args, api, extraOptions)
      } catch (error) {
        localStorage.removeItem('tokens')
        localStorage.removeItem('user')
      }
    }
  }
  return result
}
