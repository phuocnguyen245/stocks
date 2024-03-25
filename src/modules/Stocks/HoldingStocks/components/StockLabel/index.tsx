import { type TypographyProps } from '@mui/material'
import { useMemo } from 'react'
import { Label } from 'src/components/MUIComponents'
import { type LabelType } from 'src/models'

interface LabelProps extends TypographyProps {
  type?: LabelType
  number?: number
  compareNumber?: number
}
const StockLabel = (props: LabelProps): JSX.Element => {
  const { number = 0, compareNumber = 0, children, type, ...rest } = props
  const labelType = useMemo(() => {
    if (number === compareNumber) {
      return 'warning'
    }
    if (number > compareNumber) {
      return 'success'
    }
    return 'error'
  }, [number, compareNumber])

  return (
    <Label type={type ?? labelType} {...rest} fontSize={14} fontWeight={600}>
      {children}
    </Label>
  )
}

export default StockLabel
