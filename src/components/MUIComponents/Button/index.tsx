import * as React from 'react'
import SaveIcon from '@mui/icons-material/Save'
import Stack from '@mui/material/Stack'
import {
  Button,
  CircularProgress,
  Typography,
  type ButtonProps as MUIButtonProps
} from '@mui/material'

interface ButtonProps extends MUIButtonProps {
  isLoading?: boolean
}
const LoadingButton = ({ isLoading, ...props }: ButtonProps): JSX.Element => {
  return (
    <Button {...props} style={{ opacity: isLoading ? 0.5 : 1 }} disabled={isLoading}>
      {isLoading && (
        <CircularProgress
          color='inherit'
          sx={{
            width: '26px !important',
            height: '26px !important',
            mr: 1,
            transform: 'all 0.25s ease'
          }}
        />
      )}
      {props.children}
    </Button>
  )
}
export default LoadingButton
