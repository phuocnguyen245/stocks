import { Menu as MenuIcon } from '@mui/icons-material'
import { IconButton, useMediaQuery, useTheme } from '@mui/material'
import { useModals } from 'src/hooks'
import MenuDrawer from './MenuDrawer'
import { useAppSelector } from 'src/store'
import AssetDrawer from '../AssetDrawer'

interface MenuProps {
  open: boolean
  languages: 'vi' | 'en'
  darkMode: 'dark' | 'light'
  onOpenWatchList: () => void
  onSetDarkMode: (value: React.SetStateAction<'dark' | 'light'>) => void
  onSetLanguages: (value: React.SetStateAction<'vi' | 'en'>) => void
}
const Menu = ({
  open,
  languages,
  darkMode,
  onSetLanguages,
  onSetDarkMode,
  onOpenWatchList
}: MenuProps): JSX.Element => {
  const { isMdWindow, isLogin } = useAppSelector((state) => state.Stocks)

  const { open: openAsset, toggle: onOpenAsset } = useModals()

  const onOpenDrawer = (): void => {
    // if (isMdWindow) {
    //   return onToggleMenu()
    // }
    return onOpenWatchList()
  }

  return (
    <>
      <IconButton
        color='inherit'
        onClick={onOpenDrawer}
        edge='start'
        sx={{ mr: 2, display: isLogin ? 'block' : 'none' }}
      >
        <MenuIcon />
      </IconButton>
      <MenuDrawer
        open={open}
        darkMode={darkMode}
        languages={languages}
        toggle={onOpenWatchList}
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
