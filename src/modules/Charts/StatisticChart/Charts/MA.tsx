import { Box, Typography } from '@mui/material'

import { memo, useEffect, useState } from 'react'
import { Label } from 'src/components/MUIComponents'
import { chartLabelOptions, type ChartLabelType } from '../utils'
import Chart from 'src/components/Chart'

interface MaProps {
  data: number[]
}
interface Lines {
  ma10: number[]
  ma20: number[]
  ma50: number[]
  ma100: number[]
  ma150: number[]
  ma200: number[]
}

const calculateMA = (prices: number[], size: number): number[] => {
  const ma: number[] = []

  for (let i = size - 1; i < prices.length; i++) {
    const slicePrices = prices.slice(i - size + 1, i + 1)
    const sum = slicePrices.reduce((acc, price) => acc + price, 0)
    const average = sum / size
    ma.push(average)
  }

  return [...Array.from({ length: size }).map(() => null), ...ma] as unknown as number[]
}

const MA = ({ data }: MaProps): JSX.Element => {
  const [lines, setLines] = useState<Lines>()

  useEffect(() => {
    if (data.length) {
      setLines({
        ma10: calculateMA(data, 10),
        ma20: calculateMA(data, 20),
        ma50: calculateMA(data, 50),
        ma100: calculateMA(data, 100),
        ma150: calculateMA(data, 150),
        ma200: calculateMA(data, 200)
      })
    }
  }, [data])

  const renderLabel = (ma?: number[]): JSX.Element | null => {
    let signal: ChartLabelType
    if (lines && Object.keys(lines).length && ma) {
      const lastPrice = data[data.length - 1]
      const lastMAPrice = ma[ma.length - 1]
      if (lastPrice > lastMAPrice) {
        signal = 'recommended'
      } else if (lastPrice < lastMAPrice) {
        signal = 'sell'
      } else {
        signal = 'hold'
      }
      const { type, message } = chartLabelOptions[signal]
      return (
        <Label type={type} fontSize='14px'>
          {message}
        </Label>
      )
    }
    return null
  }

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
    xAxis: {
      visible: false
    },
    yAxis: {
      title: {
        text: ''
      }
    },
    series: [
      {
        name: 'MA10',
        data: lines?.ma10,
        type: 'line'
      },
      {
        name: 'MA20',
        data: lines?.ma20,
        type: 'line'
      },
      {
        name: 'MA50',
        data: lines?.ma50,
        type: 'line'
      },
      {
        name: 'MA100',
        data: lines?.ma100,
        type: 'line'
      },
      {
        name: 'MA150',
        data: lines?.ma150,
        type: 'line'
      },
      {
        name: 'MA200',
        data: lines?.ma200,
        type: 'line'
      }
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500
          }
        }
      ]
    }
  }

  return (
    <Box>
      <Box display='flex' mb={1}>
        <Typography variant='h5' component={'span'}>
          MA&nbsp;
        </Typography>
      </Box>
      <Box display='flex' alignItems='center' flexWrap='wrap' gap={0.75} mb={1.5}>
        <Box display='flex' alignItems='center'>
          <Typography component={'span'} variant='subtitle1'>
            MA10:
          </Typography>
          &nbsp;
          {renderLabel(lines?.ma10)}
        </Box>
        <Box display='flex' alignItems='center'>
          <Typography component={'span'} variant='subtitle1'>
            MA20:
          </Typography>
          &nbsp;
          {renderLabel(lines?.ma10)}
        </Box>
        <Box display='flex' alignItems='center'>
          <Typography component={'span'} variant='subtitle1'>
            MA100:
          </Typography>
          &nbsp;
          {renderLabel(lines?.ma10)}
        </Box>
        <Box display='flex' alignItems='center'>
          <Typography component={'span'} variant='subtitle1'>
            MA150:
          </Typography>
          &nbsp;
          {renderLabel(lines?.ma10)}
        </Box>
        <Box display='flex' alignItems='center'>
          <Typography component={'span'} variant='subtitle1'>
            MA200:
          </Typography>
          &nbsp;
          {renderLabel(lines?.ma10)}
        </Box>
      </Box>

      <Chart options={options} />
    </Box>
  )
}

export default memo(MA)
