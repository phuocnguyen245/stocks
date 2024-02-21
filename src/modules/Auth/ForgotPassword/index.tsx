import { yupResolver } from '@hookform/resolvers/yup'
import { LockOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { useAlert, useModals } from 'src/hooks'
import { useUpdatePasswordMutation } from 'src/services/user.services'
import AcceptModal from '../Modals/AcceptModal'
import schema from './schema'

interface FormBody {
  password: string
  confirmPassword: string
}

const ForgotPassword = (): JSX.Element => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [updatePassword] = useUpdatePasswordMutation()
  const { open, toggle } = useModals()
  const alert = useAlert()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormBody>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (values: FormBody): Promise<void> => {
    try {
      const token = searchParams.get('token')
      if (!token) {
        alert({
          message: 'Your token is not available, please try to get new link',
          variant: 'error'
        })
      }
      const response = await updatePassword({
        password: values.password.trim(),
        token: token?.trim()
      }).unwrap()
      if (response.message) {
        reset()
        navigate('/login')
      }
      alert({ message: 'Password has been reset', variant: 'success' })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 400 || error.status === 401 || error.status === 404) {
        alert({ message: error?.data?.message, variant: 'error' })
      } else {
        toggle()
      }
    }
  }

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlined color='action' />
      </Avatar>
      <Typography component='h1' variant='h5'>
        Forgot Password
      </Typography>
      <Box component='form' noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
        <TextField
          margin='normal'
          required
          fullWidth
          label='Password'
          type='password'
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          label='Confirm Password'
          type='password'
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
          <Typography fontWeight={600}>Submit</Typography>
        </Button>
      </Box>
      <AcceptModal open={open} toggle={toggle} />
    </>
  )
}

export default ForgotPassword
