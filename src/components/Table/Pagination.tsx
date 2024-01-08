import { Box, TablePagination } from '@mui/material'
import React, { memo, type MouseEvent, type SetStateAction } from 'react'
import { type DefaultPagination as IPagination } from './type'

interface PaginationProps {
  pagination: IPagination
  totalItems: number
  onSetPagination: (value: SetStateAction<IPagination>) => void
}
const Pagination = ({ pagination, totalItems, onSetPagination }: PaginationProps): JSX.Element => {
  const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    onSetPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    onSetPagination((prev) => ({ ...prev, size: parseInt(event.target.value, 10) }))
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <TablePagination
        component='div'
        count={totalItems}
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
