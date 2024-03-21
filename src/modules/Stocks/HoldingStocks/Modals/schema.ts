import * as yup from 'yup'

const schema = yup
  .object()
  .shape({
    code: yup.string().required('Code is required'),
    sector: yup.string().required('Sector is required'),
    volume: yup.lazy((value) =>
      value === ''
        ? yup.string().required()
        : yup.number().integer().positive().integer().required()
    ),
    orderPrice: yup.lazy((value) =>
      value === ''
        ? yup.string().required()
        : yup.number().moreThan(0, 'Order Price must be greater than 0').nullable()
    ),
    sellPrice: yup.lazy((value) =>
      value === ''
        ? yup.string().required()
        : yup.number().moreThan(0, 'Selling Price must be greater than 0').nullable()
    ),
    date: yup.string().required('Date is required')
  })
  .required()
export default schema
