import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Container, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import supabase from '../Services/Supabase';

function Ward() {
    const [patients, setPatients] = useState([]);
    const [staff, setStaff] = useState([]);
    const [selectedWard, setSelectedWard] = useState(null);
    const [medicationRecords, setMedicationRecords] = useState([]);
    const [supplies, setSupplies] = useState([]);
    const [isFullCapacity, setIsFullCapacity] = useState(false); // State to track full capacity

    // Define ward bed limits
    const wardBedLimits = {
        default: 14,
        1: 15,
        4: 15
        // Define bed limits for other wards as needed
    };

    useEffect(() => {
        fetchPatients();
        fetchStaff();
        fetchMedicationRecords();
        fetchSupplies();
    }, []);

    const fetchMedicationRecords = async () => {
        try {
          const { data, error } = await supabase
            .from('MedicationRecords')
            .select('*');
      
          if (error) {
            throw error;
          }
      
          setMedicationRecords(data);
        } catch (error) {
          console.error('Error fetching medication records:', error.message);
        }
    };

    const fetchSupplies = async () => {
        try {
            const { data, error } = await supabase
            .from('Supplies')
            .select('id, Supplies_name');
        
            if (error) {
            throw error;
            }
        
            setSupplies(data);
        } catch (error) {
            console.error('Error fetching supplies:', error.message);
        }
    };

    const fetchPatients = async () => {
        try {
            const { data, error } = await supabase
                .from('Patient')
                .select('*');

            if (error) {
                throw error;
            }

            setPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error.message);
        }
    };

    const fetchStaff = async () => {
        try {
            const { data, error } = await supabase
                .from('Staff')
                .select('*');

            if (error) {
                throw error;
            }

            setStaff(data);
        } catch (error) {
            console.error('Error fetching staff:', error.message);
        }
    };

    const handleWardButtonClick = (wardNum) => {
        setSelectedWard(wardNum);
        setIsFullCapacity(false); // Reset full capacity status when switching wards
    };

    const countPatientsInWard = (wardNum) => {
        return patients.filter(patient => patient.ward_num === wardNum).length;
    };

    const countStaffInWard = (wardNum) => {
        return staff.filter(staffMember => staffMember.ward_num === wardNum).length;
    };

    const getWardName = (wardNum) => {
        const wardNames = ['ICU', 'Orthopedic', 'Pediatrics', 'Emergency', 'NICU', 'Maternity', 'Surgical', 'Medical', 'Cardiology', 'Oncology', 'Psychiatric', 'Burn Unit', 'Neurology', 'Geriatric', 'Rehabilitation', 'Isolation', 'Hematology'];
        return wardNames[wardNum - 1];
    };

    const getWardMaxBeds = (wardNum) => {
        return wardBedLimits[wardNum] || wardBedLimits.default;
    };

    const getStaffForWard = (wardNum) => {
        // Filter staff to find those managing the specified ward
        return staff.filter(staffMember => staffMember.ward_num === wardNum);
    };

    return (
        <>
            <div style={{ overflowY: 'auto', maxHeight: '250px' }}>
                <Grid container spacing={2}>
                    {[...Array(17).keys()].map((index) => {
                        const wardNum = index + 1;
                        const maxBeds = getWardMaxBeds(wardNum);
                        const availableBeds = maxBeds - countPatientsInWard(wardNum);

                        return (
                            <Grid key={index} item xs={4}>
                                <Paper sx={{ p: 4, textAlign: 'center' }}>
                                    <Button
                                        onClick={() => handleWardButtonClick(wardNum)}
                                        variant="contained"
                                        sx={{
                                            textTransform: 'none',
                                            fontSize: '20px',
                                            width: '100%',
                                            height: '100px',
                                            backgroundColor: 'white',
                                            color: 'black',
                                            '&:hover': {
                                                backgroundColor: 'rgb(234, 234, 234)',
                                            },
                                        }}
                                    >
                                        {`Ward ${wardNum}: ${getWardName(wardNum)}`}
                                    </Button>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontSize: '20px',
                                            textAlign: 'center',
                                            marginTop: 2,
                                            backgroundColor: availableBeds <= 0 ? 'rgb(237,76,76)' : 'rgb(120, 231, 120)',
                                            color: 'white',
                                            padding: '10px 0'
                                        }}
                                    >
                                        {availableBeds > 0 ? `AVAILABLE BEDS: ${availableBeds}` : 'FULL CAPACITY'}
                                    </Typography>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </div>

            <Container sx={{ border: '1px solid #ccc', marginTop: 2 }}>
                <Typography sx={{ marginTop: 5, fontSize: '30px', marginBottom: 5 }}>
                    {selectedWard !== null ? `Ward ${selectedWard}: ${getWardName(selectedWard)}` : 'Select a ward to view patients'}
                </Typography>
                {selectedWard !== null && (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Sex</TableCell>
                                    <TableCell align="center">Address</TableCell>
                                    <TableCell align="center">Birthdate</TableCell>
                                    <TableCell align="center">Marital Status</TableCell>
                                    <TableCell align="center">Cellphone Number</TableCell>
                                    <TableCell align="center">Date Expected Leave</TableCell>
                                    <TableCell align="center">Staff Name</TableCell>
                                    <TableCell align="center" style={{ minWidth: '150px' }}>Patient Medication</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {patients.filter(patient => patient.ward_num === selectedWard).map(patient => {
                                    const assignedStaff = staff.find(staffMember => staffMember.ward_num === patient.ward_num);
                                    const patientMedicationRecords = medicationRecords.filter(record => record.patient_id === patient.patient_id);
                                    return (
                                        <TableRow key={patient.patient_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell align="center">{patient.firstname} {patient.lastname}</TableCell>
                                            <TableCell align="center">{patient.gender}</TableCell>
                                            <TableCell align="center">{patient.address}</TableCell>
                                            <TableCell align="center">{patient.date_of_birth}</TableCell>
                                            <TableCell align="center">{patient.marital_status}</TableCell>
                                            <TableCell align="center">{patient.cellphone_number}</TableCell>
                                            <TableCell align="center">{patient.date_expected_leave}</TableCell>
                                            <TableCell align="center" style={{ minWidth: '200px' }}>
                                                {getStaffForWard(selectedWard).length > 0 ? (
                                                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                                    {getStaffForWard(selectedWard).map((staffMember, index) => (
                                                        <li key={staffMember.id}>
                                                        {`${staffMember.firstname} ${staffMember.lastname}`}
                                                        {index !== getStaffForWard(selectedWard).length - 1 && <br />} {/* Adds <br /> except after the last name */}
                                                        </li>
                                                    ))}
                                                    </ul>
                                                ) : (
                                                    'No Assigned Staff'
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {patientMedicationRecords.length > 0 ? (
                                                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                                    {patientMedicationRecords.map(record => (
                                                        <li key={record.id}>
                                                        {supplies.find(supply => supply.id === record.supply_id)?.Supplies_name}
                                                        </li>
                                                    ))}
                                                    </ul>
                                                ) : (
                                                    'No Medication Records'
                                                )}
                                                </TableCell>
                                                <TableCell align="center">
                                                {patientMedicationRecords.length > 0 ? (
                                                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                                    {patientMedicationRecords.map(record => (
                                                        <li key={record.id}>{record.quantity}</li>
                                                    ))}
                                                    </ul>
                                                ) : (
                                                    '-'
                                                )}
                                                </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
        </>
    );
}

export default Ward;
