import {
  AttachMoney,
  CandlestickChart,
  Checklist,
  ChevronLeft,
  FilterAlt,
  History,
  Logout,
  Menu,
  Payment,
  ShowChart
} from '@mui/icons-material'
import { Box, Divider, Drawer, Grid, Typography, styled } from '@mui/material'
import { Fragment, useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import { useLocation, useNavigate } from 'react-router'
import useClickOutside from 'src/hooks/useClickOutside'
import { useAppSelector } from 'src/store'
import { menuWidth } from '../../../..'

interface MenuDrawerProps {
  open: boolean
  openAsset: boolean
  openWatchList: boolean
  toggle: () => void
  onHideMenu: () => void
  onHideAsset: () => void
  onToggleAsset: () => void
  onOpenWatchList: () => void
}

const routes = [
  {
    icons: (color: never) => <ShowChart sx={{ color, width: 28, height: 28 }} />,
    name: 'title.stocks',
    url: '/stocks',
    key: 'stocks'
  },
  {
    icons: (color: never) => <History sx={{ color, width: 28, height: 28 }} />,
    name: 'title.history.stocks',
    url: '/history',
    key: 'history'
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
  openAsset,
  openWatchList,
  toggle,
  onHideMenu,
  onToggleAsset,
  onHideAsset,
  onOpenWatchList
}: MenuDrawerProps): JSX.Element => {
  const navigate = useNavigate()
  const drawerRef = useRef<HTMLDivElement>(null)

  const { isMdWindow, isLogin } = useAppSelector((state) => state.Stocks)

  const location = useLocation()

  useClickOutside(drawerRef, () => {
    if (isMdWindow) {
      onHideMenu()
    }
  })

  const onOpen = (url?: string, name?: string): void => {
    if (url) {
      navigate(url)
    }
    if (name) {
      if (name === 'title.watchlist') {
        onOpenWatchList()
        if (openAsset) {
          onHideAsset()
        }
      } else if (name === 'title.asset') {
        onToggleAsset()
        if (openWatchList) {
          onOpenWatchList()
        }
      }
    }
    isMdWindow && toggle()
  }

  const onLogout = (): void => {
    navigate('/login')
    localStorage.removeItem('user')
    localStorage.removeItem('tokens')
    onHideMenu()
  }

  return (
    <Drawer
      variant='persistent'
      anchor='left'
      open={isLogin ? (isMdWindow ? open : true) : false}
      onClose={toggle}
      ref={drawerRef}
      sx={{
        '& .MuiPaper-root': {
          transition: 'all 0.25s ease',
          width: open ? menuWidth : 60
        }
      }}
    >
      <Box boxShadow={3} width='100%' height='100%' overflow='hidden'>
        <DrawerHeader
          onClick={toggle}
          sx={{ cursor: 'pointer', justifyContent: open ? 'space-between' : 'center' }}
        >
          {open && (
            <Typography pl={2} fontWeight={600} whiteSpace='nowrap'>
              Stock Tracking
            </Typography>
          )}
          {open ? <ChevronLeft /> : <Menu />}
        </DrawerHeader>
        <Divider />
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
                const isRoute = item?.url && location.pathname.split('/').includes(item.key)
                const isWatchList = item?.name === 'title.watchlist'
                const isAsset = item?.name === 'title.asset'
                let styles = {}
                if (isRoute) {
                  styles = { bgcolor: 'primary.main', color: 'grey.100' }
                } else if (isWatchList && openWatchList) {
                  styles = { bgcolor: 'primary.main', color: 'grey.100' }
                } else if (isAsset && openAsset) {
                  styles = { bgcolor: 'primary.main', color: 'grey.100' }
                }
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
                        transition: 'all .15s ease-in-out',
                        ...styles
                      }}
                      onClick={() => onOpen(item.url, item.name)}
                    >
                      {item?.url &&
                        !isWatchList &&
                        item.icons(isRoute ? ('grey.100' as never) : ('primary.main' as never))}
                      {!item?.url &&
                        isWatchList &&
                        item.icons(
                          openWatchList ? ('grey.100' as never) : ('primary.main' as never)
                        )}
                      {!item?.url &&
                        isAsset &&
                        item.icons(openAsset ? ('grey.100' as never) : ('primary.main' as never))}
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
