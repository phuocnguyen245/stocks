import { useTheme } from '@mui/material'
import type Highcharts from 'highcharts'
import DarkChart from './DarkChart'
import LightChart from './LightChart'

const ChartComponent = ({
  highcharts,
  options
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  highcharts: any
  options: Highcharts.Options
}): JSX.Element => {
  const theme = useTheme()

  return theme.palette.mode === 'dark' ? (
    <DarkChart
      options={{
        ...options,
        tooltip: {
          ...options.tooltip,
          backgroundColor: 'transparent',
          style: {
            ...options.tooltip?.style,
            color: '#fff'
          }
        }
      }}
      highcharts={highcharts}
    />
  ) : (
    <LightChart
      options={{
        ...options,
        tooltip: {
          ...options.tooltip,
          backgroundColor: 'transparent',
          style: {
            ...options.tooltip?.style,
            color: '#000'
          }
        }
      }}
      highcharts={highcharts}
    />
  )
}

export default ChartComponent
