import { useState } from 'react';
import { Container, Paper, TextField, Button, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import supabase from '../Services/Supabase';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setError('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);

            if (error) {
                throw error;
            }

            setMessage('Password reset email has been sent.');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Container maxWidth="xs" component={Paper} sx={{ p: 3, marginTop: 5 }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center" direction="column">
                <Grid item>
                    <Typography variant="h5" gutterBottom>Forgot Password</Typography>
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
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        Request Password Reset
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

export default ForgotPassword;
