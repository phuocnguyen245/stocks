import type { TableCellProps } from '@mui/material'
import { type SetStateAction } from 'react'

interface DefaultPagination {
  page: number
  size: number
}
interface TableHeaderBody<T> extends TableCellProps {
  name: keyof T | ''
  title: string
  width?: number | string
  render?: (data: T) => JSX.Element
}

interface TableProps<T, P> {
  data: T[]
  table: Array<TableHeaderBody<T>>
  isLoading: boolean
  totalItems: number
  pagination: P
  onSetPagination: (value: SetStateAction<P>) => void
  onDelete?: (value: T) => void
  onEdit?: (value: T) => void
  onView?: (value: T) => void
}

export type { DefaultPagination, TableHeaderBody, TableProps }
