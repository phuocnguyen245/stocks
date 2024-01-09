import React, { Suspense, lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import SuppedLoader from './components/SuspendLoader'

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

const Stocks = Loader(lazy(async () => await import('src/modules/Table')))
const Charts = Loader(lazy(async () => await import('src/modules/Charts')))
const MainLayout = Loader(lazy(async () => await import('src/Layouts')))

const routes: RouteObject[] = [
  {
    path: '',
    element: <MainLayout />,
    children: [
      {
        path: '/stocks',
        element: <Stocks />,
        children: [
          {
            path: ':code',
            element: <Charts />
          }
        ]
      },
      {
        path: '/payment',
        element: <Stocks />
      }
    ]
  }
]

export default routes
