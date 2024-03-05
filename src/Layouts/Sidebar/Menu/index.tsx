import { Menu as MenuIcon } from '@mui/icons-material'
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { useModals } from 'src/hooks'
import MenuDrawer from './MenuDrawer'
import { useAppSelector } from 'src/store'
import AssetDrawer from '../AssetDrawer'

interface MenuProps {
  open: boolean
  languages: 'vi' | 'en'
  darkMode: 'dark' | 'light'
  onOpenMenu: () => void
  onSetDarkMode: (value: React.SetStateAction<'dark' | 'light'>) => void
  onSetLanguages: (value: React.SetStateAction<'vi' | 'en'>) => void
  onOpenWatchList: () => void
}
const Menu = ({
  open,
  languages,
  darkMode,
  onOpenMenu,
  onSetDarkMode,
  onSetLanguages,
  onOpenWatchList
}: MenuProps): JSX.Element => {
  const { isMdWindow, isLogin } = useAppSelector((state) => state.Stocks)

  const { open: openAsset, toggle: onOpenAsset } = useModals()

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
          sx={{ mr: 2, display: isLogin ? 'block' : 'none' }}
        >
          <MenuIcon />
        </IconButton>
      ) : (
        <Box></Box>
      )}

      <MenuDrawer
        open={open}
        darkMode={darkMode}
        languages={languages}
        toggle={onOpenMenu}
        onOpenAsset={onOpenAsset}
        onSetDarkMode={onSetDarkMode}
        onSetLanguages={onSetLanguages}
        onOpenWatchList={onOpenWatchList}
      />
      <AssetDrawer open={openAsset} toggle={onOpenAsset} />
    </>
  )
}

export default Menu
