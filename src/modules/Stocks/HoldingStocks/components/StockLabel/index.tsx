import { type TypographyProps } from '@mui/material'
import { useMemo } from 'react'
import { Label } from 'src/components/MUIComponents'

interface LabelProps extends TypographyProps {
  number: number
  compareNumber?: number
}
const StockLabel = (props: LabelProps): JSX.Element => {
  const { number, compareNumber = 0, children, ...rest } = props
  const type = useMemo(() => {
    if (number === compareNumber) {
      return 'warning'
    }
    if (number > compareNumber) {
      return 'success'
    }
    return 'error'
  }, [number, compareNumber])

  return (
    <Label type={type} {...rest} fontSize={14} fontWeight={600}>
      {children}
    </Label>
  )
}

export default StockLabel
