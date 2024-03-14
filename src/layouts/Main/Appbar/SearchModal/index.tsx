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
          '& .MuiPaper-root': {
            width: '90%',
            m: '0',
            top: '10vh',
            '&. .MuiInputBase-root': {
              height: '40px'
            }
          }
        }
      }}
    >
      <Box px={4.5} py={2} position='relative'>
        <SearchBar />
        <Box position='absolute' top={0} right={0}>
          <IconButton onClick={toggle}>
            <Close />
          </IconButton>
        </Box>
      </Box>
    </Dialog>
  )
}

export default SearchModal
