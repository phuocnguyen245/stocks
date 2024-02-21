import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Modal,
  Typography,
  styled
} from '@mui/material'
import ChromeStep1 from '../../../asset/imgs/chromeStep1.png'
import ChromeStep2 from '../../../asset/imgs/chromeStep2.png'
import SafariStep1 from '../../../asset/imgs/safariStep1.png'
import SafariStep2 from '../../../asset/imgs/safariStep2.png'
import { Close } from '@mui/icons-material'

interface ModalsProps {
  open: boolean
  toggle: () => void
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '400px !important',
  minWidth: 350,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
  overflow: 'scroll',
  maxHeight: '80vh',
  pb: 0
}

const AcceptModal = ({ open, toggle }: ModalsProps): JSX.Element => {
  return (
    <Modal
      open={open}
      onClose={toggle}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Container sx={style}>
        <Box position={'absolute'} top={10} right={10}>
          <IconButton onClick={toggle}>
            <Close />
          </IconButton>
        </Box>

        <Typography
          id='modal-modal-title'
          fontSize={20}
          fontWeight={600}
          textAlign='center'
          color='primary.main'
        >
          Confirmation
        </Typography>
        <Typography id='modal-modal-description' sx={{ mt: 0.5 }}>
          Due to some errors in the HTTPS protocol that we have not been able to resolve, we require
          your authentication to proceed. We assure you that we do not collect saved user data,
          passwords, cards, etc.
        </Typography>
        <Typography fontWeight={600}>If you agree, please follow these steps:</Typography>
        <Box>
          <Typography fontWeight={600} color={'primary.500'}>
            - Step 1:
          </Typography>
          <Typography>
            Access the website (We will redirect you to that page in a new tab.)
          </Typography>
          <a href='https://167.172.69.166/api/v1/api-confirmation' target='_blank' rel='noreferrer'>
            <Typography
              sx={{
                transition: 'all 0.5s ease',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              https://167.172.69.166/api/v1/api-confirmation
            </Typography>
          </a>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography fontWeight={600} color={'primary.500'}>
            - Step 2:
          </Typography>
          <Typography color={'primary.400'}> + If you are using Chrome</Typography>
          <Typography>&nbsp;&nbsp;Click on the red boxes.</Typography>
          <Box>
            <Image src={ChromeStep1} alt='Chrome step 1' />
            <Image src={ChromeStep2} alt='Chrome step 2' />
          </Box>
          <Typography color={'primary.400'}> + If you are using Safari</Typography>
          <Typography>&nbsp;&nbsp;Click on the red boxes.</Typography>
          <Box>
            <Image src={SafariStep1} alt='Chrome step 1' />
            <Image src={SafariStep2} alt='Chrome step 2' />
          </Box>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography fontWeight={600} color={'primary.500'}>
            - Step 3:
          </Typography>
          <Typography>
            Close the Confirmation page, Confirmation popup and continue using the stock-tracking
            webapp.
          </Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography fontWeight={600} textAlign='center' color={'primary.main'}>
            Contact email ... if you have any questions regarding confirmation.
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ textAlign: 'right' }}>
          <Button variant='contained' onClick={toggle}>
            Close
          </Button>
        </Box>
      </Container>
    </Modal>
  )
}

const Image = styled('img')({
  width: '100%',
  maxWidth: '100%',
  height: '100%',
  maxHeight: '100%'
})

export default AcceptModal
