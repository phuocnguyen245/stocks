import * as yup from 'yup'

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  type: yup.number().required('Type is required'),
  date: yup.string().required('Date is required'),
  balance: yup.number().moreThan(0, 'Balance be greater than 0').nullable()
})
export default schema
