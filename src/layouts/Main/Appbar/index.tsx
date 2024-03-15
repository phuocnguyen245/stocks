/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppBar as MuiAppBar,
  Toolbar,
  styled,
  type AppBarProps as MuiAppBarProps
} from '@mui/material'
import Header from 'src/layouts/Main/Appbar/Header'
import { watchListWidth } from 'src/layouts'
import Menu from 'src/layouts/Main/Appbar/Menu'
import { memo } from 'react'

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
})<AppBarProps>(({ theme, widthAndMargin, openWatchList, isLogin }) => ({
  transition: 'all 0.25s ease',
  width: `calc(100% - ${
    isLogin ? widthAndMargin.width + (openWatchList ? watchListWidth : 0) : 0
  }px)`,
  marginLeft: widthAndMargin.marginLeft,
  marginRight: openWatchList ? watchListWidth : 0,
  [theme.breakpoints.down('md')]: {
    marginRight: 0,
    width: '100%'
  }
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
  onSetLanguages,
  onHideMenu
}: any): JSX.Element => {
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
          onHideMenu={onHideMenu}
          openWatchList={openWatchList}
          onOpenWatchList={onOpenWatchList}
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

export default memo(AppBarComponent)
