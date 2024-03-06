import { type SnackbarKey, useSnackbar, type VariantType, type EnqueueSnackbar } from 'notistack'
import { type ReactNode } from 'react'
interface AlertProps {
  message: ReactNode
  variant: VariantType
}

const useAlert = (): (({ message, variant }: AlertProps) => SnackbarKey) => {
  const { enqueueSnackbar } = useSnackbar()

  return ({ message, variant }: AlertProps) => {
    return enqueueSnackbar(message ?? 'Successfully', {
      variant: variant ?? 'success',
      autoHideDuration: 5000,
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top'
      },
      className: `alert ${variant}`
    })
  }
}

export default useAlert
