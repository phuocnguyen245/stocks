/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup'
import { Email, Send } from '@mui/icons-material'
import { Avatar, Box, Button, TextField, Typography, styled } from '@mui/material'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { useAlert, useModals } from 'src/hooks'
import { useCheckEmailMutation } from 'src/services/user.services'
import AcceptModal from '../Modals/AcceptModal'
import schema from './schema'
import { Link, useNavigate } from 'react-router-dom'
interface FormBody {
  email: string
}

const EnterEmail = (): JSX.Element => {
  const navigate = useNavigate()
  const [checkEmail] = useCheckEmailMutation()
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
      const response = await checkEmail({ email: values.email.trim() }).unwrap()
      reset()
      alert({ message: response.message, variant: 'success' })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 404) {
        alert({ message: 'Email not exists', variant: 'error' })
      } else {
        toggle()
      }
    }
  }

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <Email color='action' />
      </Avatar>
      <Typography component='h1' variant='h5'>
        <FormattedMessage id='label.enter.email' />
      </Typography>
      <Box component='form' noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
        <TextField
          margin='normal'
          required
          fullWidth
          label='Email'
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
          <Send />
          <Typography fontWeight={600} ml={1}>
            <FormattedMessage id='label.submit' />
          </Typography>
        </Button>
        <Box width='100%' textAlign='right'>
          <CustomLink
            to={'..'}
            onClick={(e) => {
              e.preventDefault()
              navigate(-1)
            }}
          >
            <FormattedMessage id='label.go.back' />
          </CustomLink>
        </Box>
      </Box>
      <AcceptModal open={open} toggle={toggle} />
    </>
  )
}

export default EnterEmail
const CustomLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    color: theme.palette.primary.dark
  }
}))
