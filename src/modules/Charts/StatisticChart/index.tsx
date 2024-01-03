import React, { useMemo } from 'react'
import MACD from './MACD'

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
  console.log(closePrices)

  return (
    <div>
      <MACD data={closePrices} />
    </div>
  )
}

export default StatisticCharts
