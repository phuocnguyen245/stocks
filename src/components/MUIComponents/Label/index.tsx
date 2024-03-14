import { Typography, type TypographyProps } from '@mui/material'
import { type LabelType } from 'src/models'
import { getBgColor, getColor } from 'src/models/constants'
interface LabelProps extends TypographyProps {
  type?: LabelType
}

const Label = ({ type = 'primary', children, ...props }: LabelProps): JSX.Element => {
  return (
    <Typography
      color={getColor(type)}
      bgcolor={getBgColor(type)}
      textAlign='center'
      paddingX={0.75}
      paddingY={0.5}
      margin={0}
      borderRadius={1}
      {...props}
    >
      {children}
    </Typography>
  )
}

export default Label
