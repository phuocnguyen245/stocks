import { Box } from '@mui/material'
import { type Stock } from 'src/models'
import SectorChart from 'src/layouts/Sidebar/Main/Appbar/Menu/AssetDrawer/Asset/Charts/SectorChart'
import StockCharts from 'src/layouts/Sidebar/Main/Appbar/Menu/AssetDrawer/Asset/Charts/StockCharts'

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
