import { Grid, TextField } from '@mui/material'

const UserAccount = (): JSX.Element => {
  return (
    <Grid container width='80%' rowSpacing={2}>
      <Grid item xs={12}>
        <TextField label='Name' fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField label='Email' fullWidth />
      </Grid>
    </Grid>
  )
}

export default UserAccount
