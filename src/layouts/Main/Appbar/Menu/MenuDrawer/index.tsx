/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Search,
  ShowChart
} from '@mui/icons-material'
import { Box, Divider, Drawer, Grid, Typography, styled } from '@mui/material'
import { Fragment, useCallback, useMemo, useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import { useLocation, useNavigate } from 'react-router'
import { ConfirmPopup } from 'src/components'
import useClickOutside from 'src/hooks/useClickOutside'
import { menuWidth } from 'src/layouts'
import { useAppSelector } from 'src/store'

interface MenuDrawerProps {
  open: boolean
  openAsset: boolean
  openSearch: boolean
  openWatchList: boolean
  toggle: () => void
  onHideMenu: () => void
  onHideAsset: () => void
  onHideSearch: () => void
  onToggleAsset: () => void
  onToggleSearch: () => void
  onOpenWatchList: () => void
}

const MenuDrawer = ({
  open,
  openAsset,
  openSearch,
  openWatchList,
  toggle,
  onHideMenu,
  onHideAsset,
  onHideSearch,
  onToggleAsset,
  onToggleSearch,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routes: any = useMemo(
    () => [
      isMdWindow && {
        icons: (color: never) => <Search sx={{ color, width: 28, height: 28 }} />,
        name: 'label.search'
      },
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
    ],
    [isMdWindow]
  )

  const onOpen = (url?: string, name?: string): void => {
    if (url) {
      navigate(url)
    }
    if (name === 'title.watchlist') {
      onOpenWatchList()
      onHideAsset()
      onHideSearch()
    } else if (name === 'title.asset') {
      onToggleAsset()
      onHideSearch()
      if (openWatchList) {
        onOpenWatchList()
      }
    } else if (name === 'label.search') {
      onToggleSearch()
      if (openAsset) {
        onHideAsset()
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

  const renderMenuIcon = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any, isRoute: boolean, isAssetNotRouter: boolean) => {
      if (routes?.length && item?.icons) {
        return item?.url
          ? item?.icons(isRoute ? ('grey.100' as never) : ('primary.main' as never))
          : item?.icons(isAssetNotRouter ? ('primary.main' as never) : ('grey.100' as never))
      }
    },
    [routes, isMdWindow]
  )

  return (
    <Drawer
      variant='persistent'
      anchor='left'
      open={isLogin ? (isMdWindow ? open : true) : false}
      onClose={toggle}
      ref={drawerRef}
      sx={{
        transition: 'all 0.25s ease',
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
        <Box sx={{ height: '100%', overflowY: 'auto', scrollBehavior: 'smooth' }}>
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
              {routes.filter(Boolean).map((item: any) => {
                const isRoute = item?.url && location.pathname.split('/').includes(item.key)
                const isWatchList = item?.name === 'title.watchlist' && openWatchList
                const isAsset = item?.name === 'title.asset' && openAsset
                let styles = {}
                if (isRoute) {
                  styles = { bgcolor: 'primary.main', color: 'grey.100' }
                } else if ((isWatchList && openWatchList) || (isAsset && openAsset)) {
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
                        transition: 'all 0.25s ease-in-out',
                        width: '100%',
                        ...styles
                      }}
                      onClick={() => onOpen(item.url, item?.name)}
                    >
                      {renderMenuIcon(item, Boolean(isRoute), !isAsset && !isWatchList)}
                      {open && (
                        <Typography variant='h6' fontWeight={600} whiteSpace='nowrap'>
                          <FormattedMessage id={item.name ?? ''} />
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
              <ConfirmPopup
                onConfirm={onLogout}
                title={<FormattedMessage id='text.are.you.sure.want.to.logout' />}
              >
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
                >
                  {open && <Typography fontWeight={600}>Logout</Typography>}
                  <Logout />
                </Box>
              </ConfirmPopup>
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
