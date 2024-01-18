import React, { Suspense, lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import SuppedLoader from './components/SuspendLoader'
import Register from './modules/Auth/Register'

const PrivateRoute = ({
  element: Element,
  path
}: {
  element: React.ComponentType
  path?: string
}): JSX.Element => {
  const tokens = localStorage.getItem('tokens') ?? ''
  const isLoggedIn = Boolean(JSON.parse(tokens))
  if (isLoggedIn) {
    if (path === '/') {
      return <Navigate to='/stocks' replace />
    }
    return <Element />
  }
  localStorage.removeItem('tokens')
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

const Stocks = Loader(lazy(async () => await import('src/modules/Stocks')))
const Charts = Loader(lazy(async () => await import('src/modules/Charts')))
const Payment = Loader(lazy(async () => await import('src/modules/Payments')))
const AuthLayout = Loader(lazy(async () => await import('src/modules/Auth/Layout')))
const Login = Loader(lazy(async () => await import('src/modules/Auth/Login')))
const MainLayout = Loader(lazy(async () => await import('src/Layouts/Sidebar')))

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
          },
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
          }
        ]
      }
    ]
  }
]

export default routes
