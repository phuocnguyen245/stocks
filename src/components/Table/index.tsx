/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edit, KeyboardArrowDown, KeyboardArrowUp, RemoveRedEyeSharp } from '@mui/icons-material'
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
  TableSortLabel,
  Typography,
  useTheme
} from '@mui/material'
import { Fragment, memo, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyResult from 'src/asset/imgs/empty-result.jpg'
import { Loader } from 'src/components/MUIComponents'
import DeletePopover from './DeletePopover'
import Pagination from './Pagination'
import type { TableHeaderBody, TableProps } from './type'
const Table = ({
  data,
  table,
  isLoading,
  totalItems,
  pagination,
  subTable,
  subData,
  onSetPagination,
  onDelete,
  onEdit,
  onView,
  onSort,
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

  const createSortHandler = (name: string) => (event: React.MouseEvent<unknown>) => {
    if (!onSort || !pagination) return

    const isSameSortBy = pagination.sortBy === name
    let direction: 'asc' | 'desc' | undefined

    if (isSameSortBy) {
      direction = pagination.sortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      direction = 'asc'
    }

    const newPagination = {
      ...pagination,
      sortBy: isSameSortBy ? (direction ? name : '') : name,
      sortDirection: direction
    }

    onSort(newPagination)
  }

  return (
    <Box boxShadow={2} borderRadius={1}>
      <TableContainer
        component={Paper}
        sx={{ ...sx, boxShadow: 'none', borderRadius: 0 }}
        {...restProps}
      >
        <MUITable stickyHeader size='small' sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              {[...(subTable ? [{ name: '', title: '' }] : []), ...table].map(
                ({ title, name, render, ...rest }: TableHeaderBody<unknown>, index) => (
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
                    key={`header-${name as string}-${index}`}
                  >
                    <TableSortLabel
                      active={pagination?.sortBy === name}
                      direction={pagination?.sortBy === name ? pagination?.sortDirection : 'asc'}
                      onClick={createSortHandler(name)}
                    >
                      {title}
                    </TableSortLabel>
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
                            {onDelete && (
                              <Box position='relative'>
                                <DeletePopover
                                  row={row}
                                  onDelete={onDelete}
                                  isLoading={isLoading}
                                />
                              </Box>
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
              {isLoading && <Loader />}
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
            p={2}
          >
            <img
              style={{
                width: '56px',
                height: '56px',
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
