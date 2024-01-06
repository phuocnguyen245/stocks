import { Box, Typography } from '@mui/material'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { memo, useEffect, useMemo, useState } from 'react'
import { Label } from 'src/components/MUIComponents'
import { chartLabelOptions, type ChartLabelType } from '../utils'
interface MFIProps {
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

  for (let i = 0; i < closePrices.length; i++) {
    let positiveFlow = 0
    let negativeFlow = 0

    // Tính toán dòng tiền cho mỗi phiên giao dịch
    for (let j = i - period + 1; j <= i; j++) {
      const typicalPrice = (highPrices[j] + lowPrices[j] + closePrices[j]) / 3
      const moneyFlow = typicalPrice * volumes[j]

      if (typicalPrice > (highPrices[j - 1] + lowPrices[j - 1] + closePrices[j - 1]) / 3) {
        positiveFlow += moneyFlow
      } else if (typicalPrice < (highPrices[j - 1] + lowPrices[j - 1] + closePrices[j - 1]) / 3) {
        negativeFlow += moneyFlow
      }
    }

    const moneyRatio = positiveFlow / negativeFlow
    const mfi = 100 - 100 / (1 + moneyRatio)

    mfiValues.push(mfi)
  }

  return mfiValues
}
const period = 14

const MFI = ({ data }: MFIProps): JSX.Element => {
  const [mfiValues, setMfiValues] = useState<number[]>([])

  useEffect(() => {
    if (data.length) {
      const mfi = calculateMFI(data.slice(100), period)
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

    xAxis: {
      visible: false
    },

    series: [{ data: mfiValues, type: 'line', name: 'MFI' }],
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
