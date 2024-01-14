/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Box, Paper, Tab, Tabs, Typography } from '@mui/material'
import React, { memo, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import StatisticCharts from './StatisticChart'
import StockChart from './StockChart'
import { useAppSelector } from 'src/store'

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
  const navigate = useNavigate()
  const [value, setValue] = useState(0)
  const { code: paramsCode } = useParams()
  const [code, setCode] = useState<string>('')

  const { isOpenSidebar } = useAppSelector((state) => state.Stocks)

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
          <Tab label='Stock Chart' sx={{ color: 'text.primary', fontWeight: 600 }} />
          <Tab label='Statistic Charts' sx={{ color: 'text.primary', fontWeight: 600 }} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <StockChart />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <StatisticCharts code={code} />
      </CustomTabPanel>
    </Box>
  )
}

export default memo(Charts)
