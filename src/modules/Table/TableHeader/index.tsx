import { Box, Button } from '@mui/material'
import { type SetStateAction } from 'react'
import useModal from 'src/hooks/useModals'
import type { ConfirmModal as ConfirmModalType } from '../Modals/'
import ConfirmModal from '../Modals/ConfirmModal'
import StockModal from '../Modals/StockModal'

interface TableHeaderProps {
  modalStatus: ConfirmModalType
  onSetModalStatus: (state: SetStateAction<ConfirmModalType>) => void
  openConfirmModal: () => void
}

const TableHeader = ({
  modalStatus,
  onSetModalStatus,
  openConfirmModal
}: TableHeaderProps): JSX.Element => {
  const onStockModal = useModal()

  const addData = (): void => {
    onStockModal.toggle()
  }

  return (
    <Box p={4} display='flex' alignItems='center' gap={2} justifyContent='flex-end'>
      <Button variant='contained' onClick={openConfirmModal}>
        Created Payment
      </Button>
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

export default TableHeader
