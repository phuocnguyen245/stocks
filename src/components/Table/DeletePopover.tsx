import { Delete } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  Grid,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useModals } from 'src/hooks'
interface DeletePopoverProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any
  isLoading: boolean
  onDelete: (row: unknown) => void
}
const DeletePopover = ({ row, isLoading, onDelete }: DeletePopoverProps): JSX.Element => {
  const { open: popoverOpen, toggle, hide } = useModals()
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)

  const handleDelete = (): void => {
    onDelete(row)
  }

  useEffect(() => {
    console.log(isLoading, popoverOpen, isLoading && popoverOpen)
    isLoading && popoverOpen ? setIsLoadingDelete(true) : setIsLoadingDelete(false)
  }, [isLoading, popoverOpen])

  return (
    <Tooltip
      className='123123'
      open={popoverOpen}
      title={
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography fontWeight={600} sx={{ marginTop: '4px', width: '100%' }}>
            Are you sure want to delete?
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: '12px',
              padding: '12px 0 8px',
              justifyContent: 'flex-end'
            }}
          >
            <Button variant='outlined' onClick={toggle} sx={{ color: 'text.secondary' }}>
              No
            </Button>
            <Button onClick={handleDelete} variant='contained'>
              <Box display='flex' alignItems='center' gap={1} flexWrap='nowrap'>
                {isLoadingDelete && (
                  <CircularProgress
                    color='info'
                    sx={{ height: '28px !important', width: '28px !important' }}
                  />
                )}
                <Typography>Yes</Typography>
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
      <IconButton color='error' onClick={toggle}>
        <Delete fontSize='small' />
      </IconButton>
    </Tooltip>
  )
}

export default DeletePopover
