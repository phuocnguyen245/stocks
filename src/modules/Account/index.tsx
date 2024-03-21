import { Box, Container, Divider, Grid, Tab, Tabs, TextField } from '@mui/material'
import React, { useState } from 'react'
import UserAccount from './UserAccount'
import Password from './Password'
import { useSelector } from 'react-redux'
import { useAppSelector } from 'src/store'

const Account = (): JSX.Element => {
  const { isMdWindow } = useAppSelector((state) => state.Stocks)
  const [tabsValue, setTabsValue] = useState(0)
  const onChangeTabs = (event: React.SyntheticEvent, newValue: number): void => {
    setTabsValue(newValue)
  }

  return (
    <Container sx={{ pt: 10, height: '100%' }}>
      <Box position='relative' width='100%' height='calc(100vh - 112px)'>
        <Grid
          container
          position='absolute'
          top={isMdWindow ? '8px' : '10%'}
          display={isMdWindow ? 'block' : 'flex'}
        >
          <Grid item xl={3} pb={2}>
            <Tabs
              orientation={isMdWindow ? 'horizontal' : 'vertical'}
              value={tabsValue}
              onChange={onChangeTabs}
              centered
              sx={{
                borderRight: isMdWindow ? 0 : 1,
                borderColor: 'divider',
                '& button': {
                  color: 'text.primary',
                  '&.Mui-selected': {
                    fontWeight: 600
                  }
                }
              }}
            >
              <Tab label='Account' />
              <Tab label='Password' />
            </Tabs>
          </Grid>
          <Grid item xl={9} flex={1} justifyContent='center' display='flex'>
            {tabsValue === 0 && <UserAccount />}
            {tabsValue === 1 && <Password />}
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
export default Account
