import { Box, Typography } from '@mui/material'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { memo, useEffect, useMemo, useState } from 'react'
import { Label } from 'src/components/MUIComponents'
import { chartLabelOptions, type ChartLabelType } from '../utils'
interface RSIProps {
  data: number[][]
}

const calculateMFI = (data: number[][], period: number): number[] => {
  const volumes: number[] = []
  const mfiValues: number[] = []
  const highPrices: number[] = []
  const lowPrices: number[] = []
  const closePrices: number[] = []

  data.forEach((item) => {
    highPrices.push(item[2])
    lowPrices.push(item[3])
    closePrices.push(item[4])
    volumes.push(item[5])
  })

  const typicalPrices = []
  const moneyFlows = []
  const positiveMoneyFlows = []
  const negativeMoneyFlows = []

  for (let i = 0; i < data.length; i++) {
    const typicalPrice = (highPrices[i] + lowPrices[i] + closePrices[i]) / 3
    typicalPrices.push(typicalPrice)

    const moneyFlow = typicalPrice * volumes[i]
    moneyFlows.push(moneyFlow)

    if (typicalPrices[i] > typicalPrices[i - 1]) {
      positiveMoneyFlows.push(moneyFlow)
      negativeMoneyFlows.push(0)
    } else if (typicalPrices[i] < typicalPrices[i - 1]) {
      positiveMoneyFlows.push(0)
      negativeMoneyFlows.push(moneyFlow)
    } else {
      positiveMoneyFlows.push(0)
      negativeMoneyFlows.push(0)
    }

    if (i >= period) {
      const positiveMF = positiveMoneyFlows.slice(i - period, i).reduce((a, b) => a + b, 0)
      const negativeMF = negativeMoneyFlows.slice(i - period, i).reduce((a, b) => a + b, 0)
      const moneyRatio = positiveMF / negativeMF
      const mfi = 100 - 100 / (1 + moneyRatio)
      mfiValues.push(mfi)
    }
  }

  return mfiValues
}
const period = 14

const MFI = ({ data }: RSIProps): JSX.Element => {
  const [mfiValues, setMfiValues] = useState<number[]>([])

  useEffect(() => {
    if (data.length) {
      const mfi = calculateMFI(data, period)
      setMfiValues(mfi)
    }
  }, [data])

  const renderLabel = useMemo(() => {
    if (mfiValues.length) {
      const lastSignal = mfiValues[mfiValues.length - 1]
      let actionCase: ChartLabelType = 'strong'

      if (lastSignal >= 80) {
        actionCase = 'force'
      } else if (lastSignal < 70 || lastSignal > 25) {
        actionCase = 'hold'
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
  }, [mfiValues])

  const options: Highcharts.Options = {
    title: {
      text: ''
    },

    series: [{ data: mfiValues, type: 'line', name: 'RSI' }],
    yAxis: {
      title: {
        text: ''
      },
      range: 100,
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
    <Box>
      <Box display='flex' mb={1}>
        <Typography variant='h5' component={'span'}>
          MFI:&nbsp;
        </Typography>
        <Label component={'span'} type={mfiValues[mfiValues.length - 1] > 0 ? 'success' : 'error'}>
          {mfiValues[mfiValues.length - 1]?.toFixed(2)}
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

export default memo(MFI)
