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
    <Box>
      <FormControl sx={{ width: 'max-content' }}>
        <Select
          labelId='language'
          value={languages as '' | HTMLInputElement | undefined}
          onChange={onChangeLanguage}
          sx={{
            '& fieldset': {
              border: 'none'
            },
            '& .MuiSelect-select': {
              textAlign: 'right',
              paddingLeft: 0
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
