import { ChevronLeft, ChevronRight, Logout, Search } from '@mui/icons-material'
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Typography,
  styled,
  useTheme
} from '@mui/material'
import { useNavigate } from 'react-router'
import DarkModeSwitch from 'src/Layouts/Header/components/DarkModeSwitch'
import Languages from 'src/Layouts/Header/components/Languages'
import RefreshTime from 'src/Layouts/Header/components/RefreshTime'
import SearchBar from 'src/components/SearchBar'

interface MenuDrawerProps {
  open: boolean
  toggle: () => void
  darkMode: 'dark' | 'light'
  languages: 'vi' | 'en'
  onOpenWatchList: () => void
  onOpenAsset: () => void
  onSetDarkMode: (value: React.SetStateAction<'dark' | 'light'>) => void
  onSetLanguages: (value: React.SetStateAction<'vi' | 'en'>) => void
}
const MenuDrawer = ({
  open,
  darkMode,
  languages,
  toggle,
  onOpenAsset,
  onSetDarkMode,
  onSetLanguages,
  onOpenWatchList
}: MenuDrawerProps): JSX.Element => {
  const theme = useTheme()
  const navigate = useNavigate()

  const onOpen = (): void => {
    onOpenWatchList()
    toggle()
  }

  const onLogout = (): void => {
    navigate('/login')
    localStorage.removeItem('user')
    localStorage.removeItem('tokens')
    toggle()
  }

  return (
    <Drawer variant='persistent' anchor='right' open={open} onClose={toggle}>
      <Box sx={{ overflowY: 'hidden' }} boxShadow={3}>
        <DrawerHeader onClick={toggle} sx={{ cursor: 'pointer' }}>
          <Typography pl={2} fontWeight={600}>
            Menu
          </Typography>
          {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem sx={{ cursor: 'pointer' }} onClick={onOpen}>
            <Typography variant='h6' fontWeight={600}>
              Watch List
            </Typography>
          </ListItem>
          <Divider />
          <ListItem sx={{ cursor: 'pointer' }} onClick={onOpenAsset}>
            <Typography variant='h6' fontWeight={600}>
              Asset
            </Typography>
          </ListItem>
          <Divider />
          <ListItem>
            <SearchBar />
          </ListItem>
          <Divider />
          <ListItem sx={{ display: 'flex', gap: 2 }}>
            <Typography>Refreshed Time:</Typography>
            <RefreshTime />
          </ListItem>
          <Divider />
          <ListItem
            sx={{
              display: 'flex',
              gap: 4,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <DarkModeSwitch darkMode={darkMode} onSetDarkMode={onSetDarkMode} />
            <Languages languages={languages} onSetLanguages={onSetLanguages} />
          </ListItem>
          <Divider />
          <ListItem
            sx={{
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main'
              },
              transition: 'color 0.3s ease'
            }}
            onClick={onLogout}
          >
            <Typography fontWeight={600}>Logout</Typography>
            <Logout />
          </ListItem>
          <Divider />
        </List>
      </Box>
    </Drawer>
  )
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between'
}))

export default MenuDrawer
