import { Sync } from '@mui/icons-material'
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Skeleton } from 'src/components/MUIComponents'
import { useAlert, useIsLogin, useModals } from 'src/hooks'
import { useRefreshStocksMutation, useRefreshTimeQuery } from 'src/services/stocks.services'
import { useAppSelector } from 'src/store'
import { refetchStocks } from 'src/store/slices/stockSlice'

const RefreshTime = (): JSX.Element => {
  const { isMdWindow } = useAppSelector((state) => state.Stocks)
  const { open, show, hide } = useModals()
  const alert = useAlert()
  const dispatch = useDispatch()

  const [refreshTime, setRefreshTime] = useState<string>()
  const isLogin = useIsLogin()

  const [refreshStocks] = useRefreshStocksMutation()
  const { data: date, isLoading } = useRefreshTimeQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 1000 * 60 * 10,
    skip: !isLogin
  })

  useEffect(() => {
    if (date?.data) {
      return setRefreshTime(moment(date.data.date).utcOffset(420).format('HH:mm DD/MM'))
    }
    setRefreshTime(moment().utcOffset(420).format('HH:mm DD/MM'))
  }, [date])

  const onRefresh = async (): Promise<void> => {
    try {
      const response = await refreshStocks().unwrap()
      if (response?.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        alert({ variant: 'success', message: response?.message })
        setRefreshTime(
          moment(response?.data.date)
            .utcOffset(420)
            .format('HH:mm DD/MM')
        )
        localStorage.setItem('refreshTime', response?.data.date)
        dispatch(refetchStocks(true))
        hide()
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert({ message: error.data.message, variant: 'error' })
    }
  }

  const modals = (
    <Box px={2} py={1}>
      {isLogin && (
        <>
          <Typography>Do you want to refresh all stocks? </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }} gap={2}>
            <Button variant='contained' color='info' onClick={hide}>
              No
            </Button>
            <Button variant='contained' color='primary' onClick={onRefresh}>
              Yes
            </Button>
          </Box>
        </>
      )}
    </Box>
  )

  return (
    <Box
      alignItems='center'
      justifyContent='space-between'
      display='flex'
      marginRight={isMdWindow ? 0 : 2}
    >
      <Box order={isMdWindow ? 2 : 1}>
        <ClickAwayListener onClickAway={hide}>
          <Tooltip
            PopperProps={{
              disablePortal: true
            }}
            onClose={hide}
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={modals}
          >
            <IconButton
              onClick={show}
              color='primary'
              sx={{
                transition: 'transform 1s ease',
                transform: 'rotate(90deg)',
                '&:focus': {
                  transform: 'rotate(180deg)'
                }
              }}
            >
              <Sync />
            </IconButton>
          </Tooltip>
        </ClickAwayListener>
        <Skeleton
          width={70}
          sx={{ bgcolor: 'primary.100', borderRadius: 0.5, display: isLoading ? 'block' : 'none' }}
          variant='rectangular'
        />
      </Box>
      <Typography
        ml={0.25}
        whiteSpace='nowrap'
        display={isLoading ? 'none' : 'block'}
        order={isMdWindow ? 1 : 2}
      >
        {refreshTime}
      </Typography>
    </Box>
  )
}

export default RefreshTime
