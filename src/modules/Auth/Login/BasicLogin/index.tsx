import { yupResolver } from '@hookform/resolvers/yup'
import { LoginOutlined } from '@mui/icons-material'
import {
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
import { useAlert, useLocalStorage } from 'src/hooks'
import { useLoginMutation } from 'src/services/user.services'
import schema from '../schema'
import { Link } from 'react-router-dom'

interface FormBody {
  username: string
  password: string
}

const BasicLogin = (): JSX.Element => {
  const [value, setLocalValue] = useLocalStorage('tokens', {})
  const navigate = useNavigate()
  const [onLogin] = useLoginMutation()
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
        alert({ message: JSON.stringify(error), variant: 'error' })
      }
    }
  }
  return (
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
        label={<FormattedMessage id='label.password' />}
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
        label={<FormattedMessage id='label.remember.me' />}
      />
      <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
        <LoginOutlined />
        <Typography fontWeight={600} ml={1}>
          <FormattedMessage id='label.sign.in' />
        </Typography>
      </Button>
      <Grid container>
        <Grid item xs>
          <CustomLink to='/email'>
            <FormattedMessage id='label.forgot.password' />?
          </CustomLink>
        </Grid>
        <CustomLink to='/register'>
          <FormattedMessage id='text.dont.have.an.account' />? &nbsp;
          <FormattedMessage id='label.sign.up' />
        </CustomLink>
      </Grid>
    </Box>
  )
}

export default BasicLogin
const CustomLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    color: theme.palette.primary.dark
  }
}))
