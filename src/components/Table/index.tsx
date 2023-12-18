import { Box, Button } from '@mui/material'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import React, { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { Status, StockProps } from '../../Models'
import useModal from '../../hooks/useModals'
import StockModal from '../StockModal'
import TableDetail from './TableDetail'
import TableCurrent from './TableCurrent'

const BasicTable = (): JSX.Element => {
  const { open, toggle } = useModal()
  const [editData, setEditData] = useState<StockProps>()
  const [data, setData] = useState<StockProps[]>([])

  useEffect(() => {
    setData(
      [
        {
          id: uuid(),
          code: 'DIG',
          date: '12/10/2023',
          quantity: 100,
          purchasePrice: 1,
          ratio: 1,
          actualGain: 1,
          status: 'Buy' as Status
        }
      ].map((item) => ({
        ...item
      }))
    )
  }, [])

  const addData = (row: StockProps): void => {
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
