import { Close } from '@mui/icons-material'
import { Box, Dialog, IconButton } from '@mui/material'
import React from 'react'
import { SearchBar } from 'src/components'

interface SearchModalProps {
  open: boolean
  toggle: () => void
}

const SearchModal = ({ open, toggle }: SearchModalProps): JSX.Element => {
  return (
    <Dialog
      open={open}
      onClose={toggle}
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-start',
          mt: 10,
          '& .MuiPaper-root': {
            width: '90%',
            mx: '0',
            '&. .MuiInputBase-root': {
              height: '40px'
            }
          }
        }
      }}
    >
      <Box px={6} py={3.25} position='relative'>
        <SearchBar />
        <Box position='absolute' top={3} right={3}>
          <IconButton onClick={toggle}>
            <Close />
          </IconButton>
        </Box>
      </Box>
    </Dialog>
  )
}

export default SearchModal
