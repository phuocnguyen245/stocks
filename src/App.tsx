import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import 'moment/locale/vi'
import { Provider } from 'react-redux'
import Table from './components/Table'
import { store } from './store'
import './styles/index.scss'
import { ThemeProvider } from '@mui/material'
import theme from './styles/theme'

const App = (): JSX.Element => (
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='vi'>
        <div className='App'>
          <Table />
        </div>
      </LocalizationProvider>
    </Provider>
  </ThemeProvider>
)

export default App
