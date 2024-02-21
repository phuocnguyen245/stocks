import { Menu as MenuIcon } from '@mui/icons-material'
import { IconButton, useMediaQuery, useTheme } from '@mui/material'
import { useModals } from 'src/hooks'
import MenuDrawer from './MenuDrawer'
import { useAppSelector } from 'src/store'
import AssetDrawer from '../AssetDrawer'

interface MenuProps {
  onOpenWatchList: () => void
  darkMode: 'dark' | 'light'
  languages: 'vi' | 'en'
  onSetDarkMode: (value: React.SetStateAction<'dark' | 'light'>) => void
  onSetLanguages: (value: React.SetStateAction<'vi' | 'en'>) => void
}
const Menu = ({
  languages,
  darkMode,
  onSetLanguages,
  onSetDarkMode,
  onOpenWatchList
}: MenuProps): JSX.Element => {
  const { isMdWindow, isLogin } = useAppSelector((state) => state.Stocks)

  const { open: openMenu, toggle: onToggleMenu } = useModals()
  const { open: openAsset, toggle: onOpenAsset } = useModals()

  const onOpenDrawer = (): void => {
    if (isMdWindow) {
      return onToggleMenu()
    }
    return onOpenWatchList()
  }

  return (
    <>
      <IconButton
        color='inherit'
        onClick={onOpenDrawer}
        edge='start'
        sx={{ ml: 2, display: isLogin ? 'block' : 'none' }}
      >
        <MenuIcon />
      </IconButton>
      <MenuDrawer
        open={openMenu}
        darkMode={darkMode}
        languages={languages}
        toggle={onToggleMenu}
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
