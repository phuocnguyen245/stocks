import { useEffect, useState } from 'react'
import type { Payments } from 'src/Models'
import Table from 'src/components/Table'
import type { DefaultPagination, TableHeaderBody } from 'src/components/Table/type'
import {
  useDeletePaymentMutation,
  useGetPaymentQuery,
  useUpdatePaymentMutation
} from 'src/services/payment.services'

const StocksDetail = (): JSX.Element => {
  const [updatePayment] = useUpdatePaymentMutation()
  const [deletePayment] = useDeletePaymentMutation()

  const [data, setData] = useState<Payments[]>([])
  const [editData, setEditData] = useState<Payments>()
  const [pagination, setPagination] = useState<DefaultPagination>({
    page: 0,
    size: 10
  })

  const {
    data: paymentData,
    isLoading,
    refetch
  } = useGetPaymentQuery({ ...pagination }, { refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (paymentData?.data?.data?.length) {
      setData(paymentData?.data?.data)
    }
  }, [paymentData])

  const onEdit = async (row: Payments): Promise<void> => {}

  const onDelete = async (row: Payments): Promise<void> => {
    await deletePayment({ _id: row._id })
      .unwrap()
      .then(async () => {
        await refetch()
      })
    return setData(data.filter((item) => item._id !== row._id))
  }

  const table: Array<TableHeaderBody<Payments>> = []

  return (
    <Table
      data={data}
      table={table}
      isLoading={isLoading}
      totalItems={paymentData?.data?.totalItems ?? 0}
      onDelete={onDelete}
      onEdit={onEdit}
      pagination={pagination}
      onSetPagination={setPagination}
    />
  )
}

export default StocksDetail
