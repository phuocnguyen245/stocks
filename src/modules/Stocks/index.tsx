import SwipeableTabs from 'src/components/SwipeableTabs'
import HoldingStocks from './HoldingStocks'
import FilterStocks from './FilterStocks'
import { Box, Paper } from '@mui/material'
import { FormattedMessage } from 'react-intl'

const Stocks = (): JSX.Element => {
  return (
    <Box component={Paper} sx={{ borderRadius: 0 }}>
      <SwipeableTabs
        components={[
          { title: <FormattedMessage id='title.holding.stocks' />, component: <HoldingStocks /> },
          { title: <FormattedMessage id='title.filter.stocks' />, component: <FilterStocks /> }
        ]}
      />
    </Box>
  )
}
export default Stocks
