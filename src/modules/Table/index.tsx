import { Box } from '@mui/material'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import { useState } from 'react'
import type { ConfirmModal as ConfirmModalType } from './Modals/index'
import TableCurrent from './CurrentStocks'
import TableDetail from './StocksDetail'
import TableFooter from './TableFooter'
import TableHeader from './StockHeader'

const BasicTable = (): JSX.Element => {
  const [modalStatus, setModalStatus] = useState<ConfirmModalType>({
    isBuy: 1,
    open: false
  })

  const openConfirmModal = (): void => setModalStatus({ ...modalStatus, open: true })

  return (
    <TableContainer component={Paper}>
      <Box height='100vh' paddingX={2}>
        <TableHeader
          openConfirmModal={openConfirmModal}
          modalStatus={modalStatus}
          onSetModalStatus={setModalStatus}
        />
        <Box display='flex' gap={2}>
          <Box flex={1}>
            <TableDetail />
          </Box>
          <Box flex={1} flexShrink='unset'>
            <TableCurrent />
          </Box>
        </Box>
        <TableFooter />
      </Box>
    </TableContainer>
  )
}
export default BasicTable
