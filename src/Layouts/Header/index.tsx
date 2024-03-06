import { Logout } from '@mui/icons-material'
import { Box, Grid, IconButton, Paper, styled, useMediaQuery, useTheme } from '@mui/material'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchBar from 'src/components/SearchBar'
import { onIsLogin, onMdWindow } from 'src/store/slices/stockSlice'
import DarkModeSwitch from './components/DarkModeSwitch'
import Languages from './components/Languages'
import RefreshTime from './components/RefreshTime'

export interface HeaderProps {
  darkMode: 'dark' | 'light'
  languages: 'vi' | 'en'
  onSetDarkMode: (value: React.SetStateAction<'dark' | 'light'>) => void
  onSetLanguages: (value: React.SetStateAction<'vi' | 'en'>) => void
}

const Header = ({
  darkMode,
  languages,
  onSetLanguages,
  onSetDarkMode
}: HeaderProps): JSX.Element => {
  const theme = useTheme()
  const isMd = useMediaQuery(theme.breakpoints.down('md'))

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isLogin, setIsLogin] = useState(false)
  const location = useLocation()

  useEffect(() => {
    dispatch(onMdWindow(isMd))
  }, [])

  useEffect(() => {
    const tokensLocal = localStorage.getItem('tokens')

    if (tokensLocal) {
      const tokens = JSON.parse(tokensLocal)
      const isLoggedIn = typeof tokens === 'object' && tokens !== null

      dispatch(onIsLogin(isLoggedIn))
      setIsLogin(isLoggedIn)
    } else {
      dispatch(onIsLogin(false))
      setIsLogin(false)
    }
  }, [location])

  const onLogout = (): void => {
    navigate('/login')
    localStorage.removeItem('users')
    localStorage.removeItem('tokens')
  }

  return (
    <HeaderContainer
      sx={{
        width: '100%',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'flex-end',
        height: 52,
        gap: '4px'
      }}
    >
      <HeaderSetting route={location.pathname}>
        <Grid
          container
          alignItems='center'
          flexWrap='nowrap'
          width='auto'
          columnSpacing={0.5}
          height='100%'
        >
          {isLogin && !isMd && (
            <Grid item>
              <Box
                width={160}
                sx={{
                  [theme.breakpoints.down('md')]: {
                    display:
                      (location.pathname === '/login' || location.pathname === '/register') &&
                      'none'
                  }
                }}
              >
                <SearchBar />
              </Box>
            </Grid>
          )}
          <Grid
            item
            sx={{
              [theme.breakpoints.down('md')]: {
                display:
                  (location.pathname === '/login' || location.pathname === '/register') && 'none'
              }
            }}
          >
            <RefreshTime />
          </Grid>

          <Grid item>
            <Languages languages={languages} onSetLanguages={onSetLanguages} />
          </Grid>
          <Grid item>
            <DarkModeSwitch darkMode={darkMode} onSetDarkMode={onSetDarkMode} />
          </Grid>

          {isLogin && !isMd && (
            <Grid
              item
              mr={1}
              sx={{
                [theme.breakpoints.down('md')]: {
                  display:
                    (location.pathname === '/login' || location.pathname === '/register') && 'none'
                }
              }}
            >
              <IconButton
                onClick={onLogout}
                sx={{
                  p: 1,
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                <Logout />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </HeaderSetting>
    </HeaderContainer>
  )
}

const HeaderContainer = styled(Paper)(({ theme }) => ({}))

const HeaderSetting = styled(Box)<{ route: string }>(({ theme, route }) => ({
  display: route === '/login' || route === '/register' ? 'none' : 'block'
}))

export default Header
