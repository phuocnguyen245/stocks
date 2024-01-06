import { Box, Typography } from '@mui/material'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { memo, useEffect, useMemo, useState } from 'react'
import { Label } from 'src/components/MUIComponents'
import { chartLabelOptions, type ChartLabelType } from 'src/modules/Charts/StatisticChart/utils'

interface MACDProps {
  data: number[]
}
interface Signals {
  index: number
  action: string
  point: number
  macd: number
  signal: number
}

const calculateEMA = (data: number[], period: number): number[] => {
  const k = 2 / (period + 1)
  const ema: number[] = []
  let sum = 0

  for (let i = 0; i < period; i++) {
    sum += data[i]
    ema.push(null as unknown as number)
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

const calculateMACD = (data: number[]): number[] => {
  const ema12 = calculateEMA(data, 12)
  const ema26 = calculateEMA(data, 26)
  const macdLine: number[] = []

  for (let i = 0; i < data.length; i++) {
    const macdValue = ema12[i] - ema26[i]
    macdLine.push(macdValue)
  }

  return macdLine
}

const calculateSignalLine = (macdLine: number[], signalPeriod: number): number[] => {
  const signalLine = calculateEMA(macdLine, signalPeriod)
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
        macd,
        signal
      })
    } else if (macd < signal) {
      actions.push({
        index: i,
        point: macd - signal,
        action: 'SELL',
        macd,
        signal
      })
    } else {
      actions.push({
        index: i,
        point: macd - signal,
        action: 'HOLD',
        macd,
        signal
      })
    }
  }
  return actions
}
interface Lines {
  macd: number[]
  signal: number[]
}
const MACD = ({ data }: MACDProps): JSX.Element => {
  const [signals, setSignals] = useState<Signals[]>([])
  const [lines, setLines] = useState<Lines>({ macd: [], signal: [] })

  useEffect(() => {
    const macdLine = calculateMACD(data)
    const signalLine = calculateSignalLine(macdLine, 9)
    const action = decideAction(macdLine, signalLine)
    setSignals(action)
    setLines({ macd: macdLine.slice(40), signal: signalLine.slice(40) })
  }, [data])

  const options: Highcharts.Options = {
    title: {
      text: ''
    },

    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        }
      }
    },
    yAxis: {
      title: {
        text: ''
      }
    },
    xAxis: {
      visible: false
    },

    series: [
      {
        type: 'line',
        name: 'MACD',
        data: lines.macd,
        color: '#48c8f3',
        lineWidth: 4
      },
      {
        type: 'line',
        name: 'Signal',
        data: lines.signal,
        color: '#ee6666',
        lineWidth: 4
      }
    ]
  }

  const renderLabel = useMemo(() => {
    if (signals.length) {
      const lastSignal = signals[signals.length - 1].point
      let actionCase: ChartLabelType

      if (lastSignal <= -0.5) {
        actionCase = 'force'
      } else if (lastSignal < -0.1) {
        actionCase = 'sell'
      } else if (lastSignal >= -0.1 && lastSignal <= 0.1) {
        actionCase = 'hold'
      } else if (lastSignal > 0.1 && lastSignal <= 0.5) {
        actionCase = 'recommended'
      } else {
        actionCase = 'strong'
      }

      return (
        <Label type={chartLabelOptions[actionCase].type} fontSize={14}>
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
        <Label component={'span'} type={'success'}>
          {signals[signals.length - 1]?.macd?.toFixed(2)}
        </Label>
        &nbsp;
        <Label component={'span'} type={'info'}>
          {signals[signals.length - 1]?.signal?.toFixed(2)}
        </Label>
        &nbsp;
        <Label
          component={'span'}
          type={signals[signals.length - 1]?.point > 0 ? 'success' : 'error'}
        >
          {signals[signals.length - 1]?.point?.toFixed(2)}
        </Label>
      </Box>
      <Box display='flex' alignItems='center'>
        <Typography component={'span'}>Action today:</Typography>&nbsp;
        <Typography component={'span'}>{renderLabel}</Typography>
      </Box>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  )
}

export default memo(MACD)
