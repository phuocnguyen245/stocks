import { Box, Container, Paper, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import Table from 'src/components/Table'
import { type TableHeaderBody } from 'src/components/Table/type'
import { type Indicator } from 'src/Models'
import { convertToDecimal } from 'src/utils'

interface FilterResultProps {
  data: Indicator[]
}
const FilterResult = ({ data }: FilterResultProps): JSX.Element => {
  const table: Array<TableHeaderBody<Indicator>> = [
    {
      name: 'code',
      title: <FormattedMessage id='label.code' />,
      width: '10%'
    },
    {
      name: 'result',
      title: 'RSI',
      width: '10%',
      render: (row) => {
        return <>{convertToDecimal(row.result.rsi)}</>
      }
    },
    {
      name: 'result',
      title: 'MFI',
      width: '10%',
      render: (row) => {
        return <>{convertToDecimal(row.result.mfi)}</>
      }
    },
    {
      name: 'result',
      title: 'MACD',
      width: '10%',
      render: (row) => {
        return (
          <>
            <Typography>{convertToDecimal(row.result.macd.macd)}</Typography>
            <Typography>{convertToDecimal(row.result.macd.signal)}</Typography>
          </>
        )
      }
    },
    {
      name: 'result',
      title: 'Stoch',
      width: '10%',
      render: (row) => {
        return (
          <>
            <Typography>{convertToDecimal(row.result.stoch.k)}</Typography>
            <Typography>{convertToDecimal(row.result.stoch.d)}</Typography>
          </>
        )
      }
    },
    {
      name: 'result',
      title: 'StochRSI',
      width: '10%',
      render: (row) => {
        return (
          <>
            <Typography>{convertToDecimal(row.result.stochRSI.k)}</Typography>
            <Typography>{convertToDecimal(row.result.stochRSI.d)}</Typography>
          </>
        )
      }
    }
  ]
  return <Table data={data} table={table} isLoading={false} totalItems={0} />
}

export default FilterResult
