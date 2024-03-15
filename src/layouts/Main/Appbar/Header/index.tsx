import { Logout } from '@mui/icons-material'
import { Box, Grid, Paper, styled, useMediaQuery, useTheme } from '@mui/material'
import * as React from 'react'
import { memo, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { ConfirmPopup, SearchBar } from 'src/components'
import Account from 'src/layouts/Main/Appbar/Header/components/Account'
import DarkModeSwitch from 'src/layouts/Main/Appbar/Header/components/DarkModeSwitch'
import Languages from 'src/layouts/Main/Appbar/Header/components/Languages'
import RefreshTime from 'src/layouts/Main/Appbar/Header/components/RefreshTime'
import { onIsLogin, onMdWindow } from 'src/store/slices/stockSlice'

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
        display: 'flex',
        justifyContent: 'flex-end',
        height: isMd ? 44 : 52,
        pr: isMd ? 1 : 0,
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
          mr={1}
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
          {isLogin && (
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
          )}
          <Grid item>
            <Languages languages={languages} onSetLanguages={onSetLanguages} />
          </Grid>
          <Grid item>
            <DarkModeSwitch darkMode={darkMode} onSetDarkMode={onSetDarkMode} />
          </Grid>
          {isLogin && (
            <Grid item>
              <Account />
            </Grid>
          )}
          {isLogin && !isMd && (
            <Grid
              item
              sx={{
                [theme.breakpoints.down('md')]: {
                  display:
                    (location.pathname === '/login' || location.pathname === '/register') && 'none'
                }
              }}
            >
              <ConfirmPopup
                onConfirm={onLogout}
                icon={<Logout color='primary' />}
                title={<FormattedMessage id='text.are.you.sure.want.to.logout' />}
              />
            </Grid>
          )}
        </Grid>
      </HeaderSetting>
    </HeaderContainer>
  )
}

const HeaderContainer = styled(Paper)(({ theme }) => ({}))

const HeaderSetting = styled(Box)<{ route: string }>(({ theme, route }) => ({
  display: 'block'
}))

export default memo(Header)
