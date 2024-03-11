import { memo } from 'react'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router'
import Tabs from 'src/components/Tabs'
import StockChart from './StockChart'
import TechnicalCharts from './TechnicalCharts'

const Charts = (): JSX.Element => {
  const { code } = useParams()

  return (
    <>
      <Tabs
        components={[
          { title: <FormattedMessage id='title.stock.chart' />, component: <StockChart /> },
          {
            title: <FormattedMessage id='title.technical.chart' />,
            component: <TechnicalCharts code={code ?? 'vnindex'} />
          }
        ]}
      />
    </>
  )
}

export default memo(Charts)
