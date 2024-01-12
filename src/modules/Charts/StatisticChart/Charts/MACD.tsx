import { Box, Typography } from '@mui/material'
import type Highcharts from 'highcharts'
import { memo, useEffect, useMemo, useState } from 'react'
import type { MACD as IMACD } from 'src/Models'
import Chart from 'src/components/Chart'
import { Label } from 'src/components/MUIComponents'
import { chartLabelOptions, type ChartLabelType } from 'src/modules/Charts/StatisticChart/utils'
import { convertToDecimal } from 'src/utils'

interface MACDProps {
  data?: IMACD
}

interface Lines {
  macd: number[]
  signal: number[]
}
const MACD = ({ data }: MACDProps): JSX.Element => {
  const [lines, setLines] = useState<Lines>({ macd: [], signal: [] })

  useEffect(() => {
    if (data) {
      setLines({ macd: data.macd.slice(40), signal: data.signal.slice(40) })
    }
  }, [data])

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
    yAxis: {
      title: {
        text: ''
      }
    },
    xAxis: {
      visible: false
    },

    series: [
      {
        type: 'line',
        name: 'MACD',
        data: lines.macd,
        color: '#48c8f3',
        lineWidth: 4
      },
      {
        type: 'line',
        name: 'Signal',
        data: lines.signal,
        color: '#ee6666',
        lineWidth: 4
      }
    ]
  }

  const renderLabel = useMemo(() => {
    if (lines.macd.length && lines.signal.length) {
      const lastSignal = lines.macd[lines.macd.length - 1] - lines.signal[lines.signal.length - 1]
      let actionCase: ChartLabelType

      if (lastSignal <= -0.5) {
        actionCase = 'force'
      } else if (lastSignal < -0.1) {
        actionCase = 'sell'
      } else if (lastSignal >= -0.1 && lastSignal <= 0.1) {
        actionCase = 'hold'
      } else if (lastSignal > 0.1 && lastSignal <= 0.5) {
        actionCase = 'recommended'
      } else {
        actionCase = 'strong'
      }

      return (
        <Label type={chartLabelOptions[actionCase].type} fontSize={14}>
          {chartLabelOptions[actionCase].message}
        </Label>
      )
    }
  }, [lines])

  const lastPriceMACD = useMemo(() => {
    let macd = 0
    let signal = 0
    let minus = 0
    if (lines.macd.length && lines.signal.length) {
      macd = lines.macd[lines.macd.length - 1]
      signal = lines.signal[lines.signal.length - 1]
      minus = macd - signal
    }
    return {
      macd: convertToDecimal(macd),
      signal: convertToDecimal(signal),
      minus
    }
  }, [lines])

  return (
    <Box>
      <Box display='flex' mb={1}>
        <Typography variant='h5' component={'span'}>
          MACD:&nbsp;
        </Typography>
        <Label component={'span'} type={'success'}>
          {lastPriceMACD.macd}
        </Label>
        &nbsp;
        <Label component={'span'} type={'info'}>
          {lastPriceMACD.signal}
        </Label>
        &nbsp;
        <Label component={'span'} type={lastPriceMACD.minus > 0 ? 'success' : 'error'}>
          {lastPriceMACD.minus.toFixed(2)}
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

export default memo(MACD)
