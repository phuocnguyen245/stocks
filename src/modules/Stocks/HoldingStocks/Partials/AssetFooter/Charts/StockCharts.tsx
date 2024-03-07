import Chart from 'src/components/Chart'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import type { Stock } from 'src/Models'
import { convertToDecimal } from 'src/utils'

interface IChartData {
  code: string
  y: number
}

const StockCharts = ({ data }: { data: Stock[] }): JSX.Element => {
  const [chartData, setChartData] = useState<IChartData[]>([])

  useEffect(() => {
    const totalAsset = data.reduce((acc, cur) => acc + (cur.averagePrice ?? 0) * cur.volume, 0)
    const stocks: IChartData[] = []
    if (data.length) {
      data.forEach((stock: Stock) => {
        stocks.push({
          code: stock.code,
          y: convertToDecimal(((stock.averagePrice ?? 0) * stock.volume) / totalAsset)
        })
      })
      setChartData(stocks)
    } else {
      setChartData([
        {
          code: 'Cash',
          y: 100
        }
      ])
    }
  }, [data])

  const options = {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Stocks percentage',
      align: 'left'
    },
    tooltip: {
      pointFormat: '{series.code}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        borderWidth: 2,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.code}</b><br>{point.percentage}%'
        }
      }
    },
    series: [
      {
        // Disable mouse tracking on load, enable after custom animation
        enableMouseTracking: false,
        animation: {
          duration: 2000
        },
        colorByPoint: true,
        data: chartData
      }
    ]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any

  return (
    <Box
      sx={{
        '& .highcharts-container': {
          height: '230px !important'
        }
      }}
    >
      <Chart options={options} />
    </Box>
  )
}

export default StockCharts
