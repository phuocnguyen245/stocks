import { Box, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'

interface MACDProps {
  data: number[]
}
interface Signals {
  index: number
  action: string
}
const calculateEMA = (prices: number[], period: number): number[] => {
  const k = 2 / (period + 1)
  const ema: number[] = []
  const initialSMA = prices.slice(0, period).reduce((acc, val) => acc + val, 0) / period
  ema.push(initialSMA)

  for (let i = period; i < prices.length; i++) {
    const nextEMA: number = (prices[i] - ema[ema.length - 1]) * k + ema[ema.length - 1]
    ema.push(nextEMA)
  }

  return ema
}

const calculateMACD = (
  prices: number[],
  shortPeriod = 5,
  longPeriod = 12,
  signalPeriod = 9
): {
  macdLine: number[]
  signalLine: number[]
} => {
  const shortEMA = calculateEMA(prices, shortPeriod)
  const longEMA = calculateEMA(prices, longPeriod)

  const macdLine = shortEMA.map((val, index) => val - longEMA[index])

  // Adjust signalLine length to match macdLine
  const signalLine = calculateEMA(macdLine, signalPeriod)

  return { macdLine, signalLine }
}

const generateSignals = (macdLine: number[], signalLine: number[]): Signals[] => {
  const signals = []
  for (let i = 1; i < macdLine.length; i++) {
    if (
      signalLine[i - 1] !== undefined &&
      macdLine[i] > signalLine[i - 1] &&
      macdLine[i - 1] <= signalLine[i - 1]
    ) {
      signals.push({ index: i, action: 'Buy' })
    } else if (
      signalLine[i - 1] !== undefined &&
      macdLine[i] < signalLine[i - 1] &&
      macdLine[i - 1] >= signalLine[i - 1]
    ) {
      signals.push({ index: i, action: 'Sell' })
    } else {
      signals.push({ index: i, action: 'Hold' })
    }
  }
  return signals
}

const MACD = ({ data }: MACDProps): JSX.Element => {
  const [signals, setSignals] = useState<Signals[]>([{ index: 0, action: 'Not thing' }])

  useEffect(() => {
    const { macdLine, signalLine } = calculateMACD(data)
    setSignals(generateSignals(macdLine, signalLine))
  }, [data])

  const actionsFor10daysBefore = useMemo(() => {
    const arr = []
    if (signals.length) {
      for (let i = 10; i > 0; i--) {
        arr.push(signals[signals.length - 1 - i]?.action)
      }
    }
    return arr
  }, [signals])

  console.log(actionsFor10daysBefore)

  return (
    <Box>
      <Typography variant='h5'>MACD</Typography>
      <Box display='flex'>
        <Typography>Action today:</Typography>&nbsp;
        <Typography>{signals[signals.length - 1].action}</Typography>
        {actionsFor10daysBefore.map((item, index) => {
          return <Typography key={index}>{item}&nbsp;</Typography>
        })}
      </Box>
    </Box>
  )
}

export default MACD
