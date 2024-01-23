import { Box, Grid, Typography, useTheme, type Theme } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import type { LabelType, Asset } from 'src/models'
import { Label, Skeleton } from 'src/components/MUIComponents'
import { PaymentService } from 'src/services/payment.services'
import { StockService } from 'src/services/stocks.services'
import { useAppSelector } from 'src/store'
import { convertToDecimal, formatVND } from 'src/utils'
import Chart from '../Chart'

const TableFooter = (): JSX.Element => {
  const theme: Theme = useTheme()
  const { isOpenSidebar } = useAppSelector((state) => state.Stocks)
  const [asset, setAsset] = useState<Asset>({
    topUp: 0,
    waiting: 0,
    order: 0,
    selling: 0,
    available: 0,
    net: 0,
    profitOrLost: 0,
    investedValue: 0,
    marketValue: 0
  })
  const { isRefetchStock } = useAppSelector((state) => state.Stocks)

  const {
    data: assetData,
    isLoading: isLoadingAsset,
    refetch
  } = PaymentService.useGetAssetQuery({}, { refetchOnMountOrArgChange: true })

  const { data: currentData, isLoading: isLoadingCurrent } = StockService.useGetCurrentStocksQuery(
    {},
    { refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    void (isRefetchStock && refetch())
  }, [isRefetchStock])

  useEffect(() => {
    if (assetData?.data) {
      const responseAsset = assetData.data
      const topUp = responseAsset?.payment ?? 0
      const waiting = responseAsset?.stock.waiting * 1000
      const order = responseAsset?.stock.order * 1000
      const selling = responseAsset?.stock.sell * 1000

      setAsset((prev) => ({
        ...prev,
        topUp,
        waiting,
        order,
        selling,
        available: topUp + selling - order - waiting
      }))
    }
  }, [assetData])

  useEffect(() => {
    if (currentData?.data?.data) {
      let investedValue = 0
      let marketValue = 0
      currentData?.data?.data?.forEach((stock) => {
        marketValue += (stock?.marketPrice ?? 0) * stock?.volume * 1000
        investedValue += (stock?.averagePrice ?? 0) * (stock?.volume ?? 0) * 1000
      })

      setAsset((prev) => {
        return {
          ...prev,
          marketValue: convertToDecimal(marketValue),
          investedValue: convertToDecimal(investedValue),
          profitOrLost: convertToDecimal(
            ((prev.selling - prev.order + marketValue) / (prev.topUp ?? 1)) * 100
          ),
          net: prev.topUp + prev.selling - prev.order + marketValue
        }
      })
    }
  }, [assetData, currentData])

  const isLoading = useMemo(() => {
    return isLoadingAsset && isLoadingCurrent
  }, [isLoadingAsset, isLoadingCurrent])

  const SkeletonRender = (): JSX.Element => {
    return <Skeleton width='100px' height='40px' animation='wave' />
  }

  const renderLabel = (message: number | string, first = 1, compare = 0): JSX.Element => {
    const check = Number(first) === compare ? 'equal' : first > compare ? 'more' : 'less'

    const options = {
      more: {
        type: 'success',
        message
      },
      equal: {
        type: 'warning',
        message
      },
      less: {
        type: 'error',
        message
      }
    }

    return (
      <Label type={options[check].type as LabelType} fontWeight={600}>
        {message}
      </Label>
    )
  }

  return (
    <Box>
      <Box
        position='fixed'
        width={`calc(100vw - ${isOpenSidebar ? '340px' : '0px'})`}
        height='auto'
        bottom={0}
        py={3}
        display='flex'
        alignItems='center'
        bgcolor={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f9f3fe'}
        boxShadow='rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px'
      >
        <Grid
          container
          alignItems='center'
          columnSpacing={2}
          rowSpacing={1}
          justifyContent='center'
        >
          <Grid item>
            <Grid container alignItems='center'>
              <Grid item>
                <Typography fontWeight={600}>
                  <FormattedMessage id='label.top.up' />
                  :&nbsp;
                </Typography>
              </Grid>
              <Grid item>
                <Typography fontWeight={600}>
                  {isLoading ? <SkeletonRender /> : renderLabel(formatVND(asset.topUp))}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems='center'>
              <Grid item>
                <Typography fontWeight={600}>
                  <FormattedMessage id='label.net.asset.value' />
                  :&nbsp;
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  {isLoading ? <SkeletonRender /> : renderLabel(formatVND(asset.net))}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems='center'>
              <Grid item>
                <Typography fontWeight={600}>
                  <FormattedMessage id='label.available.cash' />
                  :&nbsp;
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  {isLoading ? <SkeletonRender /> : renderLabel(formatVND(asset.available))}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems='center'>
              <Grid item>
                <Typography fontWeight={600}>
                  <FormattedMessage id='label.profit.loss' />
                  :&nbsp;
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  {isLoading ? (
                    <SkeletonRender />
                  ) : (
                    renderLabel(`${asset.profitOrLost || 0}%`, asset.profitOrLost)
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems='center'>
              <Grid item>
                <Typography fontWeight={600}>
                  <FormattedMessage id='label.invested.value' />
                  :&nbsp;
                </Typography>
              </Grid>
              <Grid item>
                <Typography fontWeight={600}>
                  {isLoading ? (
                    <SkeletonRender />
                  ) : (
                    renderLabel(formatVND(asset.investedValue), asset.profitOrLost)
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems='center'>
              <Grid item>
                <Typography fontWeight={600}>
                  <FormattedMessage id='label.market.value' />
                  :&nbsp;
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  {isLoading ? (
                    <SkeletonRender />
                  ) : (
                    renderLabel(formatVND(asset.marketValue), asset.profitOrLost)
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default TableFooter
