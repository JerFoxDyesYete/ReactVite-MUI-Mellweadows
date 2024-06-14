import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Avatar,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Site from "./Images/wellmeadows.png";
import '../Styles/index.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import supabase from "../Services/Supabase";

function Signup() {
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [generatedNIN, setGeneratedNIN] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const allowedDomains = ['gmail.com', 'yahoo.com'];
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // 'error', 'success', etc.

  const validatePassword = (password) => {
    return passwordRegex.test(password);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const initialFormData = {
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: '',
    email: '',
    address: '',
    phoneNumber: '',
    jobPosition: '',
    gender: '',
    dateOfBirth: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (dateSetter) => (newDate) => {
    dateSetter(newDate);
  };

  function formatDateForDatabase(dateString) {
    if (!dateString) {
      return null;
    }

    if (typeof dateString === 'string') {
      const parts = dateString.split('-');
      const date = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
      const formattedDate = date.toISOString().split('T')[0];
      return formattedDate;
    } else {
      return dateString;
    }
  }

  const generateRandomNIN = () => {
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
  };

  const handleSignUp = async (userData) => {
    try {
      const formattedDateOfBirth = formatDateForDatabase(dateOfBirth);
      const { user, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      if (error) throw error;

      const { data, error: insertError } = await supabase
        .from('Staff')
        .insert([
          {
            firstname: userData.firstname,
            lastname: userData.lastname,
            password: userData.password,
            confirm_password: userData.confirmPassword,
            date_of_birth: formattedDateOfBirth,
            email: userData.email,
            address: userData.address,
            phone_number: userData.phoneNumber,
            job_position: userData.jobPosition,
            gender: userData.gender,
            nin: generatedNIN,
          },
        ]);

      if (insertError) throw insertError;
      console.log('User created and data inserted:', data);
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    const { firstname, lastname, password, confirmPassword, email, phoneNumber, gender, jobPosition } = formData;

    if (!firstname || !lastname || !password || !confirmPassword || !email || !phoneNumber || !gender || !jobPosition) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Fill in all the fields.');
      setSnackbarOpen(true);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase letters, numbers, and symbols.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const emailDomain = email.split('@')[1];
    if (!allowedDomains.includes(emailDomain)) {
      setError('Please sign up with a Gmail or Yahoo email address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const newNIN = generateRandomNIN();
      setGeneratedNIN(newNIN);
      setOpenDialog(true); // Open the dialog to show the generated NIN
    } catch (error) {
      console.error('Error generating NIN:', error.message);
      setError('Error generating NIN. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = async () => {
    setOpenDialog(false);
    formData.nin = generatedNIN;
    try {
      await handleSignUp(formData);
      setIsSubmitting(false);
      setSnackbarSeverity('success');
      setSnackbarMessage('Supply added successfully.');
      setSnackbarOpen(true);
      setFormData(initialFormData);
      setDateOfBirth(null);
      navigate('/login')
    } catch (error) {
      console.error('Error signing up:', error.message);
      setError('Error signing up. Please try again.');
      setIsSubmitting(false);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to add supply.');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Container maxWidth="sm" component={Paper} sx={{ p: 3, marginTop: 5 }}>
        <Grid container spacing={1} justifyContent="center" alignItems="center" direction="column">
          <Grid item>
            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
          </Grid>
          <Grid item>
            <Avatar
              src={Site}
              sx={{ width: 150, height: 150, marginTop: -5 }}
            />
          </Grid>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>Sign up</Typography>
        </Grid>
        <Grid container spacing={2} sx={{ p: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 5,
                }
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 5,
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 5,
                }
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 5,
                }
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={() => setConfirmShowPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="job-position-label">Job Position</InputLabel>
              <Select
                labelId="job-position-label"
                id="job-position"
                label="Job Position"
                name="jobPosition"
                value={formData.jobPosition}
                onChange={handleChange}
                sx={{
                  borderRadius: 5
                }}
              >
                <MenuItem value="Charge Nurse">Charge Nurse</MenuItem>
                <MenuItem value="Personnel Officer">Personnel Officer</MenuItem>
                <MenuItem value="Medical Doctor">Medical Doctor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                sx={{
                  borderRadius: 5
                }}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 5,
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              name="address"
              value={formData.address}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 5,
                }
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 5,
                }
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Birthday"
                value={dateOfBirth}
                onChange={handleDateChange(setDateOfBirth)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 5,
                  }
                }}
                textField={<TextField variant="outlined" />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button
              size="large"
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                marginBottom: 1,
                borderRadius: 3,
                marginLeft: 13,
                backgroundColor: 'rgb(29, 94, 37)',
                '&:hover': {
                  backgroundColor: 'rgb(20, 70, 25)',
                },
                width: '60%',
                display: 'block',
                margin: '0 auto',
              }}
            >
              Sign up
            </Button>
          </Grid>
        </Grid>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                  {snackbarSeverity === 'error' && <ErrorIcon color="error" sx={{ marginRight: 1 }} />}
                  {snackbarSeverity === 'success' && <CheckCircleOutlineIcon color="success" sx={{ marginRight: 1 }} />} {/* Success icon */}
                  <Typography variant="body1" sx={{ color: snackbarSeverity === 'error' ? 'error.main' : 'success.main' }}>
                    {snackbarMessage}
                  </Typography>
              </span>
          }
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          key={'top' + 'center'}
          action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
                  <CloseIcon fontSize="small" />
              </IconButton>
          }
        />

      </Container>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>NIN Generated</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your generated NIN is: {generatedNIN}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Signup;