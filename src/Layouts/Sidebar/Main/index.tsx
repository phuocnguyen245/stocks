import React from 'react'
import AppBarComponent from './Appbar'
import Outlet from './Outlet'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Main = ({ appBar, outlet }: any): JSX.Element => {
  return (
    <>
      <AppBarComponent {...appBar} />
      <Outlet {...outlet} />
    </>
  )
}

export default Main
