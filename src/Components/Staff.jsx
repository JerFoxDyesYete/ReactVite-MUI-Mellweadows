import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import supabase from '../Services/Supabase';
import SearchBarStaff from './SearchBarStaff';

function Staff() {
    const [staffs, setStaffs] = useState([]);
    const [filteredStaffs, setFilteredStaffs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStaffs();
    }, []);

    const fetchStaffs = async () => {
        try {
            const { data, error } = await supabase
                .from('Staff')
                .select('*');

            if (error) {
                throw error;
            }

            setStaffs(data);
            setFilteredStaffs(data);
        } catch (error) {
            console.error('Error fetching staffs:', error.message);
        }
    };

    useEffect(() => {
        const filteredResults = staffs.filter(staff =>
            staff.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.lastname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStaffs(filteredResults);
    }, [searchTerm, staffs]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleWardChange = async (event, staffId) => {
        const updatedWard = event.target.value;

        try {
            const { data: updatedStaff, error } = await supabase
                .from('Staff')
                .update({ ward_num: updatedWard })
                .eq('id', staffId)
                .single();

            if (error) {
                throw error;
            }

            // Update the staffs state with the updated ward number
            setFilteredStaffs(prevStaffs => prevStaffs.map(staff => (
                staff.id === staffId ? { ...staff, ward_num: updatedWard } : staff
            )));
        } catch (error) {
            console.error(`Error updating staff ${staffId} ward:`, error.message);
        }
    };

    return (
        <>
            <SearchBarStaff onSearchChange={handleSearchChange} />

            <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '70vh', overflow: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Staff Name</TableCell>
                            <TableCell align="center">Gender</TableCell>
                            <TableCell align="center">Address</TableCell>
                            <TableCell align="center">Birthday</TableCell>
                            <TableCell align="center">Job Position</TableCell>
                            <TableCell align="center">Phone Number</TableCell>
                            <TableCell align="center">NIN Number</TableCell>
                            <TableCell align="center">Current Ward</TableCell>
                            <TableCell align="center">Ward Selector</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStaffs.map((staff) => (
                            <TableRow
                                key={staff.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{staff.firstname} {staff.lastname}</TableCell>
                                <TableCell align="center">{staff.gender}</TableCell>
                                <TableCell align="center">{staff.address}</TableCell>
                                <TableCell align="center">{staff.date_of_birth}</TableCell>
                                <TableCell align="center">{staff.job_position}</TableCell>
                                <TableCell align="center">{staff.phone_number}</TableCell>
                                <TableCell align="center">{staff.nin}</TableCell>
                                <TableCell align="center">{staff.ward_num}</TableCell>
                                <TableCell align="center">
                                    <Select
                                        value={staff.ward_num || ''}
                                        onChange={(event) => handleWardChange(event, staff.id)}
                                        fullWidth
                                    >
                                        {Array.from({ length: 17 }, (_, i) => i + 1).map((ward) => (
                                            <MenuItem key={ward} value={ward}>
                                                Ward {ward}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default Staff;
