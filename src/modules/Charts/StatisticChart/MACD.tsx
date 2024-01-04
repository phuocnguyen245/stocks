// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Box, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState, memo } from 'react'
import { Label } from 'src/components/MUIComponents'
import { chartLabelOptions } from 'src/modules/Charts/StatisticChart/utils'
interface MACDProps {
  data: number[]
}
interface Signals {
  rate: number
  index: number
  action: string
}

const calculateEMA1 = (data: number[], period: number): number[] => {
  const k = 2 / (period + 1)
  const ema: number[] = []
  let sum = 0

  for (let i = 0; i < period; i++) {
    sum += data[i]
    ema.push(null)
  }

  ema.push(sum / period)

  for (let i = period + 1; i < data.length; i++) {
    const currentValue = data[i]
    const prevEMA = ema[i - 1]
    const currentEMA = (currentValue - prevEMA) * k + prevEMA
    ema.push(currentEMA)
  }

  return ema
}

const calculateMACD1 = (data: number[]): number[] => {
  const ema12 = calculateEMA1(data, 12)
  const ema26 = calculateEMA1(data, 26)
  const macdLine: number[] = []

  for (let i = 0; i < data.length; i++) {
    const macdValue = ema12[i] - ema26[i]
    macdLine.push(macdValue)
  }

  return macdLine
}

const calculateSignalLine = (macdLine: number[], signalPeriod: number): number[] => {
  const signalLine = calculateEMA1(macdLine, signalPeriod)
  return signalLine
}

const decideAction = (macdLine: number[], signalLine: number[]): Signals[] => {
  const actions = []

  for (let i = 0; i < macdLine.length; i++) {
    const macd = macdLine[i]
    const signal = signalLine[i]
    if (macd > signal) {
      actions.push({
        index: i,
        point: macd - signal,
        action: 'BUY',
        rate: `${macd / signal}`
      })
    } else if (macd < signal) {
      actions.push({
        index: i,
        point: macd - signal,
        action: 'SELL',
        rate: `${macd / signal}`
      })
    } else {
      actions.push({
        index: i,
        point: macd - signal,
        action: 'HOLD',
        rate: `${macd / signal}`
      })
    }
  }
  return actions
}

const MACD = ({ data }: MACDProps): JSX.Element => {
  const [signals, setSignals] = useState<Signals[]>([])

  useEffect(() => {
    const macdLine = calculateMACD1(data)
    const signalLine = calculateSignalLine(macdLine, 9)
    const action = decideAction(macdLine, signalLine)
    setSignals(action)
  }, [data])

  const actionsDaysBefore = useCallback(
    (days = 10) => {
      if (signals.length) {
        const actions = [...signals].slice(days * -1)
        return actions
      }
      return []
    },
    [signals]
  )

  const renderLabel = useMemo(() => {
    if (signals.length) {
      const lastSignal = signals[signals.length - 1].point
      let actionCase: string

      if (lastSignal <= -50) {
        actionCase = 'force'
      } else if (lastSignal <= -30) {
        actionCase = 'sell'
      } else if (lastSignal <= 20) {
        actionCase = 'hold'
      } else if (lastSignal <= 40) {
        actionCase = 'recommended'
      } else {
        actionCase = 'strong'
      }

      return (
        <Label type={chartLabelOptions[actionCase].type}>
          {chartLabelOptions[actionCase].message}
        </Label>
      )
    }
  }, [signals])

  return (
    <Box>
      <Box display='flex' mb={1}>
        <Typography variant='h5' component={'span'}>
          MACD:&nbsp;
        </Typography>
        <Label
          component={'span'}
          type={signals[signals.length - 1]?.point > 0 ? 'success' : 'error'}
        >
          {signals[signals.length - 1]?.point.toFixed(2)}
        </Label>
      </Box>
      <Box display='flex' alignItems='center'>
        <Typography component={'span'}>Action today:</Typography>&nbsp;
        <Typography component={'span'}>{renderLabel}</Typography>
      </Box>
      {/* <Box display='flex'>
        <Typography>Action 10 days:</Typography>&nbsp;
        {actionsDaysBefore()?.map((item: Signals, index) => (
          <Typography component={'span'} key={index}>
            {item.action}&nbsp;
          </Typography>
        ))}
      </Box> */}
    </Box>
  )
}

export default memo(MACD)
