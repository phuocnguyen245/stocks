import React, { useMemo } from 'react'
import Charts from 'src/components/Chart'
import type HighCharts from 'highcharts'
import type { Stock, Asset, ResponsePagination, ResponseType } from 'src/models'

interface ChartProps {
  currentData?: ResponseType<ResponsePagination<Stock[]>>
  asset?: Asset
}

const Chart = ({ data }: { data: ChartProps }): JSX.Element => {
  const chartData = useMemo(() => {
    if (data?.currentData?.data && data?.asset) {
      const arr = data?.currentData?.data?.data?.map((item) => ({
        name: item.code,
        y: ((item.volume * (item?.averagePrice ?? 0)) / (data?.asset?.investedValue ?? 1)) * 100000
      }))
      arr?.push({
        name: 'Available',
        y: (data.asset.available / data?.asset?.investedValue) * 100
      })
      return arr?.sort((a, b) => a.y - b.y)
    }
    return []
  }, [data])

  const options = {
    legend: {
      enabled: false
    },
    title: {
      text: ''
    },
    tooltip: {
      valueDecimals: 2,
      valueSuffix: '%'
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        colorByPoint: true,
        type: 'pie',
        size: '100%',
        innerSize: '0%',
        width: '200px',
        dataLabels: [
          {
            enabled: true,
            distance: 20
          },
          {
            enabled: true,
            distance: -40,
            format: '{point.percentage:.1f}%',
            style: {
              fontSize: '1.2em',
              textOutline: 'none',
              opacity: 0.7
            },
            filter: {
              operator: '>',
              property: 'percentage',
              value: 10
            }
          }
        ]
      }
    },
    series: [
      {
        type: 'pie',
        name: 'Percentage',
        data: chartData
      }
    ]
  }
  return <Charts options={options as HighCharts.Options} />
}

export default Chart
