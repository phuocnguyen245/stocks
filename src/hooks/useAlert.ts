import { useSnackbar, type SnackbarKey, type VariantType } from 'notistack'
import { type ReactNode } from 'react'
interface AlertProps {
  message: ReactNode
  variant: VariantType
}

const useAlert = (): (({ message, variant }: AlertProps) => SnackbarKey) => {
  const { enqueueSnackbar } = useSnackbar()

  return ({ message, variant }: AlertProps) => {
    const showedMessage = (): string | ReactNode => {
      if (message) return message
      if (variant === 'success') return 'Successfully'
      if (variant === 'error') return 'Bad Request'
    }

    return enqueueSnackbar(showedMessage(), {
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
