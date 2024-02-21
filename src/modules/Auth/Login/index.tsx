import { yupResolver } from '@hookform/resolvers/yup'
import { LockOutlined } from '@mui/icons-material'
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
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { useAlert, useLocalStorage } from 'src/hooks'
import useModal from 'src/hooks/useModals'
import { useLoginMutation } from 'src/services/user.services'
import AcceptModal from '../Modals/AcceptModal'
import schema from './schema'

interface FormBody {
  username: string
  password: string
}

const Login = (): JSX.Element => {
  const [value, setLocalValue] = useLocalStorage('tokens', {})
  const navigate = useNavigate()
  const [onLogin] = useLoginMutation()
  const alert = useAlert()
  const { open, toggle } = useModal()
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
      const response = await onLogin({ ...values }).unwrap()
      if (response.data) {
        setLocalValue(response.data?.tokens)
        navigate('/stocks')
        reset()
      }
      alert({ message: 'Login successfully', variant: 'success' })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 404) {
        alert({ message: 'Username or password is not correct', variant: 'error' })
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
        Sign in
      </Typography>
      <Box component='form' noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
        <TextField
          margin='normal'
          required
          fullWidth
          label='Username'
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
          label='Password'
          type='password'
          autoComplete='current-password'
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
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
          label='Remember me'
        />
        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
          <Typography fontWeight={600}>Sign In</Typography>
        </Button>
        <Grid container>
          <Grid item xs>
            <CustomLink to='/email'>Forgot password?</CustomLink>
          </Grid>
          <CustomLink to='/register'>Don&apos;t have an account? Sign Up</CustomLink>
        </Grid>
      </Box>
      <AcceptModal open={open} toggle={toggle} />
    </>
  )
}

export default Login

const CustomLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))
