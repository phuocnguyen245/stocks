import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import type { Stock } from 'src/Models'
import Chart from 'src/components/Chart'
import { convertToDecimal } from 'src/utils'
interface IChartData {
  name: string
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
      type: 'pie'
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
      }
    },
    series: [
      {
        name: 'Percentage',
        colorByPoint: true,
        data: chartData
      }
    ]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
  console.log(chartData)

  return (
    <Box
      sx={{
        '& .highcharts-container': {
          height: '230px !important'
        }
      }}
      className='asset-chart'
    >
      <Chart options={options} />
    </Box>
  )
}

export default StockCharts
