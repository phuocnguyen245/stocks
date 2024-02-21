import { FormattedMessage } from 'react-intl'
import SwipeableTabs from 'src/components/SwipeableTabs'
import FilterStocks from './FilterStocks'
import HoldingStocks from './HoldingStocks'

const Stocks = (): JSX.Element => {
  return (
    <SwipeableTabs
      exceptionRoute='/stocks'
      components={[
        {
          title: <FormattedMessage id='title.holding.stocks' />,
          link: {
            url: '/stocks'
          },
          component: <HoldingStocks />
        },
        {
          title: <FormattedMessage id='title.filter.stocks' />,
          link: {
            url: '/stocks/filters'
          },
          component: <FilterStocks />
        }
      ]}
    />
  )
}
export default Stocks
