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
import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchBar from 'src/components/SearchBar'
import DarkModeSwitch from './components/DarkModeSwitch'
import Languages from './components/Languages'
import RefreshTime from './components/RefreshTime'
import { useDispatch } from 'react-redux'
import { onMdWindow } from 'src/store/slices/stockSlice'
import { Logout } from '@mui/icons-material'

export interface HeaderProps {
  darkMode: 'dark' | 'light'
  languages: 'vi' | 'en'
  isLogin: boolean
  onSetDarkMode: (value: React.SetStateAction<'dark' | 'light'>) => void
  onSetLanguages: (value: React.SetStateAction<'vi' | 'en'>) => void
}

const Header = ({
  darkMode,
  languages,
  isLogin,
  onSetLanguages,
  onSetDarkMode
}: HeaderProps): JSX.Element => {
  const theme = useTheme()
  const isMd = useMediaQuery(theme.breakpoints.down('md'))

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [value, setValue] = React.useState('1')
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
        height: 52
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
      <HeaderSetting>
        <Grid container alignItems='center' flexWrap='nowrap' width='auto'>
          <Grid item>
            <Box width={160}>
              <SearchBar />
            </Box>
          </Grid>
          <Grid item>
            <RefreshTime />
          </Grid>
          <Grid item>
            <DarkModeSwitch darkMode={darkMode} onSetDarkMode={onSetDarkMode} />
          </Grid>
          <Grid item>
            <Languages languages={languages} onSetLanguages={onSetLanguages} />
          </Grid>
          <Grid item mr={1}>
            <IconButton
              onClick={onLogout}
              sx={{
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              <Logout />
            </IconButton>
          </Grid>
        </Grid>
      </HeaderSetting>
    </HeaderContainer>
  )
}

const HeaderContainer = styled(Paper)(({ theme }) => ({}))

const HeaderNavigation = styled(Box)(({ theme }) => ({}))

const HeaderSetting = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

export default Header
