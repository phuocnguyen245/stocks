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
import { DatePicker } from '@mui/x-date-pickers'
import moment, { type MomentInput } from 'moment'
import { useState, type ChangeEvent, type SetStateAction, useEffect } from 'react'
import { type DefaultPagination } from 'src/components/Table/type'
import { useDebounce } from 'src/hooks'
import { useAppSelector } from 'src/store'

interface FilterProps {
  status: string
  from: string
  to: string
}

interface FilteredStocksProps {
  onSetPagination?: (value: SetStateAction<DefaultPagination>) => void
}
interface PaginationWithFilter extends FilterProps, DefaultPagination {
  search?: string
}

const FilteredStocks = ({ onSetPagination }: FilteredStocksProps): JSX.Element => {
  const { isMdWindow } = useAppSelector((state) => state.Stocks)
  const [filter, setFilter] = useState<FilterProps>({
    status: '',
    from: '',
    to: ''
  })
  const [search, setSearch] = useState('')
  const searchDebounce = useDebounce(search, 600)

  useEffect(() => {
    if (onSetPagination) {
      onSetPagination((prev) => {
        const newPagination = {
          ...prev,
          search: searchDebounce
        }
        return newPagination
      })
    }
  }, [searchDebounce, onSetPagination])

  const onFilter = (
    e: SelectChangeEvent | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: keyof PaginationWithFilter
  ): void => {
    const value = e.target.value
    setFilter((prev) => ({ ...prev, [type]: value }))
    onSetPagination &&
      onSetPagination((prev) => {
        if (value) {
          return { ...prev, [type]: value }
        }

        if (Object.keys(filter).includes(type)) {
          const { [type]: deletedValue, ...newObj } = prev as PaginationWithFilter
          return newObj as PaginationWithFilter
        }
        return prev
      })
  }

  const onChangeDate = (e: unknown, type: 'from' | 'to'): void => {
    const value = e as MomentInput
    let date = ''
    type === 'from'
      ? (date = moment(value).startOf('day')?.toISOString()?.toString())
      : (date = moment(value).endOf('day')?.toISOString()?.toString())
    setFilter((prev) => ({ ...prev, [type]: date }))

    onSetPagination &&
      onSetPagination((prev) => {
        if (date) {
          return { ...prev, [type]: date }
        }

        if (Object.keys(filter).includes(type)) {
          const { [type]: deletedValue, ...newObj } = prev as PaginationWithFilter
          return newObj as PaginationWithFilter
        }
        return prev
      })
  }

  const renderStatus = (
    <FormControl fullWidth size='small' sx={{ width: isMdWindow ? '100%' : '100px' }}>
      <InputLabel id='status'>Status</InputLabel>
      <Select
        labelId='status'
        id='status'
        value={filter.status}
        label='Status'
        onChange={(e) => onFilter(e, 'status')}
      >
        <MenuItem value=''>All</MenuItem>
        <MenuItem value='Buy'>Buy</MenuItem>
        <MenuItem value='Sell'>Sell</MenuItem>
      </Select>
    </FormControl>
  )

  return (
    <Grid
      container
      justifyContent='space-between'
      sx={{
        display: 'flex',
        maxWidth: '100%',
        mb: 1
      }}
      rowSpacing={1}
      flexDirection={isMdWindow ? 'column' : 'row'}
    >
      <Grid item>
        <Grid container columnSpacing={1}>
          <Grid item xs={6}>
            <FormControl
              sx={{ width: isMdWindow ? '100%' : '136px' }}
              variant='outlined'
              size='small'
            >
              <InputLabel>Code ...</InputLabel>
              <OutlinedInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                inputProps={{ maxLength: 3 }}
                sx={{
                  '& input': {
                    textTransform: 'uppercase'
                  }
                }}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end'>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                }
                label='Code'
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            {isMdWindow && (
              <Grid item width={isMdWindow ? '100%' : '100px'}>
                {renderStatus}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item flex={1}>
        <Grid
          container
          columnSpacing={isMdWindow ? 0 : 1}
          justifyContent='flex-end'
          rowSpacing={1}
          width='100%'
        >
          <Grid item xs={isMdWindow ? 12 : 'auto'}>
            <Grid container columnSpacing={1}>
              <Grid item xs={6}>
                <DatePicker
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  sx={{ width: isMdWindow ? '100%' : 168 }}
                  onChange={(e) => onChangeDate(e, 'from')}
                  label='From'
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  sx={{ width: isMdWindow ? '100%' : 168 }}
                  onChange={(e) => onChangeDate(e, 'to')}
                  label='To'
                />
              </Grid>
            </Grid>
          </Grid>
          {!isMdWindow && (
            <Grid item width={isMdWindow ? '100%' : '100px'}>
              {renderStatus}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default FilteredStocks
