import { Box, Typography } from '@mui/material'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { Label } from 'src/components/MUIComponents'
import { type ChartLabelType, chartLabelOptions } from './utils'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
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

  const options = {
    title: {
      text: ''
    },

    series: [{ data: rsiValues, type: 'line', name: 'RSI' }],
    yAxis: {
      title: {
        text: ''
      },
      minorGridLineWidth: 0,
      gridLineWidth: 0,
      alternateGridColor: null,
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
          to: 30,
          color: 'rgba(12, 187, 161, 0.1)',
          label: {
            text: 'Buy recommended',
            align: 'center',
            style: {
              color: '#606060'
            }
          }
        },
        {
          // Light air
          from: 30,
          to: 70,
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
          from: 70,
          to: 80,
          color: 'rgba(84, 70, 228, 0.1)',
          label: {
            text: 'Sell recommended',
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
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }
      ]
    }
  }

  return (
    <Box my={2}>
      <Box display='flex' mb={1}>
        <Typography variant='h5' component={'span'}>
          RSI:&nbsp;
        </Typography>
        <Label component={'span'} type={rsiValues[rsiValues.length - 1] > 0 ? 'success' : 'error'}>
          {rsiValues[rsiValues.length - 1].toFixed(2)}
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

export default memo(RSI)
