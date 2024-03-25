import { Box, type Theme, useTheme } from '@mui/material'
import { type Asset, type Stock } from 'src/models'
import SectorChart from 'src/layouts/Main/Appbar/Asset/AssetDrawer/Charts/SectorChart'
import StockCharts from 'src/layouts/Main/Appbar/Asset/AssetDrawer/Charts/StockCharts'
import { memo } from 'react'

const Charts = ({ data }: { data: Asset }): JSX.Element => {
  const theme: Theme = useTheme()

  return (
    <Box
      height='100%'
      display={'flex'}
      flexDirection='column'
      bgcolor={theme.palette.mode === 'dark' ? 'grey.500' : '#f9f3fe'}
    >
      <StockCharts data={data.stocksPercentage} />
      <SectorChart data={data.sectorsPercentage} />
    </Box>
  )
}

export default memo(Charts)
