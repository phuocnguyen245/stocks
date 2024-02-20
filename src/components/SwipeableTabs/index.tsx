import { AppBar, Box, Paper, Tab, Tabs, Typography, useTheme } from '@mui/material'
import React, { useState, type ReactNode, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import SwipeableViews from 'react-swipeable-views'
import { drawerWidth } from 'src/Layouts/Sidebar'
import { useAppSelector } from 'src/store'

interface Components {
  component?: ReactNode
  title: ReactNode
  link?: {
    url: string
  }
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
    <Box hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </Box>
  )
}

const SwipeableTabs = ({ components }: SwipeableTabsProps): JSX.Element => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const theme = useTheme()
  const { isOpenSidebar, isMdWindow } = useAppSelector((state) => state.Stocks)

  const [value, setValue] = useState<number>(() => {
    if (components) {
      const index = components.findIndex((item) => item.link?.url === pathname)
      if (index === -1) {
        navigate('/stocks')
        return 0
      }
      return index
    }
    return 0
  })

  const handleChange = (_: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue)
  }

  const handleChangeIndex = (index: number): void => {
    setValue(index)
  }

  return (
    <Box borderRadius={0} mt={isMdWindow ? 13 : 14}>
      <Box
        sx={{
          boxShadow: ' rgba(0, 0, 0, 0.24) 0px 3px 8px'
        }}
        position='absolute'
        zIndex={1000}
        width={`calc(100vw - ${!isMdWindow ? (isOpenSidebar ? drawerWidth : 0) : 0}px)`}
        top={isMdWindow ? 52 : 64}
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
                onClick={() => component?.link && navigate(component?.link.url)}
              />
            ))}
          </Tabs>
        </AppBar>
      </Box>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
        style={{ position: 'relative' }}
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
