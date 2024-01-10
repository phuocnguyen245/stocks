import { Box } from '@mui/material'
import { Outlet } from 'react-router'
import { useGetAssetQuery } from 'src/services/payment.services'
import Header from './Header'

const Layout = (): JSX.Element => {
  useGetAssetQuery({}, { refetchOnMountOrArgChange: true })

  return (
    <Box>
      <Header />
      <Outlet />
    </Box>
  )
}

export default Layout
