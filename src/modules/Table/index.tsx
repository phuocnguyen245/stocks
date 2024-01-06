import { Box, Button } from '@mui/material'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import { useState } from 'react'
import type { Stock } from 'src/Models'
import useModal from 'src/hooks/useModals'
import ConfirmModal from './Modals/ConfirmModal'
import StockModal from './Modals/StockModal'
import type { ConfirmModal as ConfirmModalType } from './Modals/index'
import TableCurrent from './TableCurrent'
import TableDetail from './TableDetail'

const BasicTable = (): JSX.Element => {
  const onStockModal = useModal()
  const [modalStatus, setModalStatus] = useState<ConfirmModalType>({
    isBuy: 1,
    open: false
  })

  const openConfirmModal = (): void => setModalStatus({ ...modalStatus, open: true })

  const addData = (row: Stock): void => {
    onStockModal.toggle()
  }

  return (
    <TableContainer component={Paper}>
      <Box height='100vh'>
        <Box textAlign='right' p={4}>
          <Button variant='contained' onClick={openConfirmModal}>
            Created
          </Button>
        </Box>
        <Box display='flex' gap={2}>
          <Box flex={1}>
            <TableDetail />
          </Box>
          <Box flex={1.5} flexShrink='unset'>
            <TableCurrent />
          </Box>
        </Box>
        <ConfirmModal
          modalStatus={modalStatus}
          onSetModalStatus={setModalStatus}
          toggle={onStockModal.toggle}
        />
        <StockModal
          open={onStockModal.open}
          handleClose={onStockModal.toggle}
          addData={addData}
          status={modalStatus.isBuy}
        />
      </Box>
    </TableContainer>
  )
}
export default BasicTable
