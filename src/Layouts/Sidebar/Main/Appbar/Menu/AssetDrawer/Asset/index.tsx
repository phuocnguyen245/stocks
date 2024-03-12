import { Box, Divider, Grid, Typography, useTheme, type Theme } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import type { Asset as IAsset, LabelType } from 'src/models'
import { Label, Skeleton } from 'src/components/MUIComponents'
import { PaymentService } from 'src/services/payment.services'
import { useGetCurrentStocksQuery } from 'src/services/stocks.services'
import { useAppSelector } from 'src/store'
import { convertToDecimal, formatVND } from 'src/utils'
import Charts from 'src/layouts/Sidebar/Main/Appbar/Menu/AssetDrawer/Asset/Charts'

const Asset = ({ open }: { open: boolean }): JSX.Element => {
  const theme: Theme = useTheme()
  const [asset, setAsset] = useState<IAsset>({
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
  } = PaymentService.useGetAssetQuery({}, { skip: !open, refetchOnMountOrArgChange: true })

  const { data: currentData, isLoading: isLoadingCurrent } = useGetCurrentStocksQuery(
    {},
    { skip: !open, refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    if (isRefetchStock && open) {
      void refetch()
    }
  }, [isRefetchStock, open])

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
      currentData.data.data?.forEach((stock) => {
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
    <Box
      sx={{ transition: 'all .25s ease', display: 'flex', flexDirection: 'column' }}
      height='100%'
    >
      <Box
        display='flex'
        alignItems={'flex-start'}
        flexDirection={'column'}
        bgcolor={theme.palette.mode === 'dark' ? 'grey.500' : '#f9f3fe'}
      >
        <Box sx={{ width: '100%', px: 2, py: 1 }}>
          <Grid container alignItems='center'>
            <Grid item>
              <Typography fontWeight={600}>
                <FormattedMessage id='label.top.up' />:
              </Typography>
              &nbsp;
            </Grid>
            <Grid item>{isLoading ? <SkeletonRender /> : renderLabel(formatVND(asset.topUp))}</Grid>
          </Grid>
        </Box>
        <Divider />
        <Box sx={{ width: '100%', px: 2, py: 1 }}>
          <Grid container alignItems='center'>
            <Grid item>
              <Typography fontWeight={600}>
                <FormattedMessage id='label.net.asset.value' />:
              </Typography>
              &nbsp;
            </Grid>
            <Grid item>{isLoading ? <SkeletonRender /> : renderLabel(formatVND(asset.net))}</Grid>
          </Grid>
        </Box>
        <Divider />
        <Box sx={{ width: '100%', px: 2, py: 1 }}>
          <Grid container alignItems='center'>
            <Grid item>
              <Typography fontWeight={600}>
                <FormattedMessage id='label.available.cash' />:
              </Typography>
              &nbsp;
            </Grid>
            <Grid item>
              {isLoading ? <SkeletonRender /> : renderLabel(formatVND(asset.available))}
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Box sx={{ width: '100%', px: 2, py: 1 }}>
          <Grid container alignItems='center'>
            <Grid item>
              <Typography fontWeight={600}>
                <FormattedMessage id='label.market.value' />:
              </Typography>
              &nbsp;
            </Grid>
            <Grid item>
              {isLoading ? (
                <SkeletonRender />
              ) : (
                renderLabel(formatVND(asset.marketValue), asset.profitOrLost)
              )}
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Box sx={{ width: '100%', px: 2, py: 1 }}>
          <Grid container alignItems='center'>
            <Grid item>
              <Typography fontWeight={600}>
                <FormattedMessage id='label.invested.value' />:
              </Typography>
              &nbsp;
            </Grid>
            <Grid item>
              {isLoading ? (
                <SkeletonRender />
              ) : (
                renderLabel(formatVND(asset.investedValue), asset.profitOrLost)
              )}
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Box sx={{ width: '100%', px: 2, py: 1 }}>
          <Grid container alignItems='center'>
            <Grid item>
              <FormattedMessage id='label.profit.loss.value' />: &nbsp;
            </Grid>
            <Grid item>
              {isLoading ? (
                <SkeletonRender />
              ) : (
                renderLabel(
                  formatVND(
                    (asset.investedValue - asset.marketValue) * (asset.profitOrLost > 0 ? 1 : -1)
                  ),
                  asset.profitOrLost
                )
              )}
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Box sx={{ width: '100%', px: 2, py: 1 }}>
          <Grid container alignItems='center'>
            <Grid item>
              <FormattedMessage id='label.profit.loss' />: &nbsp;
            </Grid>
            <Grid item>
              {isLoading ? (
                <SkeletonRender />
              ) : (
                renderLabel(`${asset.profitOrLost || 0}%`, asset.profitOrLost)
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Charts data={currentData?.data?.data ?? []} />
    </Box>
  )
}

export default Asset
