import type HighCharts from 'highcharts'
import { useMemo } from 'react'
import Charts from 'src/components/Chart'
import type { Asset, ResponsePagination, ResponseType, Stock } from 'src/Models'

interface ChartProps {
  currentData?: ResponseType<ResponsePagination<Stock[]>>
  asset?: Asset
}

const Chart = ({ data }: { data: ChartProps }): JSX.Element => {
  const chartData = useMemo(() => {
    if (data?.currentData?.data && data?.asset) {
      const arr = data?.currentData?.data?.data?.map((item) => ({
        name: item.code,
        y: ((item.volume * (item?.averagePrice ?? 0)) / (data?.asset?.investedValue ?? 1)) * 100000
      }))
      arr?.push({
        name: 'Available',
        y: (data.asset.available / data?.asset?.investedValue) * 100
      })
      return arr?.sort((a, b) => a.y - b.y)
    }
    return []
  }, [data])

  const options = {
    title: '',
    chart: {
      type: 'pie',
      title: ''
    },
    series: [
      {
        type: 'pie',
        name: 'Percentage',
        data: chartData
      }
    ]
  }
  return <Charts options={options as HighCharts.Options} />
}

export default Chart
