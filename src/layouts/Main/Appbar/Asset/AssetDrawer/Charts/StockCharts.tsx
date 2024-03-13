import { Box, useTheme } from '@mui/material'
import { memo, useEffect, useState } from 'react'
import type { Stock } from 'src/models'
import Chart from 'src/components/Chart'
import { convertToDecimal } from 'src/utils'
interface IChartData {
  name: string
  y: number
}

const StockCharts = ({ data }: { data: Stock[] }): JSX.Element => {
  const theme = useTheme()
  const [chartData, setChartData] = useState<IChartData[]>([])

  useEffect(() => {
    const totalAsset = data.reduce((acc, cur) => acc + (cur.averagePrice ?? 0) * cur.volume, 0)

    const stocks: IChartData[] = []
    if (data.length) {
      data.forEach((stock: Stock) => {
        stocks.push({
          name: stock.code,
          y: convertToDecimal((((stock.averagePrice ?? 0) * stock.volume) / totalAsset) * 100)
        })
      })
      setChartData(stocks)
    } else {
      setChartData([
        {
          name: 'Cash',
          y: 100
        }
      ])
    }
  }, [data])

  const options = {
    chart: {
      type: 'pie',
      height: 300
    },
    title: {
      text: 'Stocks',
      style: {
        fontSize: '20px'
      }
    },
    tooltip: {
      valueSuffix: '%'
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer'
      },
      pie: {
        shadow: false,
        center: ['50%', '50%'],
        dataLabels: {
          format: '<b style="font-size: 12px;">{point.name}</b>'
        }
      }
    },
    series: [
      {
        name: 'Percentage',
        colorByPoint: true,
        data: chartData
      }
    ],
    credits: {
      enabled: false
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any

  return (
    <Box
      className='asset-chart'
      sx={{
        '.highcharts-background': {
          fill: theme.palette.mode === 'dark' ? theme.palette.grey[500] : '#f9f3fe'
        }
      }}
    >
      <Chart options={options} />
    </Box>
  )
}

export default memo(StockCharts)
