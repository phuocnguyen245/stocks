import { memo } from 'react'
import AppBarComponent from 'src/layouts/Main/Appbar'
import Outlet from 'src/layouts/Main/Outlet'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Main = ({ appBar, outlet }: any): JSX.Element => {
  return (
    <>
      <AppBarComponent {...appBar} />
      <Outlet {...outlet} />
    </>
  )
}

export default memo(Main)
