import AppBarComponent from 'src/layouts/Sidebar/Main/Appbar'
import Outlet from 'src/layouts/Sidebar/Main/Outlet'

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
