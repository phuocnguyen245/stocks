import {
  AttachMoney,
  CandlestickChart,
  Checklist,
  ChevronLeft,
  ChevronRight,
  FilterAlt,
  Logout,
  Menu,
  Payment,
  ShowChart
} from '@mui/icons-material'
import { Box, Divider, Drawer, Grid, Typography, styled, useTheme } from '@mui/material'
import { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { useLocation, useNavigate } from 'react-router'
import { menuWidth } from '..'
import { useSelector } from 'react-redux'
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

const MenuDrawer = ({ open, toggle, onOpenWatchList }: MenuDrawerProps): JSX.Element => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { isMdWindow } = useAppSelector((state) => state.Stocks)

  const location = useLocation()

  const onOpen = (url?: string): void => {
    if (url) {
      return navigate(url)
    } else {
      onOpenWatchList()
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
      open={isMdWindow ? open : true}
      onClose={toggle}
      sx={{
        '& .MuiPaper-root': {
          transition: 'all 0.2s ease-in-out',
          width: open ? menuWidth : 60,
          height: 'calc(100vh)'
        }
      }}
    >
      <Box boxShadow={3} width='100%' height='100%' overflow='hidden'>
        <Box height='max-content'>
          <DrawerHeader
            onClick={toggle}
            sx={{ cursor: 'pointer', justifyContent: open ? 'space-between' : 'center' }}
          >
            {open && (
              <Typography pl={2} fontWeight={600} whiteSpace='nowrap'>
                Stock Tracking
              </Typography>
            )}
            {open ? theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight /> : <Menu />}
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
                        gap: open ? 1 : 0,
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
                      {open && (
                        <Typography variant='h6' fontWeight={600} whiteSpace='nowrap'>
                          <FormattedMessage id={item.name} />
                        </Typography>
                      )}
                    </Grid>
                    <Divider />
                  </Fragment>
                )
              })}
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
                {open && <Typography fontWeight={600}>Logout</Typography>}
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
