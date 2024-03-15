import { Delete } from '@mui/icons-material'
import { Box, Button, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material'
import { type ReactNode, useEffect, useState, type ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { useModals } from 'src/hooks'
interface ConfirmPopupProps {
  row?: unknown
  title?: ReactNode
  icon?: ReactNode
  isLoading?: boolean
  isSuccess?: boolean
  children?: ReactElement
  onConfirm: (row?: unknown) => void
}
const ConfirmPopup = ({
  row,
  title = 'Are you sure want to delete?',
  icon = <Delete fontSize='small' />,
  children,
  isLoading = false,
  isSuccess = false,
  onConfirm
}: ConfirmPopupProps): JSX.Element => {
  const { open: popoverOpen, toggle, hide } = useModals()
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)

  const handleConfirm = (): void => {
    onConfirm(row)
  }

  useEffect(() => {
    setIsLoadingDelete(isLoading)
  }, [isLoading])

  useEffect(() => {
    if (isSuccess) {
      hide()
    }
  }, [isSuccess])

  return (
    <Tooltip
      open={popoverOpen}
      title={
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography fontWeight={600} sx={{ marginTop: '4px', width: '100%' }}>
            {title}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: '12px',
              padding: '12px 0 8px',
              justifyContent: 'flex-end'
            }}
          >
            <Button variant='outlined' onClick={toggle} sx={{ color: '#fff', borderColor: '#fff' }}>
              <FormattedMessage id='label.no' />
            </Button>
            <Button onClick={handleConfirm} variant='contained'>
              <Box display='flex' alignItems='center' gap={1} flexWrap='nowrap'>
                {isLoadingDelete && (
                  <CircularProgress
                    color='primary'
                    sx={{ height: '28px !important', width: '28px !important' }}
                  />
                )}
                <Typography>
                  <FormattedMessage id='label.yes' />
                </Typography>
              </Box>
            </Button>
          </Box>
        </Box>
      }
      arrow
      disableFocusListener
      disableHoverListener
      disableTouchListener
      PopperProps={{
        disablePortal: true,
        sx: {
          position: 'fixed !important',
          '& .MuiTooltip-tooltip': {
            padding: '0 !important'
          }
        }
      }}
    >
      {children ? (
        <Box onClick={toggle} sx={{ p: 0, m: 0 }}>
          {children}
        </Box>
      ) : (
        <IconButton color='error' onClick={toggle}>
          {icon}
        </IconButton>
      )}
    </Tooltip>
  )
}

export default ConfirmPopup
