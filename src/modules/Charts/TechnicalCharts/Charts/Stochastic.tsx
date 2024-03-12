import { Box, Typography } from '@mui/material'
import type * as Highcharts from 'highcharts'
import { memo, useEffect, useMemo, useState } from 'react'
import Chart from 'src/components/Chart'
import { Label } from 'src/components/MUIComponents'
import { chartLabelOptions, type ChartLabelType } from '../../utils'
import { type Stoch } from 'src/models'

interface Signal {
  signal: ChartLabelType
  i: number
}
interface StochasticLines {
  d: number[]
  k: number[]
}
interface StochasticProps {
  data?: Stoch
}

const Stochastic = ({ data }: StochasticProps): JSX.Element => {
  const [lines, setLines] = useState<StochasticLines>({ d: [], k: [] })

  useEffect(() => {
    if (data?.d?.length && data?.k?.length) {
      const k = data?.k
      const d = data?.d
      setLines({ d, k })
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
        data: lines.k.slice(2),
        color: '#48c8f3',
        lineWidth: 2
      },
      {
        type: 'line',
        name: '%D',
        data: lines.d,
        color: '#ee6666',
        lineWidth: 2
      }
    ]
  }

  const signals = useMemo(() => {
    const arr: Signal[] = []
    if (lines.d.length && lines.k.length) {
      const length = lines.d.length
      for (let i = 0; i < length; i++) {
        const k = lines.k[i + 2]
        const d = lines.d[i]

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
          %K: {lines.k[lines.k.length - 1]?.toFixed(2)}
        </Label>
        &nbsp;
        <Label type='info' component={'span'}>
          %D: {lines.d[lines.d.length - 1]?.toFixed(2)}
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

export default memo(Stochastic)
