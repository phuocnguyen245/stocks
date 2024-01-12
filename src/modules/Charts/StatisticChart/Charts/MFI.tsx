import { Box, Typography } from '@mui/material'
import type Highcharts from 'highcharts'
import { memo, useEffect, useMemo, useState } from 'react'
import Chart from 'src/components/Chart'
import { Label } from 'src/components/MUIComponents'
import { chartLabelOptions, type ChartLabelType } from '../utils'
interface MFIProps {
  data?: number[]
}

const MFI = ({ data }: MFIProps): JSX.Element => {
  const [mfiValues, setMfiValues] = useState<number[]>([])

  useEffect(() => {
    if (data?.length) {
      setMfiValues(data)
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

    series: [{ data: mfiValues, type: 'line', name: 'MFI', color: '#48c8f3', lineWidth: 4 }],
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
      <Box display='flex' alignItems='center' mb={1.5}>
        <Typography component={'span'}>Action today:</Typography>&nbsp;
        <Typography component={'span'}>{renderLabel}</Typography>
      </Box>
      <Chart options={options} />
    </Box>
  )
}

export default memo(MFI)
