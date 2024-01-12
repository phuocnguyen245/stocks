import * as React from 'react'
import { Tabs, Tab, Box, Paper } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import DarkModeSwitch from './DarkModeSwitch'

export interface DarkModeSwitchProps {
  darkMode: 'dark' | 'light'
  onSetDarkMode: (value: React.SetStateAction<'dark' | 'light'>) => void
}

const Header = ({ darkMode, onSetDarkMode }: DarkModeSwitchProps): JSX.Element => {
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
    <Paper sx={{ width: '100%', top: 0, left: 0, display: 'flex', justifyContent: 'center' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        sx={{
          '& .MuiTabs-scroller': {
            height: '44px',
            minHeight: 'unset'
          }
        }}
      >
        <Tab
          label='Stocks'
          value={'1'}
          onClick={() => navigate('/stocks')}
          sx={{ color: 'text.primary', fontWeight: 600 }}
        />
        <Tab
          label='Charts'
          value={'2'}
          sx={{ color: 'text.primary', fontWeight: 600 }}
          onClick={() => navigate('/stocks/vnindex')}
        />
        <Tab
          label='Payment'
          value={'3'}
          sx={{ color: 'text.primary', fontWeight: 600 }}
          onClick={() => navigate('/payments')}
        />
      </Tabs>
      <DarkModeSwitch darkMode={darkMode} onSetDarkMode={onSetDarkMode} />
    </Paper>
  )
}

export default Header
