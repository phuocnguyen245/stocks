import { Box, Button } from '@mui/material'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import { useEffect, useState } from 'react'
import type { Stock } from 'src/Models'
import useModal from 'src/hooks/useModals'
import { useGetStocksQuery } from 'src/services/stocks.services'
import ConfirmModal from './Modals/ConfirmModal'
import StockModal from './Modals/StockModal'
import TableDetail from './Modals/TableDetail'
import type { ConfirmModal as ConfirmModalType } from './Modals/index'
import TableCurrent from './TableCurrent'

const BasicTable = (): JSX.Element => {
  const onStockModal = useModal()
  const [editData, setEditData] = useState<Stock>()
  const [data, setData] = useState<Stock[]>([])
  const [modalStatus, setModalStatus] = useState<ConfirmModalType>({
    isBuy: 1,
    open: false
  })
  const { data: stocksData, refetch } = useGetStocksQuery({}, { refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (stocksData?.data?.data?.length) {
      setData(stocksData.data.data)
    }
  }, [stocksData])

  const openConfirmModal = (): void => setModalStatus({ ...modalStatus, open: true })

  const addData = (row: Stock): void => {
    setData((prev) => [
      ...prev,
      {
        ...row
      }
    ])
    onStockModal.toggle()
  }

  return (
    <TableContainer component={Paper}>
      <Box height='100vh'>
        <Box textAlign='right' p={4}>
          <Button variant='contained' onClick={openConfirmModal}>
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
              refetch={refetch}
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
        <ConfirmModal
          modalStatus={modalStatus}
          onSetModalStatus={setModalStatus}
          toggle={onStockModal.toggle}
        />
        <StockModal
          open={onStockModal.open}
          handleClose={onStockModal.toggle}
          addData={addData}
          status={modalStatus.isBuy}
        />
      </Box>
    </TableContainer>
  )
}
export default BasicTable
