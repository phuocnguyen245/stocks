import { ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import 'moment/locale/vi'
import { Provider } from 'react-redux'
import { useRoutes } from 'react-router-dom'
import router from './router'
import { store, useAppSelector } from './store'
import './styles/index.scss'

const App = (): JSX.Element => {
  const routes = useRoutes(router)

  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>{routes}</LocalizationProvider>
    </Provider>
  )
}

export default App
