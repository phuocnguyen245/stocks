import type { TableCellProps, TableContainerProps } from '@mui/material'
import { type ReactNode, type SetStateAction } from 'react'

interface DefaultPagination {
  page: number
  size: number
}
interface TableHeaderBody<T> extends TableCellProps {
  name: keyof T | ''
  title: ReactNode
  width?: number | string
  render?: (data: T) => JSX.Element
}

interface TableProps<T, Y, P> extends TableContainerProps {
  data: T[]
  subData?: Y[]
  table: Array<TableHeaderBody<T>>
  subTable?: Array<TableHeaderBody<T>>
  isLoading: boolean
  totalItems: number
  pagination?: P
  onSetPagination?: (value: SetStateAction<P>) => void
  onDelete?: (value: T) => void
  onEdit?: (value: T) => void
  onView?: (value: T) => void
}

export type { DefaultPagination, TableHeaderBody, TableProps }
