import { yupResolver } from '@hookform/resolvers/yup'
import { HowToRegOutlined, Login } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  styled
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { useAlert, useLocalStorage, useModals } from 'src/hooks'
import { useRegisterMutation } from 'src/services/user.services'
import AcceptModal from '../Modals/AcceptModal'
import schema from './schema'

interface FormBody {
  username: string
  password: string
  confirmPassword: string
  name: string
  email: string
}

const Register = (): JSX.Element => {
  const navigate = useNavigate()
  const [onRegister] = useRegisterMutation()
  const [value, setLocalValue] = useLocalStorage('tokens', {})
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
      const response = await onRegister({ ...values }).unwrap()
      if (response.data) {
        reset()
        setLocalValue(response.data?.tokens)
        navigate('/stocks')
      }
      alert({ message: 'Register Successfully', variant: 'success' })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 400) {
        alert({ message: 'User already exists', variant: 'error' })
      } else {
        toggle()
      }
    }
  }

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <HowToRegOutlined color='action' />
      </Avatar>
      <Typography component='h1' variant='h5'>
        <FormattedMessage id='label.sign.up' />
      </Typography>
      <Box component='form' noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
        <TextField
          margin='normal'
          required
          fullWidth
          label={<FormattedMessage id='label.username' />}
          autoComplete='username'
          autoFocus
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          label={<FormattedMessage id='label.email' />}
          autoComplete='email'
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          label={<FormattedMessage id='label.name' />}
          autoComplete='current-password'
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          label={<FormattedMessage id='label.password' />}
          type='password'
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          label={<FormattedMessage id='label.confirm.password' />}
          type='password'
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        <FormControlLabel
          control={
            <Checkbox
              value='remember'
              color='primary'
              sx={{
                '& .MuiSvgIcon-root': {
                  fill: 'primary.main'
                }
              }}
              defaultChecked
            />
          }
          label={<FormattedMessage id='label.remember.me' />}
        />
        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
          <Login />
          <Typography fontWeight={600} ml={1}>
            <FormattedMessage id='label.sign.up' />
          </Typography>
        </Button>
        <Grid container justifyContent='flex-end'>
          <CustomLink to='/login'>
            <FormattedMessage id='text.have.an.account' />? &nbsp;
            <FormattedMessage id='label.sign.in' />
          </CustomLink>
        </Grid>
      </Box>
      <AcceptModal open={open} toggle={toggle} />
    </>
  )
}

const CustomLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

export default Register
