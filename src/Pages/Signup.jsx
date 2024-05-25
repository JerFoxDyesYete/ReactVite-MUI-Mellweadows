import {Container, Paper, TextField, Button, Grid, Typography, Avatar} from '@mui/material'
import Site from './Images/Dark_Site.png'

function Signup() {
  return (
    <>
        <Container maxWidth="xs" component={Paper} sx={{ p: 3, marginTop: 10 }}>
          <Grid container spacing={1} justifyContent="center" alignItems="center" direction="column">
            <Grid item>
              <Typography variant="h5" gutterBottom>Sign up</Typography>
            </Grid>
            <Grid item>
              <Avatar
                src={Site}
                sx={{ width: 150, height: 150, marginTop: -5}}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{p:1}}>
            <Grid item xs={6}>
              <TextField fullWidth label="Username" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Password" type="password" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Phone Number" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Age" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="City" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <Button size="large" fullWidth variant="contained">
                Sign up
              </Button>
            </Grid>
          </Grid>
      </Container>
    </>
  )
}

export default Signup;
