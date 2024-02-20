import { Box, Button, Container } from '@mui/material'
import { type SetStateAction } from 'react'
import useModal from 'src/hooks/useModals'
import type { ConfirmModal as ConfirmModalType } from '../../Modals'
import ConfirmModal from '../../Modals/ConfirmModal'
import StockModal from '../../Modals/StockModal'
import { FormattedMessage } from 'react-intl'
import { useAppSelector } from 'src/store'

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
  const { isMdWindow } = useAppSelector((state) => state.Stocks)
  const onStockModal = useModal()

  const addData = (): void => {
    onStockModal.toggle()
  }

  const children = (
    <>
      <Button variant='contained' onClick={openConfirmModal}>
        <FormattedMessage id='label.create' />
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
    </>
  )

  return (
    <>
      {isMdWindow ? (
        <Container sx={{ width: '100%', textAlign: 'right', py: 1 }}>{children}</Container>
      ) : (
        <Box sx={{ width: '100%', textAlign: 'right', py: 2, px: 2 }}>{children}</Box>
      )}
    </>
  )
}

export default StockHeader
