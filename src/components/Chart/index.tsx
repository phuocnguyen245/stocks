import type Highcharts from 'highcharts'
import { useAppSelector } from 'src/store'
import DarkChart from './DarkChart'
import LightChart from './LightChart'

const Chart = ({ options }: { options: Highcharts.Options }): JSX.Element => {
  const { mode } = useAppSelector((state) => state.Stocks)
  console.log(mode)

  if (mode === 'dark') {
    return <DarkChart options={options} />
  }
  if (mode === 'light') {
    return <LightChart options={options} />
  }
  return <></>
}

export default Chart
