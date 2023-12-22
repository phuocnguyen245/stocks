import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import Indicators from 'highcharts/indicators/indicators-all.js'
import DragPanes from 'highcharts/modules/drag-panes.js'
import AnnotationsAdvanced from 'highcharts/modules/annotations-advanced.js'
import PriceIndicator from 'highcharts/modules/price-indicator.js'
import FullScreen from 'highcharts/modules/full-screen.js'
import StockTools from 'highcharts/modules/stock-tools.js'
import React, { useEffect, useState } from 'react'

import { useGetStockStatisticQuery } from '../../services/stocks.services'

Indicators(Highcharts)
DragPanes(Highcharts)
AnnotationsAdvanced(Highcharts)
PriceIndicator(Highcharts)
FullScreen(Highcharts)
StockTools(Highcharts)

const StockChart = (): JSX.Element => {
  const [data, setData] = useState<[number[]]>([[]])
  const { data: stockStatistic } = useGetStockStatisticQuery(
    { code: 'DIG' },
    { refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    if (stockStatistic?.data?.data?.length) {
      setData(stockStatistic.data.data)
    }
  }, [stockStatistic])

  const volume = data?.map((item) => ({
    x: item[0], // the date
    y: item[5],
    color: item[1] > item[4] ? '#e41717' : '#39d424'
  }))
  // Define your chart configuration
  const options: Highcharts.Options = {
    yAxis: [
      {
        labels: {
          align: 'left'
        },
        height: '80%',
        resize: {
          enabled: true
        }
      },
      {
        labels: {
          align: 'left'
        },
        top: '80%',
        height: '20%',
        offset: 0
      }
    ],
    tooltip: {
      shape: 'callout',
      headerShape: 'callout',
      borderWidth: 0,
      shadow: false,
      positioner: function (width, height, point) {
        const chart = this.chart
        let position

        if (point.isHeader) {
          position = {
            x: Math.max(
              chart.plotLeft,
              Math.min(point.plotX + chart.plotLeft - width / 2, chart.chartWidth - width - 30)
            ),
            y: point.plotY
          }
        } else {
          position = {
            x: point.series.chart.plotLeft,
            y: 0
          }
        }

        return position
      }
    },
    series: [
      {
        name: 'DIG',
        id: 'DIG',
        type: 'candlestick',
        color: '#FF6F6F',
        upColor: '#50e51a',
        data
      },
      {
        type: 'column',
        id: 'DIG-volume',
        name: 'DIG Volume',
        data: volume,
        yAxis: 1
      },
      {
        type: 'sma',
        linkedTo: 'DIG',
        zIndex: 1,
        index: 20,
        params: {
          period: 20
        }
      },
      {
        type: 'sma',
        linkedTo: 'DIG',
        zIndex: 1,
        index: 20,
        params: {
          period: 50
        }
      },
      {
        type: 'sma',
        linkedTo: 'DIG',
        zIndex: 1,
        index: 20,
        params: {
          period: 100
        }
      }
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 800
          },
          chartOptions: {
            rangeSelector: {
              inputEnabled: false
            }
          }
        }
      ]
    }
  }

  return (
    <HighchartsReact highcharts={Highcharts} options={options} constructorType={'stockChart'} />
  )
}

export default StockChart
