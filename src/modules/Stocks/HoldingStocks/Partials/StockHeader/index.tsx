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
  const { toggle, hide, show, open } = useModal()

  const addData = (): void => {
    show()
  }

  const children = (
    <>
      <Button variant='contained' onClick={openConfirmModal}>
        <FormattedMessage id='label.create' />
      </Button>
      <ConfirmModal modalStatus={modalStatus} onSetModalStatus={onSetModalStatus} toggle={toggle} />
      <StockModal open={open} handleClose={hide} addData={addData} status={modalStatus.isBuy} />
    </>
  )

  return (
    <>
      {isMdWindow ? (
        <Container sx={{ width: '100%', textAlign: 'right', py: 1, px: 0 }}>{children}</Container>
      ) : (
        <Box sx={{ width: '100%', textAlign: 'right', py: 2 }}>{children}</Box>
      )}
    </>
  )
}

export default StockHeader
