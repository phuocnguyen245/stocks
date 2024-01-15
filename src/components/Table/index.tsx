/* eslint-disable @typescript-eslint/no-explicit-any */
import { Delete, Edit, RemoveRedEyeSharp } from '@mui/icons-material'
import {
  Box,
  Button,
  Table as MUITable,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material'
import { memo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loader } from 'src/components/MUIComponents'
import Pagination from './Pagination'
import type { TableHeaderBody, TableProps } from './type'
import { FormattedMessage } from 'react-intl'

const Table = ({
  data,
  table,
  isLoading = false,
  totalItems,
  pagination,
  onSetPagination,
  onDelete,
  onEdit,
  onView
}: TableProps<any, any>): JSX.Element => {
  return (
    <Box sx={{ minWidth: '650px' }}>
      <MUITable stickyHeader sx={{ position: 'relative' }}>
        <TableHead>
          <TableRow>
            {table.map(({ title, ...rest }: TableHeaderBody<unknown>, index) => (
              <TableCell
                sx={{ whiteSpace: 'nowrap' }}
                {...rest}
                key={`${rest.name as string}-${index}`}
              >
                {title}
              </TableCell>
            ))}
            {(onDelete ?? onEdit ?? onView) && (
              <TableCell align='center' sx={{ whiteSpace: 'nowrap' }} width='10%'>
                <FormattedMessage id='label.actions' />
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={`${row._id as string}-${index}`}>
              {table.map(({ title, ...rest }, tableIndex) => (
                <TableCell {...rest} key={`table-${tableIndex}`}>
                  {rest?.render?.(row) ?? row[rest.name]}
                </TableCell>
              ))}
              <TableCell>
                <Box display='flex' alignItems='center' justifyContent='center' gap={0.5}>
                  {onView && (
                    <Button
                      sx={{ width: '40px', minWidth: 'unset', borderRadius: '100%' }}
                      onClick={() => {
                        onView(row)
                      }}
                    >
                      <Link
                        to={`/stocks/${row.code}`}
                        style={{ display: 'flex', alignItems: 'center' }}
                        target='_blank'
                      >
                        <RemoveRedEyeSharp color='primary' />
                      </Link>
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      color='info'
                      sx={{ width: '40px', minWidth: 'unset', borderRadius: '100%' }}
                      onClick={() => {
                        onEdit(row)
                      }}
                    >
                      <Edit />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      sx={{ width: '40px', minWidth: 'unset', borderRadius: '100%' }}
                      onClick={() => {
                        onDelete(row)
                      }}
                    >
                      <Delete color='error' />
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {isLoading && <Loader />}
      </MUITable>
      <Pagination
        pagination={pagination}
        onSetPagination={onSetPagination}
        totalItems={totalItems}
      />
    </Box>
  )
}

export default memo(Table)
