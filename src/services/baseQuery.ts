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
      const { access } = tokenParse
      headers.set('Authorization', `Bearer ${access}`)
    }
    headers.set('Access-Control-Allow-Origin', '*')
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
      const tokenParse = JSON.parse(token)
      const { refresh } = tokenParse
      const refreshArgs = {
        url: '/users/refresh-token',
        body: {
          refreshToken: refresh
        },
        method: 'POST'
      }
      try {
        const refreshResult = await baseQuery(refreshArgs, api, extraOptions)

        if (refreshResult?.data) {
          localStorage.setItem(
            'tokens',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            JSON.stringify({ ...(refreshResult.data as any).data })
          )
          result = await baseQuery(args, api, extraOptions)
        } else {
          localStorage.removeItem('tokens')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      } catch (error) {
        localStorage.removeItem('tokens')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
  }
  return result
}
