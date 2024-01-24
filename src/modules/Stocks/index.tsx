import { Box } from '@mui/material'
import Paper from '@mui/material/Paper'
import { useState } from 'react'
import Helmet from 'src/components/Helmet'
import type { ConfirmModal as ConfirmModalType } from './Modals/index'
import StockFooter from './StockFooter'
import StockHeader from './StockHeader'
import CurrentStocks from './StockTables/CurrentStocks'
import StocksDetail from './StockTables/StocksDetail'

const Stocks = (): JSX.Element => {
  const [modalStatus, setModalStatus] = useState<ConfirmModalType>({
    isBuy: 1,
    open: false
  })

  const openConfirmModal = (): void => setModalStatus({ ...modalStatus, open: true })

  return (
    <>
      <Helmet>
        <title>Stocks</title>
      </Helmet>
      <Box
        component={Paper}
        sx={{ borderRadius: 0 }}
        position='relative'
        height='100%'
        minHeight={'100vh'}
        pt={4}
        mb='100px'
      >
        <StockHeader
          openConfirmModal={openConfirmModal}
          modalStatus={modalStatus}
          onSetModalStatus={setModalStatus}
        />
        <Box display='flex' gap={2} px={2}>
          <Box flex={1}>
            <StocksDetail />
          </Box>
          <Box flex={1.5} flexShrink='unset'>
            <CurrentStocks />
          </Box>
        </Box>
        <StockFooter />
      </Box>
    </>
  )
}
export default Stocks
