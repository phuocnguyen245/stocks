import { Box, Button } from '@mui/material'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import React, { useEffect, useState } from 'react'
import type { Stock } from '../../Models'
import useModal from '../../hooks/useModals'
import { useGetStocksQuery } from '../../services/stocks.services'
import StockModal from '../StockModal'
import TableCurrent from './TableCurrent'
import TableDetail from './TableDetail'

const BasicTable = (): JSX.Element => {
  const { open, toggle } = useModal()
  const [editData, setEditData] = useState<Stock>()
  const [data, setData] = useState<Stock[]>([])
  const { data: stocksData } = useGetStocksQuery({}, { refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (stocksData?.data?.data?.length) {
      setData(stocksData.data.data)
    }
  }, [stocksData])

  const addData = (row: Stock): void => {
    setData((prev) => [
      ...prev,
      {
        ...row
      }
    ])
    toggle()
  }

  return (
    <TableContainer component={Paper}>
      <Box textAlign='right' p={4}>
        <Button variant='contained' onClick={toggle}>
          Created
        </Button>
      </Box>
      <Box display='flex' gap={2}>
        <Box flex={1}>
          <TableDetail
            data={data}
            editData={editData}
            setEditData={setEditData}
            setData={setData}
          />
        </Box>
        <Box flex={1.5} flexShrink='unset'>
          <TableCurrent
            data={data}
            editData={editData}
            setEditData={setEditData}
            setData={setData}
          />
        </Box>
      </Box>
      <StockModal open={open} handleClose={toggle} addData={addData} />
    </TableContainer>
  )
}
export default BasicTable
