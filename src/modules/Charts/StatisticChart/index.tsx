import React, { memo, useMemo } from 'react'
import MACD from './Charts/MACD'
import RSI from './Charts/RSI'
import { Box, Grid, Paper } from '@mui/material'
import Stochastic from './Charts/Stochastic'
import MA from './Charts/MA'
import StochasticRSI from './Charts/StochasticRSI'
import MFI from './Charts/MFI'
import { useGetIndicatorQuery } from 'src/services/stocks.services'

interface StatisticChartsProps {
  code: string
}

const StatisticCharts = ({ code }: StatisticChartsProps): JSX.Element => {
  const { data } = useGetIndicatorQuery({ code }, { refetchOnMountOrArgChange: true, skip: !code })

  return (
    <Paper>
      <Grid container spacing={1.5} marginTop='112px' pb={3} px={3}>
        <Grid item xs={4} pb={1.5}>
          <MA data={data?.data?.ma} lastPrice={data?.data?.lastPrice ?? 0} />
        </Grid>
        <Grid item xs={4} pb={1.5}>
          <MACD data={data?.data?.macd} />
        </Grid>
        <Grid item xs={4} pb={1.5}>
          <RSI data={data?.data?.rsi} />
        </Grid>
        <Grid item xs={4} pb={1.5}>
          <Stochastic data={data?.data?.stoch} />
        </Grid>
        <Grid item xs={4} pb={1.5}>
          <StochasticRSI />
        </Grid>
        <Grid item xs={4} pb={1.5}>
          <MFI data={data?.data?.mfi} />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default memo(StatisticCharts)
