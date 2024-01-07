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
import { memo, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader } from 'src/components/MUIComponents'
import Pagination from './Pagination'
import type { Pagination as IPagination, TableHeaderBody, TableProps } from './type'

const Table = ({
  data,
  table,
  isLoading = false,
  totalItems,
  onDelete,
  onEdit,
  onView
}: TableProps<any>): JSX.Element => {
  const [pagination, setPagination] = useState<IPagination>({
    page: 0,
    size: 0,
    totalItems: 0,
    sort: '',
    startDate: '',
    fromDate: '',
    status: 'Buy'
  })

  useEffect(() => {
    setPagination((prev) => ({ ...prev, totalItems }))
  }, [totalItems])

  console.log(data, table)

  return (
    <Box sx={{ minWidth: '650px' }}>
      <MUITable>
        <TableHead>
          <TableRow>
            {table.map((item: TableHeaderBody<unknown>) => (
              <TableCell {...item} key={item.name}>
                {item.title}
              </TableCell>
            ))}
            {(onDelete ?? onEdit ?? onView) && <TableCell align='center'>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {data.map((row, index) => (
                <>
                  <TableRow key={index}>
                    {table.map((tableItem, tableIndex) => (
                      <TableCell {...tableItem} key={`table-${tableIndex}`}>
                        {tableItem?.render?.(row) ? tableItem?.render?.(row) : row[tableItem.name]}{' '}
                      </TableCell>
                    ))}
                    <TableRow key={'actions'}>
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
                                to={`/stock/${row.code}`}
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
                  </TableRow>
                </>
              ))}
            </>
          )}
        </TableBody>
      </MUITable>
      <Pagination pagination={pagination} setPagination={setPagination} />
    </Box>
  )
}

export default memo(Table)
