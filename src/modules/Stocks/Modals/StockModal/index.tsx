import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Container, Dialog, Divider, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { type MomentInput } from 'moment'
import { memo, useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import type { Stock } from 'src/Models'
import { StockService, useCreateStockMutation } from 'src/services/stocks.services'
import { useAppDispatch } from 'src/store'
import { refetchStocks } from 'src/store/slices/stockSlice'
import schema from './schema'
import { Select } from 'src/components/MUIComponents'
import { FormattedMessage } from 'react-intl'

interface FormBody {
  code: string
  volume: number
  orderPrice?: number | null
  sellPrice?: number | null
  date: string
}

interface StockModalProps {
  open: boolean
  status: 0 | 1
  handleClose: () => void
  addData: (data: Stock) => void
}

const StockModal = ({ open, status, handleClose, addData }: StockModalProps): JSX.Element => {
  const textFieldRef = useRef(null)
  const dispatch = useAppDispatch()
  const [createStock] = useCreateStockMutation()

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const { data: stockData } = StockService.useGetCurrentStocksQuery({})

  useEffect(() => {
    if (open && textFieldRef.current) {
      const textField = textFieldRef.current as HTMLInputElement
      textField.focus()
    }
    if (status === 1) {
      setValue('sellPrice', null)
    } else {
      setValue('orderPrice', null)
    }
    setValue('date', moment(Date.now()).toISOString())
  }, [open, status])

  const onChangeDate = (date: MomentInput): void => {
    setValue('date', moment(date).toISOString())
  }

  const handleSave = async (value: FormBody): Promise<void> => {
    try {
      const { code, volume, orderPrice, sellPrice } = value
      const response = await createStock({
        code: code.toUpperCase(),
        volume,
        date: getValues('date'),
        ...(status === 1 ? { orderPrice } : { sellPrice }),
        status: status === 1 ? 'Buy' : 'Sell'
      }).unwrap()
      if (response.data) {
        reset()
        dispatch(refetchStocks(true))
        return addData({ ...response.data })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const option = useMemo(() => {
    if (status === 0) {
      if (stockData?.data?.data?.length) {
        return stockData?.data?.data?.map((stock: Stock) => ({
          id: stock._id,
          name: stock.code,
          value: stock.code
        }))
      }
      return []
    }
    return []
  }, [status])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          console.log('123')

          handleSubmit(handleSave)
        }
      }}
    >
      <Container maxWidth='sm' sx={{ padding: '0 !important' }}>
        <Box py={3} px={0} component='form' onSubmit={handleSubmit(handleSave)} id='stock-form'>
          <Box paddingBottom={2} paddingX={4}>
            <Typography>
              {status === 1 ? (
                <FormattedMessage id='label.buying' />
              ) : (
                <FormattedMessage id='label.selling' />
              )}
              &nbsp;
              <FormattedMessage id='label.stock' />
            </Typography>
          </Box>
          <Divider />
          <Box paddingX={4} paddingY={2} component='form'>
            {status === 1 ? (
              <TextField
                fullWidth
                label={<FormattedMessage id='label.code' />}
                autoFocus
                inputRef={textFieldRef}
                inputProps={{
                  autoFocus: true,
                  maxLength: 3,
                  style: { textTransform: 'uppercase' }
                }}
                required
                sx={{ margin: '8px 0' }}
                {...register('code')}
                error={!!errors.code}
                helperText={errors.code?.message}
              />
            ) : (
              <Select
                control={control}
                name='code'
                label={<FormattedMessage id='label.code' />}
                options={option}
              />
            )}
            <DatePicker
              label={<FormattedMessage id='label.date' />}
              sx={{ width: '100%', margin: '8px 0' }}
              defaultValue={moment(Date.now())}
              onChange={onChangeDate}
            />
            <TextField
              fullWidth
              label={<FormattedMessage id='label.volume' />}
              type='number'
              defaultValue={0}
              inputProps={{ min: 0 }}
              required
              sx={{ margin: '8px 0' }}
              {...register('volume')}
              error={!!errors.volume}
              helperText={errors.volume?.message}
            />
            {status === 1 ? (
              <TextField
                fullWidth
                label={<FormattedMessage id='label.order.price' />}
                type='number'
                defaultValue={0}
                required
                sx={{ margin: '8px 0' }}
                {...register('orderPrice')}
                error={!!errors?.orderPrice}
                helperText={errors.orderPrice?.message}
              />
            ) : (
              <TextField
                label={<FormattedMessage id='label.selling.price' />}
                fullWidth
                sx={{ margin: '8px 0' }}
                type='number'
                required
                defaultValue={0}
                {...register('sellPrice')}
                error={!!errors?.sellPrice}
                helperText={errors.sellPrice?.message}
              />
            )}
          </Box>
          <Divider />
          <Box textAlign='end' paddingX={4} paddingTop={3}>
            <Button color='secondary' variant='contained' onClick={handleClose}>
              <FormattedMessage id='label.cancel' />
            </Button>
            <Button
              variant='contained'
              sx={{ marginLeft: 2 }}
              type='submit'
              form='stock-form'
              autoFocus
            >
              <FormattedMessage id='label.save' />
            </Button>
          </Box>
        </Box>
      </Container>
    </Dialog>
  )
}

export default memo(StockModal)
