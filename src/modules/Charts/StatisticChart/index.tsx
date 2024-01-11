import React, { memo, useMemo } from 'react'
import MACD from './Charts/MACD'
import RSI from './Charts/RSI'
import { Box, Grid, Paper } from '@mui/material'
import Stochastic from './Charts/Stochastic'
import MA from './Charts/MA'
import StochasticRSI from './Charts/StochasticRSI'
import MFI from './Charts/MFI'

interface StatisticChartsProps {
  data: number[][]
}

const StatisticCharts = ({ data }: StatisticChartsProps): JSX.Element => {
  const closePrices = useMemo(() => {
    if (data.length) {
      return data.map((item) => item[4])
    }
    return []
  }, [data])

  return (
    <Paper>
      <Grid container spacing={1.5} marginTop='112px' pb={3} px={3}>
        <Grid item xs={4} pb={1.5}>
          <MA data={closePrices} />
        </Grid>
        <Grid item xs={4} pb={1.5}>
          <MACD data={closePrices} />
        </Grid>
        <Grid item xs={4} pb={1.5}>
          <RSI data={closePrices} />
        </Grid>
        <Grid item xs={4} pb={1.5}>
          <Stochastic data={data} />
        </Grid>
        <Grid item xs={4} pb={1.5}>
          <StochasticRSI />
        </Grid>
        <Grid item xs={4} pb={1.5}>
          <MFI data={data} />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default memo(StatisticCharts)
