import { Logout } from '@mui/icons-material'
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
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

  const [value, setValue] = React.useState('1')
  const [isLogin, setIsLogin] = useState(false)
  const location = useLocation()
  const handleChange = (event: React.SyntheticEvent, newValue: string): void => {
    setValue(newValue)
  }

  useEffect(() => {
    const options = {
      '/stocks': '1',
      '/stocks/vnindex': '2',
      '/payments': '3'
    }
    setValue(options[location.pathname as keyof typeof options] || '1')
  }, [location])

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
        justifyContent: 'space-between',
        height: 52,
        gap: '4px'
      }}
    >
      <HeaderNavigation flex={1} ml={isMd ? 0 : 4}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered={isMd}
          sx={{
            '& .MuiTabs-scroller': {
              height: '50px',
              minHeight: 'unset'
            },
            display: isLogin ? 'block' : 'none'
          }}
        >
          <Tab
            label={<FormattedMessage id='title.stocks' />}
            value={'1'}
            onClick={() => navigate('/stocks')}
            sx={{ color: 'text.primary', fontWeight: 600, height: 56 }}
          />
          <Tab
            label={<FormattedMessage id='title.charts' />}
            value={'2'}
            sx={{ color: 'text.primary', fontWeight: 600 }}
            onClick={() => navigate('/stocks/vnindex')}
          />
          <Tab
            label={<FormattedMessage id='title.payments' />}
            value={'3'}
            sx={{ color: 'text.primary', fontWeight: 600 }}
            onClick={() => navigate('/payments')}
          />
        </Tabs>
      </HeaderNavigation>
      <HeaderSetting route={location.pathname}>
        <Grid
          container
          alignItems='center'
          flexWrap='nowrap'
          width='auto'
          columnSpacing={0.5}
          height='100%'
        >
          {isLogin && (
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

const HeaderNavigation = styled(Box)(({ theme }) => ({}))

const HeaderSetting = styled(Box)<{ route: string }>(({ theme, route }) => ({
  [theme.breakpoints.down('md')]: {
    display: route === '/login' || route === '/register' ? 'block' : 'none'
  }
}))

export default Header
