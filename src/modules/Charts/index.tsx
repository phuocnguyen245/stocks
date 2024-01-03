/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Box, Tabs, Tab, Typography } from '@mui/material'
import React, { memo, useEffect, useMemo, useState } from 'react'
import StockChart from './StockChart'
import StatisticCharts from './StatisticChart'
import { useParams } from 'react-router'
import { useGetStockStatisticQuery } from 'src/services/stocks.services'

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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const Charts = (): JSX.Element => {
  const [value, setValue] = useState(0)
  const { code: paramsCode } = useParams()
  const [code, setCode] = useState<string>('')
  const [data, setData] = useState<[number[]]>([[]])

  const { data: stockStatistic } = useGetStockStatisticQuery(
    { code },
    { skip: !code, refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    !!paramsCode && setCode(paramsCode.toUpperCase())
  }, [paramsCode])

  useEffect(() => {
    if (stockStatistic?.data?.data?.length) {
      setData(stockStatistic.data.data)
    }
  }, [stockStatistic])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
    </>
  )
}

export default memo(Charts)
