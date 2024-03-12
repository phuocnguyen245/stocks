import { Box, useTheme } from '@mui/material'
import { memo, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { type Stock } from 'src/models'
import { Chart } from 'src/components'
import { convertToDecimal } from 'src/utils'
import type Highcharts from 'highcharts'

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
      Object.values(sectors).forEach((sector) => {
        sectorData.push(
          ...sector.map((stock) => ({
            name: intl.formatMessage({ id: `label.${stock.name}` }),
            y: convertToDecimal((stock.y / totalAssets) * 100)
          }))
        )
      })
      return sectorData
    }
    const sectorData = getSectorsData(data)
    setChartData(data.length > 0 ? sectorData : [{ name: 'Cash', y: 100 }])
  }, [data])

  const options: Highcharts.Options = {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Sectors',
      style: {
        fontSize: '20px'
      }
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
  }

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
