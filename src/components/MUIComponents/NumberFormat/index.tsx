import { TextField, type TextFieldProps } from '@mui/material'
import { NumericFormat, type NumericFormatProps as NFP } from 'react-number-format'

interface NumberFormatCustomProps extends NFP {
  textFieldProps?: TextFieldProps
}

const NumberFormatCustom = (props: NumberFormatCustomProps): JSX.Element => {
  const { ...otherProps } = props

  const CustomTextFieldNumeric = (props: TextFieldProps): JSX.Element => {
    return <TextField {...props} />
  }

  return (
    <NumericFormat
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customInput={CustomTextFieldNumeric as any}
      thousandSeparator=','
      decimalSeparator='.'
      {...otherProps}
    />
  )
}

export default NumberFormatCustom
