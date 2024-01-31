import * as React from 'react'
import { Tabs, Tab, Box, Paper, Grid } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import DarkModeSwitch from './DarkModeSwitch'
import Languages from './Languages'
import { FormattedMessage } from 'react-intl'
import RefreshTime from './RefreshTime'

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
  const navigate = useNavigate()
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

  return (
    <Paper
      sx={{
        width: '100%',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'space-between',
        height: 52
      }}
    >
      <Box width={300}></Box>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
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
      <Grid container width='max-content' alignItems='center' flexWrap='nowrap'>
        <Grid item>
          <RefreshTime />
        </Grid>
        <Grid item>
          <DarkModeSwitch darkMode={darkMode} onSetDarkMode={onSetDarkMode} />
        </Grid>
        <Grid item>
          <Languages languages={languages} onSetLanguages={onSetLanguages} />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Header
