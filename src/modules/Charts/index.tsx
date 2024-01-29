import { memo } from 'react'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router'
import Helmet from 'src/components/Helmet'
import SwipeableTabs from 'src/components/SwipeableTabs'
import TechnicalCharts from './TechnicalCharts'
import StockChart from './StockChart'
import SearchBar from './components/SearchBar'

const Charts = (): JSX.Element => {
  const { code } = useParams()

  return (
    <>
      <Helmet>
        <title>Stocks</title>
      </Helmet>
      <SearchBar top={15} left={48} zIndex={10000} />
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
