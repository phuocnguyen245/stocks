import { Box, Button, Link } from '@mui/material'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { type RecommendedStocks, type Indicator, type LabelType } from 'src/models'
import { Label } from 'src/components/MUIComponents'
import Table from 'src/components/Table'
import type { DefaultPagination, TableHeaderBody } from 'src/components/Table/type'
import { useGetRecommendedQuery } from 'src/services/stocks.services'
import { convertToDecimal } from 'src/utils'
import { type FilterStocksType } from '.'
interface FilterResultProps {
  filterDebounce: FilterStocksType
}

const labelColor = (name: string, value: number): JSX.Element => {
  let type: LabelType
  switch (name) {
    case 'rsi':
      if (value < 30) {
        type = 'primary'
        break
      } else if (value < 70) {
        type = 'success'
        break
      }
      type = 'error'
      break
    case 'macd':
      if (value < 0) {
        type = 'error'
        break
      }
      type = 'success'
      break
    case 'stochRSI':
    case 'stoch':
    case 'mfi':
      if (value < 20) {
        type = 'primary'
        break
      } else if (value < 80) {
        type = 'success'
        break
      }
      type = 'error'
      break

    default:
      type = 'error'
      break
  }
  return (
    <Label type={type} sx={{ width: 80 }}>
      {value}
    </Label>
  )
}
const FilterResult = ({ filterDebounce }: FilterResultProps): JSX.Element => {
  const navigate = useNavigate()
  const { data: recommendedData } = useGetRecommendedQuery(JSON.stringify(filterDebounce), {
    refetchOnMountOrArgChange: true
  })

  const [data, setData] = useState<RecommendedStocks[]>([])
  const [pagination, setPagination] = useState<DefaultPagination>({
    page: 0,
    size: 10
  })

  useEffect(() => {
    if (pagination?.sortBy) {
      setData((prev) => {
        if (pagination.sortDirection === 'asc' || pagination.sortDirection === 'desc') {
          return [...prev]
            .sort((a, b) => {
              const key = pagination.sortBy as keyof RecommendedStocks
              let comparisonValueA = 0
              let comparisonValueB = 0
              if (key === 'rsi' || key === 'mfi') {
                comparisonValueA = a[key]
                comparisonValueB = b[key]
              } else if (key === 'macd') {
                comparisonValueA = a[key].macd
                comparisonValueB = b[key].macd
              } else if (key === 'stoch' || key === 'stochRSI') {
                comparisonValueA = a[key].k
                comparisonValueB = b[key].k
              }

              if (pagination.sortDirection === 'asc') {
                return Number(comparisonValueA) - Number(comparisonValueB)
              } else {
                return Number(comparisonValueB) - Number(comparisonValueA)
              }
            })
            .slice()
        }
        return prev
      })
    }
  }, [pagination])

  useEffect(() => {
    navigate('/filters')
  }, [])

  useEffect(() => {
    setData(recommendedData?.data ?? [])
  }, [recommendedData])

  const table: Array<TableHeaderBody<RecommendedStocks>> = [
    {
      name: 'code',
      title: <FormattedMessage id='label.code' />,
      align: 'center',
      width: '10%',
      render: (row) => {
        return (
          <Link
            href={`/charts/${row.code}`}
            target='_blank'
            sx={{ color: 'primary.main', textDecoration: 'none' }}
          >
            <Button>{row.code}</Button>
          </Link>
        )
      }
    },
    {
      name: 'rsi',
      title: 'RSI',
      width: '15%',
      align: 'center',
      render: (row) => {
        return (
          <Box display='flex' justifyContent='center'>
            {labelColor('rsi', convertToDecimal(row.rsi))}
          </Box>
        )
      }
    },
    {
      name: 'mfi',
      title: 'MFI',
      width: '15%',
      align: 'center',
      render: (row) => {
        return (
          <Box display='flex' justifyContent='center'>
            {labelColor('mfi', convertToDecimal(row.mfi))}
          </Box>
        )
      }
    },
    {
      name: 'macd',
      title: 'MACD',
      width: '20%',
      align: 'center',
      render: (row) => {
        return (
          <Box display='flex' gap={1} justifyContent='center'>
            {labelColor('macd', convertToDecimal(row.macd.macd))}
            {labelColor('macd', convertToDecimal(row.macd.signal))}
          </Box>
        )
      }
    },
    {
      name: 'stoch',
      title: 'Stoch',
      width: '20%',
      align: 'center',
      render: (row) => {
        return (
          <Box display='flex' gap={1} justifyContent='center'>
            {labelColor('stoch', convertToDecimal(row.stoch.k))}
            {labelColor('stoch', convertToDecimal(row.stoch.d))}
          </Box>
        )
      }
    },
    {
      name: 'stochRSI',
      title: 'StochRSI',
      width: '20%',
      align: 'center',
      render: (row) => {
        return (
          <Box display='flex' gap={1} justifyContent='center'>
            {labelColor('stochRSI', convertToDecimal(row.stochRSI.k))}
            {labelColor('stochRSI', convertToDecimal(row.stochRSI.d))}
          </Box>
        )
      }
    }
  ]

  const onSort = (pagination: DefaultPagination): void => {
    setPagination(pagination)
  }

  return (
    <Table
      data={data ?? []}
      table={table}
      isLoading={false}
      sx={{ maxHeight: 500 }}
      // pagination={pagination}
      // onSetPagination={setPagination}
      totalItems={data?.length ?? 0}
      onSort={onSort}
    />
  )
}

export default FilterResult
