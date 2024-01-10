import { Box, Grid, Typography, useTheme, type Theme } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { type Asset } from 'src/Models'
import { Label, Skeleton } from 'src/components/MUIComponents'
import { PaymentService } from 'src/services/payment.services'
import { StockService } from 'src/services/stocks.services'
import { convertToDecimal } from 'src/utils'

const TableFooter = (): JSX.Element => {
  const theme: Theme = useTheme()
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
  const { data: assetData, isLoading: isLoadingAsset } = PaymentService.useGetAssetQuery({})
  const { data: currentData, isLoading: isLoadingCurrent } = StockService.useGetCurrentStocksQuery(
    {}
  )

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
      currentData?.data?.data.forEach((stock) => {
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
          net: prev.topUp + prev.selling - prev.order + marketValue - investedValue
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

  const renderLabel = (message: string | number, compare = 0): JSX.Element => {
    const check = Number(message) > compare ? 'ok' : 'nook'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      ok: {
        type: 'success',
        message
      },
      nook: {
        type: 'error',
        message
      }
    }

    return <Label type={options[check].type}>{message}</Label>
  }
  return (
    <Box
      position='fixed'
      width='100vw'
      height='100px'
      bottom={0}
      display='flex'
      alignItems='center'
      bgcolor={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)'}
    >
      <Grid container alignItems='center' spacing={2} justifyContent='center'>
        <Grid item>
          <Grid container alignItems='center'>
            <Grid item>
              <Typography>Top up:&nbsp;</Typography>
            </Grid>
            <Grid item>
              <Typography>{isLoading ? <SkeletonRender /> : asset.topUp}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container alignItems='center'>
            <Grid item>
              <Typography>Net Asset Value:&nbsp;</Typography>
            </Grid>
            <Grid item>
              <Typography>{isLoading ? <SkeletonRender /> : asset.net}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container alignItems='center'>
            <Grid item>
              <Typography>Available Cash:&nbsp;</Typography>
            </Grid>
            <Grid item>
              <Typography>{isLoading ? <SkeletonRender /> : asset.available}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container alignItems='center'>
            <Grid item>
              <Typography>Profit/Loss:&nbsp;</Typography>
            </Grid>
            <Grid item>
              <Typography>
                {isLoading ? <SkeletonRender /> : `${asset.profitOrLost ?? 0}%`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container alignItems='center'>
            <Grid item>
              <Typography>Invested Value:&nbsp;</Typography>
            </Grid>
            <Grid item>
              <Typography>{isLoading ? <SkeletonRender /> : asset.investedValue}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container alignItems='center'>
            <Grid item>
              <Typography>Market Value:&nbsp;</Typography>
            </Grid>
            <Grid item>
              <Typography>{isLoading ? <SkeletonRender /> : asset.marketValue}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TableFooter
