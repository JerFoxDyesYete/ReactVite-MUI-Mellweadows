import {Container, Paper, TextField, Button, Grid, Typography, Avatar, Box, InputAdornment, IconButton } from '@mui/material'
import Site from './Images/Dark_Site.png'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import supabase from '../Services/Supabase';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const login = async() => {
        let { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if(error !== null){
            setIsError(true);
            setErrorMessage(error.message);
            return
        }
        if (data !== null){
            navigate("/dashboard");
        }
    }

    return (
        <>
            <Container maxWidth="xs" component={Paper} sx={{ p: 3, marginTop: 10 }}>
                <Grid container spacing={1} justifyContent="center" alignItems="center" direction="column">
                    <Grid item>
                        <Typography variant="h5" gutterBottom sx={{textAlign: "center"}}>Log in</Typography>
                        {
                            isError &&
                            <Box>
                                <Typography sx={{color:"red"}}>{errorMessage}</Typography>
                            </Box>
                        }
                    </Grid>
                    <Grid item>
                        <Avatar
                            src={Site}
                            sx={{ width: 150, height: 150, marginTop: -5}}
                        />
                    </Grid>
                </Grid>
                <Box item sx={{p: 1}}>
                    <TextField fullWidth label="Username" variant="outlined" onChange={(e) => setEmail(e.target.value)}/>
                </Box>
                <Grid item sx={{p: 1}}>
                    <TextField fullWidth
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password" 
                    type={showPassword ? "text" : "password"}
                    variant="outlined" 
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </InputAdornment>
                    }}
                    />
                </Grid>
                <Box sx={{ p: 1 }}>
                    <Button 
                    size="large" 
                    onClick={login}
                    fullWidth 
                    variant="contained" 
                    sx={{marginBottom: 1}}
                    >
                        Sign in
                    </Button>
                    <Button size="large" fullWidth variant="contained">
                        <Link to='/signup' className='without-underline'>
                            CREATE AN ACCOUNT
                        </Link>
                    </Button>
                </Box>
            </Container>
        </>
    )
}

export default Login;