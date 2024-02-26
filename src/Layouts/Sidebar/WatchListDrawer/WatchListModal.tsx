import { Add } from '@mui/icons-material'
import { Box, Button, Dialog, Divider, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useUpdateWatchListMutation } from 'src/services/stocks.services'

interface WatchListModalProps {
  open: boolean
  toggle: () => void
}
const WatchListModal = ({ open, toggle }: WatchListModalProps): JSX.Element => {
  const [name, setName] = useState('')
  const [onUpdateWatchList] = useUpdateWatchListMutation()

  const onAdd = async (): Promise<void> => {
    if (name) {
      await onUpdateWatchList({ name }).unwrap()
    }
  }

  return (
    <Dialog open={open} onClose={toggle} fullWidth>
      <Box py={1} sx={{ boxSizing: 'border-box' }}>
        <Box py={1} px={2}>
          <Typography mb={1}>WatchList Name</Typography>
          <TextField
            label='Name'
            fullWidth
            size='small'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={!name}
            helperText={'Name is required'}
          />
          <Box width='100%' textAlign='right'>
            <Button sx={{ mt: 1 }} variant='contained' onClick={onAdd}>
              <Add /> &nbsp; Create
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}

export default WatchListModal
