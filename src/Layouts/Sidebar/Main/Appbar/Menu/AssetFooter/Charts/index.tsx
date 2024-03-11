import React from 'react'
import StockCharts from './StockCharts'
import { type Stock } from 'src/Models'
import SectorChart from './SectorChart'
import { Box } from '@mui/material'

const Charts = ({ data }: { data: Stock[] }): JSX.Element => {
  return (
    <Box
      height='100%'
      flex={1}
      display={'flex'}
      flexDirection='column'
      justifyContent='space-between'
      bgcolor='rgb(240, 240, 240)'
    >
      <StockCharts data={data} />
      <SectorChart data={data} />
    </Box>
  )
}

export default Charts
