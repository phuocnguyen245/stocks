import { Box, useTheme } from '@mui/material'
import type Highcharts from 'highcharts'
import { memo, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Chart } from 'src/components'
import { type Stock } from 'src/models'

interface IChartData {
  name: string
  y: number
}
type SectorsMap = Record<string, IChartData[]>

const SectorChart = ({ data }: { data: Stock[] }): JSX.Element => {
  const intl = useIntl()
  const theme = useTheme()
  const [chartData, setChartData] = useState<IChartData[]>([])

  useEffect(() => {
    const getSectorsData = (data: Stock[]): IChartData[] => {
      const sectors: SectorsMap = {}
      let totalAssets = 0
      data.forEach((currentStocks) => {
        const sector = currentStocks.sector
        const value = (currentStocks.averagePrice ?? 0) * currentStocks.volume
        if (!sectors[sector]) {
          sectors[sector] = []
        }
        sectors[sector].push({ name: sector, y: value })
        totalAssets += value
      })
      const sectorData: IChartData[] = []

      Object.values(sectors).forEach((sector, index) => {
        sectorData.push({
          name: intl.formatMessage({ id: `label.${Object.keys(sectors)[index]}` }),
          y: sector.reduce((sum, sector) => sum + sector.y, 0)
        })
      })
      return sectorData
    }
    const sectorData = getSectorsData(data)
    setChartData(data.length > 0 ? sectorData : [{ name: 'Cash', y: 100 }])
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
        data: chartData,
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
          fill: theme.palette.mode === 'dark' ? theme.palette.grey[500] : '#f9f3fe'
        }
      }}
    >
      <Chart options={options} />
    </Box>
  )
}

export default memo(SectorChart)
