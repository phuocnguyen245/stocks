import * as yup from 'yup'

const schema = yup.object().shape({
  password: yup
    .string()
    .min(5, 'Password must has more than 5 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], "Confirm Passwords doesn't match")
    .required('Confirm Password is required')
})
export default schema
