import { Box, Container, Divider, Grid, Tab, Tabs, TextField } from '@mui/material'
import React, { useState } from 'react'

const Account = (): JSX.Element => {
  const [tabsValue, setTabsValue] = useState(0)
  const onChangeTabs = (event: React.SyntheticEvent, newValue: number): void => {
    setTabsValue(newValue)
  }
  console.log(tabsValue)

  return (
    <Container sx={{ pt: 10, height: '100%' }}>
      <Box height='calc(100vh - 112px)' position='relative' width='100%'>
        <Grid
          container
          position='absolute'
          top='10%'
          sx={{ transform: 'translateY(-10%)', width: '100%' }}
        >
          <Grid item xl={3}>
            <Tabs
              orientation='vertical'
              value={tabsValue}
              onChange={onChangeTabs}
              aria-label='Vertical tabs example'
              sx={{
                borderRight: 1,
                borderColor: 'divider',
                '& button': {
                  color: 'text.primary'
                }
              }}
            >
              <Tab label='Account' />
              <Tab label='Password' />
            </Tabs>
          </Grid>
          <Grid item xl={9} flex={1} justifyContent='center' display='flex'>
            {tabsValue === 0 && (
              <Grid container width='80%' rowSpacing={2}>
                <Grid item xs={12}>
                  <TextField label='Name' fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label='Email' fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <TextField label='Password' fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label='Confirm Password' fullWidth />
                </Grid>
              </Grid>
            )}
            {tabsValue === 1 && <Box width='80%'>1213</Box>}
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
export default Account
