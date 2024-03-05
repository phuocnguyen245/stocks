/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppBar as MuiAppBar,
  Toolbar,
  styled,
  type AppBarProps as MuiAppBarProps
} from '@mui/material'
import Header from 'src/Layouts/Header'
import { watchListWidth } from '../..'
import Menu from '../../Menu'

interface AppBarProps extends MuiAppBarProps {
  widthAndMargin: {
    width: number
    marginLeft: number
    marginRight: number
  }
  isLogin?: boolean
  openWatchList?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) =>
    prop !== 'widthAndMargin' && prop !== 'isLogin' && prop !== 'openWatchList'
})<AppBarProps>(({ theme, widthAndMargin, openWatchList }) => ({
  transition: 'all 0.2s ease-in-out',
  width: `calc(100% - ${widthAndMargin.width + (openWatchList ? watchListWidth : 0)}px)`,
  marginLeft: widthAndMargin.marginLeft,
  marginRight: openWatchList ? watchListWidth : 0
}))

const AppBarComponent = ({
  widthAndMargin,
  isLogin,
  openWatchList,
  darkMode,
  onOpenMenu,
  open,
  onOpenWatchList,
  onSetDarkMode,
  languages,
  onSetLanguages
}: any): JSX.Element => {
  console.log(widthAndMargin)

  return (
    <AppBar
      position='fixed'
      widthAndMargin={widthAndMargin}
      openWatchList={openWatchList}
      isLogin={isLogin}
    >
      <Toolbar>
        <Menu
          open={open}
          onOpenMenu={onOpenMenu}
          onOpenWatchList={onOpenWatchList}
          darkMode={darkMode}
          onSetDarkMode={onSetDarkMode}
          languages={languages}
          onSetLanguages={onSetLanguages}
        />
        <Header
          darkMode={darkMode}
          onSetDarkMode={onSetDarkMode}
          languages={languages}
          onSetLanguages={onSetLanguages}
        />
      </Toolbar>
    </AppBar>
  )
}

export default AppBarComponent
