import {
  Box,
  CssBaseline,
  AppBar as MuiAppBar,
  ThemeProvider,
  Toolbar,
  styled,
  type AppBarProps as MuiAppBarProps
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
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
import { useAppSelector } from 'src/store'
import MainComponents from './Main'
export const watchListWidth = 280
export const menuWidth = 240

const PersistentDrawerLeft = (): JSX.Element => {
  const dispatch = useDispatch()
  const isLogin = useIsLogin()
  const { isMdWindow } = useAppSelector((state) => state.Stocks)

  const [openMenu, setOpenMenu] = useState(() => {
    const openLocal = localStorage.getItem('isOpenMenu')
    if (typeof openLocal === 'string' && (openLocal === 'true' || openLocal === 'false')) {
      const isOpen = JSON.parse(openLocal)
      const isTypeBoolean = typeof isOpen === 'boolean'
      return isTypeBoolean ? isOpen : true
    }
    return false
  })

  const [openWatchList, setOpenWatchList] = useState(() => {
    const openLocal = localStorage.getItem('isOpenWatchList')
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
    localStorage.setItem('isOpenMenu', JSON.stringify(openMenu))
  }, [openMenu])

  useEffect(() => {
    localStorage.setItem('isOpenWatchList', JSON.stringify(openWatchList))
  }, [openWatchList])

  const toggleMenu = (): void => {
    setOpenMenu(!openMenu)
  }

  useEffect(() => {
    dispatch(setOpenSidebar(openMenu))
  }, [openMenu])

  useEffect(() => {
    dispatch(setMode(darkMode))
  }, [darkMode])

  const locale = {
    en,
    vi
  }

  const widthAndMargin = useMemo(() => {
    let width = 60
    let marginLeft = 60
    let marginRight = 0

    if (!isMdWindow) {
      if (openMenu && openWatchList) {
        width = menuWidth
        marginLeft = menuWidth
      } else if (openMenu) {
        width = menuWidth
        marginLeft = menuWidth
        if (!openWatchList) {
          width = menuWidth
          marginLeft = menuWidth
        }
      } else if (openWatchList) {
        width = watchListWidth - 60
        marginRight = watchListWidth
        if (!openMenu) {
          width = 60
          marginLeft = 60
          marginRight = 0
        }
      }
    } else {
      width = 0
      marginLeft = 0
    }

    const result = { width, marginLeft, marginRight }

    return result
  }, [openMenu, openWatchList, isMdWindow])

  return (
    <ThemeProvider theme={themeProvider(darkMode)}>
      <IntlProvider locale={languages} messages={locale[languages] as Record<string, string>}>
        <Box sx={{ display: 'flex' }} bgcolor={darkMode === 'dark' ? '#000' : '#fff'}>
          <CssBaseline />
          <MainComponents
            appBar={{
              widthAndMargin,
              darkMode,
              open: openMenu,
              languages,
              openWatchList,
              onOpenMenu: toggleMenu,
              onOpenWatchList: () => setOpenWatchList(!openWatchList),
              onSetDarkMode: setDarkMode,
              onSetLanguages: setLanguages
            }}
            outlet={{
              widthAndMargin,
              sx: { p: 0 },
              isLogin
            }}
          />

          <WatchListDrawer
            open={openWatchList}
            toggle={() => setOpenWatchList(false)}
            isLogin={isLogin}
          />
        </Box>
      </IntlProvider>
    </ThemeProvider>
  )
}
export default PersistentDrawerLeft
