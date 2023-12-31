import { Box, Button } from '@mui/material'
import { type SetStateAction } from 'react'
import useModal from 'src/hooks/useModals'
import type { ConfirmModal as ConfirmModalType } from '../Modals'
import ConfirmModal from '../Modals/ConfirmModal'
import StockModal from '../Modals/StockModal'

interface StockHeaderProps {
  modalStatus: ConfirmModalType
  onSetModalStatus: (state: SetStateAction<ConfirmModalType>) => void
  openConfirmModal: () => void
}

const StockHeader = ({
  modalStatus,
  onSetModalStatus,
  openConfirmModal
}: StockHeaderProps): JSX.Element => {
  const onStockModal = useModal()

  const addData = (): void => {
    onStockModal.toggle()
  }

  return (
    <Box p={4} display='flex' alignItems='center' gap={2} justifyContent='flex-end'>
      <Button variant='contained' onClick={openConfirmModal}>
        Created
      </Button>
      <ConfirmModal
        modalStatus={modalStatus}
        onSetModalStatus={onSetModalStatus}
        toggle={onStockModal.toggle}
      />
      <StockModal
        open={onStockModal.open}
        handleClose={onStockModal.toggle}
        addData={addData}
        status={modalStatus.isBuy}
      />
    </Box>
  )
}

export default StockHeader
