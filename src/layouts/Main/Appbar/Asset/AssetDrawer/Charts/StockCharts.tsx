import { Box } from '@mui/material'
import type Highcharts from 'highcharts'
import { memo, useMemo } from 'react'
import Chart from 'src/components/Chart'

interface IChartData {
  name: string
  y: number
}

const StockCharts = ({ data }: { data: IChartData[] }): JSX.Element => {
  const convertData = useMemo(() => {
    if (data.length > 0) {
      return data.map((item) => ({
        ...item
      }))
    }
  }, [data])

  const options: Highcharts.Options = {
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
        data: convertData,
        type: 'pie' as never
      }
    ],
    credits: {
      enabled: false
    }
  }

  return (
    <Box
      className='asset-chart'
      sx={{
        '.highcharts-background': {
          fill: (t) => (t.palette.mode === 'dark' ? t.palette.grey[500] : '#f9f3fe')
        }
      }}
    >
      <Chart options={options} />
    </Box>
  )
}

export default memo(StockCharts)
