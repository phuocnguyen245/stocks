import { yupResolver } from '@hookform/resolvers/yup'
import { Add, Remove } from '@mui/icons-material'
import {
  Box,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { type MomentInput } from 'moment'
import { memo, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import type { Stock, Target } from 'src/Models'
import InfinitySelectCode from 'src/components/InfilitySelectCode'
import { Button, Select } from 'src/components/MUIComponents'
import { useAlert } from 'src/hooks'
import { StockService, useCreateStockMutation } from 'src/services/stocks.services'
import { useAppDispatch, useAppSelector } from 'src/store'
import { onSellStock, refetchStocks } from 'src/store/slices/stockSlice'
import { convertToDecimal } from 'src/utils'
import { v4 as uuidV4 } from 'uuid'
import schema from './schema'
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

interface TargetItem extends Target {
  id: string
}

interface TargetState {
  take: TargetItem[]
  stop: TargetItem[]
}

const StockModal = ({ open, status, handleClose, addData }: StockModalProps): JSX.Element => {
  const textFieldRef = useRef(null)
  const dispatch = useAppDispatch()

  const { sellStock } = useAppSelector((state) => state.Stocks)
  const [createStock, { isLoading }] = useCreateStockMutation()
  const alert = useAlert()

  const init = { id: uuidV4(), name: '', price: 0, volume: 0 }

  const [target, setTarget] = useState<TargetState>({
    take: [{ id: uuidV4(), name: '', price: 0, volume: 0 }],
    stop: [{ id: uuidV4(), name: '', price: 0, volume: 0 }]
  })
  const [tradingStatus, setTradingStatus] = useState(0)

  useEffect(() => {
    setTradingStatus(status)
  }, [status])

  useEffect(() => {
    sellStock && setTradingStatus(0)
  }, [sellStock])

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
    if (sellStock) {
      setValue('code', sellStock.code)
      setValue('volume', sellStock.volume)
      setValue('orderPrice', null)
    }
    setValue('date', moment(Date.now()).toISOString())
  }, [open, status, sellStock])

  const onChangeDate = (date: MomentInput): void => {
    setValue('date', moment(date).toISOString())
  }

  const onCloseModal = (): void => {
    handleClose()
    handleClose()
    dispatch(onSellStock(null))
  }

  const handleSave = async (value: FormBody): Promise<void> => {
    try {
      const { code, volume, orderPrice, sellPrice } = value
      const response = await createStock({
        code: code.toUpperCase(),
        volume,
        date: getValues('date'),
        ...(tradingStatus === 1 ? { orderPrice } : { sellPrice }),
        status: tradingStatus === 1 ? 'Buy' : 'Sell',
        ...(tradingStatus === 1 && { take: target.take }),
        ...(tradingStatus === 1 && { stop: target.stop })
      }).unwrap()
      if (response.data) {
        reset()
        dispatch(refetchStocks(true))
        dispatch(onSellStock(undefined))
        alert({ message: response.message, variant: 'success' })
        setTarget({
          take: [{ id: uuidV4(), name: '', price: 0, volume: 0 }],
          stop: [{ id: uuidV4(), name: '', price: 0, volume: 0 }]
        })
        return onCloseModal()
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert({ message: error.data.message, variant: 'error' })
    }
  }

  const option = useMemo(() => {
    if (tradingStatus === 0) {
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
  }, [tradingStatus])

  const onAddTakeOrStop = (type: keyof TargetState): void => {
    return setTarget((prev) => ({ ...prev, [type]: [...prev[type], init] }))
  }

  const onRemoveTakeOrStop = (type: keyof TargetState, id: string): void => {
    return setTarget((prev) => ({ ...prev, [type]: prev[type].filter((t) => t.id !== id) }))
  }

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: keyof TargetState,
    id: string
  ): void => {
    const name = e.target.name
    const value = Number(e.target.value)

    setTarget((prev) => ({
      ...prev,
      [type]: prev[type].map((t) => {
        if (t.id === id) {
          return { ...t, [name]: value }
        }
        return { ...t }
      })
    }))
  }

  const onChangeInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const name = e.target.name
    const value = Number(e.target.value)
    setValue(name as keyof FormBody, value)
    const targetVolume = getValues('volume') ?? 0
    const targetPrice = getValues('orderPrice') ?? 0
    setTarget({
      stop: [
        {
          id: uuidV4(),
          name: '',
          price: convertToDecimal(((targetPrice ?? 0) * 96) / 100),
          volume: targetVolume / 2
        },
        {
          id: uuidV4(),
          name: '',
          price: convertToDecimal(((targetPrice ?? 0) * 92) / 100),
          volume: targetVolume
        }
      ],
      take: [
        {
          id: uuidV4(),
          name: '',
          price: convertToDecimal(((targetPrice ?? 0) * 104) / 100),
          volume: targetVolume
        }
      ]
    })
  }

  return (
    <Dialog
      open={Boolean(sellStock) || open}
      onClose={onCloseModal}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          handleSubmit(handleSave)
        }
      }}
    >
      <Container maxWidth='sm' sx={{ padding: '0 !important' }}>
        <Box py={3} px={0} component='form' onSubmit={handleSubmit(handleSave)} id='stock-form'>
          <Box paddingBottom={2} paddingX={4}>
            <Typography>
              {tradingStatus === 1 && !sellStock && <FormattedMessage id='label.buying' />}
              {(tradingStatus === 0 || sellStock) && <FormattedMessage id='label.selling' />}
              &nbsp;
              <FormattedMessage id='label.stock' />
            </Typography>
          </Box>
          <Divider />
          <Box paddingX={4} paddingY={2} component='form'>
            {tradingStatus === 1 ? (
              <InfinitySelectCode onSetData={setValue} />
            ) : (
              <Box pb={1}>
                <Select
                  control={control}
                  name='code'
                  label={<FormattedMessage id='label.code' />}
                  options={option}
                  required
                />
              </Box>
            )}
            <Box sx={{ width: '100%' }} py={1}>
              <DatePicker
                label={<FormattedMessage id='label.date' />}
                defaultValue={moment(Date.now())}
                onChange={onChangeDate}
                sx={{ width: '100%' }}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>

            <Grid container columnSpacing={0.75}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={<FormattedMessage id='label.volume' />}
                  type='number'
                  inputProps={{ min: 0 }}
                  required
                  sx={{ margin: '8px 0' }}
                  {...register('volume')}
                  onChange={onChangeInput}
                  error={!!errors.volume}
                  helperText={errors.volume?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {tradingStatus === 1 ? (
                  <TextField
                    fullWidth
                    label={<FormattedMessage id='label.order.price' />}
                    type='number'
                    required
                    inputProps={{ min: 0 }}
                    sx={{ margin: '8px 0' }}
                    {...register('orderPrice')}
                    onChange={onChangeInput}
                    error={!!errors?.orderPrice}
                    helperText={errors.orderPrice?.message}
                  />
                ) : (
                  <TextField
                    fullWidth
                    label={<FormattedMessage id='label.selling.price' />}
                    type='number'
                    required
                    sx={{ margin: '8px 0' }}
                    {...register('sellPrice')}
                    error={!!errors?.sellPrice}
                    helperText={errors.sellPrice?.message}
                  />
                )}
              </Grid>
            </Grid>

            {tradingStatus === 1 && (
              <Box mt={0.5}>
                <Typography mb={0.75}>Takes</Typography>
                {target.take.map((item, index) => (
                  <Grid
                    container
                    key={item.id}
                    pb={1.5}
                    alignItems='center'
                    justifyContent='space-between'
                    columnSpacing={0.75}
                    rowSpacing={2}
                  >
                    <Grid item xs={12} md={5.5}>
                      <TextField
                        fullWidth
                        label='Volume'
                        name='volume'
                        value={item.volume}
                        onChange={(e) => onChange(e, 'take', item.id)}
                        type='number'
                        inputProps={{ step: '0.1' }}
                      />
                    </Grid>
                    <Grid item xs={10} md={5.5}>
                      <TextField
                        fullWidth
                        label='Price'
                        name='price'
                        value={item.price}
                        onChange={(e) => onChange(e, 'take', item.id)}
                        type='number'
                        inputProps={{ step: '0.1' }}
                      />
                    </Grid>
                    <Grid item xs={2} md={1}>
                      {index === 0 ? (
                        <IconButton
                          sx={{ bgcolor: index === 0 ? 'primary.main' : 'error.main', p: 0 }}
                          onClick={() => onAddTakeOrStop('take' as keyof TargetState)}
                        >
                          <Add color='inherit' sx={{ width: '32px', height: '32px' }} />
                        </IconButton>
                      ) : (
                        <IconButton
                          sx={{ bgcolor: index === 0 ? 'primary.main' : 'error.main', p: 0 }}
                          onClick={() => onRemoveTakeOrStop('take', item.id)}
                        >
                          <Remove sx={{ width: '32px', height: '32px' }} />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Box>
            )}

            {tradingStatus === 1 && (
              <Box mt={0.5}>
                <Typography mb={0.75}>Stops</Typography>
                {target.stop.map((item, index) => (
                  <Grid
                    container
                    key={item.id}
                    pb={1.5}
                    alignItems='center'
                    justifyContent='space-between'
                    columnSpacing={0.75}
                  >
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label='Volume'
                        name='volume'
                        value={item.volume}
                        onChange={(e) => onChange(e, 'stop', item.id)}
                        type='number'
                        inputProps={{ step: '0.1' }}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label='Price'
                        name='price'
                        value={item.price}
                        onChange={(e) => onChange(e, 'stop', item.id)}
                        type='number'
                        inputProps={{ step: '0.1' }}
                        disabled
                      />
                    </Grid>
                  </Grid>
                ))}
              </Box>
            )}
          </Box>
          <Divider />
          <Box textAlign='end' paddingX={4} paddingTop={3}>
            <Button color='secondary' variant='contained' onClick={onCloseModal}>
              <FormattedMessage id='label.cancel' />
            </Button>
            <Button
              isLoading={isLoading}
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
