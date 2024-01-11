import { type Theme, createTheme, colors } from '@mui/material'

const onDarkTheme = (mode: 'dark' | 'light'): Theme => {
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#A020F0'
      },
      secondary: {
        main: '#31e631'
      },
      text: {
        primary: mode === 'dark' ? '#fff' : '#000',
        secondary: mode === 'dark' ? '#000' : '#fff'
      },
      background: {
        default: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)'
      }
    },
    components: {
      MuiSwitch: {
        styleOverrides: {
          root: {
            '& .MuiSwitch-switchBase': {
              padding: '8px'
            }
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& label': {
              color: mode === 'dark' ? '#fff' : '#000'
            }
          }
        }
      }
    }
  })
  return theme
}

export default onDarkTheme
