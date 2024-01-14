import { Box, Typography } from '@mui/material'
import type Highcharts from 'highcharts'
import { memo, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import Chart from 'src/components/Chart'
import { Label } from 'src/components/MUIComponents'
import { getRSI } from 'src/store/slices/stockSlice'
import { chartLabelOptions, type ChartLabelType } from '../utils'
interface RSIProps {
  data?: number[]
}

const RSI = ({ data }: RSIProps): JSX.Element => {
  const dispatch = useDispatch()
  const [rsiValues, setRSIValues] = useState<number[]>([])

  useEffect(() => {
    if (data?.length) {
      const rsi = data
      setRSIValues(rsi)
      dispatch(getRSI(rsi))
    }
  }, [data])

  const renderLabel = useMemo(() => {
    if (rsiValues.length) {
      const lastSignal = rsiValues[rsiValues.length - 1]
      let actionCase: ChartLabelType = 'strong'

      if (lastSignal >= 80) {
        actionCase = 'force'
      } else if (lastSignal >= 70) {
        actionCase = 'sell'
      } else if (lastSignal >= 30) {
        actionCase = 'hold'
      } else if (lastSignal >= 30) {
        actionCase = 'recommended'
      } else {
        actionCase = 'strong'
      }

      const { type, message } = chartLabelOptions[actionCase]

      return (
        <Label type={type} fontSize={14}>
          {message}
        </Label>
      )
    }
    return null
  }, [rsiValues])

  const options: Highcharts.Options = {
    title: {
      text: ''
    },

    series: [{ data: rsiValues, type: 'line', name: 'RSI', color: '#48c8f3', lineWidth: 2 }],
    yAxis: {
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
          to: 30,
          color: 'rgba(12, 187, 161, 0.1)',
          label: {
            text: 'Buy',
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
            text: 'Hold',
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
            text: 'Sell',
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
    <Box>
      <Box display='flex' mb={1}>
        <Typography variant='h5' component={'span'}>
          RSI:&nbsp;
        </Typography>
        <Label component={'span'} type={rsiValues[rsiValues.length - 1] > 0 ? 'success' : 'error'}>
          {rsiValues[rsiValues.length - 1]?.toFixed(2)}
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

export default memo(RSI)
