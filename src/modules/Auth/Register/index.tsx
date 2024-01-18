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
  styled,
  useTheme
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { useRegisterMutation } from 'src/services/user.services'
import schema from './schema'
import { useLocalStorage } from 'src/hooks'

interface FormBody {
  username: string
  password: string
  confirmPassword: string
  name: string
}

const Register = (): JSX.Element => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [onRegister] = useRegisterMutation()
  const [value, setLocalValue] = useLocalStorage('tokens', {})
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
        Sign Up
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
          label='Name'
          autoComplete='current-password'
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
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
          <Typography fontWeight={600}>Sign Up</Typography>
        </Button>
        <Grid container justifyContent='flex-end'>
          <CustomLink to='/login'>Have an account? Sign In</CustomLink>
        </Grid>
      </Box>
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
