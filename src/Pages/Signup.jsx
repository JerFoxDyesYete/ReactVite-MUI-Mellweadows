import {Container, Paper, TextField, Button, Grid, Typography, Avatar, InputAdornment, IconButton} from '@mui/material'
import Site from './Images/Dark_Site.png'
import {Link} from 'react-router-dom'
import '../Styles/index.css'
import { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Signup() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  return (
    <>
        <Container maxWidth="xs" component={Paper} sx={{ p: 3, marginTop: 5 }}>
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
              <TextField 
              fullWidth 
              label="Password" 
              variant="outlined" 
              type={showPassword ? "text" : "password"}
              InputProps={{
                  endAdornment: <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                  </InputAdornment>
              }}/>
            </Grid>
            <Grid item xs={12}>
              <TextField 
              fullWidth 
              label="Confirm Password" 
                    type={showConfirmPassword ? "text" : "password"}
                    variant="outlined" 
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <IconButton onClick={() => setConfirmShowPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </InputAdornment>
                    }}
              />
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
              <Button size="large" fullWidth variant="contained" sx={{marginBottom: 1}}>
                Sign up
              </Button>
              <Button size="large" fullWidth variant="contained">
                  <Link to='/' className='without-underline'>
                      Log in
                  </Link>
              </Button>
            </Grid>
          </Grid>
      </Container>
    </>
  )
}

export default Signup;
