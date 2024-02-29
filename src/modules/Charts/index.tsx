import { memo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useParams } from 'react-router'
import Helmet from 'src/components/Helmet'
import SwipeableTabs from 'src/components/SwipeableTabs'
import StockChart from './StockChart'
import TechnicalCharts from './TechnicalCharts'

const Charts = (): JSX.Element => {
  const { code } = useParams()

  return (
    <>
      <SwipeableTabs
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
