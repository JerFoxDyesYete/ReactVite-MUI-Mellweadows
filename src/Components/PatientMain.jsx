import React, { useEffect, useState } from 'react';
import SearchBarPatient from './SearchBarPatient';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { Paper } from '@mui/material';
import supabase from '../Services/Supabase';

export default function PatientMain() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [patientToDelete, setPatientToDelete] = React.useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data: patientsData, error: patientsError } = await supabase
        .from('Patient')
        .select('*');
  
      if (patientsError) {
        throw patientsError;
      }
  
      // Fetching associated Staff for each Patient
      const patientsWithStaffData = await Promise.all(
        patientsData.map(async (patient) => {
          if (!patient.ward_num) {
            return { ...patient, ward: null, staff: [], isInpatient: false }; // Outpatient if no ward_num
          }
  
          try {
            // Fetch Ward data for the patient
            const { data: wardData, error: wardError } = await supabase
              .from('Ward')
              .select('ward_num, ward_name')
              .eq('ward_num', patient.ward_num)
              .single();
  
            if (wardError) {
              throw wardError;
            }
  
            // Fetch all Staff assigned to the same ward as the Patient via Ward
            const { data: staffData, error: staffError } = await supabase
              .from('Staff')
              .select('id, firstname, lastname')
              .eq('ward_num', wardData?.ward_num);
  
            if (staffError) {
              throw staffError;
            }
  
            // Combine patient, ward, and staff data
            return { ...patient, ward: wardData, staff: staffData, isInpatient: true }; // Inpatient if ward_num exists
          } catch (error) {
            console.error(`Error fetching associated data for patient ${patient.patient_id}:`, error.message);
            return { ...patient, ward: null, staff: [], isInpatient: true }; // Handle error gracefully, assume inpatient if ward_num is present but error occurs
          }
        })
      );
  
      setPatients(patientsWithStaffData);
      setFilteredPatients(patientsWithStaffData); // Initialize filteredPatients with all patients
    } catch (error) {
      console.error('Error fetching patients:', error.message);
    }
  };

  useEffect(() => {
    const filteredResults = patients.filter(patient =>
      `${patient.firstname} ${patient.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filteredResults);
  }, [searchTerm, patients]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeletePatient = (patientId) => {
    setPatientToDelete(patientId);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    setPatientToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('Patient')
        .delete()
        .eq('patient_id', patientToDelete);

      if (error) {
        throw error;
      }

      setPatients((prevPatients) =>
        prevPatients.filter((patient) => patient.patient_id !== patientToDelete)
      );
      setFilteredPatients((prevFilteredPatients) =>
        prevFilteredPatients.filter((patient) => patient.patient_id !== patientToDelete)
      );
    } catch (error) {
      console.error('Error deleting patient:', error.message);
    } finally {
      setSnackbarOpen(false);
      setPatientToDelete(null);
    }
  };

  return (
    <>
      <SearchBarPatient onSearchChange={handleSearchChange} patients={patients} />

      <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '70vh', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Patient Name</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Birthday</TableCell>
              <TableCell align="center">Marital Status</TableCell>
              <TableCell align="center">Cellphone Number</TableCell>
              <TableCell align="center">Ward Number</TableCell>
              <TableCell align="center">Staff Name(s)</TableCell>
              <TableCell align="center">In/Out Patient</TableCell>
              <TableCell align="center">Delete Patient(s)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow
                key={`${patient.firstname}-${patient.lastname}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">{patient.firstname} {patient.lastname}</TableCell>
                <TableCell align="center">{patient.gender}</TableCell>
                <TableCell align="center">{patient.address}</TableCell>
                <TableCell align="center">{patient.date_of_birth}</TableCell>
                <TableCell align="center">{patient.marital_status}</TableCell>
                <TableCell align="center">{patient.cellphone_number}</TableCell>
                <TableCell align="center">{patient.ward ? `${patient.ward.ward_num} - ${patient.ward.ward_name}` : 'No Ward Data'}</TableCell>
                <TableCell align="center">
                  {patient.staff && patient.staff.length > 0 ? (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      {patient.staff.map((staffMember) => (
                        <li key={staffMember.id}>
                          {`${staffMember.firstname} ${staffMember.lastname}`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'No Assigned Staff'
                  )}
                </TableCell>
                <TableCell align="center">{patient.isInpatient ? 'In Patient' : 'Out Patient'}</TableCell>
                <TableCell align="center">
                  <IconButton
                    aria-label="delete"
                    variant="contained"
                    color="error"
                    onClick={() => handleDeletePatient(patient.patient_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Are you sure you want to delete this patient?"
        action={
          <>
            <Button
              color="secondary"
              size="small"
              onClick={handleCloseSnackbar}
              style={{ fontWeight: 'bold' }}
            >
              No
            </Button>
            <Button
              color="primary"
              size="small"
              onClick={handleConfirmDelete}
              style={{ fontWeight: 'bold' }}
            >
              Yes
            </Button>
          </>
        }
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      />
    </>
  );
}
