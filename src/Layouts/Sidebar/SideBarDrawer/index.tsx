import { Add, ChevronLeft, ChevronRight, ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Drawer,
  Link,
  IconButton,
  Typography,
  styled,
  useTheme
} from '@mui/material'
import { useEffect, useState } from 'react'
import { drawerWidth } from '..'
import { type Board, type WatchList } from 'src/models'
import { useGetWatchListQuery } from 'src/services/stocks.services'

interface SideBarDrawerProps {
  open: boolean
  isLogin: boolean
  toggle: () => void
}
const SideBarDrawer = ({ open, isLogin, toggle }: SideBarDrawerProps): JSX.Element => {
  const theme = useTheme()

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

  return (
    <Drawer
      sx={{
        display: isLogin ? 'block' : 'none',
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
      variant='persistent'
      anchor='right'
      open={open}
    >
      <Box sx={{ overflowY: 'hidden' }}>
        <DrawerHeader onClick={toggle} sx={{ cursor: 'pointer' }}>
          <Typography pl={2} fontWeight={600}>
            Watch Lists
          </Typography>
          <IconButton onClick={toggle}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box sx={{ overflowY: 'auto', height: 'calc(100vh - 112px)' }} className='watch-list'>
          {data.map((item) => (
            <Accordion
              key={item.displayIndex}
              expanded={expanded === item.displayIndex}
              onChange={() => setExpanded(item.displayIndex === expanded ? -1 : item.displayIndex)}
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
                {item.stocks.map((stock: Board) => (
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
                  </Link>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
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
