import { ChevronLeft, ChevronRight, ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Drawer,
  IconButton,
  Link,
  Tooltip,
  Typography,
  styled,
  useTheme
} from '@mui/material'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useAlert } from 'src/hooks'
import { watchListWidth } from 'src/layouts/Sidebar'
import { type Board, type WatchList } from 'src/models'
import { useGetWatchListQuery } from 'src/services/stocks.services'

interface WatchListDrawerProps {
  open: boolean
  isLogin: boolean
  toggle: () => void
}
const WatchListDrawer = ({ open, isLogin, toggle }: WatchListDrawerProps): JSX.Element => {
  const theme = useTheme()
  const alert = useAlert()
  const watchListRef = useRef<HTMLDivElement | null>(null)
  const wrapperWatchListRef = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { data: watchList, refetch } = useGetWatchListQuery(undefined, { skip: !isLogin || !open })

  const [data, setData] = useState<WatchList[]>([])
  const [expanded, setExpanded] = useState<number>(-1)

  useEffect(() => {
    if (watchList) {
      if (watchList?.data?.length) {
        return setData(
          [...watchList.data]
            .sort((a, b) => a.displayIndex - b.displayIndex)
            .map((item) => ({
              ...item,
              symbols: [...item.symbols].sort((a, b) => a.localeCompare(b))
            }))
        )
      } else {
        refetch()
          .unwrap()
          .then((data) => {
            setData(
              [...(data?.data ?? [])]
                .sort((a, b) => a.displayIndex - b.displayIndex)
                .map((item) => ({
                  ...item,
                  symbols: [...item.symbols].sort((a, b) => a.localeCompare(b))
                }))
            )
          })
          .catch(() => {
            alert({ message: 'Error fetching Watch list', variant: 'error' })
          })
      }
    }
  }, [watchList])

  useEffect(() => {
    const wrapperWatchList = wrapperWatchListRef?.current
    if (wrapperWatchList) {
      console.log(wrapperWatchList.clientHeight)
    }
  })

  useLayoutEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (watchListRef?.current) {
        if (expanded !== -1) {
          return watchListRef.current.scroll(0, expanded * 48)
        }
      }
    }, 300)
    return () => clearTimeout(timeoutRef.current as NodeJS.Timeout)
  }, [expanded])

  const onChange = (e: React.SyntheticEvent<Element, Event>, item: WatchList): void => {
    setExpanded(item.displayIndex === expanded ? -1 : item.displayIndex)
  }

  return (
    <Drawer
      sx={{
        display: isLogin ? 'block' : 'none',
        transition: 'all 0.25s ease',
        width: open ? watchListWidth : 0,
        height: '100%',
        '& .MuiDrawer-paper': {
          width: open ? watchListWidth : 0,
          boxShadow: 3,
          height: '100%'
        }
      }}
      variant='persistent'
      anchor='right'
      open={open}
    >
      <DrawerHeader onClick={toggle} sx={{ cursor: 'pointer' }}>
        <Typography pl={2} fontWeight={600}>
          Watch Lists
        </Typography>
        <IconButton onClick={toggle}>
          {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box
        sx={{ height: '100%', overflowY: 'auto', scrollBehavior: 'smooth' }}
        ref={watchListRef}
        className='watch-list'
      >
        {data.map((item) => (
          <Accordion
            key={item.displayIndex}
            expanded={expanded === item.displayIndex}
            onChange={(e) => onChange(e, item)}
            sx={{
              minHeight: '36px',
              my: '0 !important',
              background:
                expanded === item.displayIndex
                  ? theme.palette.mode === 'dark'
                    ? '#3c3c3c'
                    : 'rgba(242, 232, 252, 0.5)'
                  : null,
              '& .MuiButtonBase-root': {
                background:
                  expanded === item.displayIndex
                    ? theme.palette.mode === 'dark'
                      ? '#2e2e2e'
                      : theme.palette.primary.main
                    : null
              }
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography
                color={`${
                  expanded === item.displayIndex
                    ? theme.palette.mode === 'dark'
                      ? 'text.primary'
                      : 'text.secondary'
                    : 'text.primary'
                }`}
                fontWeight={expanded === item.displayIndex ? 600 : 400}
              >
                {item.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                p: 0,
                cursor: 'pointer'
              }}
            >
              {item?.stocks?.map((stock: Board, index) => (
                <Link
                  href={`/charts/${stock.symbol}`}
                  key={stock.symbol}
                  target='_blank'
                  style={{ color: 'unset', textDecoration: 'none' }}
                  sx={{
                    transition: 'all 2s ease',
                    '& :hover': {
                      background: `${theme.palette.mode === 'dark' ? '#6e6e6e' : '#f8dffa'}`
                    }
                  }}
                >
                  <Box py={0.75} px={1.5}>
                    <Box
                      display='flex'
                      justifyContent='space-between'
                      alignItems='center'
                      mb={0.25}
                    >
                      <Typography fontWeight={600}>{stock.symbol}</Typography>
                      <Typography
                        fontWeight={600}
                        sx={{
                          color:
                            stock.changePercent > 0
                              ? 'success.main'
                              : stock.changePercent < 0
                                ? 'error.main'
                                : 'warning.main'
                        }}
                      >
                        {stock.close}
                      </Typography>
                    </Box>
                    <Box
                      display='flex'
                      justifyContent='space-between'
                      alignItems='center'
                      gap={0.75}
                    >
                      <Tooltip title={stock.companyName} arrow>
                        <Typography
                          flex={1}
                          textOverflow='ellipsis'
                          whiteSpace='nowrap'
                          overflow='hidden'
                          fontSize={14}
                          typography={stock.companyName}
                        >
                          {stock.companyName}
                        </Typography>
                      </Tooltip>

                      <Typography
                        width={80}
                        textAlign='right'
                        fontWeight={600}
                        whiteSpace='nowrap'
                        fontSize={14}
                        sx={{
                          color:
                            stock.changePercent > 0
                              ? 'success.main'
                              : stock.changePercent < 0
                                ? 'error.main'
                                : 'warning.main'
                        }}
                      >{`${stock.change} / ${stock.changePercent}%`}</Typography>
                    </Box>
                  </Box>
                  {index !== item.stocks.length - 1 && <Divider />}
                </Link>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Drawer>
  )
}

export default WatchListDrawer

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between'
}))
