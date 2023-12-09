import { Delete, Edit } from '@mui/icons-material'
import { Button } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import * as React from 'react'
import useModal from '../hooks/useModals'
import StockModal from './StockModal'

type status = 'Buy' | 'Sell'
interface TableProps {
  code: string
  date: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  ratio?: string
  actualGain?: number
  status: status
}

export default function BasicTable(): JSX.Element {
  const { open, toggle } = useModal()
  const [data, setData] = React.useState<TableProps[]>([])

  const ratio = React.useCallback((current: number, init: number) => {
    return (((current - init) / init) * 100).toFixed(2)
  }, [])

  const addData = (row: TableProps) => {
    setData((prev) => [...prev, row])
  }

  React.useEffect(
    () =>
      setData(
        [
          {
            code: 'DIG',
            date: '123123',
            quantity: 100,
            purchasePrice: 1,
            currentPrice: 1.05,
            ratio: 1,
            actualGain: 1,
            status: 'Buy' as status,
          },
        ].map((item) => ({
          ...item,
          ratio: ratio(item.currentPrice, item.purchasePrice),
          actualGain: item.quantity * item.currentPrice,
        }))
      ),
    []
  )

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Purchase Price</TableCell>
            <TableCell>Current Price</TableCell>
            <TableCell>Ratio</TableCell>
            <TableCell>Actual Gain</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.code}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.purchasePrice}</TableCell>
              <TableCell>{row.currentPrice}</TableCell>
              <TableCell>{`${row.ratio}%`}</TableCell>
              <TableCell>{row.actualGain}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>
                <Button>
                  <Edit />
                </Button>
                <Button>
                  <Delete color='error' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <StockModal open={true} handleClose={toggle} addData={addData} />
    </TableContainer>
  )
}
