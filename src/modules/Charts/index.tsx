/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Box, Tab, Tabs, Typography } from '@mui/material'
import React, { memo, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useGetStockStatisticQuery } from 'src/services/stocks.services'
import StatisticCharts from './StatisticChart'
import StockChart from './StockChart'

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
  const [value, setValue] = useState(1)
  const { code: paramsCode } = useParams()
  const [code, setCode] = useState<string>('')
  const [data, setData] = useState<[number[]]>([[]])

  const { data: stockStatistic } = useGetStockStatisticQuery({ code }, { skip: !code })

  useEffect(() => {
    !!paramsCode && setCode(paramsCode.toUpperCase())
  }, [paramsCode])

  useEffect(() => {
    if (stockStatistic?.data?.data?.length) {
      setData(stockStatistic.data.data)
    }
  }, [stockStatistic])

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <Box>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          boxShadow: ' rgba(0, 0, 0, 0.24) 0px 3px 8px'
        }}
        position='fixed'
        zIndex={1000}
        width='100%'
        top={0}
        bgcolor='text.primary'
      >
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label='Stock Chart' />
          <Tab label='Statistic Charts' />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <StockChart data={data} code={code} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <StatisticCharts data={data} />
      </CustomTabPanel>
    </Box>
  )
}

export default memo(Charts)
