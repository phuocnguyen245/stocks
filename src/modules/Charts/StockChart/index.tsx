import { Box } from '@mui/material'
import Highcharts from 'highcharts/highstock'
import Indicators from 'highcharts/indicators/indicators-all.js'
import AnnotationsAdvanced from 'highcharts/modules/annotations-advanced.js'
import DragPanes from 'highcharts/modules/drag-panes.js'
import FullScreen from 'highcharts/modules/full-screen.js'
import PriceIndicator from 'highcharts/modules/price-indicator.js'
import StockTools from 'highcharts/modules/stock-tools.js'
import { memo, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetStockStatisticQuery } from 'src/services/stocks.services'
import { useAppSelector } from 'src/store'
import ChartComponent from 'src/modules/Charts/components/ChartComponent'
import { menuWidth } from 'src/layouts/'
import Helmet from 'src/components/Helmet'

Indicators(Highcharts)
DragPanes(Highcharts)
AnnotationsAdvanced(Highcharts)
PriceIndicator(Highcharts)
FullScreen(Highcharts)
StockTools(Highcharts)

const StockChart = (): JSX.Element => {
  const { code } = useParams()
  const mode = localStorage.getItem('mode')

  const { isOpenSidebar, isMdWindow } = useAppSelector((state) => state.Stocks)

  const { data: stockStatistic } = useGetStockStatisticQuery({ code }, { skip: !code })

  const [data, setData] = useState<[number[]]>([[]])
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (stockStatistic?.data?.data?.length) {
      setData(stockStatistic.data.data)
    }
  }, [stockStatistic])

  useEffect(() => {
    const onResize = (): void => {
      const width = window.innerWidth
      const height = window.innerHeight - 112
      if (width && height) {
        setWindowSize({ width, height })
      }
    }
    onResize()
    window.addEventListener('resize', onResize)

    return (): void => {
      window.removeEventListener('resize', onResize)
    }
  }, [isOpenSidebar])

  const volume = useMemo(
    () =>
      data?.map((item) => ({
        x: item[0],
        y: item[5],
        color: item[1] > item[4] ? '#e41717' : '#39d424'
      })),
    [data]
  )

  const options: Highcharts.Options = {
    title: {
      text: `${code?.toUpperCase()}`,
      align: 'center'
    },
    yAxis: [
      {
        labels: {
          align: 'left'
        },
        height: '80%',
        resize: {
          enabled: true
        }
      },
      {
        labels: {
          align: 'left'
        },
        top: '80%',
        height: '20%',
        offset: 0
      }
    ],
    tooltip: {
      shape: 'callout',
      headerShape: 'callout',
      borderWidth: 0,
      shadow: false,

      positioner: function (width, height, point) {
        let position

        if (point.isHeader) {
          position = {
            x: Math.max(60),
            y: point.plotY
          }
        } else {
          position = {
            x: 60,
            y: 0
          }
        }

        return position
      }
    },
    series: [
      {
        name: code,
        id: code,
        type: 'candlestick',
        color: '#FF6F6F',
        upColor: '#50e51a',
        data
      },
      {
        type: 'column',
        id: `${code}-volume`,
        name: `${code} Volume`,
        data: volume,
        yAxis: 1
      },
      {
        type: 'sma',
        linkedTo: code,
        zIndex: 1,
        index: 20,
        params: {
          period: 20
        }
      },
      {
        type: 'sma',
        linkedTo: code,
        zIndex: 1,
        index: 20,
        params: {
          period: 50
        }
      },
      {
        type: 'sma',
        linkedTo: code,
        zIndex: 1,
        index: 20,
        params: {
          period: 100
        }
      },
      {
        type: 'sma',
        linkedTo: code,
        zIndex: 1,
        index: 20,
        params: {
          period: 150
        }
      },
      {
        type: 'sma',
        linkedTo: code,
        zIndex: 1,
        index: 20,
        params: {
          period: 200
        }
      },
      {
        type: 'ema',
        linkedTo: code,
        zIndex: 1,
        index: 20,
        params: {
          period: 4
        }
      },
      {
        type: 'ema',
        linkedTo: code,
        zIndex: 1,
        index: 20,
        params: {
          period: 9
        }
      },
      {
        type: 'ema',
        linkedTo: code,
        zIndex: 1,
        index: 20,
        params: {
          period: 18
        }
      },
      {
        type: 'bb',
        linkedTo: code,
        zIndex: 1,
        index: 20
      }
    ],

    chart: {
      width: windowSize.width - (!isMdWindow ? (isOpenSidebar ? menuWidth : 60) : 0),
      height: windowSize.height
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false
            }
          }
        }
      }
    },
    credits: {
      enabled: false
    }
  }

  return (
    <Box p={0} height='calc(100vh - 108px)' bgcolor={mode === 'dark' ? '#000' : '#fff'}>
      <Helmet title='title.charts' />
      <ChartComponent highcharts={Highcharts} options={options} />
    </Box>
  )
}

export default memo(StockChart)
