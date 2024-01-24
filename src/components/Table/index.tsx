/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Delete,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowUp,
  RemoveRedEyeSharp
} from '@mui/icons-material'
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table as MUITable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { memo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { Loader } from 'src/components/MUIComponents'
import Pagination from './Pagination'
import type { TableHeaderBody, TableProps } from './type'

const Table = ({
  data,
  table,
  isLoading = false,
  totalItems,
  pagination,
  subTable,
  subData,
  onSetPagination,
  onDelete,
  onEdit,
  onView
}: TableProps<any, any, any>): JSX.Element => {
  const [open, setOpen] = useState<string[]>([])

  const onOpen = (id: string): void => {
    setOpen(() => {
      if (open.includes(id)) {
        return open.filter((openId) => openId !== id)
      }
      return [...open, id]
    })
  }

  return (
    <Box sx={{ maxHeight: 600 }}>
      <MUITable stickyHeader sx={{ position: 'relative' }} size='small'>
        <TableHead>
          <TableRow>
            {[...(subTable ? [{ name: '', title: '' }] : []), ...table].map(
              ({ title, ...rest }: TableHeaderBody<unknown>, index) => (
                <TableCell
                  sx={{ whiteSpace: 'nowrap', padding: '8px' }}
                  {...rest}
                  key={`${rest.name as string}-${index}`}
                >
                  {title}
                </TableCell>
              )
            )}
            {(onDelete ?? onEdit ?? onView) && (
              <TableCell align='center' sx={{ whiteSpace: 'nowrap' }} width='10%'>
                <FormattedMessage id='label.actions' />
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <>
              <TableRow key={`${row._id as string}-${index}`}>
                {subTable && (
                  <TableCell>
                    <IconButton size='small' onClick={() => onOpen(row._id)}>
                      {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                )}
                {table.map(({ title, ...rest }, tableIndex) => (
                  <TableCell {...rest} key={`table-${tableIndex}`} sx={{ padding: '8px' }}>
                    {rest?.render?.(row) ?? row[rest.name]}
                  </TableCell>
                ))}
                <TableCell size='small'>
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
              {subTable && (
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={!open.includes(row._id)} timeout='auto' unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <MUITable size='small' aria-label='purchases'>
                          <TableHead>
                            <TableRow>
                              {subTable?.map(
                                ({ title, ...rest }: TableHeaderBody<unknown>, index) => (
                                  <TableCell
                                    sx={{ whiteSpace: 'nowrap', padding: '8px' }}
                                    {...rest}
                                    key={`${rest.name as string}-${index}`}
                                  >
                                    {title}
                                  </TableCell>
                                )
                              )}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {subData?.map((subItems) => {
                              return subItems
                                .filter((item: any) => item.code === row.code)
                                .map((subItem: any) => {
                                  return (
                                    <TableRow key={subItem._id}>
                                      {subTable?.map(({ title, ...rest }, tableIndex) => (
                                        <TableCell
                                          {...rest}
                                          key={`table-${tableIndex}`}
                                          sx={{ padding: '8px' }}
                                        >
                                          {rest?.render?.(subItem) ?? subItem[rest.name]}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  )
                                })
                            })}
                          </TableBody>
                        </MUITable>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              )}
            </>
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
