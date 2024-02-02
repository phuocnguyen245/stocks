import { type Theme, createTheme, colors } from '@mui/material'

const onDarkTheme = (mode: 'dark' | 'light'): Theme => {
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#A020F0' : '#b641ff',
        light: colors.purple[50],
        100: colors.purple[100],
        200: colors.purple[200],
        300: colors.purple[300],
        400: colors.purple[400],
        500: colors.purple[500],
        600: colors.purple[600],
        700: colors.purple[700],
        800: colors.purple[800],
        900: colors.purple[900]
      },
      secondary: {
        main: '#31e631'
      },
      success: {
        main: mode === 'light' ? colors.green[500] : '#2ac32a',
        50: colors.green[50],
        100: colors.green[100],
        200: colors.green[200],
        300: colors.green[300],
        400: colors.green[400],
        500: colors.green[500],
        600: colors.green[600],
        700: colors.green[700],
        800: colors.green[800],
        900: colors.green[900]
      },
      warning: {
        main: mode === 'light' ? colors.yellow[600] : colors.yellow[400],
        50: colors.yellow[50],
        100: colors.yellow[100],
        200: colors.yellow[200],
        300: colors.yellow[300],
        400: colors.yellow[400],
        500: colors.yellow[500],
        600: colors.yellow[600],
        700: colors.yellow[700],
        800: colors.yellow[800],
        900: colors.yellow[900]
      },
      error: {
        main: mode === 'light' ? colors.red[700] : colors.red[400],
        50: colors.red[50],
        100: colors.red[100],
        200: colors.red[200],
        300: colors.red[300],
        400: colors.red[400],
        500: colors.red[500],
        600: colors.red[600],
        700: colors.red[700],
        800: colors.red[800],
        900: colors.red[900]
      },
      text: {
        primary: mode === 'dark' ? '#fff' : '#000',
        secondary: mode === 'dark' ? '#000' : '#fff'
      },
      background: {
        default: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)'
      },
      grey: {
        100: '#f7fafc',
        200: '#edf2f7',
        300: '#e2e8f0',
        400: '#cbd5e0',
        500: '#6e6e6e',
        600: '#718096',
        700: '#4a5568',
        800: '#2e2e2e',
        900: '#1a202c'
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
