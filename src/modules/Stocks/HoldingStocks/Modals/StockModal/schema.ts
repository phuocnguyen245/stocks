import * as yup from 'yup'

const schema = yup.object().shape({
  code: yup.string().required('Code is required'),
  sector: yup.string().required('Sector is required'),
  volume: yup.number().moreThan(0, 'Volume must be greater than 0').required('Volume is required'),
  orderPrice: yup.number().moreThan(0, 'Order Price must be greater than 0').nullable(),
  sellPrice: yup.number().moreThan(0, 'Selling Price must be greater than 0').nullable(),
  date: yup.string().required('Date is required')
})
export default schema
