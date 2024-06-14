import React, { useState } from 'react';
import { Typography, TextField, Button, Paper, Grid, Container, Avatar, Snackbar, IconButton } from '@mui/material';
import supabase from '../Services/Supabase';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Site from '../Pages/Images/wellmeadows.png';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function AddSupply() {
    const [newSupply, setNewSupply] = useState({
        Supplies_name: '',
        Description: '',
        Category: '',
        Price: '',
        Quantity: '',
        Expiration_Date: null
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // 'error', 'success', etc.

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewSupply({
            ...newSupply,
            [name]: value
        });
    };

    const handleDateChange = (date) => {
        setNewSupply({
            ...newSupply,
            Expiration_Date: date // Ensure Expiration_Date is set to a Date object
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const addSupply = async () => {
        // Check if any field is empty
        for (let key in newSupply) {
            if (!newSupply[key]) {
                setSnackbarSeverity('error');
                setSnackbarMessage('Fill in all the fields.');
                setSnackbarOpen(true);
                return;
            }
        }

        try {
            const { data, error } = await supabase
                .from('Supplies')
                .insert([newSupply]);

            if (error) {
                throw error;
            }

            console.log('Supply added successfully:', data);
            // Clear all fields after successful insertion
            setNewSupply({
                Supplies_name: '',
                Description: '',
                Category: '',
                Price: '',
                Quantity: '',
                Expiration_Date: null
            });
            setSnackbarSeverity('success');
            setSnackbarMessage('Supply added successfully.');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error adding supply:', error.message);
            setSnackbarSeverity('error');
            setSnackbarMessage('Failed to add supply.');
            setSnackbarOpen(true);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper sx={{
                padding: 3,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Grid item>
                    <Avatar
                        src={Site}
                        sx={{ width: 150, height: 150 }}
                    />
                </Grid>
                <Typography variant="h5" sx={{ marginBottom: 2 , fontWeight: 800, fontFamily: 'Lucida Sans Unicode, Lucida Grande, sans-serif'}}>ADD NEW SUPPLY</Typography>

                <TextField
                    fullWidth
                    name="Supplies_name"
                    label="Supplies Name"
                    variant="outlined"
                    value={newSupply.Supplies_name}
                    onChange={handleInputChange}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    fullWidth
                    name="Description"
                    label="Description"
                    variant="outlined"
                    value={newSupply.Description}
                    onChange={handleInputChange}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    fullWidth
                    name="Category"
                    label="Category"
                    variant="outlined"
                    value={newSupply.Category}
                    onChange={handleInputChange}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    fullWidth
                    name="Price"
                    label="Price"
                    type="number"
                    variant="outlined"
                    value={newSupply.Price}
                    onChange={handleInputChange}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    fullWidth
                    name="Quantity"
                    label="Quantity"
                    type="number"
                    variant="outlined"
                    value={newSupply.Quantity}
                    onChange={handleInputChange}
                    sx={{ marginBottom: 2 }}
                />
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            fullWidth
                            label="Expiration Date"
                            value={newSupply.Expiration_Date}
                            onChange={handleDateChange}
                            textField={<TextField variant="outlined" />}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 5,
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={addSupply}
                            sx={{
                                borderRadius: 5,
                                height: 50,
                                backgroundColor: 'rgb(29, 94, 37)',
                                '&:hover': {
                                    backgroundColor: 'rgb(20, 70, 25)',
                                }
                            }}
                        >
                            Add Supply
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Snackbar for displaying validation/error messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        {snackbarSeverity === 'error' && <ErrorIcon color="error" sx={{ marginRight: 1 }} />}
                        {snackbarSeverity === 'success' && <CheckCircleOutlineIcon color="success" sx={{ marginRight: 1 }} />} {/* Success icon */}
                        <Typography variant="body1" sx={{ color: snackbarSeverity }}>{snackbarMessage}</Typography>
                    </span>
                }
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                key={'top' + 'center'}
                severity={snackbarSeverity}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </Container>
    );
}
