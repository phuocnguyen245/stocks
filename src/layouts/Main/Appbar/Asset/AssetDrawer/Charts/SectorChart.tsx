import { Box } from '@mui/material'
import type Highcharts from 'highcharts'
import { memo, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { Chart } from 'src/components'

interface IChartData {
  name: string
  y: number
}

const SectorChart = ({ data }: { data: IChartData[] }): JSX.Element => {
  const intl = useIntl()

  const convertData = useMemo(() => {
    if (data.length > 0) {
      return data.map((item) => ({
        ...item,
        name: intl.formatMessage({ id: `label.${item.name}` })
      }))
    }
  }, [data])

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: 300
    },
    title: {
      text: 'Sectors',
      style: {
        fontSize: '20px'
      },
      align: 'center',
      floating: true
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      followPointer: true
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: 'pie' as any
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
          fill: (t) => (t.palette.mode === 'dark' ? t.palette.grey[500] : '#f9f3fe')
        }
      }}
    >
      <Chart options={options} />
    </Box>
  )
}

export default memo(SectorChart)
