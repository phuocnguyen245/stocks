import {
  Box,
  CssBaseline,
  AppBar as MuiAppBar,
  ThemeProvider,
  Toolbar,
  styled,
  type AppBarProps as MuiAppBarProps
} from '@mui/material'
import { useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { useIsLogin } from 'src/hooks'
import en from 'src/locales/en.json'
import vi from 'src/locales/vi.json'
import { setMode, setOpenSidebar } from 'src/store/slices/stockSlice'
import themeProvider from 'src/styles/theme'
import Header from '../Header'
import Menu from './Menu'
import WatchListDrawer from './WatchListDrawer'

export const drawerWidth = 340

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isLogin'
})<{
  open?: boolean
  isLogin?: boolean
}>(({ theme, open, isLogin }) => ({
  padding: theme.spacing(3),
  width: '100%',
  transition: theme.transitions.create('all', {
    easing: theme.transitions.easing.easeInOut,
    duration: '0,2s'
  }),
  marginRight: isLogin ? `-${drawerWidth}px` : 0,
  ...(open && {
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.easeInOut,
      duration: '0,2s'
    }),
    marginRight: 0
  })
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
  isLogin: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isLogin'
})<AppBarProps>(({ theme, open, isLogin }) => ({
  transition: 'all 0.2s ease-in-out',
  width: '100%',
  ...(open && {
    width: isLogin ? `calc(100% - ${drawerWidth}px)` : '100%',
    marginRight: isLogin ? `${drawerWidth}px` : '0',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginRight: 0
    }
  })
}))

const PersistentDrawerLeft = (): JSX.Element => {
  const dispatch = useDispatch()
  const isLogin = useIsLogin()

  const [openWatchList, setOpenWatchList] = useState(() => {
    const openLocal = localStorage.getItem('isOpenDrawer')
    if (typeof openLocal === 'string' && (openLocal === 'true' || openLocal === 'false')) {
      const isOpen = JSON.parse(openLocal)
      const isTypeBoolean = typeof isOpen === 'boolean'
      return isTypeBoolean ? isOpen : true
    }
    return false
  })

  const [darkMode, setDarkMode] = useState<'light' | 'dark'>(() => {
    const localMode = localStorage.getItem('mode')
    if (!localMode || (localMode !== 'dark' && localMode !== 'light')) {
      return 'light'
    }
    return localMode
  })
  const [languages, setLanguages] = useState<'en' | 'vi'>(() => {
    const lang = localStorage.getItem('lang')
    if (!lang || (lang !== 'en' && lang !== 'vi')) {
      return 'vi'
    }
    return lang
  })

  useEffect(() => {
    localStorage.setItem('isOpenDrawer', JSON.stringify(openWatchList))
  }, [openWatchList])

  const toggle = (): void => {
    setOpenWatchList(!openWatchList)
  }

  useEffect(() => {
    dispatch(setOpenSidebar(openWatchList))
  }, [openWatchList])

  useEffect(() => {
    dispatch(setMode(darkMode))
  }, [darkMode])

  const locale = {
    en,
    vi
  }

  return (
    <ThemeProvider theme={themeProvider(darkMode)}>
      <IntlProvider locale={languages} messages={locale[languages] as Record<string, string>}>
        <Box sx={{ display: 'flex' }} bgcolor={darkMode === 'dark' ? '#000' : '#fff'}>
          <CssBaseline />
          <AppBar position='fixed' open={openWatchList} isLogin={isLogin}>
            <Toolbar>
              <Header
                darkMode={darkMode}
                onSetDarkMode={setDarkMode}
                languages={languages}
                onSetLanguages={setLanguages}
              />
              <Menu
                onOpenWatchList={toggle}
                darkMode={darkMode}
                onSetDarkMode={setDarkMode}
                languages={languages}
                onSetLanguages={setLanguages}
              />
            </Toolbar>
          </AppBar>
          <Main open={openWatchList} sx={{ p: 0 }} isLogin={isLogin}>
            <Outlet />
          </Main>
          <WatchListDrawer open={openWatchList} toggle={toggle} isLogin={isLogin} />
        </Box>
      </IntlProvider>
    </ThemeProvider>
  )
}
export default PersistentDrawerLeft
