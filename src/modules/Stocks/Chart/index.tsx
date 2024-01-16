import React from 'react'
import Charts from 'src/components/Chart'
import type HighCharts from 'highcharts'
// eslint-disable-next-line react/prop-types, @typescript-eslint/no-explicit-any
const Chart = ({ data }: { data: any }): JSX.Element => {
  console.log(data?.currentData?.data?.data)

  const options = {
    title: {
      text: 'Nuclear energy production from 1965 to 2021 in US, UK, France, Germany, and Japan',
      align: 'center'
    },

    legend: {
      enabled: false
    },

    tooltip: {
      valueDecimals: 2,
      valueSuffix: ' TWh'
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        colorByPoint: true,
        type: 'pie',
        size: '100%',
        innerSize: '80%',
        dataLabels: {
          enabled: true,
          crop: false,
          distance: '10px',
          style: {
            fontWeight: 'bold',
            fontSize: '16px'
          },
          connectorWidth: 0
        }
      }
    },
    series: [
      {
        type: 'pie',
        name: 'Percentage',
        data: [
          {
            name: 'Water',
            y: 55.02
          },
          {
            name: 'Fat',
            sliced: true,
            selected: true,
            y: 26.71
          },
          {
            name: 'Carbohydrates',
            y: 1.09
          },
          {
            name: 'Protein',
            y: 15.5
          },
          {
            name: 'Ash',
            y: 1.68
          }
        ]
      }
    ]
  }
  return <Charts options={options as HighCharts.Options} />
}

export default Chart
