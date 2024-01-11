// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import SandSignika from 'highcharts/themes/brand-light'
import { memo } from 'react'

const LightChart = ({ options }: { options: Highcharts.Options }): JSX.Element => {
  SandSignika(Highcharts)
  Highcharts._modules['Extensions/Themes/BrandLight.js'].apply()

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default memo(LightChart)
