import { Box, Button, Container, Dialog, Typography } from '@mui/material'
import { memo, useState } from 'react'
import type { ConfirmModal as ConfirmModalType } from '..'
import { FormattedMessage } from 'react-intl'
import { Target } from 'src/Models'

interface ConfirmModalProps {
  modalStatus: ConfirmModalType
  onSetModalStatus: (value: ConfirmModalType) => void
  toggle: () => void
}

const ConfirmModal = ({
  modalStatus,
  toggle,
  onSetModalStatus
}: ConfirmModalProps): JSX.Element => {
  const onOpenSellingModal = (): void => {
    toggle()
    onSetModalStatus({ open: false, isBuy: 0 })
  }

  const onOpenBuyModal = (): void => {
    toggle()
    onSetModalStatus({ open: false, isBuy: 1 })
  }
  const onClose = (): void => {
    onSetModalStatus({ open: false, isBuy: 0 })
  }

  return (
    <Dialog open={modalStatus.open} onClose={onClose}>
      <Container maxWidth='lg'>
        <Box padding={4}>
          <Typography variant='h5'>
            <FormattedMessage id='text.which.status.do.you.want.to.create' />
          </Typography>
          <Box display='flex' justifyContent='center' alignItems='center' gap={3} mt={2}>
            <Button
              variant='contained'
              color='secondary'
              sx={{ color: 'text.primary' }}
              onClick={onOpenBuyModal}
            >
              <FormattedMessage id='label.buying' />
            </Button>
            <Button variant='contained' onClick={onOpenSellingModal}>
              <FormattedMessage id='label.selling' />
            </Button>
          </Box>
        </Box>
      </Container>
    </Dialog>
  )
}

export default memo(ConfirmModal)
