import { Box, type Theme, useTheme } from '@mui/material'
import { type Stock } from 'src/models'
import SectorChart from 'src/layouts/Sidebar/Main/Appbar/Asset/AssetDrawer/Charts/SectorChart'
import StockCharts from 'src/layouts/Sidebar/Main/Appbar/Asset/AssetDrawer/Charts/StockCharts'

const Charts = ({ data }: { data: Stock[] }): JSX.Element => {
  const theme: Theme = useTheme()

  return (
    <Box
      height='100%'
      display={'flex'}
      flexDirection='column'
      bgcolor={theme.palette.mode === 'dark' ? 'grey.500' : '#f9f3fe'}
    >
      <StockCharts data={data} />
      <SectorChart data={data} />
    </Box>
  )
}

export default Charts
