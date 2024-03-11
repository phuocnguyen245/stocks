import { Box, Container } from '@mui/material'
import Status404Img from 'src/asset/imgs/status404.svg'
import Helmet from 'src/components/Helmet'

const Status404 = (): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>Status - 404</title>
      </Helmet>
      <Box
        sx={{
          overflow: 'hidden',
          display: 'flex',
          width: '100vw',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        mt={8}
      >
        <Box textAlign='center' width='600px' height='600px'>
          <img
            alt='404'
            src={Status404Img}
            style={{
              width: '100%',
              maxWidth: '100%',
              height: '100%',
              maxHeight: '100%'
            }}
          />
        </Box>
      </Box>
    </>
  )
}

export default Status404
