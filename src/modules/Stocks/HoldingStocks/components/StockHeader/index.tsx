import { Box, Button, Container } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { useAppSelector } from 'src/store'
import StockModal from '../../Modals'
import { memo, useMemo } from 'react'

interface StockHeaderProps {
  open: boolean
  hide: () => void
  show: () => void
}

const StockHeader = ({ open, show, hide }: StockHeaderProps): JSX.Element => {
  const { isMdWindow } = useAppSelector((state) => state.Stocks)

  const children = useMemo(() => {
    return (
      <>
        <Button variant='contained' onClick={show}>
          <FormattedMessage id='label.create' />
        </Button>
        <StockModal open={open} handleClose={hide} />
      </>
    )
  }, [open, show, hide])

  return (
    <>
      {isMdWindow ? (
        <Container sx={{ width: '100%', textAlign: 'right', py: 1, px: 0 }}>{children}</Container>
      ) : (
        <Box sx={{ width: '100%', textAlign: 'right', py: 2 }}>{children}</Box>
      )}
    </>
  )
}

export default memo(StockHeader)
