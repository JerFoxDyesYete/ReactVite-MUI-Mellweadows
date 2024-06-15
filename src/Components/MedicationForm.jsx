import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Typography, Paper, Grid, Snackbar, IconButton, Avatar } from '@mui/material';
import supabase from '../Services/Supabase';
import Site from '../Pages/Images/wellmeadows.png';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const MedicationForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [staff, setStaff] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [selectedSupply, setSelectedSupply] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // 'error', 'success', etc.

  const handleSnackbarOpen = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchPatientData = async () => {
    try {
      const { data: patientData, error: patientError } = await supabase
        .from('Patient')
        .select('patient_id, ward_num, firstname, lastname')
        .or(`firstname.ilike.%${searchTerm}%,lastname.ilike.%${searchTerm}%`);

      if (patientError) throw patientError;

      setPatients(patientData);
    } catch (error) {
      console.error('Error fetching patient data:', error.message);
    }
  };

  const fetchStaffForWard = async (ward_num) => {
    try {
      const { data: staffData, error: staffError } = await supabase
        .from('Staff')
        .select('id, firstname, lastname')
        .eq('ward_num', ward_num);

      if (staffError) throw staffError;

      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching staff data:', error.message);
    }
  };

  const fetchSupplies = async () => {
    try {
      const { data: supplyData, error: supplyError } = await supabase
        .from('Supplies')
        .select('id, Supplies_name, Quantity');

      if (supplyError) throw supplyError;

      setSupplies(supplyData);
    } catch (error) {
      console.error('Error fetching supplies:', error.message);
    }
  };

  const handlePatientSelect = async (patient) => {
    setSelectedPatient(patient);
    if (patient.ward_num) {
      await fetchStaffForWard(patient.ward_num);
    }
  };

  const handleQuantityChange = (e) => {
    let value = parseInt(e.target.value, 10); // Parse input value as integer
    value = isNaN(value) ? 0 : Math.max(0, value); // Ensure value is non-negative
  
    setQuantity(value);
  };

  const handleSubmit = async () => {
    try {
      // Check if all required fields are filled
      if (
        selectedPatient === null ||
        selectedPatient === undefined ||
        selectedStaff === null ||
        selectedStaff === undefined ||
        selectedSupply === null ||
        selectedSupply === undefined ||
        quantity <= 0
      ) {
        handleSnackbarOpen('error', 'Fill in all the fields.');
        return;
      }

      const { data: medicationData, error: medicationError } = await supabase
        .from('MedicationRecords')
        .insert([
          {
            patient_id: selectedPatient.patient_id,
            ward_num: selectedPatient.ward_num,
            staff_id: selectedStaff,
            supply_id: selectedSupply,
            quantity: quantity,
          },
        ]);
  
      if (medicationError) throw medicationError;

      // Update supply quantity
      const supplyToUpdate = supplies.find((s) => s.id === selectedSupply);
      if (supplyToUpdate && selectedSupply) {
        const newQuantity = supplyToUpdate.Quantity - quantity;
        const { data: updateSupplyData, error: updateSupplyError } = await supabase
          .from('Supplies')
          .update({ Quantity: newQuantity })
          .eq('id', selectedSupply);
  
        if (updateSupplyError) {
          console.error('Error updating supply quantity:', updateSupplyError);
          throw updateSupplyError;
        }

        // Fetch updated supplies data
        const { data: updatedSupplies, error: fetchSupplyError } = await supabase
          .from('Supplies')
          .select('id, Supplies_name, Quantity');
  
        if (fetchSupplyError) {
          console.error('Error fetching updated supplies:', fetchSupplyError);
        } else {
          setSupplies(updatedSupplies);
        }
      }

      // Reset form fields
      setSearchTerm('');
      setSelectedPatient(null);
      setPatients([]);
      setStaff([]);
      setSelectedSupply('');
      setQuantity(0);
      setSelectedStaff('');

      // Show success message
      handleSnackbarOpen('success', 'Request submitted successfully.');
    } catch (error) {
      console.error('Error submitting medication form:', error.message);
      handleSnackbarOpen('error', 'Failed to submit request.');
    }
  };
  

  return (
    <div>
      <Paper sx={{ p: 4, margin: '0 auto', maxWidth: 600, display: 'flex', flexDirection: 'column', alignItems: 'center' }} elevation={3}>
        < Grid item>
            <Avatar
                src={Site}
                sx={{ width: 150, height: 150 }}
            />
        </Grid>
          <Typography 
          variant="h5" 
          gutterBottom
          sx = {{
            fontWeight: 800, 
            fontFamily: 'Lucida Sans Unicode, Lucida Grande, sans-serif'
          }}
          >
            Medication Form
          </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} marginTop={2}>
                <TextField
                  label="Search Patient"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                variant="contained" 
                color="primary" 
                sx={{
                  borderRadius: 5,
                  height: 50,
                  marginBottom: 2,
                  backgroundColor: 'rgb(29, 94, 37)',
                  '&:hover': {
                      backgroundColor: 'rgb(20, 70, 25)',
                  }
                }}
                onClick={fetchPatientData} 
                fullWidth
                >
                  Search
                </Button>
              </Grid>
            </Grid>

            {patients.length > 0 && (
              <TextField
                select
                label="Patient Selected"
                value={selectedPatient ? `${selectedPatient.firstname} ${selectedPatient.lastname}` : ''}
                onChange={(e) => handlePatientSelect(patients.find(patient => `${patient.firstname} ${patient.lastname}` === e.target.value))}
                fullWidth
              >
                {patients.map((patient) => (
                  <MenuItem key={patient.patient_id} value={`${patient.firstname} ${patient.lastname}`}>
                    {`${patient.firstname} ${patient.lastname}`}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {selectedPatient && (
              <Grid container spacing={2} marginTop={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Patient ID"
                    value={selectedPatient.patient_id}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Ward Number"
                    value={selectedPatient.ward_num || 'Out Patient'}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  {staff.length > 0 && (
                    <TextField
                      select
                      label="Select Staff"
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      fullWidth
                    >
                      {staff.map((staffMember) => (
                        <MenuItem key={staffMember.id} value={staffMember.id}>
                          {`${staffMember.firstname} ${staffMember.lastname}`}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Grid>
              </Grid>
            )}

            <Grid container spacing={2} marginTop={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Select Supply"
                  value={selectedSupply}
                  onChange={(e) => setSelectedSupply(e.target.value)}
                  fullWidth
                >
                  {supplies.map((supply) => (
                    <MenuItem key={supply.id} value={supply.id}>
                      {supply.Supplies_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit} 
                fullWidth
                sx={{
                  borderRadius: 5,
                  height: 50,
                  backgroundColor: 'rgb(29, 94, 37)',
                  '&:hover': {
                      backgroundColor: 'rgb(20, 70, 25)',
                  }
                }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
        </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {snackbarSeverity === 'error' && <ErrorIcon color="error" sx={{ marginRight: 1 }} />}
            {snackbarSeverity === 'success' && <CheckCircleOutlineIcon color="success" sx={{ marginRight: 1 }} />}
            <Typography variant="body1" sx={{ color: snackbarSeverity }}>{snackbarMessage}</Typography>
          </span>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        key={'top' + 'center'}
        severity={snackbarSeverity}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
};

export default MedicationForm;
