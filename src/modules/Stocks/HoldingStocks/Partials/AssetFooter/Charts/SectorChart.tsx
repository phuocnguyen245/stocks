import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { type Stock } from 'src/Models'
import Chart from 'src/components/Chart'
import { convertToDecimal } from 'src/utils'
import type Highcharts from 'highcharts'

interface IChartData {
  code: string
  y: number
}
type SectorsMap = Record<string, IChartData[]>

const SectorChart = ({ data }: { data: Stock[] }): JSX.Element => {
  const intl = useIntl()
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
        sectors[sector].push({ code: sector, y: value })
        totalAssets += value
      })
      const sectorData: IChartData[] = []
      Object.values(sectors).forEach((sector) => {
        sectorData.push(
          ...sector.map((stock) => ({
            code: intl.formatMessage({ id: `label.${stock.code}` }),
            y: convertToDecimal(stock.y / totalAssets)
          }))
        )
      })
      return sectorData
    }
    const sectorData = getSectorsData(data)
    setChartData(data.length > 0 ? sectorData : [{ code: 'Cash', y: 100 }])
  }, [data])

  const options: Highcharts.Options = {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Sector percentage',
      align: 'left'
    },
    // tooltip: {
    //   pointFormat: '{series.code}: <b>{point.y:.1f}%</b>'
    // },
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
          format:
            '<b>{point.code}</b><br><span style="fontWeight: 400; fontSize: 14">{point.percentage}%</span>'
        }
      }
    },
    series: [
      {
        // Disable mouse tracking on load, enable after custom animation
        enableMouseTracking: false,
        animation: {
          duration: 1000
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

export default SectorChart
