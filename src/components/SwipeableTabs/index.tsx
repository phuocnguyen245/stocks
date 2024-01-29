import { AppBar, Box, Paper, Tab, Tabs, Typography, useTheme } from '@mui/material'
import React, { useState, type ReactNode } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { useAppSelector } from 'src/store'

interface Components {
  component: ReactNode
  title: ReactNode
}
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

interface SwipeableTabsProps {
  components: Components[]
}

const CustomTabPanel = (props: TabPanelProps): JSX.Element => {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const SwipeableTabs = ({ components }: SwipeableTabsProps): JSX.Element => {
  const theme = useTheme()
  const { isOpenSidebar } = useAppSelector((state) => state.Stocks)

  const [value, setValue] = useState(0)

  const handleChange = (_: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue)
  }

  const handleChangeIndex = (index: number): void => {
    setValue(index)
  }

  return (
    <Box borderRadius={0}>
      <Box
        sx={{
          boxShadow: ' rgba(0, 0, 0, 0.24) 0px 3px 8px'
        }}
        position='absolute'
        zIndex={1000}
        width={`calc(100vw - ${isOpenSidebar ? '340px' : '0px'})`}
        top={64}
        bgcolor='text.primary'
      >
        <AppBar position='static'>
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            component={Paper}
            sx={{
              position: 'relative',
              overflow: 'unset',
              borderRadius: 0
            }}
          >
            {components.map((component, index) => (
              <Tab
                key={index}
                label={component.title}
                sx={{ color: 'text.primary', fontWeight: 600 }}
              />
            ))}
          </Tabs>
        </AppBar>
      </Box>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {components.map((component, index) => (
          <CustomTabPanel value={value} index={index} key={index}>
            {component.component}
          </CustomTabPanel>
        ))}
      </SwipeableViews>
    </Box>
  )
}

export default SwipeableTabs
