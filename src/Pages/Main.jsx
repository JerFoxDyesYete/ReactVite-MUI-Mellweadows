import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Snackbar, SnackbarContent, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import supabase from '../Services/Supabase';

function Main() {
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [patients, setPatients] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [wardCapacities, setWardCapacities] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const wardNames = ['ICU', 'Orthopedic', 'Pediatrics', 'Emergency', 'NICU', 'Maternity', 'Surgical', 'Medical', 'Cardiology', 'Oncology', 'Psychiatric', 'Burn Unit', 'Neurology', 'Geriatric', 'Rehabilitation', 'Isolation', 'Hematology'];
  const maxWardCapacity = 240;

  useEffect(() => {
    fetchTotalStaffs();
    fetchTotalPatients();
    fetchPatients();
    fetchWaitingList();
    fetchWardCapacities();
  }, []);

  const fetchTotalPatients = async () => {
    try {
      const { count, error } = await supabase
        .from('Patient')
        .select('patient_id', { count: 'exact' });

      if (error) throw error;
      setTotalPatients(count);
    } catch (error) {
      console.error('Error fetching total patients:', error.message);
    }
  };

  const fetchTotalStaffs = async () => {
    try {
      const { count, error } = await supabase
        .from('Staff')
        .select('id', { count: 'exact' });

      if (error) throw error;
      setTotalStaff(count);
    } catch (error) {
      console.error('Error fetching total staff:', error.message);
    }
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('Patient')
        .select('*');

      if (error) throw error;
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error.message);
    }
  };

  const fetchWaitingList = async () => {
    try {
      const { data, error } = await supabase
        .from('Patient')
        .select('*')
        .eq('waiting_list', true); // Fetch only patients on the waiting list

      if (error) throw error;
      setWaitingList(data);
    } catch (error) {
      console.error('Error fetching waiting list:', error.message);
    }
  };

  const fetchWardCapacities = async () => {
    try {
      // Fetch or initialize ward capacities based on your application's logic
      const capacities = {
        1: 15,
        2: 14,
        3: 14,
        4: 14,
        5: 14,
        6: 14,
        7: 14,
        8: 14,
        9: 14,
        10: 14,
        11: 14,
        12: 14,
        13: 14,
        14: 14,
        15: 14,
        16: 14,
        17: 14,
      };
      setWardCapacities(capacities);
    } catch (error) {
      console.error('Error fetching ward capacities:', error.message);
    }
  };

  const remainingCapacity = maxWardCapacity - totalPatients;

  const handleInPatient = async (patientId) => {
    const patient = waitingList.find(p => p.patient_id === patientId);
    if (!patient.ward_num) {
      setSnackbarMessage('Select a ward first');
      setSnackbarOpen(true);
      return;
    }
    try {
      // Update patient record in Supabase
      const { data, error } = await supabase
        .from('Patient')
        .update({ in_patient: true, out_patient: false, waiting_list: false })
        .eq('patient_id', patientId);
  
      if (error) throw error;
  
      // Update local waiting list state to remove the patient
      const updatedWaitingList = waitingList.filter(patient => patient.patient_id !== patientId);
      setWaitingList(updatedWaitingList);
  
      // Update local patients state to reflect the change
      const updatedPatients = patients.map(patient => {
        if (patient.patient_id === patientId) {
          return { ...patient, in_patient: true, out_patient: false, waiting_list: false };
        }
        return patient;
      });
      setPatients(updatedPatients);
  
    } catch (error) {
      console.error('Error updating patient to in-patient:', error.message);
    }
  };
  
  const handleOutPatient = async (patientId) => {
    try {
      // Update patient record in Supabase
      const { data, error } = await supabase
        .from('Patient')
        .update({ in_patient: false, out_patient: true, waiting_list: false, ward_num: null })
        .eq('patient_id', patientId);
  
      if (error) throw error;
  
      // Update local waiting list state to remove the patient
      const updatedWaitingList = waitingList.filter(patient => patient.patient_id !== patientId);
      setWaitingList(updatedWaitingList);
  
      // Update local patients state to reflect the change
      const updatedPatients = patients.map(patient => {
        if (patient.patient_id === patientId) {
          return { ...patient, out_patient: true, ward_num: null };
        }
        return patient;
      });
      setPatients(updatedPatients);
  
    } catch (error) {
      console.error('Error updating patient to out-patient:', error.message);
    }
  };

  const handleWardChange = async (patientId, selectedWard) => {
    try {
      // Check if the selected ward is already at full capacity
      const currentWardPatients = patients.filter(patient => patient.ward_num === selectedWard).length;
      const maxCapacity = wardCapacities[selectedWard] || 0;

      if (currentWardPatients >= maxCapacity) {
        const message = `Ward ${selectedWard} is already at full capacity.`;
        setSnackbarMessage(message);
        setSnackbarOpen(true);
        return; // Exit function if ward is at full capacity
      }

      const updatedPatients = waitingList.map(patient => {
        if (patient.patient_id === patientId) {
          return { ...patient, ward_num: selectedWard };
        }
        return patient;
      });
      setWaitingList(updatedPatients);
  
      // Update the database (if necessary) with the new ward_num
      const { data, error } = await supabase
        .from('Patient')
        .update({ ward_num: selectedWard })
        .eq('patient_id', patientId);
  
      if (error) throw error;
      console.log(`Updated ward number for patient ${patientId} to ${selectedWard}`);
    } catch (error) {
      console.error('Error updating ward number:', error.message);
    }
  };

  const inPatients = patients.filter(patient => patient.in_patient);

  const outPatients = patients.filter(patient => patient.out_patient);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h1" sx={{ fontSize: '60px', textAlign: 'center', marginTop: 7, fontWeight: 700 }}>
              {totalPatients}
            </Typography>
            <Typography variant="h1" sx={{ fontSize: '30px', textAlign: 'center', backgroundColor: 'rgb(120, 231, 120)', marginTop: 7 }}>
              TOTAL PATIENT
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h1" sx={{ 
              fontSize: '60px',
              textAlign: 'center',
              marginTop: 7,
              fontWeight: 700,
              color: remainingCapacity === 0 ? 'rgb(120, 231, 120)' : 'inherit'
            }}>
              {remainingCapacity === 0 ? "There's no bed for you today" : remainingCapacity}
            </Typography>
            <Typography variant="h1" sx={{ 
              fontSize: '30px',
              textAlign: 'center',
              backgroundColor: 'rgb(120, 231, 120)',
              marginTop: 7
            }}>
              BED CAPACITY
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h1" sx={{ fontSize: '60px', textAlign: 'center', marginTop: 7, fontWeight: 700 }}>
              {totalStaff}
            </Typography>
            <Typography variant="h1" sx={{ fontSize: '30px', textAlign: 'center', backgroundColor: 'rgb(120, 231, 120)', marginTop: 7 }}>
              STAFFS
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography sx={{ marginTop: 5, fontSize: '30px', marginBottom: 5, fontFamily: 'Helvetica, sans-serif'}}>
        Waiting List:
      </Typography>

      <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '50vh', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="waiting-list table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Patient Name</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Birthday</TableCell>
              <TableCell align="center">Marital Status</TableCell>
              <TableCell align="center">Cellphone Number</TableCell>
              <TableCell align="center">Date Registered</TableCell>
              <TableCell align="center">IN PATIENTS</TableCell>
              <TableCell align="center">OUT PATIENTS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render IN patients */}
            {waitingList.map((patient) => (
              <TableRow key={`${patient.firstname}-${patient.lastname}`}>
                <TableCell align="center">{`${patient.firstname} ${patient.lastname}`}</TableCell>
                <TableCell align="center">{patient.gender}</TableCell>
                <TableCell align="center">{patient.address}</TableCell>
                <TableCell align="center">{patient.date_of_birth}</TableCell>
                <TableCell align="center">{patient.marital_status}</TableCell>
                <TableCell align="center">{patient.cellphone_number}</TableCell>
                <TableCell align="center">{patient.date_registered}</TableCell>
                <TableCell align="center">
                  {patient.out_patient ? (
                    // Display "OUT" if patient is already out
                    <Typography variant="body2" color="secondary">OUT</Typography>
                  ) : (
                    // Display buttons for IN patients and dropdown for ward selection
                    <>
                      <Button
                        onClick={() => handleInPatient(patient.patient_id)}
                        variant="contained"
                        color="primary"
                        sx={{ marginRight: 1, marginTop: 1 }}
                      >
                        IN
                      </Button>
                      {/* Dropdown for ward selection */}
                      <FormControl sx={{ minWidth: 100 }}>
                        <InputLabel>Ward</InputLabel>
                        <Select
                          value={patient.ward_num || ''}
                          onChange={(e) => handleWardChange(patient.patient_id, e.target.value)}
                        >
                          {wardNames.map((name, index) => (
                            <MenuItem key={index + 1} value={index + 1}>{`Ward ${index + 1} ${name}`}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </>
                  )}
                </TableCell>
                <TableCell align="center">
                  {/* Button to mark patient as OUT */}
                  <Button onClick={() => handleOutPatient(patient.patient_id)} variant="contained" color="secondary">
                    OUT
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Typography sx={{ marginTop: 5, fontSize: '30px', marginBottom: 5, fontFamily: 'Helvitica, sans-serif' }}>In Patients:</Typography>

      <TableContainer component={Paper} sx={{ marginTop: 2 , maxHeight: '50vh', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="in-patients table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Marital Status</TableCell>
              <TableCell align="center">Date Registered</TableCell>
              <TableCell align="center">Date Expected Leave</TableCell>
              <TableCell align="center">Ward Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inPatients.map((patient) => (
              <TableRow key={patient.patient_id}>
                <TableCell align="center">{patient.firstname} {patient.lastname}</TableCell>
                <TableCell align="center">{patient.gender}</TableCell>
                <TableCell align="center">{patient.address}</TableCell>
                <TableCell align="center">{patient.marital_status}</TableCell>
                <TableCell align="center">{patient.date_registered}</TableCell>
                <TableCell align="center">{patient.date_expected_leave}</TableCell>
                <TableCell align="center">{patient.ward_num}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography sx={{ marginTop: 5, fontSize: '30px', marginBottom: 5, fontFamily: 'Helvitica, sans-serif'}}>Out Patients:</Typography>

      <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '50vh', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="out-patients table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Marital Status</TableCell>
              <TableCell align="center">Date Registered</TableCell>
              <TableCell align="center">Date Expected Leave</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {outPatients.map((patient) => (
              <TableRow key={patient.patient_id}>
                <TableCell align="center">{patient.firstname} {patient.lastname}</TableCell>
                <TableCell align="center">{patient.gender}</TableCell>
                <TableCell align="center">{patient.address}</TableCell>
                <TableCell align="center">{patient.marital_status}</TableCell>
                <TableCell align="center">{patient.date_registered}</TableCell>
                <TableCell align="center">{patient.date_expected_leave}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%', fontSize: 18 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </>
  );
}

export default Main;
