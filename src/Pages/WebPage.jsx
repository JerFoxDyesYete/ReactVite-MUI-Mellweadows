import React from 'react';
import Site from './Images/wellmeadows.png';
import { Grid, Avatar, Link as MuiLink, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../Styles/style.css';
import Doctor from './Images/doctor.png';

function WebPage() {
  return (
    <div className="background" style={{ minHeight: '110vh' }}>
      <Grid container alignItems="center" spacing={2} justifyContent="space-between">
        <Grid item>
          <Avatar
            alt="Website Logo"
            src={Site}
            sx={{ width: 150, height: 150, marginLeft: 10 }}
          />
        </Grid>
        <Grid item>
          <Link to="/login" style={{ marginRight: 80, color: 'black', fontWeight: 700, fontSize: '25px', fontFamily: 'Lucida Sans Unicode, Lucida Grande, sans-serif' }}>
            Login
          </Link>
        </Grid>
      </Grid>
      <Grid container alignItems="center" spacing={2} justifyContent="space-between">
        <Grid item>
            <Typography sx = {{marginLeft: 25, fontSize: 80, fontWeight: 800, fontFamily: 'system-ui'}}>
            Your Health, <br />
            Our Priority
            </Typography>
        </Grid>
        <Grid item>
            <Avatar
                alt="Doctor Logo"
                src={Doctor}
                sx={{ width: 600, height: 600, marginRight: 30, borderRadius: 0 }}
            />
        </Grid>
      </Grid>
    </div>
  );
}

export default WebPage;
