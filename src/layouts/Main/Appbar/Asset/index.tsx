import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Box, Drawer, IconButton, Typography, styled, useTheme } from '@mui/material'
import { memo } from 'react'
import AssetContent from 'src/layouts/Main/Appbar/Asset/AssetDrawer'
import { useAppSelector } from 'src/store'

interface AssetProps {
  open: boolean
  toggle: () => void
}
const Asset = ({ open, toggle }: AssetProps): JSX.Element => {
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
      <Box>
        <DrawerHeader onClick={toggle} sx={{ cursor: 'pointer' }}>
          <Typography pl={2} fontWeight={600}>
            Assets
          </Typography>
          <IconButton>{theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}</IconButton>
        </DrawerHeader>
        <AssetContent open={open} />
      </Box>
    </Drawer>
  )
}

export default memo(Asset)

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between'
}))
