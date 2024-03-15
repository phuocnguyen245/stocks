import { Box, Button, TextField } from '@mui/material'
import QRCode from 'react-qr-code'

const Authenticator = (): JSX.Element => {
  return (
    <Box display='block'>
      <Box mb={2}>
        <TextField label='Username' required fullWidth sx={{ mb: 1 }} />
        <Box width='100%' textAlign='right'>
          <Button variant='contained'>Get QR</Button>
        </Box>
      </Box>
      <QRCode value='hey' />
    </Box>
  )
}

export default Authenticator
