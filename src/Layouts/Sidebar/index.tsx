import MenuIcon from '@mui/icons-material/Menu'
import {
  Box,
  CssBaseline,
  IconButton,
  AppBar as MuiAppBar,
  ThemeProvider,
  Toolbar,
  styled,
  type AppBarProps as MuiAppBarProps
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { setMode, setOpenSidebar } from 'src/store/slices/stockSlice'
import themeProvider from 'src/styles/theme'
import Header from '../Header'
import SideBarDrawer from './SideBarDrawer'

export const drawerWidth = 280

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginRight: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  })
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  transition: 'all 0.5s ease',
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: `${drawerWidth}px`
  })
}))

const PersistentDrawerLeft = (): JSX.Element => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(() => {
    const openLocal = localStorage.getItem('isOpenDrawer')
    if (openLocal) {
      const isOpen = JSON.parse(openLocal)
      const isTypeBoolean = typeof isOpen === 'boolean'
      return isTypeBoolean ? isOpen : true
    }
    return true
  })
  const [darkMode, setDarkMode] = useState<'light' | 'dark'>(() => {
    const localMode = localStorage.getItem('mode')
    if (!localMode || (localMode !== 'dark' && localMode !== 'light')) {
      return 'light'
    }
    return localMode
  })

  useEffect(() => {
    localStorage.setItem('isOpenDrawer', JSON.stringify(open))
  }, [open])

  const toggle = (): void => {
    setOpen(!open)
  }

  const handleDrawerOpen = (): void => {
    toggle()
  }

  useEffect(() => {
    dispatch(setOpenSidebar(open))
  }, [open])

  useEffect(() => {
    dispatch(setMode(darkMode))
  }, [darkMode])

  return (
    <ThemeProvider theme={themeProvider(darkMode)}>
      <Box sx={{ display: 'flex' }} bgcolor={darkMode === 'dark' ? '#000' : '#fff'}>
        <CssBaseline />
        <AppBar position='fixed' open={open}>
          <Toolbar>
            <Header darkMode={darkMode} onSetDarkMode={setDarkMode} />
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Main open={open} sx={{ p: 0 }}>
          <Outlet />
        </Main>
        <SideBarDrawer open={open} toggle={toggle} />
      </Box>
    </ThemeProvider>
  )
}
export default PersistentDrawerLeft
