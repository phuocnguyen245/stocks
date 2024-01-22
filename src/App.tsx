import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import 'moment/locale/vi'
import { SnackbarProvider } from 'notistack'
import { Provider } from 'react-redux'
import { useRoutes } from 'react-router-dom'
import router from './router'
import { store } from './store'
import './styles/index.scss'

const App = (): JSX.Element => {
  const routes = useRoutes(router)

  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <LocalizationProvider dateAdapter={AdapterMoment}>{routes}</LocalizationProvider>
      </SnackbarProvider>
    </Provider>
  )
}

export default App
