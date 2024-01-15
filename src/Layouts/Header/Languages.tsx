import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent
} from '@mui/material'
import { type SetStateAction } from 'react'

interface LanguageProps {
  languages: 'vi' | 'en'
  onSetLanguages: (value: SetStateAction<'vi' | 'en'>) => void
}
const Languages = ({ languages, onSetLanguages }: LanguageProps): JSX.Element => {
  const onChangeLanguage = (e: SelectChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value as string
    onSetLanguages(value as 'vi' | 'en')
    localStorage.setItem('lang', value)
  }
  return (
    <Box position='absolute' right='80px' top='50%' sx={{ transform: 'translateY(-50%)' }}>
      <FormControl fullWidth>
        <Select
          labelId='language'
          value={languages as '' | HTMLInputElement | undefined}
          onChange={onChangeLanguage}
          sx={{
            '& fieldset': {
              border: 'none'
            }
          }}
        >
          <MenuItem value='en'>English</MenuItem>
          <MenuItem value='vi'>Tiếng Việt </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default Languages
