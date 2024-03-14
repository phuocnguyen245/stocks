import { Person } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { Link } from 'react-router-dom'

const Account = (): JSX.Element => {
  return (
    <Link to='/account'>
      <IconButton>
        <Person color='primary' />
      </IconButton>
    </Link>
  )
}

export default Account
