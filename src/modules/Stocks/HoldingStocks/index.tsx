import { Box, Grid } from '@mui/material'
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
    <Box height='100%' position='relative' minHeight='calc(100vh - 112px)' pt={0} pb='112px'>
      <Helmet>
        <title>Stocks</title>
      </Helmet>

      <StockHeader
        openConfirmModal={openConfirmModal}
        modalStatus={modalStatus}
        onSetModalStatus={setModalStatus}
      />
      <Box px={2}>
        <Grid container columnSpacing={2} rowGap={2}>
          <Grid item xs={12} sm={12} md={12} lg={5}>
            <StocksDetail />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={7}>
            <CurrentStocks />
          </Grid>
        </Grid>
      </Box>
      <StockFooter />
    </Box>
  )
}
export default HoldingStocks
