import React, { memo, useEffect, useMemo, useState } from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Box, Typography } from '@mui/material'
import { Label } from 'src/components/MUIComponents'
import { type ChartLabelType, chartLabelOptions } from '../utils'

interface Signal {
  signal: ChartLabelType
  i: number
}
interface StochasticLines {
  kValues: number[]
  dValues: number[]
}
interface StochasticProps {
  data: number[][]
}

const period = 14

const calculateStochasticK = (prices: number[][], period: number): number[] => {
  const result: number[] = []
  const highPrices: number[] = []
  const lowPrices: number[] = []
  const closePrices: number[] = []

  prices.forEach((item) => {
    highPrices.push(item[2])
    lowPrices.push(item[3])
    closePrices.push(item[4])
  })

  for (let i = period - 1; i < closePrices.length; i++) {
    const recentClose = closePrices.slice(i - period + 1, i + 1)
    const recentLow = lowPrices.slice(i - period + 1, i + 1)
    const recentHigh = highPrices.slice(i - period + 1, i + 1)

    const lowestLow = Math.min(...recentLow)
    const highestHigh = Math.max(...recentHigh)

    const currentClose = recentClose[recentClose.length - 1]
    const stochasticK = (100 * (currentClose - lowestLow)) / (highestHigh - lowestLow)
    result.push(stochasticK)
  }

  return result
}

const calculateStochasticD = (stochasticKValues: number[], smaPeriod: number): number[] => {
  const result: number[] = []

  for (let i = smaPeriod - 1; i < stochasticKValues.length; i++) {
    const recentStochasticK = stochasticKValues.slice(i - smaPeriod + 1, i + 1)
    const stochasticD = recentStochasticK.reduce((sum, value) => sum + value, 0) / smaPeriod
    result.push(stochasticD)
  }
  return result
}

const Stochastic = ({ data }: StochasticProps): JSX.Element => {
  const [lines, setLines] = useState<StochasticLines>({ dValues: [], kValues: [] })

  useEffect(() => {
    if (data.length) {
      const k = calculateStochasticK(data.slice(100), period)
      const d = calculateStochasticD(k, 3)
      setLines({ dValues: d, kValues: k })
    }
  }, [data])

  const options: Highcharts.Options = {
    title: {
      text: ''
    },

    yAxis: {
      range: 100,
      title: {
        text: ''
      },
      plotBands: [
        {
          // Light air
          from: 0,
          to: 20,
          color: 'rgba(0, 255, 26, 0.1)',
          label: {
            text: 'Strong Buy recommended',
            align: 'center',
            style: {
              color: '#606060'
            }
          }
        },
        {
          // Light air
          from: 20,
          to: 80,
          color: 'rgba(137, 198, 223, 0.1)',
          label: {
            text: 'Hold recommended',
            align: 'center',
            style: {
              color: '#606060'
            }
          }
        },
        {
          // Light air
          from: 80,
          to: 100,
          color: 'rgba(22, 1, 253, 0.1)',
          label: {
            text: 'Strong Sell recommended',
            align: 'center'
          }
        }
      ]
    },

    xAxis: {
      visible: false
    },

    series: [
      {
        type: 'line',
        name: '%D',
        data: lines.dValues
      },
      {
        type: 'line',
        name: '%K',
        data: lines.kValues.slice(2)
      }
    ]
  }

  const signals = useMemo(() => {
    const arr: Signal[] = []
    if (lines.dValues.length && lines.kValues.length) {
      const length = lines.dValues.length
      for (let i = 0; i < length; i++) {
        const k = lines.kValues[i + 2]
        const d = lines.dValues[i]

        if (k > d) {
          if (k <= 20) {
            arr.push({ signal: 'strong', i })
          }
          arr.push({ signal: 'recommended', i })
        } else if (k < d) {
          if (k >= 80) {
            arr.push({ signal: 'force', i })
          }
          arr.push({ signal: 'sell', i })
        } else {
          arr.push({ signal: 'hold', i })
        }
      }
    }
    return arr
  }, [lines])

  const renderLabel = useMemo(() => {
    if (signals.length) {
      const lastSignal = signals[signals.length - 1]

      const { type, message } = chartLabelOptions[lastSignal.signal]

      return (
        <Label type={type} fontSize={14}>
          {message}
        </Label>
      )
    }
    return null
  }, [signals])

  return (
    <Box>
      <Box display='flex' mb={1}>
        <Typography variant='h5' component={'span'}>
          Stochastic:&nbsp;
        </Typography>
        <Label type='success' component={'span'}>
          %K: {lines.kValues[lines.kValues.length - 1]?.toFixed(2)}
        </Label>
        &nbsp;
        <Label type='info' component={'span'}>
          %D: {lines.dValues[lines.dValues.length - 1]?.toFixed(2)}
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

export default memo(Stochastic)
