import { Search } from '@mui/icons-material'
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent
} from '@mui/material'
import { type SetStateAction, useState, useEffect } from 'react'
import { type DefaultPagination } from 'src/components/Table/type'

interface FilterProps {
  status: string
}

interface FilteredStocksProps {
  onSetPagination?: (value: SetStateAction<DefaultPagination>) => void
}
const FilteredStocks = ({ onSetPagination }: FilteredStocksProps): JSX.Element => {
  const [filter, setFilter] = useState<FilterProps>({
    status: ''
  })

  const onFilter = (e: SelectChangeEvent, type: keyof FilterProps): void => {
    const value = e.target.value
    setFilter((prev) => ({ ...prev, [type]: value }))
    onSetPagination && onSetPagination((prev: DefaultPagination) => ({ ...prev, [type]: value }))
  }

  return (
    <Grid
      container
      justifyContent='space-between'
      alignItems='center'
      sx={{
        maxWidth: '100%',
        '& .MuiInputLabel-root': {
          color: 'primary.main'
        }
      }}
    >
      <Grid item>
        <FormControl sx={{ m: 1, width: '120px' }} variant='outlined' size='small'>
          <InputLabel htmlFor='outlined-adornment-password'>Search ...</InputLabel>
          <OutlinedInput
            endAdornment={
              <InputAdornment position='end'>
                <IconButton edge='end'>
                  <Search />
                </IconButton>
              </InputAdornment>
            }
            label='Password'
          />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl fullWidth size='small' sx={{ width: '100px' }}>
          <InputLabel id='status'>Status</InputLabel>
          <Select
            labelId='status'
            id='status'
            value={filter.status}
            label='Status'
            onChange={(e) => onFilter(e, 'status')}
          >
            {/* <MenuItem value=''>All</MenuItem> */}
            <MenuItem value='Buy'>Buy</MenuItem>
            <MenuItem value='Sell'>Sell</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default FilteredStocks
