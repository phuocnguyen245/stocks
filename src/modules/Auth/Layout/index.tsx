import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { type ReactNode } from 'react'
import { Outlet } from 'react-router'

const AuthLayout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <Grid container position='relative'>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        display={'flex'}
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        width='100%'
        height='100%'
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Outlet />
        </Box>
      </Grid>
    </Grid>
  )
}

export default AuthLayout
