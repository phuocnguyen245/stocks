import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import type Highcharts from 'highcharts'
import { memo, useEffect, useMemo, useState } from 'react'
import Chart from 'src/components/Chart'
import { Label } from 'src/components/MUIComponents'
import { useAppSelector } from 'src/store'
import { chartLabelOptions, type ChartLabelType } from '../utils'

interface Lines {
  kValues: number[]
  dValues: number[]
}

interface Signal {
  signal: ChartLabelType
  i: number
}

const calculateStochasticRSI = (rsiValues: number[], period: number): number[] => {
  const kValues: number[] = []

  for (let i = period - 1; i < rsiValues.length; i++) {
    const recentRSI = rsiValues.slice(i - period + 1, i + 1)

    const lowestRSI = Math.min(...recentRSI)
    const highestRSI = Math.max(...recentRSI)

    const currentRSI = rsiValues[i]
    const stochasticRSI = ((currentRSI - lowestRSI) / (highestRSI - lowestRSI)) * 100

    kValues.push(stochasticRSI)
  }

  return kValues
}

const calculateStochastic = (stochasticKValues: number[], smaPeriod: number): number[] => {
  const result: number[] = []

  for (let i = smaPeriod - 1; i < stochasticKValues.length; i++) {
    const recentStochasticK = stochasticKValues.slice(i - smaPeriod + 1, i + 1)
    const stochasticD = recentStochasticK.reduce((sum, value) => sum + value, 0) / smaPeriod
    result.push(stochasticD)
  }
  return result
}

const StochasticRSI = (): JSX.Element => {
  const { rsi: RSI } = useAppSelector((state) => state.Stocks)

  const [lines, setLines] = useState<Lines>({ dValues: [], kValues: [] })

  useEffect(() => {
    if (RSI.length) {
      const stochRSI = calculateStochasticRSI(RSI.slice(100), 14)
      const k = calculateStochastic(stochRSI, 3)
      const d = calculateStochastic(k, 3)
      setLines({ dValues: d, kValues: k })
    }
  }, [RSI])

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
            text: 'Strong Buy',
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
            text: 'Hold',
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
            text: 'Strong Sell',
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
        name: '%K',
        data: lines.kValues.slice(2),
        color: '#48c8f3',
        lineWidth: 4
      },
      {
        type: 'line',
        name: '%D',
        data: lines.dValues,
        color: '#ee6666',
        lineWidth: 4
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
          Stochastic RSI:&nbsp;
        </Typography>
        <Label type='success' component={'span'}>
          %K: {lines.kValues[lines.kValues.length - 1]?.toFixed(2)}
        </Label>
        &nbsp;
        <Label type='info' component={'span'}>
          %D: {lines.dValues[lines.dValues.length - 1]?.toFixed(2)}
        </Label>
      </Box>
      <Box display='flex' alignItems='center' mb={1.5}>
        <Typography component={'span'}>Action today:</Typography>&nbsp;
        <Typography component={'span'}>{renderLabel}</Typography>
      </Box>
      <Chart options={options} />
    </Box>
  )
}

export default memo(StochasticRSI)
