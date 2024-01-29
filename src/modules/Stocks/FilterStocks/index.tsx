/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check } from '@mui/icons-material'
import { Box, Container, Grid, List, ListItem, Slider, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Helmet from 'src/components/Helmet'
import { useDebounce } from 'src/hooks'
import { useGetRecommendedQuery } from 'src/services/stocks.services'

interface FilterStocksType {
  macd?: number[]
  rsi?: number[]
  stoch?: number[]
  stoshRSI?: number[]
  mfi?: number[]
}

const technicalList = ['macd', 'rsi', 'stoch', 'stoshRSI', 'mfi'] as Array<keyof FilterStocksType>

const valuetext = (value: number): string => {
  return `${value}°C`
}

const FilterStocks = (): JSX.Element => {
  const [defaultFilter, setDefaultFilter] = useState<Array<keyof FilterStocksType>>([
    'macd',
    'rsi',
    'stoch',
    'stoshRSI',
    'mfi'
  ])
  const [filter, setFilter] = useState<FilterStocksType | null>({
    macd: [-1, 1],
    rsi: [0, 30],
    stoch: [0, 40],
    mfi: [0, 30],
    stoshRSI: [0, 40]
  })

  const { data } = useGetRecommendedQuery({ ...filter }, { refetchOnMountOrArgChange: true })

  const handleChange = (event: Event, newValue: number | number[]): void => {
    const target = event.target as HTMLDivElement
    const name = (target as HTMLInputElement).name
    setFilter({ ...filter, [name as keyof FilterStocksType]: newValue as number[] })
  }
  const [key, setKey] = useState<keyof FilterStocksType | null>(null)
  const debouncedKey = useDebounce(key as string, 500)

  useEffect(() => {
    if (debouncedKey !== null) {
      setDefaultFilter((prev: any) => {
        if (prev.includes(debouncedKey as unknown as any)) {
          const { [debouncedKey]: _, ...rest } = filter ?? {}
          setFilter(rest)
          return prev.filter((item: any) => item !== debouncedKey)
        }
        setFilter({ ...filter, [debouncedKey]: [0, 100] })
        return [...prev, debouncedKey]
      })
    }
  }, [debouncedKey])

  const onSetDefaultFilter = (key: keyof FilterStocksType): void => {
    setKey(key)
  }

  return (
    <Box height='100%' position='relative' minHeight='100vh' pt={14}>
      <Helmet>
        <title>Filter Stocks</title>
      </Helmet>
      <Container sx={{ pt: 5 }} maxWidth='md'>
        <Grid container md={12} spacing={2}>
          <Grid item md={4}>
            <List
              sx={{
                bgcolor: '#f9f3fe',
                p: 0,
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              {technicalList.map((item) => {
                const isIncludes = defaultFilter.includes(item)
                return (
                  <ListItem onClick={() => onSetDefaultFilter(item)} key={item} sx={{ p: 0 }}>
                    <Box
                      sx={{ bgcolor: isIncludes ? '#f8dffa' : 'transparent' }}
                      width='100%'
                      px={3}
                      py={2}
                      display='flex'
                      justifyContent='space-between'
                      alignItems='center'
                    >
                      {item.toUpperCase()}
                      {isIncludes && <Check />}
                    </Box>
                  </ListItem>
                )
              })}
            </List>
          </Grid>
          <Grid item md={8} display='flex' gap={2}>
            <List
              sx={{
                bgcolor: '#f9f3fe',
                p: 0,
                borderRadius: 1,
                width: '100%'
              }}
            >
              {technicalList.map((item) => {
                const isIncludes = defaultFilter.includes(item)
                return (
                  <ListItem
                    key={item}
                    sx={{
                      width: '100%',
                      height: '56px',
                      px: 3
                    }}
                  >
                    {isIncludes ? (
                      <Grid container justifyContent='space-between'>
                        <Grid item flex={1}>
                          <Slider
                            name={item}
                            value={filter?.[item]}
                            onChange={handleChange}
                            valueLabelDisplay='auto'
                            getAriaValueText={valuetext}
                            min={item === 'macd' ? -10 : 0}
                            max={item === 'macd' ? 10 : 100}
                          />
                        </Grid>
                        <Grid item>
                          <Typography width={120} textAlign='right'>
                            ({filter?.[item]?.[0] ?? '0'}, {filter?.[item]?.[1] ?? '0'})
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : (
                      <></>
                    )}
                  </ListItem>
                )
              })}
            </List>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default FilterStocks
