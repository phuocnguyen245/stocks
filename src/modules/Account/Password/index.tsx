import { Button, Grid, TextField } from '@mui/material'

const Password = (): JSX.Element => {
  return (
    <Grid container width='80%' rowSpacing={2}>
      <Grid item xs={12}>
        <TextField label='Current Password' fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField label='New Password' fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField label='Confirm Password' fullWidth />
      </Grid>
      <Grid item xs={12}>
        <Button fullWidth variant='contained'>
          Submit
        </Button>
      </Grid>
    </Grid>
  )
}

export default Password
