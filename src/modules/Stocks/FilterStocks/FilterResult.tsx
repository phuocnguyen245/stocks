import { Box, Button, IconButton, Link } from '@mui/material'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { type Indicator, type LabelType } from 'src/Models'
import { Label } from 'src/components/MUIComponents'
import Table from 'src/components/Table'
import type { DefaultPagination, TableHeaderBody } from 'src/components/Table/type'
import { convertToDecimal } from 'src/utils'
interface FilterResultProps {
  data: Indicator[]
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
  return <Label type={type}>{value}</Label>
}
const FilterResult = ({ data }: FilterResultProps): JSX.Element => {
  const navigate = useNavigate()

  const [pagination, setPagination] = useState<DefaultPagination>({
    page: 0,
    size: 10
  })
  const table: Array<TableHeaderBody<Indicator>> = [
    {
      name: 'code',
      title: <FormattedMessage id='label.code' />,
      align: 'center',
      width: '10%',
      render: (row) => {
        return (
          <Link
            href={`/stocks/${row.code}`}
            target='_blank'
            sx={{ color: 'primary.main', textDecoration: 'none' }}
          >
            <Button>{row.code}</Button>
          </Link>
        )
      }
    },
    {
      name: 'result',
      title: 'RSI',
      width: '15%',
      align: 'center',
      render: (row) => {
        return <>{labelColor('rsi', convertToDecimal(row.result.rsi))}</>
      }
    },
    {
      name: 'result',
      title: 'MFI',
      width: '15%',
      align: 'center',
      render: (row) => {
        return <>{labelColor('mfi', convertToDecimal(row.result.mfi))}</>
      }
    },
    {
      name: 'result',
      title: 'MACD',
      width: '20%',
      align: 'center',
      render: (row) => {
        return (
          <Box display='flex' gap={1} justifyContent='center'>
            {labelColor('macd', convertToDecimal(row.result.macd.macd))}
            {labelColor('macd', convertToDecimal(row.result.macd.signal))}
          </Box>
        )
      }
    },
    {
      name: 'result',
      title: 'Stoch',
      width: '20%',
      align: 'center',
      render: (row) => {
        return (
          <Box display='flex' gap={1} justifyContent='center'>
            {labelColor('stoch', convertToDecimal(row.result.stoch.k))}
            {labelColor('stoch', convertToDecimal(row.result.stoch.d))}
          </Box>
        )
      }
    },
    {
      name: 'result',
      title: 'StochRSI',
      width: '20%',
      align: 'center',
      render: (row) => {
        return (
          <Box display='flex' gap={1} justifyContent='center'>
            {labelColor('stochRSI', convertToDecimal(row.result.stochRSI.k))}
            {labelColor('stochRSI', convertToDecimal(row.result.stochRSI.d))}
          </Box>
        )
      }
    }
  ]

  useEffect(() => {
    navigate('/stocks/filters')
  }, [])

  return (
    <Table
      data={data}
      table={table}
      isLoading={false}
      sx={{ maxHeight: 500 }}
      pagination={pagination}
      onSetPagination={setPagination}
      totalItems={data?.length ?? 0}
    />
  )
}

export default FilterResult
