import React, { useMemo } from 'react'
import MACD from './MACD'
import RSI from './RSI'

interface StatisticChartsProps {
  data: [number[]]
}

const StatisticCharts = ({ data }: StatisticChartsProps): JSX.Element => {
  const closePrices = useMemo(() => {
    if (data.length) {
      return data.map((item) => item[4])
    }
    return []
  }, [data])

  return (
    <div>
      <MACD data={closePrices} />
      <RSI data={closePrices} />
    </div>
  )
}

export default StatisticCharts
