import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { type Stock } from 'src/Models'
import Chart from 'src/components/Chart'
import { convertToDecimal } from 'src/utils'

interface IChartData {
  name: string
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

  const options = {
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
      valueSuffix: '%'
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: [
          {
            enabled: true,
            distance: 20
          }
        ]
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

export default SectorChart
