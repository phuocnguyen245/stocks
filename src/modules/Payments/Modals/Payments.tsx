/* eslint-disable @typescript-eslint/indent */
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
import NumberFormat from 'src/components/MUIComponents/NumberFormat'
import { useAlert } from 'src/hooks'
import { useCreatePaymentMutation, useUpdatePaymentMutation } from 'src/services/payment.services'
import schema from './schema'
import { type Payments } from 'src/Models'

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
  editData?: Payments
  handleClose: () => void
  refetch: () => void
}

const PaymentModal = ({ open, editData, refetch, handleClose }: PaymentModalProps): JSX.Element => {
  const textFieldRef = useRef(null)
  const [createPayment] = useCreatePaymentMutation()
  const [updatePayment] = useUpdatePaymentMutation()
  const [checked, setChecked] = useState<boolean>(true)
  const alert = useAlert()

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormBody>({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (editData) {
      setValue('balance', editData.balance)
      setValue('date', editData.date)
      setValue('name', editData.name)
      setValue('type', editData.type ? 0 : 1)
      setChecked(editData.type === 0)
    }
  }, [editData])

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

  const materialUiTextFieldProps = {
    required: true,
    error: !!errors?.balance,
    helperText: errors.balance?.message,
    fullWidth: true,
    label: 'Balance',
    sx: { margin: '8px 0' },
    ...register('balance'),
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setValue('balance', Number(e.target.value.split(',').join('')))
    }
  }

  const handleSave = async (data: FormBody): Promise<void> => {
    try {
      const { name, date, balance } = data
      const type = checked ? 0 : 1
      let response
      if (editData?.balance) {
        response = await updatePayment({
          name,
          date,
          type,
          balance: Number(balance),
          _id: editData?._id
        }).unwrap()
      } else {
        response = await createPayment({
          name,
          date,
          type,
          balance: Number(balance)
        }).unwrap()
      }
      if (response) {
        refetch()
        handleClose()
        alert({ message: response.message, variant: 'success' })
        reset()
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert({ message: error?.message, variant: 'error' })
    }
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
            <NumberFormat {...materialUiTextFieldProps} TextField={TextField} />
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
