import type { TableCellProps } from '@mui/material'

interface Pagination {
  page: number
  size: number
  totalItems: number
  sort?: string
  startDate?: string
  fromDate?: string
  status?: 'Buy' | 'Sell'
}
interface TableHeaderBody<T> extends TableCellProps {
  name: keyof T
  title: string
  width?: number | string
  render?: (data: T) => JSX.Element
}

interface TableProps<T> {
  data: T[]
  table: Array<TableHeaderBody<T>>
  isLoading: boolean
  totalItems: number
  onDelete?: (value: T) => void
  onEdit?: (value: T) => void
  onView?: (value: T) => void
}

export type { Pagination, TableHeaderBody, TableProps }
