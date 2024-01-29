import { Add, ChevronLeft, ChevronRight, ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Link,
  Typography,
  styled,
  useTheme
} from '@mui/material'
import { type SyntheticEvent, useEffect, useRef, useState, useLayoutEffect } from 'react'
import { type Board, type WatchList } from 'src/models'
import { useGetWatchListQuery } from 'src/services/stocks.services'
import { drawerWidth } from '..'

interface SideBarDrawerProps {
  open: boolean
  isLogin: boolean
  toggle: () => void
}
const SideBarDrawer = ({ open, isLogin, toggle }: SideBarDrawerProps): JSX.Element => {
  const theme = useTheme()
  const watchListRef = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { data: watchList } = useGetWatchListQuery(undefined, { skip: !isLogin })

  const [data, setData] = useState<WatchList[]>([])
  const [expanded, setExpanded] = useState<number>(-1)

  useEffect(() => {
    if (watchList?.data) {
      setData(
        [...watchList.data]
          .sort((a, b) => a.displayIndex - b.displayIndex)
          .map((item) => ({
            ...item,
            symbols: [...item.symbols].sort((a, b) => a.localeCompare(b))
          }))
      )
    }
  }, [watchList])

  useLayoutEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (watchListRef?.current) {
        if (expanded !== -1) {
          watchListRef.current.style.scrollBehavior = 'smooth'
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
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflowY: 'unset'
        }
      }}
      variant='persistent'
      anchor='right'
      open={open}
    >
      <Box sx={{ overflowY: 'hidden' }} boxShadow={3}>
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
          sx={{ height: 'calc(100vh - 112px)', overflowY: 'auto' }}
          className='watch-list'
          ref={watchListRef}
        >
          <Box>
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
                      href={`/stocks/${stock.liveboard.Symbol}`}
                      key={stock.liveboard.Symbol}
                      target='_blank'
                      style={{ color: 'unset', textDecoration: 'none' }}
                      sx={{
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
                          <Typography fontWeight={600}>{stock.liveboard.Symbol}</Typography>
                          <Typography fontWeight={600}>{stock.liveboard.Close}</Typography>
                        </Box>
                        <Box
                          display='flex'
                          justifyContent='space-between'
                          alignItems='center'
                          gap={0.75}
                        >
                          <Typography
                            flex={1}
                            textOverflow='ellipsis'
                            whiteSpace='nowrap'
                            overflow='hidden'
                            fontSize={14}
                          >
                            {stock.CompanyName}
                          </Typography>
                          <Typography
                            width={80}
                            textAlign='right'
                            fontWeight={600}
                            whiteSpace='nowrap'
                            fontSize={14}
                            sx={{
                              color:
                                stock.liveboard.ChangePercent > 0
                                  ? 'success.main'
                                  : stock.liveboard.ChangePercent < 0
                                    ? 'error.main'
                                    : 'warning.main'
                            }}
                          >{`${stock.liveboard.Change} / ${stock.liveboard.ChangePercent}%`}</Typography>
                        </Box>
                      </Box>
                      {index !== item.stocks.length - 1 && <Divider />}
                    </Link>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
        <Divider />
        <Box sx={{ cursor: 'pointer' }} height='46px'>
          <Button fullWidth sx={{ height: '100%' }}>
            Add Stock
            <Add />
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default SideBarDrawer

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between'
}))
