// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import SandSignika from 'highcharts/themes/sand-signika'

const LightChart = ({ options }: { options: Highcharts.Options }): JSX.Element => {
  SandSignika(Highcharts)
  Highcharts._modules['Extensions/Themes/SandSignika.js'].apply()

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default LightChart
