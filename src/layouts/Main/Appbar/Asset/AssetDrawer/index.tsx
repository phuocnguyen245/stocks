import { Box, Grid, Typography, useTheme, type Theme } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Label, Skeleton } from 'src/components/MUIComponents'
import Charts from 'src/layouts/Main/Appbar/Asset/AssetDrawer/Charts'
import type { Asset, Asset as IAsset, LabelType } from 'src/models'
import { PaymentService } from 'src/services/payment.services'
import { useGetCurrentStocksQuery } from 'src/services/stocks.services'
import { useAppSelector } from 'src/store'
import { convertToDecimal, formatVND } from 'src/utils'

const AssetDrawer = ({ open }: { open: boolean }): JSX.Element => {
  const intl = useIntl()
  const theme: Theme = useTheme()
  const [asset, setAsset] = useState<IAsset>({
    topUp: 0,
    waiting: 0,
    cash: 0,
    order: 0,
    sell: 0,
    available: 0,
    net: 0,
    profitOrLost: 0,
    investedValue: 0,
    marketValue: 0,
    ratePortfolio: 0,
    sectorsPercentage: [{ name: intl.formatMessage({ id: 'label.cash' }), y: 100 }],
    stocksPercentage: [{ name: intl.formatMessage({ id: 'label.cash' }), y: 100 }]
  })
  const { isRefetchStock } = useAppSelector((state) => state.Stocks)

  const {
    data: assetData,
    isLoading: isLoadingAsset,
    refetch
  } = PaymentService.useGetAssetQuery({}, { skip: !open, refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (isRefetchStock && open) {
      void refetch()
    }
  }, [isRefetchStock, open])

  useEffect(() => {
    const data = assetData?.data as IAsset
    if (data) {
      setAsset(() => ({
        ...data,
        topUp: data.topUp * 1000,
        cash: data.cash * 1000,
        investedValue: data.investedValue * 1000,
        marketValue: data.marketValue * 1000,
        net: data.net * 1000,
        order: data.order * 1000,
        sell: data.sell * 1000,
        waiting: data.waiting * 1000
      }))
    }
  }, [assetData])

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

  const renderAsset = useMemo(() => {
    const content = [
      {
        name: 'label.top.up',
        value: renderLabel(formatVND(asset.topUp))
      },
      {
        name: 'label.net.asset.value',
        value: renderLabel(formatVND(asset.net))
      },
      {
        name: 'label.available.cash',
        value: renderLabel(formatVND(asset.cash))
      },
      {
        name: 'label.market.value',
        value: renderLabel(formatVND(asset.marketValue), asset.profitOrLost)
      },
      {
        name: 'label.invested.value',
        value: renderLabel(formatVND(asset.investedValue), asset.ratePortfolio)
      },
      {
        name: 'label.profit.loss.portfolio',
        value: renderLabel(`${convertToDecimal(asset.ratePortfolio)}%`, asset.ratePortfolio)
      },
      {
        name: 'label.profit.loss.asset',
        value: renderLabel(`${convertToDecimal(asset.profitOrLost || 0)}%`, asset.profitOrLost)
      }
    ]
    return content.map((item, index) => (
      <Box sx={{ width: '100%', px: 2, py: 1 }} key={index}>
        <Grid container alignItems='center'>
          <Grid item>
            <Typography fontWeight={600}>{intl.formatMessage({ id: item.name })}:&nbsp;</Typography>
          </Grid>
          <Grid item>{isLoadingAsset ? <SkeletonRender /> : item.value}</Grid>
        </Grid>
      </Box>
    ))
  }, [asset])

  return (
    <Box
      sx={{
        transition: 'all .25s ease',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}
    >
      <Box
        display='flex'
        alignItems={'flex-start'}
        flexDirection={'column'}
        bgcolor={theme.palette.mode === 'dark' ? 'grey.500' : '#f9f3fe'}
      >
        {renderAsset}
      </Box>
      <Charts data={asset} />
    </Box>
  )
}

export default AssetDrawer
