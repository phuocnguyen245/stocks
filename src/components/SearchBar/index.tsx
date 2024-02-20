import { Box, TextField, type BoxProps } from '@mui/material'
import { useState, type ChangeEvent } from 'react'
import { useDebounce } from 'src/hooks'
import SearchResult from './SearchResult'
import Search from '@mui/icons-material/Search'

interface SearchBarProps extends BoxProps {}
const SearchBar = (props: SearchBarProps): JSX.Element => {
  const [search, setSearch] = useState('')
  const debouncedSearchTerm = useDebounce(search, 500)

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value.trim())
  }

  return (
    <Box position='relative' width='100%'>
      <Box width='100%' {...props}>
        <TextField
          sx={[
            { width: '100%' },
            {
              '& .MuiInputBase-root': {
                height: '36px',
                width: '100%'
              },
              '& input': {
                textTransform: search ? 'uppercase' : 'none'
              },
              '& input:focus + svg': {
                // Custom focus styles for the input text
                color: 'primary.main' // Example text color
              }
            }
          ]}
          name='volume'
          value={search}
          onChange={onChange}
          placeholder='Stocks...'
          InputProps={{
            endAdornment: <Search />,
            fullWidth: true
          }}
        />
      </Box>
      <Box position='absolute' left={0} top='110%' zIndex={1000}>
        <SearchResult search={debouncedSearchTerm} />
      </Box>
    </Box>
  )
}

export default SearchBar
