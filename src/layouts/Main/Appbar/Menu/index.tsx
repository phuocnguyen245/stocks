import { Menu as MenuIcon } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import { useModals } from 'src/hooks'
import { useAppSelector } from 'src/store'
import AssetDrawer from 'src/layouts/Main/Appbar/Asset'
import MenuDrawer from 'src/layouts/Main/Appbar/Menu/MenuDrawer'
import SearchModal from 'src/layouts/Main/Appbar/SearchModal'

interface MenuProps {
  open: boolean
  openWatchList: boolean
  onOpenMenu: () => void
  onHideMenu: () => void
  onOpenWatchList: () => void
}
const Menu = ({
  open,
  openWatchList,
  onOpenMenu,
  onOpenWatchList,
  onHideMenu
}: MenuProps): JSX.Element => {
  const { isMdWindow, isLogin } = useAppSelector((state) => state.Stocks)

  const { open: openAsset, toggle: onToggleAsset, hide: onHideAsset } = useModals()
  const { open: openSearch, toggle: onToggleSearch, hide: onHideSearch } = useModals()

  const onOpenDrawer = (): void => {
    return onOpenMenu()
  }

  return (
    <>
      {isMdWindow && !open ? (
        <IconButton
          color='inherit'
          onClick={onOpenDrawer}
          edge='start'
          sx={{ mr: 0.5, display: isLogin ? 'block' : 'none' }}
        >
          <MenuIcon />
        </IconButton>
      ) : (
        <Box></Box>
      )}

      <MenuDrawer
        open={open}
        toggle={onOpenMenu}
        onHideMenu={onHideMenu}
        openAsset={openAsset}
        onToggleAsset={onToggleAsset}
        onHideAsset={onHideAsset}
        openWatchList={openWatchList}
        onOpenWatchList={onOpenWatchList}
        openSearch={openSearch}
        onHideSearch={onHideSearch}
        onToggleSearch={onToggleSearch}
      />
      <AssetDrawer open={openAsset} toggle={onToggleAsset} />
      <SearchModal open={openSearch} toggle={onToggleSearch} />
    </>
  )
}

export default Menu
