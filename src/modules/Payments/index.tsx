import { Edit } from '@mui/icons-material'
import { Box, Button, Container, IconButton, Typography } from '@mui/material'
import { memo, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { ConfirmPopup, Helmet, Table } from 'src/components'
import { Label } from 'src/components/MUIComponents'
import type { DefaultPagination, TableHeaderBody } from 'src/components/Table/type'
import useModal from 'src/hooks/useModals'
import type { LabelType, Payments } from 'src/models'
import { useDeletePaymentMutation, useGetPaymentQuery } from 'src/services/payment.services'
import { formatVND } from 'src/utils'
import PaymentsModal from './Modals/Payments'

const Payment = (): JSX.Element => {
  const [deletePayment, { isLoading: isLoadingDelete, isSuccess }] = useDeletePaymentMutation()
  const { open, toggle } = useModal()

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

  const onEdit = async (row: Payments): Promise<void> => {
    setEditData(row)
    toggle()
  }

  const onDelete = async (row: Payments): Promise<void> => {
    await deletePayment({ _id: row._id })
      .unwrap()
      .then(async () => {
        await refetch()
      })
    return setData(data.filter((item) => item._id !== row._id))
  }

  const table: Array<TableHeaderBody<Payments>> = [
    {
      name: 'name',
      title: <FormattedMessage id='label.name' />
    },
    {
      name: 'type',
      title: <FormattedMessage id='label.type' />,
      render: (row) => {
        const options = {
          0: {
            type: 'success',
            message: 'Top up'
          },
          1: {
            type: 'error',
            message: 'Withdraw'
          }
        }
        const type = row.type as 0 | 1
        return (
          <Label type={options[type].type as LabelType} sx={{ maxWidth: '100px' }}>
            {options[type].message}
          </Label>
        )
      }
    },
    {
      name: 'balance',
      title: <FormattedMessage id='label.balance' />,
      render: (row) => <Typography>{formatVND(row.balance)}</Typography>
    },
    {
      name: '',
      title: '',
      align: 'right',
      render: (row) => {
        return (
          <>
            <Box display='flex' justifyContent='flex-end'>
              <IconButton color='info' onClick={() => onEdit(row)}>
                <Edit />
              </IconButton>
              <ConfirmPopup
                row={row}
                isLoading={isLoadingDelete}
                isSuccess={isSuccess}
                onConfirm={() => onDelete(row)}
              />
            </Box>
          </>
        )
      }
    }
  ]

  return (
    <>
      <Helmet title='title.payments' />

      <Container sx={{ borderRadius: 0 }}>
        <Box pt={2} pb={0} display='flex' alignItems='center' justifyContent='flex-end'>
          <Button variant='contained' onClick={toggle} sx={{ mt: 8 }}>
            <FormattedMessage id='label.create' />
          </Button>
        </Box>
        <Box sx={{ py: 2 }}>
          <Table
            data={data}
            table={table}
            isLoading={isLoading}
            totalItems={paymentData?.data?.totalItems ?? 0}
            pagination={pagination}
            onSetPagination={setPagination}
          />
          <PaymentsModal open={open} handleClose={toggle} refetch={refetch} editData={editData} />
        </Box>
      </Container>
    </>
  )
}

export default memo(Payment)
