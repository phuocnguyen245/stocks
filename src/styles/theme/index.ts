import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#A020F0'
    }
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            padding: '5px',
            marginLeft: '4px'
          }
        }
      }
    }
  }
})

export default theme
