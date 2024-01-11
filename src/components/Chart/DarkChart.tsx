// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import DarkUnica from 'highcharts/themes/dark-unica'

const ChartDart = ({ options }: { options: Highcharts.Options }): JSX.Element => {
  DarkUnica(Highcharts)
  Highcharts._modules['Extensions/Themes/DarkUnica.js'].apply()

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default ChartDart
