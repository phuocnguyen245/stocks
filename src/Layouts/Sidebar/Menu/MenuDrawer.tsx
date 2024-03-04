import {
  AttachMoney,
  CandlestickChart,
  Checklist,
  ChevronLeft,
  ChevronRight,
  FilterAlt,
  Logout,
  Payment,
  ShowChart
} from '@mui/icons-material'
import { Box, Divider, Drawer, Grid, Theme, Typography, styled, useTheme } from '@mui/material'
import { Fragment, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { useLocation, useNavigate } from 'react-router'
import DarkModeSwitch from 'src/Layouts/Header/components/DarkModeSwitch'
import Languages from 'src/Layouts/Header/components/Languages'
import RefreshTime from 'src/Layouts/Header/components/RefreshTime'
import { useAppSelector } from 'src/store'

interface MenuDrawerProps {
  open: boolean
  toggle: () => void
  darkMode: 'dark' | 'light'
  languages: 'vi' | 'en'
  onOpenWatchList: () => void
  onOpenAsset: () => void
  onSetDarkMode: (value: React.SetStateAction<'dark' | 'light'>) => void
  onSetLanguages: (value: React.SetStateAction<'vi' | 'en'>) => void
}

const routes = [
  {
    icons: (color: never) => <ShowChart sx={{ color, width: 28, height: 28 }} />,
    name: 'title.stocks',
    url: '/stocks',
    key: 'stocks'
  },
  {
    icons: (color: never) => <FilterAlt sx={{ color, width: 28, height: 28 }} />,
    name: 'title.filter.stocks',
    url: '/filters',
    key: 'filters'
  },
  {
    icons: (color: never) => <CandlestickChart sx={{ color, width: 28, height: 28 }} />,
    name: 'title.charts',
    url: '/charts/vnindex',
    key: 'charts'
  },
  {
    icons: (color: never) => <Payment sx={{ color, width: 28, height: 28 }} />,
    name: 'title.payments',
    url: '/payments',
    key: 'payments'
  },
  {
    icons: (color: never) => <Checklist sx={{ color, width: 28, height: 28 }} />,
    name: 'title.watchlist'
  },
  {
    icons: (color: never) => <AttachMoney sx={{ color, width: 28, height: 28 }} />,
    name: 'title.asset'
  }
]

const MenuDrawer = ({
  open,
  darkMode,
  languages,
  toggle,
  onOpenAsset,
  onSetDarkMode,
  onSetLanguages,
  onOpenWatchList
}: MenuDrawerProps): JSX.Element => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { isMdWindow } = useAppSelector((state) => state.Stocks)

  const location = useLocation()

  const onOpen = (url?: string): void => {
    if (url) {
      return navigate(url)
    } else {
      // onOpenWatchList()
      // toggle()
    }
  }

  const onLogout = (): void => {
    navigate('/login')
    localStorage.removeItem('user')
    localStorage.removeItem('tokens')
    toggle()
  }

  return (
    <Drawer
      variant='persistent'
      anchor='left'
      open={open}
      onClose={toggle}
      sx={{
        '& .MuiPaper-root': {
          width: 280,
          height: 'calc(100vh)'
        }
      }}
    >
      <Box boxShadow={3} width='100%' height='100%'>
        <Box height='max-content'>
          <DrawerHeader onClick={toggle} sx={{ cursor: 'pointer' }}>
            <Typography pl={2} fontWeight={600}>
              Stock Tracking
            </Typography>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </DrawerHeader>
          <Divider />
        </Box>
        <Box height='calc(100% - 65px)'>
          <Grid
            container
            sx={{
              py: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}
          >
            <Grid item flex={1}>
              {routes.map((item) => {
                const isRoute = item.url && location.pathname.split('/').includes(item.key)
                return (
                  <Fragment key={item.name}>
                    <Grid
                      item
                      sx={{
                        cursor: 'pointer',
                        gap: 1,
                        display: 'flex',
                        height: 48,
                        alignItems: 'center',
                        px: 2,
                        ...(isRoute && { bgcolor: 'primary.main' }),
                        ...(isRoute && { color: 'grey.100' })
                      }}
                      onClick={() => onOpen(item.url)}
                    >
                      {item.icons(isRoute ? ('grey.100' as never) : ('primary.main' as never))}
                      <Typography variant='h6' fontWeight={600}>
                        <FormattedMessage id={item.name} />
                      </Typography>
                    </Grid>
                    <Divider />
                  </Fragment>
                )
              })}

              {isMdWindow && (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0,
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography>Refreshed Time:</Typography>
                    <RefreshTime />
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%'
                    }}
                  >
                    <DarkModeSwitch darkMode={darkMode} onSetDarkMode={onSetDarkMode} />
                    <Languages languages={languages} onSetLanguages={onSetLanguages} />
                  </Box>
                  <Divider />
                </>
              )}
            </Grid>

            <Grid item>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'grey.100'
                  },
                  height: 48
                }}
                onClick={onLogout}
              >
                <Typography fontWeight={600}>Logout</Typography>
                <Logout />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Drawer>
  )
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between'
}))

export default MenuDrawer
