import type Highcharts from 'highcharts'
import { useAppSelector } from 'src/store'
import DarkChart from './DarkChart'
import LightChart from './LightChart'
import { memo } from 'react'

const Chart = ({ options, ...props }: { options: Highcharts.Options }): JSX.Element => {
  const { mode } = useAppSelector((state) => state.Stocks)

  if (mode === 'dark') {
    return (
      <DarkChart
        options={{
          ...options,
          tooltip: {
            ...options.tooltip,
            backgroundColor: '#000',
            style: {
              ...options.tooltip?.style,
              color: '#fff'
            }
          }
        }}
        {...props}
      />
    )
  }
  if (mode === 'light') {
    return (
      <LightChart
        options={{
          ...options,
          tooltip: {
            ...options.tooltip,
            backgroundColor: '#fff',
            style: {
              ...options.tooltip?.style,
              color: '#000'
            }
          }
        }}
        {...props}
      />
    )
  }
  return <></>
}

export default memo(Chart)
