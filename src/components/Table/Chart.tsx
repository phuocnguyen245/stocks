/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable one-var */
/* eslint-disable @typescript-eslint/promise-function-async */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { useGetStockStatisticQuery } from '../../services/stocks.services'

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

  useEffect(() => {
    if (data.length > 0) {
      ;(async () => {
        const volume = data?.map((item) => ({
          x: item[0], // the date
          y: item[5],
          color: item[1] > item[4] ? '#e41717' : '#39d424'
        }))

        Highcharts.stockChart('container', {
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
            shape: 'square',
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
                    Math.min(
                      point.plotX + chart.plotLeft - width / 2,
                      chart.chartWidth - width - chart.marginRight
                    )
                  ),
                  y: point.plotY
                }
              } else {
                position = {
                  x: point.series.chart.plotLeft,
                  y: point.series.yAxis.top - chart.plotTop
                }
              }

              return position
            }
          },
          series: [
            {
              id: 'Dig',
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
        })
      })()
    }
  }, [data])

  return <div id='container' className='chart'></div> // Container for the chart
}
export default StockChart
