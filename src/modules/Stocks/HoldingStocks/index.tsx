import { Box, Grid } from '@mui/material'
import { memo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Helmet from 'src/components/Helmet'
import CurrentStocks from 'src/modules/Stocks/HoldingStocks/CurrentStocks'
import type { ConfirmModal as ConfirmModalType } from 'src/modules/Stocks/HoldingStocks/Modals/index'
import StockFooter from 'src/modules/Stocks/HoldingStocks/Partials/AssetFooter'
import StockHeader from 'src/modules/Stocks/HoldingStocks/Partials/StockHeader'
import StocksDetail from 'src/modules/Stocks/HoldingStocks/StocksDetail'
import { useAppSelector } from 'src/store'

const HoldingStocks = (): JSX.Element => {
  const navigate = useNavigate()

  const { isMdWindow } = useAppSelector((state) => state.Stocks)
  const [modalStatus, setModalStatus] = useState<ConfirmModalType>({
    isBuy: 1,
    open: false
  })

  const openConfirmModal = (): void => setModalStatus({ ...modalStatus, open: true })

  useEffect(() => {
    navigate('/stocks')
  }, [])

  return (
    <Box
      height='100%'
      position='relative'
      minHeight='calc(100vh)'
      pt={isMdWindow ? 5 : 8}
      pb={isMdWindow ? 4 : 0}
      px={2}
    >
      <Helmet title='label.stocks' />

      <Box>
        <Grid container columnSpacing={2} rowGap={2} justifyContent='center'>
          <Grid item xs={12} sm={12} md={12} lg={5.5}></Grid>
          <Grid item xs={12} sm={12} md={12} lg={5.5}>
            <StockHeader
              openConfirmModal={openConfirmModal}
              modalStatus={modalStatus}
              onSetModalStatus={setModalStatus}
            />
          </Grid>
        </Grid>
        <Box>
          <Grid container columnSpacing={2} rowGap={2} justifyContent='center'>
            <Grid item xs={12} sm={12} md={12} lg={5.5} order={isMdWindow ? 2 : 1}>
              <StocksDetail />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={5.5} order={isMdWindow ? 1 : 2}>
              <CurrentStocks />
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* {!isMdWindow && <StockFooter />} */}
    </Box>
  )
}
export default memo(HoldingStocks)
