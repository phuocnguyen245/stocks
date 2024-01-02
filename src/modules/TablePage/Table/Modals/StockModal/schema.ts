import * as yup from 'yup'

const schema = yup.object().shape({
  code: yup.string().required('Code is required'),
  quantity: yup
    .number()
    .moreThan(0, 'Quantity must be greater than 0')
    .required('Quantity is required'),
  purchasePrice: yup.number().moreThan(0, 'Purchase Price must be greater than 0').nullable(),
  sellPrice: yup.number().moreThan(0, 'Selling Price must be greater than 0').nullable(),
  date: yup.string().required('Date is required')
})
export default schema
