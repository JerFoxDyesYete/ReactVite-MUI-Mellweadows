import { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Grid, Typography } from '@mui/material';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import supabase from '../Services/Supabase';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function ResetPassword() {
    const navigate = useNavigate();
    const query = useQuery();
    const access_token = query.get('access_token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!access_token) {
            navigate('/'); // Redirect to login if access_token is missing
        }
    }, [access_token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setIsSubmitting(false);
            return;
        }

        try {
            const { error } = await supabase.auth.api.updateUser(access_token, { password });

            if (error) {
                throw error;
            }

            setMessage('Password has been reset successfully.');
            // Optionally, you can redirect to another page after successful reset
            navigate('/'); // Redirect to login page after successful reset
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="xs" component={Paper} sx={{ p: 3, marginTop: 5 }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center" direction="column">
                <Grid item>
                    <Typography variant="h5" gutterBottom>Reset Password</Typography>
                    {error && (
                        <Typography color="error">{error}</Typography>
                    )}
                    {message && (
                        <Typography color="primary">{message}</Typography>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="New Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        variant="outlined"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        Reset Password
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth variant="contained">
                        <Link to='/' className='without-underline'>
                            Back to Login
                        </Link>
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ResetPassword;
