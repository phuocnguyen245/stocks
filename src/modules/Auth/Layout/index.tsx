import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useEffect, type ReactNode } from 'react'
import { Outlet } from 'react-router'
import { useAppSelector } from 'src/store'

const AuthLayout = (): JSX.Element => {
  const { isMdWindow } = useAppSelector((state) => state.Stocks)
  return (
    <Grid container position='relative' height='calc(100vh)' overflow='hidden'>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          pl: '-16px',
          width: isMdWindow ? '0' : '100%',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]
        }}
      >
        <img
          src='https://source.unsplash.com/random?wallpapers'
          // eslint-disable-next-line react/no-unknown-property
          fetchPriority='high'
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
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
