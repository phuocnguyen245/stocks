import { Box, Grid, type Theme, Typography, useTheme } from '@mui/material'

const TableFooter = (): JSX.Element => {
  const theme: Theme = useTheme()

  return (
    <Box
      position='fixed'
      width='100vw'
      height='100px'
      bottom={0}
      display='flex'
      alignItems='center'
      bgcolor={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)'}
    >
      <Grid container spacing={2} alignItems='center' justifyContent='center'>
        <Grid item>
          <Grid container>
            <Grid item>
              <Typography>Top up:&nbsp;</Typography>
            </Grid>
            <Grid item>
              <Typography>0</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item>
              <Typography>Net Asset Value:&nbsp;</Typography>
            </Grid>
            <Grid item>
              <Typography>0</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item>
              <Typography>Available Cash:&nbsp;</Typography>
            </Grid>
            <Grid item>
              <Typography>0</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item>
              <Typography>Withdrawable:&nbsp;</Typography>
            </Grid>
            <Grid item>
              <Typography>0</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item>
              <Typography>Profit/Loss:&nbsp;</Typography>
            </Grid>
            <Grid item>
              <Typography>0</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container>
            <Grid item>
              <Typography>Invested Value:&nbsp;</Typography>
            </Grid>
            <Grid item>
              <Typography>0</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item>
              <Typography>Market Value:&nbsp;</Typography>
            </Grid>
            <Grid item>
              <Typography>0</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TableFooter
