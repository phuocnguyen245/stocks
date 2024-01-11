import { ChevronLeft, ChevronRight, ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Drawer,
  IconButton,
  Typography,
  styled,
  useTheme
} from '@mui/material'
import { useEffect, useState } from 'react'
import { drawerWidth } from '..'

import { type WatchList } from 'src/Models'
import { useGetWatchListQuery } from 'src/services/stocks.services'

interface SideBarDrawerProps {
  open: boolean
  toggle: () => void
}
const SideBarDrawer = ({ open, toggle }: SideBarDrawerProps): JSX.Element => {
  const theme = useTheme()

  const { data: watchList } = useGetWatchListQuery()

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
        <Box sx={{ overflowY: 'auto', height: '100vh' }}>
          {data.map((item) => (
            <Accordion
              key={item.displayIndex}
              expanded={expanded === item.displayIndex}
              onChange={() => setExpanded(item.displayIndex === expanded ? -1 : item.displayIndex)}
              sx={{ my: '0 !important' }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls='panel1-content'
                id='panel1-header'
              >
                <Typography>{item.name}</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  p: 0,
                  cursor: 'pointer',
                  '& :hover': {
                    background: `${theme.palette.mode === 'dark' ? '#696e70' : '#f5f5f5'} `
                  }
                }}
              >
                {item.symbols.map((symbol) => (
                  <Typography key={symbol} py={1} px={2}>
                    {symbol}
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
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
