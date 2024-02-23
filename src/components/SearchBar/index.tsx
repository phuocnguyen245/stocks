import { Box, TextField, type BoxProps } from '@mui/material'
import { useState, type ChangeEvent, useRef, useLayoutEffect, useEffect } from 'react'
import { useDebounce } from 'src/hooks'
import SearchResult from './SearchResult'
import Search from '@mui/icons-material/Search'
import { useAppSelector } from 'src/store'

interface SearchBarProps extends BoxProps {
  open?: boolean
}
const SearchBar = (props: SearchBarProps): JSX.Element => {
  const { isMdWindow } = useAppSelector((state) => state.Stocks)
  const searchBoxRef = useRef<HTMLDivElement | null>(null)

  const [search, setSearch] = useState('')
  const [topDistance, setTopDistance] = useState(0)

  const debouncedSearchTerm = useDebounce(search, 500)

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value.trim())
  }

  useEffect(() => {
    const ref = searchBoxRef?.current
    if (ref && isMdWindow) {
      setTopDistance(ref.getBoundingClientRect().top + 64)
    }
  }, [props.open, isMdWindow])

  return (
    <Box position='relative' width='100%' ref={searchBoxRef}>
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
                color: 'primary.main'
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
      <Box
        position={isMdWindow ? 'fixed' : 'absolute'}
        left={isMdWindow ? '50%' : '0'}
        sx={{ transform: 'translate(-50%, 0)' }}
        top={isMdWindow ? topDistance : '110%'}
        width={isMdWindow ? '90%' : '400px'}
        zIndex={1000}
      >
        <SearchResult search={debouncedSearchTerm} isMd={isMdWindow} />
      </Box>
    </Box>
  )
}

export default SearchBar
