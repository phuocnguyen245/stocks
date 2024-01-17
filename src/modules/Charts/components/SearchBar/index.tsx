import { Box, TextField, Typography, debounce } from '@mui/material'
import { useEffect, useState, type ChangeEvent } from 'react'
import { useDebounce } from 'src/hooks'
import { useGetBoardQuery } from 'src/services/stocks.services'
import { useAppSelector } from 'src/store'
import SearchResult from './SearchResult'

const SearchBar = (): JSX.Element => {
  const { isOpenSidebar } = useAppSelector((state) => state.Stocks)
  const [search, setSearch] = useState('')
  const debouncedSearchTerm = useDebounce(search, 500)

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value)
  }

  return (
    <>
      <Box
        position='absolute'
        left={isOpenSidebar ? 164 : 24}
        top={'calc(50% + 2px)'}
        sx={{ transform: 'translateY(-50%)' }}
      >
        <TextField
          sx={[
            {
              '& .MuiInputBase-root': {
                height: '36px'
              },
              '& input': {
                textTransform: 'uppercase'
              }
            }
          ]}
          name='volume'
          value={search}
          onChange={onChange}
          fullWidth
        />
      </Box>
      <Box position='fixed' left={isOpenSidebar ? 164 : 24} top='100%' zIndex={10000000000}>
        <SearchResult search={debouncedSearchTerm} />
      </Box>
    </>
  )
}

export default SearchBar
