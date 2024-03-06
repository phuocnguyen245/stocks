import { styled } from '@mui/material'
import { Outlet as OutletRouter } from 'react-router'

const OutletWrapper = styled('main', {
  shouldForwardProp: (prop) => prop !== 'WidthAndMargin' && prop !== 'isLogin'
})<{
  widthAndMargin: {
    width: number
    marginLeft: number
    marginRight: number
  }
  isLogin: boolean
}>(({ theme, widthAndMargin }) => ({
  padding: theme.spacing(3),
  transition: 'all 0.25s ease',
  width: `calc(100% - ${widthAndMargin.width}px)`,
  marginLeft: widthAndMargin.marginLeft,
  marginRight: widthAndMargin.marginRight
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Outlet = (props: any): JSX.Element => {
  return (
    <OutletWrapper {...props}>
      <OutletRouter />
    </OutletWrapper>
  )
}

export default Outlet
