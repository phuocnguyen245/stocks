import * as React from 'react'
import { Tabs, Tab, Box, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Header = (): JSX.Element => {
  const navigate = useNavigate()
  const [value, setValue] = React.useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: string): void => {
    setValue(newValue)
  }

  return (
    <Paper sx={{ width: '100%' }}>
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
          onClick={() => navigate('/payment')}
        />
      </Tabs>
    </Paper>
  )
}

export default Header
