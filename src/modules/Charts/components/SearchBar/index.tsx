import { Box, type BoxProps, TextField } from '@mui/material'
import { useState, type ChangeEvent } from 'react'
import { useAppSelector } from 'src/store'
import SearchResult from './SearchResult'
import { useDebounce } from 'src/hooks'

interface SearchBarProps extends BoxProps {}
const SearchBar = (props: SearchBarProps): JSX.Element => {
  const { isOpenSidebar } = useAppSelector((state) => state.Stocks)
  const [search, setSearch] = useState('')
  const debouncedSearchTerm = useDebounce(search, 500)

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value.trim())
  }

  return (
    <>
      <Box position='absolute' left={isOpenSidebar ? 164 : 24} {...props}>
        <TextField
          sx={[
            {
              '& .MuiInputBase-root': {
                height: '36px'
              },
              '& input': {
                textTransform: search ? 'uppercase' : 'none'
              }
            }
          ]}
          name='volume'
          value={search}
          onChange={onChange}
          fullWidth
          placeholder='Search...'
        />
      </Box>
      <Box position='fixed' left={isOpenSidebar ? 164 : 24} top='100%' zIndex={10000}>
        <SearchResult search={debouncedSearchTerm} />
      </Box>
    </>
  )
}

export default SearchBar
