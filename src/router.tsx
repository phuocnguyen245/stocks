import React, { Suspense, lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import SuppedLoader from './components/SuspendLoader'

const PrivateRoute = ({
  element: Element,
  path
}: {
  element: React.ComponentType
  path?: string
}): JSX.Element => {
  const tokens = localStorage.getItem('tokens')
  if (tokens) {
    const isLoggedIn = Boolean(JSON.parse(tokens))
    if (isLoggedIn) {
      if (path === '/') {
        return <Navigate to='/stocks' replace />
      }
      return <Element />
    }
    localStorage.removeItem('tokens')
  }
  return <Navigate to='/login' replace />
}

const PublicRoute = ({ element: Element }: { element: React.ComponentType }): JSX.Element => {
  localStorage.removeItem('tokens')
  return <Element />
}

// eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
const Loader = (Component: any) => (props: any) => (
  <Suspense fallback={<SuppedLoader />}>
    <Component {...props} />
  </Suspense>
)

const MainLayout = Loader(lazy(async () => await import('src/Layouts/Sidebar')))
const AuthLayout = Loader(lazy(async () => await import('src/modules/Auth/Layout')))

const Stocks = Loader(lazy(async () => await import('src/modules/Stocks/HoldingStocks')))
const FilterStocks = Loader(lazy(async () => await import('src/modules/Stocks/FilterStocks')))
const HistoryStocks = Loader(lazy(async () => await import('src/modules/Stocks/HistoryStocks')))
const Charts = Loader(lazy(async () => await import('src/modules/Charts')))
const Payment = Loader(lazy(async () => await import('src/modules/Payments')))
const Login = Loader(lazy(async () => await import('src/modules/Auth/Login')))
const Register = Loader(lazy(async () => await import('src/modules/Auth/Register')))
const ForgotPassword = Loader(lazy(async () => await import('src/modules/Auth/ForgotPassword')))
const EnterEmail = Loader(lazy(async () => await import('src/modules/Auth/EnterEmail')))
const Status404 = Loader(lazy(async () => await import('src/modules/Status/404')))

const routes: RouteObject[] = [
  {
    path: '',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <PrivateRoute element={Stocks} path='/' />
      },
      {
        path: '/stocks',
        children: [
          {
            path: '',
            element: <PrivateRoute element={Stocks} />
          }
        ]
      },
      {
        path: '/history',
        children: [
          {
            path: '',
            element: <PrivateRoute element={HistoryStocks} />
          }
        ]
      },
      {
        path: '/filters',
        children: [
          {
            path: '',
            element: <PrivateRoute element={FilterStocks} />
          }
        ]
      },
      {
        path: '/charts/',
        children: [
          {
            path: ':code',
            element: <PrivateRoute element={Charts} />
          }
        ]
      },
      {
        path: '/payments',
        element: <PrivateRoute element={Payment} />
      },
      {
        path: '',
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <PublicRoute element={Login} />
          },
          {
            path: '/register',
            element: <PublicRoute element={Register} />
          },
          {
            path: '/email',
            element: <PublicRoute element={EnterEmail} />
          },
          {
            path: '/forgot-password',
            element: <PublicRoute element={ForgotPassword} />
          }
        ]
      },
      {
        path: '*',
        element: <Status404 />
      }
    ]
  }
]

export default routes
