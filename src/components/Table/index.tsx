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
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from '@mui/material'
import { Fragment, memo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { Loader } from 'src/components/MUIComponents'
import Pagination from './Pagination'
import type { TableHeaderBody, TableProps } from './type'
import EmptyResult from 'src/asset/imgs/empty-result.jpg'
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
  onView,
  ...props
}: TableProps<any, any, any>): JSX.Element => {
  const [open, setOpen] = useState<string[]>([])
  const theme = useTheme()
  const { sx, ...restProps } = props
  const onOpen = (id: string): void => {
    setOpen(() => {
      if (open.includes(id)) {
        return open.filter((openId) => openId !== id)
      }
      return [...open, id]
    })
  }

  return (
    <Box boxShadow={2} borderRadius={1} overflow='hidden'>
      <TableContainer
        component={Paper}
        sx={{ ...sx, boxShadow: 'none', borderRadius: 0 }}
        {...restProps}
      >
        <MUITable stickyHeader size='small' sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              {[...(subTable ? [{ name: '', title: '' }] : []), ...table].map(
                ({ title, render, ...rest }: TableHeaderBody<unknown>, index) => (
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                      padding: '8px',
                      bgcolor: 'primary.main',
                      color: '#fff',
                      paddingLeft: index === 0 ? '16px' : '8px',
                      fontWeight: 600
                    }}
                    {...rest}
                    key={`header-${rest.name as string}-${index}`}
                  >
                    {title}
                  </TableCell>
                )
              )}
              {(onDelete ?? onEdit ?? onView) && (
                <TableCell
                  align='center'
                  sx={{
                    whiteSpace: 'nowrap',
                    bgcolor: 'primary.main',
                    color: '#fff'
                  }}
                  width='10%'
                >
                  {/* <FormattedMessage id='label.actions' /> */}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          {data?.length > 0 && (
            <TableBody sx={{ position: 'relative' }}>
              {data.map((row, dataIndex) => {
                const isOpen = open.includes(row._id)
                return (
                  <Fragment key={dataIndex}>
                    <TableRow
                      onClick={() => onOpen(row?._id)}
                      sx={{
                        cursor: subTable ? 'pointer' : 'default',
                        transition: 'background 0.3s ease',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'primary.light'
                        }
                      }}
                    >
                      {subTable && (
                        <TableCell>
                          <IconButton size='small' onClick={() => onOpen(row._id)}>
                            {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                          </IconButton>
                        </TableCell>
                      )}
                      {table.map(({ title, render, ...rest }, tableIndex) => (
                        <TableCell
                          {...rest}
                          key={`${tableIndex}-${dataIndex}`}
                          sx={{ padding: '8px', paddingLeft: tableIndex === 0 ? '16px' : '8px' }}
                        >
                          {render?.(row) ?? row[rest.name]}
                        </TableCell>
                      ))}
                      {(onView ?? onEdit ?? onDelete) && (
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
                            {onDelete && row.status === 'Buy' && (
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
                      )}
                    </TableRow>
                    {subTable && (
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={12}
                          sx={{
                            bgcolor: theme.palette.mode === 'dark' ? 'grey.500' : 'primary.light'
                          }}
                        >
                          <Collapse in={open.includes(row._id)} timeout='auto' unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <MUITable size='small' aria-label='purchases'>
                                <TableHead>
                                  <TableRow>
                                    {subTable?.map(
                                      ({ title, ...rest }: TableHeaderBody<unknown>, index) => (
                                        <TableCell
                                          sx={{ whiteSpace: 'nowrap', padding: '8px' }}
                                          {...rest}
                                          key={`${rest.name as string}-${index}-sub-${dataIndex}`}
                                        >
                                          {title}
                                        </TableCell>
                                      )
                                    )}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {subData?.map((subItems, subDataIndex) => {
                                    return subItems
                                      .filter((item: any) => item.code === row.code)
                                      .map((subItem: any, subItemIndex: number) => {
                                        return (
                                          <TableRow
                                            key={`sub-data-${subItem._id}-${subDataIndex}-${subItemIndex}`}
                                          >
                                            {subTable?.map(({ title, render, ...rest }, index) => (
                                              <TableCell
                                                {...rest}
                                                key={`sub-item-${subItem._id}-${index}`}
                                                sx={{ padding: '8px' }}
                                              >
                                                {render?.(subItem) ?? subItem[rest.name]}
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
                  </Fragment>
                )
              })}
              {isLoading && (
                <TableCell sx={{ minHeight: '80px !important', display: 'block' }}>
                  <Loader />
                </TableCell>
              )}
            </TableBody>
          )}
        </MUITable>
        {data.length <= 0 && (
          <Box
            width='100%'
            height='88px'
            display='flex'
            justifyContent='center'
            alignItems='center'
            flexDirection='column'
          >
            <img
              style={{
                width: '64px',
                height: '64px',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
              src={EmptyResult}
              alt='empty result'
            />
            <Typography>No data</Typography>
          </Box>
        )}
      </TableContainer>
      {pagination && onSetPagination && (
        <Pagination
          pagination={pagination}
          onSetPagination={onSetPagination}
          totalItems={totalItems}
        />
      )}
    </Box>
  )
}

export default memo(Table)
