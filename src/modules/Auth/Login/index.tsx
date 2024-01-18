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
import { useLoginMutation } from 'src/services/user.services'
import schema from './schema'
import { useLocalStorage } from 'src/hooks'

interface FormBody {
  username: string
  password: string
}

const Login = (): JSX.Element => {
  const [value, setLocalValue] = useLocalStorage('tokens', {})
  const navigate = useNavigate()
  const [onLogin] = useLoginMutation()
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
    } catch (error) {
      console.log(error)
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
            <CustomLink to='#'>Forgot password?</CustomLink>
          </Grid>
          <CustomLink to='/register'>Don&apos;t have an account? Sign Up</CustomLink>
        </Grid>
      </Box>
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
