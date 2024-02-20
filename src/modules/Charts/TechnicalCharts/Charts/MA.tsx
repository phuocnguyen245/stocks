import { Box, Typography } from '@mui/material'

import { memo, useCallback, useEffect, useState } from 'react'
import { Label } from 'src/components/MUIComponents'
import { chartLabelOptions, type ChartLabelType } from '../../utils'
import Chart from 'src/components/Chart'
import type { MA as IMA } from 'src/Models'
import { log } from 'console'
import { useTheme } from '@emotion/react'

interface MAProps {
  data?: IMA
  lastPrice: number
}
const MA = ({ data, lastPrice }: MAProps): JSX.Element => {
  const [lines, setLines] = useState<IMA>()

  useEffect(() => {
    if (data) {
      setLines({
        ma10: data.ma10 ?? [],
        ma20: data.ma20 ?? [],
        ma50: data.ma50 ?? [],
        ma100: data.ma100 ?? [],
        ma150: data.ma150 ?? [],
        ma200: data.ma200 ?? []
      })
    }
  }, [data])

  const renderLabel = useCallback(
    (ma?: number[]): JSX.Element | null => {
      let signal: ChartLabelType
      if (lines && Object.keys(lines).length && ma) {
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
          <Label type={type} fontSize='12px'>
            {message}
          </Label>
        )
      }
      return null
    },
    [lastPrice, lines]
  )

  const options: Highcharts.Options = {
    title: {
      text: ''
    },
    tooltip: {
      backgroundColor: 'red'
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
          <Typography component={'span'} variant='subtitle1' fontSize={14}>
            MA10:
          </Typography>
          &nbsp;
          {renderLabel(lines?.ma10)}
        </Box>
        <Box display='flex' alignItems='center'>
          <Typography component={'span'} variant='subtitle1' fontSize={14}>
            MA20:
          </Typography>
          &nbsp;
          {renderLabel(lines?.ma20)}
        </Box>
        <Box display='flex' alignItems='center'>
          <Typography component={'span'} variant='subtitle1' fontSize={14}>
            MA50:
          </Typography>
          &nbsp;
          {renderLabel(lines?.ma50)}
        </Box>

        <Box display='flex' alignItems='center'>
          <Typography component={'span'} variant='subtitle1' fontSize={14}>
            MA200:
          </Typography>
          &nbsp;
          {renderLabel(lines?.ma200)}
        </Box>
      </Box>

      <Chart options={options} />
    </Box>
  )
}

export default memo(MA)
