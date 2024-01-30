import { Box } from '@mui/material'
import Paper from '@mui/material/Paper'
import { useState } from 'react'
import Helmet from 'src/components/Helmet'
import type { ConfirmModal as ConfirmModalType } from 'src/modules/Stocks/HoldingStocks/Modals/index'
import StockFooter from 'src/modules/Stocks/HoldingStocks/Partials/StockFooter'
import StockHeader from 'src/modules/Stocks/HoldingStocks/Partials/StockHeader'
import CurrentStocks from 'src/modules/Stocks/HoldingStocks/CurrentStocks'
import StocksDetail from 'src/modules/Stocks/HoldingStocks/StocksDetail'

const HoldingStocks = (): JSX.Element => {
  const [modalStatus, setModalStatus] = useState<ConfirmModalType>({
    isBuy: 1,
    open: false
  })

  const openConfirmModal = (): void => setModalStatus({ ...modalStatus, open: true })

  return (
    <Box height='100%' position='relative' minHeight='100vh' pt={0}>
      <Helmet>
        <title>Stocks</title>
      </Helmet>

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
  )
}
export default HoldingStocks
