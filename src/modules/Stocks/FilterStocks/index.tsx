import { Check } from '@mui/icons-material'
import {
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  Slider,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useState } from 'react'
import Helmet from 'src/components/Helmet'
import { useDebounce } from 'src/hooks'
import FilterResult from 'src/modules/Stocks/FilterStocks/FilterResult'
import { useGetRecommendedQuery } from 'src/services/stocks.services'

interface FilterStocksType {
  macd?: number[]
  rsi?: number[]
  stoch?: number[]
  stochRSI?: number[]
  mfi?: number[]
}
type Levels = 'Simple' | 'Intermediate' | 'Advanced' | 'Default'
const technicalList = ['macd', 'rsi', 'stoch', 'stochRSI', 'mfi'] as Array<keyof FilterStocksType>
const filterLevels: Levels[] = ['Simple', 'Default', 'Intermediate', 'Advanced']
const valuetext = (value: number): string => {
  return `${value}°C`
}

const defaultFilterLevels = {
  macd: [-1, 1],
  rsi: [0, 55],
  stoch: [0, 30],
  mfi: [0, 50],
  stochRSI: [0, 30]
}

const FilterStocks = (): JSX.Element => {
  const theme = useTheme()
  const isLg = useMediaQuery(theme.breakpoints.down('lg'))

  const [defaultFilter, setDefaultFilter] = useState<Array<keyof FilterStocksType>>(technicalList)
  const [levels, setLevels] = useState<Levels | ''>('Default')
  const [filter, setFilter] = useState<FilterStocksType>(defaultFilterLevels)

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
    setLevels('')
    setFilter({ ...filter, [name as keyof FilterStocksType]: value as number[] })
  }

  const onSetDefaultFilter = (key: keyof FilterStocksType): void => {
    setLevels('')
    setDefaultFilter((prev: Array<keyof FilterStocksType>) => {
      if (prev.includes(key)) {
        setFilter(() => ({ ...filter, [key]: key === 'macd' ? [-10, 10] : [0, 100] }))
        return prev.filter((item: keyof FilterStocksType) => item !== key)
      }
      setFilter({ ...filter, [key]: [0, 100] })
      return [...prev, key]
    })
  }

  const onFilterLevel = (level: Levels): void => {
    setLevels(level)
    setDefaultFilter(technicalList)
    switch (level) {
      case 'Simple':
        return setFilter(() =>
          technicalList.map((item) => ({ [item]: [0, 100] })).reduce((a, b) => ({ ...a, ...b }))
        )
      case 'Default':
        return setFilter(defaultFilterLevels)
      case 'Intermediate':
        return setFilter({
          macd: [-1, 1],
          rsi: [0, 50],
          stoch: [0, 50],
          mfi: [0, 50],
          stochRSI: [0, 50]
        })
      case 'Advanced':
        return setFilter({
          macd: [-1, 1],
          rsi: [0, 30],
          stoch: [0, 30],
          mfi: [0, 30],
          stochRSI: [0, 30]
        })
    }
  }

  return (
    <>
      <Helmet>
        <title>Filter Stocks</title>
      </Helmet>
      <Container sx={{ mt: 3 }}>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={6} sm={6} md={6} lg={4}>
            <List
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'primary.light',
                p: 0,
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: 2
              }}
            >
              {technicalList.map((item) => {
                const isIncludes = defaultFilter.includes(item)
                return (
                  <ListItem onClick={() => onSetDefaultFilter(item)} key={item} sx={{ p: 0 }}>
                    <Box
                      sx={{
                        bgcolor: isIncludes
                          ? theme.palette.mode === 'dark'
                            ? 'grey.500'
                            : '#ebabef'
                          : 'transparent'
                      }}
                      width='100%'
                      px={3}
                      py={1}
                      display='flex'
                      justifyContent='space-between'
                      alignItems='center'
                    >
                      <Typography>{item.toUpperCase()}</Typography>
                      {isIncludes && <Check />}
                    </Box>
                  </ListItem>
                )
              })}
            </List>
          </Grid>
          <Grid item display='flex' flex={1} order={isLg ? 3 : 2}>
            <List
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'primary.light',
                py: 0,
                borderRadius: 1,
                width: '100%',
                boxShadow: 2
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
                          <Typography width='max-content' minWidth={72} textAlign='right'>
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
          <Grid item minWidth={130} xs={6} sm={6} md={6} lg={2} order={isLg ? 2 : 3}>
            <List
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                p: 1,
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: 2
              }}
            >
              {filterLevels.map((item) => (
                <Button
                  key={item}
                  fullWidth
                  variant='contained'
                  sx={{
                    bgcolor:
                      item === levels
                        ? theme.palette.mode === 'dark'
                          ? 'grey.500'
                          : '#ebabef'
                        : 'transparent'
                  }}
                  onClick={() => onFilterLevel(item)}
                >
                  <Typography color='text.primary'>{item}</Typography>
                </Button>
              ))}
            </List>
          </Grid>
        </Grid>
        <Box my={2}>
          <FilterResult data={data?.data ?? []} />
        </Box>
      </Container>
    </>
  )
}

export default FilterStocks
