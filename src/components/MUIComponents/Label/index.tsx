import { Typography, type TypographyProps } from '@mui/material'
import React, { useMemo } from 'react'

type Type = 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'info'
interface LabelProps extends TypographyProps {
  type: Type
}
const Label = ({ type, children }: LabelProps): JSX.Element => {
  const color: string = useMemo(() => {
    const hexColors = {
      success: ' #137714',
      error: ' #d41834',
      warning: '#9e5718',
      primary: '#ece0f5',
      secondary: '#D3D3D3',
      info: '#07595a'
    }
    return hexColors[type]
  }, [type])

  const bgColor: string = useMemo(() => {
    const hexColors = {
      success: ' #7de67d',
      error: ' #FFB6C1',
      warning: '#FFDAB9',
      primary: '#a41bfa',
      secondary: '#D3D3D3',
      info: '#1fecf0'
    }
    return hexColors[type]
  }, [type])

  return (
    <Typography
      color={color}
      bgcolor={bgColor}
      textAlign='center'
      padding={0}
      margin={0}
      borderRadius={1}
    >
      {children}
    </Typography>
  )
}

export default Label
