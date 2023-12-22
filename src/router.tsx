import React, { Suspense, lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import SuppedLoader from './components/Loader'

const PrivateRoute = ({ element: Element }: { element: React.ComponentType }): JSX.Element => {
  const tokens = localStorage.getItem('tokens') ?? ''
  const isLoggedIn = Boolean(JSON.parse(tokens))
  return isLoggedIn ? <Element /> : <Navigate to='/login' replace />
}

// eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
const Loader = (Component: any) => (props: any) => (
  <Suspense fallback={<SuppedLoader />}>
    <Component {...props} />
  </Suspense>
)

const Stocks = Loader(lazy(async () => await import('./components/Table/')))

const routes: RouteObject[] = [
  {
    path: '',
    children: [
      {
        path: '/',
        element: <Stocks />
      }
      // {
      //   path: '*',
      //   element: <Status404 />
      // }
    ]
  }
]

export default routes
