import { TableCell, type TableCellProps as MUITableCellProps } from '@mui/material'
import React from 'react'

interface TableCellProps extends MUITableCellProps {
  index: number
  name: string
}
const HeaderTableCell = ({ index, name, ...props }: TableCellProps): JSX.Element => {
  const { children, ...restProps } = props
  return (
    <TableCell
      sx={{
        whiteSpace: 'nowrap',
        padding: '8px',
        bgcolor: 'primary.main',
        color: '#fff',
        paddingLeft: index === 0 ? '16px' : '8px',
        fontWeight: 600
      }}
      {...restProps}
    >
      {children}
    </TableCell>
  )
}

export default HeaderTableCell
