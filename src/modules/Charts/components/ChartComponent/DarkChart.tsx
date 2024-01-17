// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import HighchartsReact from 'highcharts-react-official'
import BrandDark from 'highcharts/themes/brand-dark'
import { memo } from 'react'
import Highcharts from 'highcharts/highstock'

const ChartDart = ({
  options,
  highcharts
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  highcharts: any
  options: Highcharts.Options
}): JSX.Element => {
  BrandDark(Highcharts)
  Highcharts?._modules?.['Extensions/Themes/BrandDark.js']?.apply()

  return (
    <HighchartsReact highcharts={highcharts} options={options} constructorType={'stockChart'} />
  )
}

export default memo(ChartDart)
