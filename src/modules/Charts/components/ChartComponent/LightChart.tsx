// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import BrandLight from 'highcharts/themes/brand-light'
import { memo } from 'react'

const LightChart = ({
  options,
  highcharts
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  highcharts: any
  options: Highcharts.Options
}): JSX.Element => {
  BrandLight(Highcharts)
  Highcharts?._modules['Extensions/Themes/BrandLight.js']?.apply()

  return (
    <HighchartsReact highcharts={highcharts} options={options} constructorType={'stockChart'} />
  )
}

export default memo(LightChart)
