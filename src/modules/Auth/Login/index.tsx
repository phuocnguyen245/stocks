import { LockOutlined } from '@mui/icons-material'
import { Avatar, Box, Tab, Tabs, Typography } from '@mui/material'
import { useState, type SyntheticEvent } from 'react'
import { FormattedMessage } from 'react-intl'
import BasicLogin from './BasicLogin'
import Authenticator from './Authenticator'

const Login = (): JSX.Element => {
  const [tabs, setTabs] = useState(0)

  const onChangeTabs = (e: SyntheticEvent<Element, Event>, newTabs: number): void => {
    setTabs(newTabs)
  }

  return (
    <>
      <Tabs
        value={tabs}
        onChange={onChangeTabs}
        aria-label='Vertical tabs example'
        sx={{
          borderColor: 'divider',
          '& button': {
            color: 'text.primary'
          }
        }}
      >
        {/* <Tab label='Basic' /> */}
        {/* <Tab label='Google Authenticator' /> */}
      </Tabs>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlined color='action' />
      </Avatar>
      <Typography component='h1' variant='h5'>
        <FormattedMessage id='label.sign.in' />
      </Typography>
      <Box>{tabs === 0 && <BasicLogin />}</Box>
    </>
  )
}

export default Login
