import { createTheme } from '@mui/material'
import { purple, red } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: '#A020F0'
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        // root: {
        //   '& .MuiOutlinedInput-root': {
        //     '&:hover fieldset': {
        //       borderColor: 'rgba(0, 0, 0, 0.23)'
        //     },
        //     '&.Mui-focused fieldset': {
        //       borderColor: 'rgba(0, 0, 0, 0.23)'
        //     }
        //   }
        // }
      }
    }
  }
})

export default theme
