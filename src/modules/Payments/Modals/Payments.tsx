import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Container,
  Dialog,
  Divider,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { type MomentInput } from 'moment'
import { memo, useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { useCreatePaymentMutation } from 'src/services/payment.services'
import schema from './schema'

enum Type {
  BUY = 0,
  SELL = 1
}

interface FormBody {
  name: string
  type: Type
  date: string
  balance?: number | null
}

interface PaymentModalProps {
  open: boolean
  handleClose: () => void
  refetch: () => void
}

const PaymentModal = ({ open, refetch, handleClose }: PaymentModalProps): JSX.Element => {
  const textFieldRef = useRef(null)
  const [createPayment] = useCreatePaymentMutation()
  const [checked, setChecked] = useState<boolean>(true)

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<FormBody>({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (open && textFieldRef.current) {
      const textField = textFieldRef.current as HTMLInputElement
      textField.focus()
    }

    setValue('date', moment(Date.now()).toISOString())
    setValue('type', 0)
  }, [open])

  const onChangeDate = (date: MomentInput): void => {
    setValue('date', moment(date).toISOString())
  }

  const onChangeType = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue('type', e.target.checked ? 0 : 1)
    setChecked(e.target.checked)
  }

  const handleSave = async (data: FormBody): Promise<void> => {
    try {
      const { name, date, type, balance } = data

      const response = await createPayment({ name, date, type, balance: Number(balance) }).unwrap()
      if (response.data) {
        refetch()
        handleClose()
      }
      reset()
    } catch (error) {}
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <Container maxWidth='sm' sx={{ padding: '0 !important' }}>
        <Box py={3} px={0} component='form' onSubmit={handleSubmit(handleSave)} id='stock-form'>
          <Box paddingBottom={2} paddingX={4}>
            <Typography>Payment</Typography>
          </Box>
          <Divider />
          <Box paddingX={4} paddingY={2} component='form'>
            <TextField
              fullWidth
              label='Name'
              autoFocus
              inputRef={textFieldRef}
              required
              sx={{ margin: '8px 0' }}
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <DatePicker
              label='Date'
              sx={{ width: '100%', margin: '8px 0' }}
              defaultValue={moment(Date.now())}
              onChange={onChangeDate}
            />

            <TextField
              fullWidth
              label='Balance'
              type='number'
              defaultValue={0}
              required
              sx={{ margin: '8px 0' }}
              {...register('balance')}
              error={!!errors?.balance}
              helperText={errors.balance?.message}
            />
            <Box display='flex' alignItems='center'>
              <Typography>Type:</Typography>
              <Switch
                checked={checked}
                required
                sx={{ margin: '8px 0' }}
                color='primary'
                onChange={onChangeType}
              />
            </Box>
          </Box>
          <Divider />
          <Box textAlign='end' paddingX={4} paddingTop={3}>
            <Button color='warning' variant='contained' onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant='contained'
              sx={{ marginLeft: 2 }}
              type='submit'
              form='stock-form'
              autoFocus
            >
              Save
            </Button>
          </Box>
        </Box>
      </Container>
    </Dialog>
  )
}

export default memo(PaymentModal)
