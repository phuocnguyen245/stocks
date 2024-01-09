import * as React from 'react'
import { Tabs, Tab, Box, Paper } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Header = (): JSX.Element => {
  const navigate = useNavigate()
  const [value, setValue] = React.useState('1')
  const location = useLocation()
  const handleChange = (event: React.SyntheticEvent, newValue: string): void => {
    setValue(newValue)
  }

  useEffect(() => {
    const options = {
      '/stocks': '1',
      '/payments': '2'
    }
    setValue(options[location.pathname as keyof typeof options] || '1')
  }, [location])

  return (
    <Paper sx={{ width: '100%', position: 'fixed', top: 0, left: 0 }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab
          label='Stocks'
          value={'1'}
          onClick={() => navigate('/stocks')}
          sx={{ color: 'text.primary' }}
        />
        <Tab
          label='Payment'
          value={'2'}
          sx={{ color: 'text.primary' }}
          onClick={() => navigate('/payments')}
        />
      </Tabs>
    </Paper>
  )
}

export default Header
