import { Container, Grid } from '@mui/material'
import { memo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Helmet from 'src/components/Helmet'
import { useModals } from 'src/hooks'
import CurrentStocks from 'src/modules/Stocks/HoldingStocks/CurrentStocks'
import StockHeader from 'src/modules/Stocks/HoldingStocks/Partials/StockHeader'
import { useAppSelector } from 'src/store'

const HoldingStocks = (): JSX.Element => {
  const navigate = useNavigate()

  const { isMdWindow } = useAppSelector((state) => state.Stocks)
  const { open, hide, show } = useModals()

  useEffect(() => {
    navigate('/stocks')
  }, [])

  return (
    <Container sx={{ pt: isMdWindow ? 5 : 8, pb: isMdWindow ? 4 : 0, px: 2 }}>
      <Helmet title='label.stocks' />

      <Grid container sx={{ pt: isMdWindow ? 2 : 0 }}>
        <StockHeader open={open} hide={hide} show={show} />
      </Grid>
      <Grid container columnSpacing={2} rowGap={2} justifyContent='center'>
        <Grid item xs={12} sm={12} md={12} lg={12} order={isMdWindow ? 1 : 2} pb={2}>
          <CurrentStocks />
        </Grid>
      </Grid>
    </Container>
  )
}
export default memo(HoldingStocks)
