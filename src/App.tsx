import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import Table from './components/Table'
import 'moment/locale/vi'

const App = (): JSX.Element => (
  <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='vi'>
    <div className='App'>
      <Table />
    </div>
  </LocalizationProvider>
)

export default App
