import * as yup from 'yup'

const schema = yup.object().shape({
  email: yup.string().email().required('Email is required')
})
export default schema
