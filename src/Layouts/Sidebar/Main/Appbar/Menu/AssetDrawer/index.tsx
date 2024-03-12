import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Drawer, IconButton, Typography, styled, useTheme } from '@mui/material'
import { memo } from 'react'
import AssetFooter from 'src/layouts/Sidebar/Main/Appbar/Menu/AssetDrawer/Asset'
import { useAppSelector } from 'src/store'

interface AssetDrawerProps {
  open: boolean
  toggle: () => void
}
const AssetDrawer = ({ open, toggle }: AssetDrawerProps): JSX.Element => {
  const { isLogin } = useAppSelector((state) => state.Stocks)
  const theme = useTheme()
  return (
    <Drawer
      open={isLogin ? open : false}
      onClose={toggle}
      anchor='right'
      variant='persistent'
      sx={{
        '& .MuiPaper-root': {
          transition: 'all 0.25s ease',
          width: 340
        }
      }}
    >
      <DrawerHeader onClick={toggle} sx={{ cursor: 'pointer' }}>
        <Typography pl={2} fontWeight={600}>
          Assets
        </Typography>
        <IconButton>{theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}</IconButton>
      </DrawerHeader>
      <AssetFooter open={open} />
    </Drawer>
  )
}

export default memo(AssetDrawer)

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between'
}))
