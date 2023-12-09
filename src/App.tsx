import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import Table from './components/Table'

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className='App'>
        <Table />
      </div>
    </LocalizationProvider>
  )
}

export default App
