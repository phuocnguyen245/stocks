import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import type { Board } from 'src/Models'
import { useDebounce } from 'src/hooks'
import { useGetBoardQuery } from 'src/services/stocks.services'

interface InfinitySelectCodeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSetData?: (name: any, value: string) => void
}

const InfinitySelectCode = ({ onSetData }: InfinitySelectCodeProps): JSX.Element => {
  const [search, setSearch] = useState<string | undefined>(undefined)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [value, setValue] = useState<any>(null)
  const debouncedSearchTerm = useDebounce(search, 500)

  const [data, setData] = useState<Board[]>([])
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    search: ''
  })
  const [totalItems, setTotalItems] = useState(0)

  const { data: boardData } = useGetBoardQuery(
    { ...pagination },
    { refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    onSetData && value?.name && onSetData('code', value.name)
  }, [value])

  useEffect(() => {
    setData([])
    setPagination((prev) => {
      const newPagination = { ...prev, page: 0, search: debouncedSearchTerm ?? '' }
      return newPagination
    })
  }, [debouncedSearchTerm])

  useEffect(() => {
    if (boardData?.data?.data?.length) {
      setData((prev) => [...prev, ...(boardData?.data?.data ?? [])])
      setTotalItems(boardData?.data?.totalItems)
    } else {
      setData([])
      setTotalItems(0)
    }
  }, [boardData])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onScroll = (e: any): void => {
    const element = e.target as HTMLDivElement
    const scrollHeight = element?.scrollHeight ?? 0
    const scrollTop = element?.scrollTop ?? 0
    const clientHeight = element?.clientHeight ?? 0

    if (scrollTop + clientHeight >= scrollHeight) {
      if ((pagination.page + 1) * pagination.size < totalItems) {
        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
      }
    }
  }

  const options = useMemo(() => {
    if (data) {
      return data?.map((item) => ({ label: item.symbol, name: item.symbol }))
    }
    return []
  }, [data])

  return (
    <Autocomplete
      disablePortal
      defaultValue={null}
      options={options}
      ListboxProps={{
        onScroll
      }}
      sx={{
        mb: 1,
        '& .MuiInputBase-input': {
          textTransform: 'uppercase'
        },
        '& label': {
          textTransform: 'none'
        }
      }}
      fullWidth
      value={value || null}
      onChange={(_: unknown, newValue) => {
        setValue(newValue)
      }}
      inputValue={search}
      onInputChange={(_, newInputValue) => {
        setSearch(newInputValue)
      }}
      renderInput={(params) => <TextField {...params} label='Code' required />}
    />
  )
}

export default InfinitySelectCode
