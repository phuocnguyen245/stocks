import * as yup from 'yup'

const schema = yup.object().shape({
  username: yup
    .string()
    .min(5, 'Username must has more than 5 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must has more than 5 characters')
    .required('Password is required')
})
export default schema
