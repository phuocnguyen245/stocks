import { Box, Typography } from '@mui/material'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { Label } from 'src/components/MUIComponents'
import { type ChartLabelType, chartLabelOptions } from './utils'

interface RSIProps {
  data: number[]
}

const calculateRSI = (data: number[], period: number): number[] => {
  const changes: number[] = []
  const gains: number[] = []
  const losses: number[] = []
  const rsis: number[] = []

  for (let i = 1; i < data.length; i++) {
    changes.push(data[i] - data[i - 1])
  }

  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      gains.push(changes[i])
      losses.push(0)
    } else {
      gains.push(0)
      losses.push(Math.abs(changes[i]))
    }
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period

  rsis.push(100 - 100 / (1 + avgGain / avgLoss))

  for (let i = period; i < changes.length; i++) {
    if (changes[i] > 0) {
      avgGain = (avgGain * (period - 1) + changes[i]) / period
      avgLoss = (avgLoss * (period - 1)) / period
    } else {
      avgGain = (avgGain * (period - 1)) / period
      avgLoss = (avgLoss * (period - 1) + Math.abs(changes[i])) / period
    }

    rsis.push(100 - 100 / (1 + avgGain / avgLoss))
  }

  return rsis
}

const period = 14
const RSI = ({ data }: RSIProps): JSX.Element => {
  const [stockData, setStockData] = useState<number[]>([])
  const [rsiValues, setRSIValues] = useState<number[]>([])

  useEffect(() => {
    if (data?.length) {
      setStockData(data)
    }
  }, [data])

  useEffect(() => {
    if (stockData.length) {
      const rsi = calculateRSI(stockData, period)
      setRSIValues(rsi)
    }
  }, [stockData])

  const renderLabel = useMemo(() => {
    if (rsiValues.length) {
      const lastSignal = rsiValues[rsiValues.length - 1]
      let actionCase: ChartLabelType = 'strong'

      if (lastSignal >= 70) {
        actionCase = 'force'
      } else if (lastSignal < 70 || lastSignal > 30) {
        actionCase = 'hold'
      } else {
        actionCase = 'strong'
      }

      const { type, message } = chartLabelOptions[actionCase]

      return <Label type={type}>{message}</Label>
    }
    return null // Return null if rsiValues.length is 0
  }, [rsiValues])

  return (
    <Box my={2}>
      <Box display='flex' mb={1}>
        <Typography variant='h5' component={'span'}>
          RSI:&nbsp;
        </Typography>
        <Label component={'span'} type={rsiValues[rsiValues.length - 1] > 0 ? 'success' : 'error'}>
          {rsiValues[rsiValues.length - 1]}
        </Label>
      </Box>
      <Box display='flex' alignItems='center'>
        <Typography component={'span'}>Action today:</Typography>&nbsp;
        <Typography component={'span'}>{renderLabel}</Typography>
      </Box>
    </Box>
  )
}

export default memo(RSI)
