import { type TextFieldProps } from '@mui/material'
import { forwardRef, type ComponentType } from 'react'
import { NumericFormat, type NumericFormatProps as NFP } from 'react-number-format'

interface NumberFormatProps extends NFP {
  TextField?: ComponentType<TextFieldProps>
}

const NumberFormatCustom = forwardRef((props: NumberFormatProps, ref) => {
  const { TextField: CustomTextField, ...otherProps } = props

  return (
    <NumericFormat
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customInput={CustomTextField as any}
      thousandSeparator=','
      decimalSeparator='.'
      {...otherProps}
    />
  )
})

NumberFormatCustom.displayName = 'NumberFormatCustom'

export default NumberFormatCustom
