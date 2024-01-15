/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AppBar, Box, Paper, Tab, Tabs, Typography, useTheme } from '@mui/material'
import React, { memo, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import StatisticCharts from './StatisticChart'
import StockChart from './StockChart'
import { useAppSelector } from 'src/store'
import { FormattedMessage } from 'react-intl'
import SwipeableViews from 'react-swipeable-views'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
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

const Charts = (): JSX.Element => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { code: paramsCode } = useParams()

  const { isOpenSidebar } = useAppSelector((state) => state.Stocks)

  const [value, setValue] = useState(0)
  const [code, setCode] = useState<string>('')

  useEffect(() => {
    if (paramsCode) {
      setCode(paramsCode.toUpperCase())
    } else {
      navigate('/stock/vnindex')
    }
  }, [paramsCode])

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index: number) => {
    setValue(index)
  }

  return (
    <Box borderRadius={0}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          boxShadow: ' rgba(0, 0, 0, 0.24) 0px 3px 8px',
          borderRadius: 0,
          border: 'none',
          transition: 'all 0.5s ease'
        }}
        position='fixed'
        zIndex={1000}
        width={'100%'}
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
              transform: `translateX(${isOpenSidebar ? '-140px' : '0'})`,
              transition: 'all 0.5s ease',
              borderRadius: 0,
              '& .MuiTabs-scroller': {
                height: '44px',
                minHeight: 'unset'
              }
            }}
          >
            <Tab
              label={<FormattedMessage id='title.stock.chart' />}
              sx={{ color: 'text.primary', fontWeight: 600 }}
            />
            <Tab
              label={<FormattedMessage id='title.statistic.chart' />}
              sx={{ color: 'text.primary', fontWeight: 600 }}
            />
          </Tabs>
        </AppBar>
      </Box>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <CustomTabPanel value={value} index={0}>
          <StockChart />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <StatisticCharts code={code} />
        </CustomTabPanel>
      </SwipeableViews>
    </Box>
  )
}

export default memo(Charts)
