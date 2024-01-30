import { Check } from '@mui/icons-material'
import { Box, Container, Grid, List, ListItem, Slider, Typography } from '@mui/material'
import { useState } from 'react'
import Helmet from 'src/components/Helmet'
import { useDebounce } from 'src/hooks'
import FilterResult from 'src/modules/Stocks/FilterStocks/FilterResult'
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
  const [filter, setFilter] = useState<FilterStocksType>({
    macd: [-1, 1],
    rsi: [0, 30],
    stoch: [0, 40],
    mfi: [0, 30],
    stoshRSI: [0, 40]
  })

  const filterDebounce = useDebounce(filter, 1500)

  const { data } = useGetRecommendedQuery(JSON.stringify(filterDebounce), {
    refetchOnMountOrArgChange: true
  })

  const handleChange = (
    event: Event | React.SyntheticEvent<Element, Event>,
    value: number | number[]
  ): void => {
    const target = event.target as HTMLDivElement
    const name = (target as HTMLInputElement).name
    setFilter({ ...filter, [name as keyof FilterStocksType]: value as number[] })
  }

  const onSetDefaultFilter = (key: keyof FilterStocksType): void => {
    setDefaultFilter((prev: Array<keyof FilterStocksType>) => {
      if (prev.includes(key)) {
        const { [key]: _, ...rest } = filter ?? {}
        setFilter(rest)
        return prev.filter((item: keyof FilterStocksType) => item !== key)
      }
      setFilter({ ...filter, [key]: [0, 100] })
      return [...prev, key]
    })
  }

  return (
    <>
      <Helmet>
        <title>Filter Stocks</title>
      </Helmet>
      <Container sx={{ mt: 3 }}>
        <Grid container spacing={2}>
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
                      py={1}
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
                      height: '40px',
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
                            onChangeCommitted={handleChange}
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
        <FilterResult data={data?.data ?? []} />
      </Container>
    </>
  )
}

export default FilterStocks
