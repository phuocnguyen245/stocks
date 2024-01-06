import { Delete, Edit, RemoveRedEyeSharp } from '@mui/icons-material'
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  type TableCellProps
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Loader } from 'src/components/MUIComponents'
import Pagination from './Pagination'

interface TableHeaderBody<T> extends TableCellProps {
  name: string
  title: string
  width: number | string
  render: (data: T) => JSX.Element
}

interface TableProps<T> {
  data: T[]
  table: Array<TableHeaderBody<T>>
  isLoading: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TableComponent = ({ data, table, isLoading = false }: TableProps<any>): JSX.Element => {
  return (
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          {table.map((item: TableHeaderBody<unknown>) => (
            <TableCell {...item} key={item.name}>
              {item.title}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell {...table[index]}>
                  {table[index].render(row) && row[table[index].name]}
                </TableCell>
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
      <Pagination />
    </Table>
  )
}

export default TableComponent
