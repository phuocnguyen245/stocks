import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import FirstPageRoundedIcon from '@mui/icons-material/FirstPageRounded'
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded'
import { Box, TablePagination } from '@mui/material'
import React, { memo, type MouseEvent, type SetStateAction } from 'react'
import { type Pagination as IPagination } from './type'

interface PaginationProps {
  pagination: IPagination
  setPagination: (value: SetStateAction<IPagination>) => void
}
const Pagination = ({ pagination, setPagination }: PaginationProps): JSX.Element => {
  const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setPagination((prev) => ({ ...prev, size: parseInt(event.target.value, 10) }))
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <TablePagination
        component='div'
        count={pagination.totalItems}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        page={pagination.page}
        rowsPerPage={pagination.size}
        rowsPerPageOptions={[5, 10, 25, 30]}
        showLastButton
        showFirstButton
      />
    </Box>
  )
}
export default memo(Pagination)
