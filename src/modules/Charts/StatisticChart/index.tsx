import React, { memo, useMemo } from 'react'
import MACD from './Charts/MACD'
import RSI from './Charts/RSI'
import { Grid } from '@mui/material'
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
    <Grid container spacing={1} marginTop='50px' pb={3} px={3}>
      <Grid item xs={4}>
        <MA data={closePrices} />
      </Grid>
      <Grid item xs={4}>
        <MACD data={closePrices} />
      </Grid>
      <Grid item xs={4}>
        <RSI data={closePrices} />
      </Grid>
      <Grid item xs={4}>
        <Stochastic data={data} />
      </Grid>
      <Grid item xs={4}>
        <StochasticRSI />
      </Grid>
      <Grid item xs={4}>
        <MFI data={data} />
      </Grid>
    </Grid>
  )
}

export default memo(StatisticCharts)
