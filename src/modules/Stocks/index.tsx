import { Box } from '@mui/material'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import { useState } from 'react'
import CurrentStocks from './CurrentStocks'
import type { ConfirmModal as ConfirmModalType } from './Modals/index'
import StockFooter from './StockFooter'
import StockHeader from './StockHeader'
import StocksDetail from './StocksDetail'

const Stocks = (): JSX.Element => {
  const [modalStatus, setModalStatus] = useState<ConfirmModalType>({
    isBuy: 1,
    open: false
  })

  const openConfirmModal = (): void => setModalStatus({ ...modalStatus, open: true })

  return (
    <TableContainer component={Paper}>
      <Box height='calc(100vh - 32px)' paddingX={2} mt={4}>
        <StockHeader
          openConfirmModal={openConfirmModal}
          modalStatus={modalStatus}
          onSetModalStatus={setModalStatus}
        />
        <Box display='flex' gap={2}>
          <Box flex={1}>
            <StocksDetail />
          </Box>
          <Box flex={1} flexShrink='unset'>
            <CurrentStocks />
          </Box>
        </Box>
        <StockFooter />
      </Box>
    </TableContainer>
  )
}
export default Stocks
