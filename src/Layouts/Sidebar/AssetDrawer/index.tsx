import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Box, Drawer, IconButton, Typography, styled, useTheme } from '@mui/material'
import AssetFooter from 'src/modules/Stocks/HoldingStocks/Partials/AssetFooter'

interface AssetDrawerProps {
  open: boolean
  toggle: () => void
}
const AssetDrawer = ({ open, toggle }: AssetDrawerProps): JSX.Element => {
  const theme = useTheme()
  return (
    <Drawer open={open} onClose={toggle} anchor='left'>
      <DrawerHeader onClick={toggle} sx={{ cursor: 'pointer' }}>
        <Typography pl={2} fontWeight={600}>
          Assets
        </Typography>
        <IconButton>{theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}</IconButton>
      </DrawerHeader>
      <Box>
        <AssetFooter />
      </Box>
    </Drawer>
  )
}

export default AssetDrawer

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between'
}))
