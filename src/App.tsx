import { ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import 'moment/locale/vi'
import { Provider } from 'react-redux'
import { store } from './store'
import './styles/index.scss'
import theme from './styles/theme'
import { useRoutes } from 'react-router-dom'
import React from 'react'
import router from './router'

const App = (): JSX.Element => {
  const routes = useRoutes(router)
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterMoment}>{routes}</LocalizationProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default App
