import { Grid, Paper } from '@mui/material'
import { memo } from 'react'
import { useGetIndicatorQuery } from 'src/services/stocks.services'
import MA from './Charts/MA'
import MACD from './Charts/MACD'
import MFI from './Charts/MFI'
import RSI from './Charts/RSI'
import Stochastic from './Charts/Stochastic'
import StochasticRSI from './Charts/StochasticRSI'
import Helmet from 'src/components/Helmet'

interface TechnicalChartProps {
  code: string
}

const TechnicalCharts = ({ code }: TechnicalChartProps): JSX.Element => {
  const { data } = useGetIndicatorQuery({ code }, { refetchOnMountOrArgChange: true, skip: !code })

  return (
    <Paper>
      <Helmet title='title.technical.chart' />
      <Grid container spacing={1.5} marginTop='12px' pb={3} px={3}>
        <Grid item xs={12} sm={6} md={6} lg={4} pb={1.5}>
          <MA data={data?.data?.ma} lastPrice={data?.data?.lastPrice ?? 0} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4} pb={1.5}>
          <MACD data={data?.data?.macd} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4} pb={1.5}>
          <RSI data={data?.data?.rsi} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4} pb={1.5}>
          <Stochastic data={data?.data?.stoch} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4} pb={1.5}>
          <StochasticRSI data={data?.data?.stochRSI} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4} pb={1.5}>
          <MFI data={data?.data?.mfi} />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default memo(TechnicalCharts)
