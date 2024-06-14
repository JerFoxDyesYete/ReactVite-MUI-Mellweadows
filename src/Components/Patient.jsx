import { Container, Grid, TextField, Typography, Paper, Button, Box, FormControl, InputLabel, Select, MenuItem, FormGroup, 
  FormControlLabel, Checkbox, Avatar, Snackbar, IconButton } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react";
import supabase from '../Services/Supabase';
import Site from '../Pages/Images/wellmeadows.png';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function Patient() {
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [dateRegistered, setDateRegistered] = useState(null);
  const [datePlaceWaiting, setDatePlaceWaiting] = useState(null);
  const [datePlaceWard, setDatePlaceWard] = useState(null);
  const [dateExpectedLeave, setDateExpectedLeave] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State for Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // 'error', 'success', etc.

  const [waitingList, setWaitingList] = useState(true);

  function formatDateForDatabase(dateString) {
    if (!dateString) return null;

    if (typeof dateString === 'string') {
      const parts = dateString.split('-');
      const date = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
      return date.toISOString().split('T')[0];
    } else {
      return dateString;
    }
  }

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cellphoneNumber: '',
    address: '',
    gender: '',
    maritalStatus: '',
    dateOfBirth: null,
    dateRegistered: null,
    datePlaceWaiting: null,
    datePlaceWard: null,
    dateExpectedLeave: null,
    nextOfKinFirstName: '',
    nextOfKinLastName: '',
    relationshipToPatient: '',
    nextOfKinAddress: '',
    nextOfKinTelephoneNumber: '',
  });

  const handleDateChange = (dateSetter) => (newDate) => {
    dateSetter(newDate);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close the Snackbar
  };

  const handleAddPatient = async () => {
    if (
      formData.firstName === '' ||
      formData.lastName === '' ||
      formData.email === '' ||
      formData.cellphoneNumber === '' ||
      formData.address === '' ||
      formData.gender === '' ||
      formData.maritalStatus === '' ||
      formData.nextOfKinFirstName === '' ||
      formData.nextOfKinLastName === '' ||
      formData.relationshipToPatient === '' ||
      formData.nextOfKinTelephoneNumber === '' ||
      formData.nextOfKinAddress === '' ||
      !dateOfBirth ||
      !dateRegistered ||
      !datePlaceWaiting ||
      !datePlaceWard ||
      !dateExpectedLeave 
    ) {
      setSnackbarMessage('Please fill in all fields.'); // Set Snackbar message
      setSnackbarOpen(true); // Open Snackbar
      return; // Exit function
    }

    try {
      console.log('Form Data:', formData);

      const formattedDateOfBirth = formatDateForDatabase(dateOfBirth);
      const formattedDateRegistered = formatDateForDatabase(dateRegistered);
      const formattedDatePlaceWaiting = formatDateForDatabase(datePlaceWaiting);
      const formattedDatePlaceWard = formatDateForDatabase(datePlaceWard);
      const formattedDateExpectedLeave = formatDateForDatabase(dateExpectedLeave);

      const patientData = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        cellphone_number: formData.cellphoneNumber,
        address: formData.address,
        gender: formData.gender,
        marital_status: formData.maritalStatus,
        date_of_birth: formattedDateOfBirth,
        date_registered: formattedDateRegistered,
        date_place_waiting: formattedDatePlaceWaiting,
        date_place_ward: formattedDatePlaceWard,
        date_expected_leave: formattedDateExpectedLeave,
        waiting_list: true,
      };

      const { data: patientInsertData, error: patientInsertError } = await supabase
        .from('Patient')
        .insert([patientData])
        .select();
      if (patientInsertError) throw patientInsertError;
      console.log('Patient added:', patientInsertData);

      const patientId = patientInsertData ? patientInsertData[0].patient_id : null;
      console.log('Inserted Patient ID:', patientId);

      const nextOfKinData = {
        firstname: formData.nextOfKinFirstName,
        lastname: formData.nextOfKinLastName,
        relationship_patient: formData.relationshipToPatient,
        address: formData.nextOfKinAddress,
        telephone_number: formData.nextOfKinTelephoneNumber,
        patient_id: patientId,
      };

      const { data: nextOfKinInsertData, error: nextOfKinInsertError } = await supabase
        .from('Next_Of_Kin')
        .insert([nextOfKinData]);
      if (nextOfKinInsertError) throw nextOfKinInsertError;
      console.log('Next of Kin added:', nextOfKinInsertData);

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        cellphoneNumber: '',
        address: '',
        gender: '',
        maritalStatus: '',
        dateOfBirth: '',
        dateRegistered: '',
        datePlaceWaiting: '',
        datePlaceWard: '',
        dateExpectedLeave: '',
        nextOfKinFirstName: '',
        nextOfKinLastName: '',
        relationshipToPatient: '',
        nextOfKinAddress: '',
        nextOfKinTelephoneNumber: '',
      });
      setDateOfBirth(null);
      setDateRegistered(null);
      setDatePlaceWaiting(null);
      setDatePlaceWard(null);
      setDateExpectedLeave(null);
      setWaitingList(true);

      setSnackbarMessage('Patient added successfully.'); // Set success message for Snackbar
      setSnackbarSeverity('success');
      setSnackbarOpen(true); // Open success Snackbar
    } catch (error) {
      console.error('Error adding patient:', error.message);
      setSnackbarMessage('Failed to add patient. Please try again.'); // Set error message for Snackbar
      setSnackbarSeverity('error');
      setSnackbarOpen(true); // Open error Snackbar
    }
  };

  return (
    <>
      <Container maxWidth="sm" component={Paper} sx={{ p: 3}}>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Grid container direction="column" alignItems="center">
                <Grid item>
                  <Avatar
                    alt="Website Logo"
                    src={Site}
                    sx={{ width: 150, height: 150 }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h5" sx={{ padding: 2, textAlign: 'center', fontWeight: 800, fontFamily: 'Lucida Sans Unicode, Lucida Grande, sans-serif' }}>
                    Patient Registration Form
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                name="firstname"
                value={formData.firstName} // Bind the value to the corresponding state property
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} // Update the state on change
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
                value={formData.lastName} // Bind the value to the corresponding state property
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} // Update the state on change
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
                label="Email"
                variant="outlined"
                name="email"
                value={formData.email} // Bind the value to the corresponding state property
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} // Update the state on change
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
                label="Cellphone Number"
                variant="outlined"
                name="cellphone_number"
                value={formData.cellphoneNumber} // Bind the value to the corresponding state property
                onChange={(e) => setFormData({ ...formData, cellphoneNumber: e.target.value })} // Update the state on change
                sx={{
                  '& .MuiOutlinedInput-root': {
                      borderRadius: 5,
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      sx={{
                            borderRadius: 5
                      }}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                  <InputLabel id="marital-status-label">Marital Status</InputLabel>
                      <Select
                        labelId="marital-status-label"
                        id="marital_status"
                        label="Marital Status"
                        name="marital_status"
                        value={formData.maritalStatus}
                        onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                        sx={{
                              borderRadius: 5
                        }}
                      >
                        <MenuItem value="Single">Single</MenuItem>
                        <MenuItem value="Married">Married</MenuItem>
                        <MenuItem value="Widowed">Widowed</MenuItem>
                        <MenuItem value="Divorce">Divorce</MenuItem>
                      </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                name="address"
                value={formData.address} // Bind the value to the corresponding state property
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} // Update the state on change
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
                  label="Date of Birth"
                  value={dateOfBirth} // Selected value
                  onChange={handleDateChange(setDateOfBirth)} // Event handler for date change
                  textField={<TextField variant="outlined" />}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 5,
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            {/* Date Registered */}
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date Registered"
                  value={dateRegistered}
                  onChange={handleDateChange(setDateRegistered)}
                  textField={<TextField variant="outlined" />}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 5,
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date Place Waiting"
                  value={datePlaceWaiting} // Selected value
                  onChange={handleDateChange(setDatePlaceWaiting)} // Event handler for date change
                  textField={<TextField variant="outlined" />}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 5,
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date Place Ward"
                  value={datePlaceWard} // Selected value
                  onChange={handleDateChange(setDatePlaceWard)} // Event handler for date change
                  textField={<TextField variant="outlined" />}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 5,
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date Expected Leave"
                  value={dateExpectedLeave} // Selected value
                  onChange={handleDateChange(setDateExpectedLeave)} // Event handler for date change
                  textField={<TextField variant="outlined" />}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 5,
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        <Typography variant="h5" sx={{ padding: 2, marginTop: 2, marginBottom: 2, textAlign: 'center', fontWeight: 800, fontFamily: 'Lucida Sans Unicode, Lucida Grande, sans-serif'}}>
            Next of Kin
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                value={formData.nextOfKinFirstName} // Bind the value to the corresponding state property
                onChange={(e) => setFormData({ ...formData, nextOfKinFirstName: e.target.value })} // Update the state on change
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
                value={formData.nextOfKinLastName} // Bind the value to the corresponding state property
                onChange={(e) => setFormData({ ...formData, nextOfKinLastName: e.target.value })} // Update the state on change
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
                label="Relationship to patient"
                variant="outlined"
                value={formData.relationshipToPatient} // Bind the value to the corresponding state property
                onChange={(e) => setFormData({ ...formData, relationshipToPatient: e.target.value })} // Update the state on change
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
                value={formData.nextOfKinTelephoneNumber} // Bind the value to the corresponding state property
                onChange={(e) => setFormData({ ...formData, nextOfKinTelephoneNumber: e.target.value })} // Update the state on change
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
                value={formData.nextOfKinAddress} // Bind the value to the corresponding state property
                onChange={(e) => setFormData({ ...formData, nextOfKinAddress: e.target.value })} // Update the state on change
                sx={{
                  '& .MuiOutlinedInput-root': {
                      borderRadius: 5,
                  }
                }}
              />
          </Grid>
        </Grid>
        <Grid container alignItems="center" justifyContent="flex-end"> {/* Parent container with flexbox */}
          <Grid item>
            </Grid>
              <Grid>
                <Button size="large" variant="contained" 
                sx={{borderRadius: 4, 
                    marginTop: 2,
                    backgroundColor: 'rgb(29, 94, 37)',
                    '&:hover': {
                        backgroundColor: 'rgb(20, 70, 25)',
                    },
                    height: '6vh',
                }} onClick={handleAddPatient}>ADD PATIENT</Button>
            </Grid>
        </Grid>
        <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose }
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
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose }>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
          />
      </Container>
    </>
  );
}

export default Patient;