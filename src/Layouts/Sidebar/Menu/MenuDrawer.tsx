import {
  AttachMoney,
  CandlestickChart,
  Checklist,
  ChevronLeft,
  ChevronRight,
  Logout,
  Payment,
  ShowChart
} from '@mui/icons-material'
import { Box, Divider, Drawer, Grid, Typography, styled, useTheme } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router'
import DarkModeSwitch from 'src/Layouts/Header/components/DarkModeSwitch'
import Languages from 'src/Layouts/Header/components/Languages'
import RefreshTime from 'src/Layouts/Header/components/RefreshTime'

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

  const onOpen = (): void => {
    // onOpenWatchList()
    // toggle()
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
        <Box height='calc(100% - 66px)'>
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
              <Grid
                item
                sx={{
                  cursor: 'pointer',
                  gap: 1,
                  display: 'flex',
                  height: 64,
                  alignItems: 'center',
                  px: 2
                }}
                onClick={onOpen}
              >
                <ShowChart sx={{ color: 'primary.main', width: 28, height: 28 }} />
                <Typography variant='h6' fontWeight={600}>
                  <FormattedMessage id='title.stocks' />
                </Typography>
              </Grid>
              <Divider />
              <Box
                sx={{
                  cursor: 'pointer',
                  gap: 1,
                  display: 'flex',
                  height: 64,
                  alignItems: 'center',
                  px: 2
                }}
                onClick={onOpen}
              >
                <CandlestickChart sx={{ color: 'primary.main', width: 28, height: 28 }} />
                <Typography variant='h6' fontWeight={600}>
                  <FormattedMessage id='title.charts' />
                </Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  cursor: 'pointer',
                  gap: 1,
                  display: 'flex',
                  height: 64,
                  alignItems: 'center',
                  px: 2
                }}
                onClick={onOpen}
              >
                <Payment sx={{ color: 'primary.main', width: 28, height: 28 }} />
                <Typography variant='h6' fontWeight={600}>
                  <FormattedMessage id='title.payments' />
                </Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  cursor: 'pointer',
                  gap: 1,
                  display: 'flex',
                  height: 64,
                  alignItems: 'center',
                  px: 2
                }}
                onClick={onOpen}
              >
                <Checklist sx={{ color: 'primary.main', width: 28, height: 28 }} />
                <Typography variant='h6' fontWeight={600}>
                  Watch List
                </Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  cursor: 'pointer',
                  gap: 1,
                  display: 'flex',
                  height: 64,
                  alignItems: 'center',
                  px: 2
                }}
                onClick={onOpenAsset}
              >
                <AttachMoney sx={{ color: 'primary.main', width: 28, height: 28 }} />
                <Typography variant='h6' fontWeight={600}>
                  Asset
                </Typography>
              </Box>
              <Divider />
              {/* <Box>
            <SearchBar open={open} />
          </Box> */}
              <Divider />
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography>Refreshed Time:</Typography>
                <RefreshTime />
              </Box>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  gap: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <DarkModeSwitch darkMode={darkMode} onSetDarkMode={onSetDarkMode} />
                <Languages languages={languages} onSetLanguages={onSetLanguages} />
              </Box>
              <Divider />
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
                  '&:hover': {
                    color: 'primary.main'
                  },
                  height: 64,
                  transition: 'color 0.3s ease'
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
