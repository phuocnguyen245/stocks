import { Box } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import SwipeableTabs from 'src/components/SwipeableTabs'
import HoldingStocks from './HoldingStocks'
import FilterStocks from './FilterStocks'

const Stocks = (): JSX.Element => {
  return (
    <SwipeableTabs
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
