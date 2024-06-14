import { Typography, Paper, Button } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SearchBarSupply from "./SearchBarSupply";
import { useEffect, useState } from 'react';
import supabase from '../Services/Supabase';

function Supply() {
    const [supplies, setSupplies] = useState([]);
    const [filteredSupplies, setFilteredSupplies] = useState([]); // State to hold filtered supplies
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSupplies();
    }, []);

    const fetchSupplies = async () => {
        try {
            const { data, error } = await supabase
                .from('Supplies')
                .select('*');

            if (error) {
                throw error;
            }

            setSupplies(data);
            setFilteredSupplies(data); // Initialize filteredSupplies with all supplies
        } catch (error) {
            console.error('Error fetching supplies:', error.message);
        }
    };

    // Filter supplies based on the search term
    useEffect(() => {
        const filteredResults = supplies.filter(supply =>
            supply.Supplies_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supply.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supply.Category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSupplies(filteredResults);
    }, [searchTerm, supplies]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const decreaseQuantity = async (index) => {
        const updatedSupplies = [...supplies];
        const updatedSupply = { ...updatedSupplies[index] };
        updatedSupply.Quantity -= 1;
        updatedSupplies[index] = updatedSupply;
        setSupplies(updatedSupplies);
    
        try {
            const { error } = await supabase
                .from('Supplies')
                .update({ Quantity: updatedSupply.Quantity })
                .eq('id', updatedSupply.id);
    
            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error updating supply quantity:', error.message);
        }
    };

    const increaseQuantity = async (index) => {
        const updatedSupplies = [...supplies];
        const updatedSupply = { ...updatedSupplies[index] };
        updatedSupply.Quantity += 1;
        updatedSupplies[index] = updatedSupply;
        setSupplies(updatedSupplies);
    
        try {
            const { error } = await supabase
                .from('Supplies')
                .update({ Quantity: updatedSupply.Quantity })
                .eq('id', updatedSupply.id);
    
            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error updating supply quantity:', error.message);
        }
    };

    return (
        <>
            <SearchBarSupply onSearchChange={handleSearchChange} />

            <Typography sx={{ marginTop: 5, fontSize: 25 }}>Supplies</Typography>

            <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '70vh', overflow: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Supplies Name</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center">Category</TableCell>
                            <TableCell align="center">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="center">Expiration Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSupplies.map((supply, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{supply.Supplies_name}</TableCell>
                                <TableCell align="center">{supply.Description}</TableCell>
                                <TableCell align="center">{supply.Category}</TableCell>
                                <TableCell align="center">{supply.Price}</TableCell>
                                <TableCell align="center">
                                    <Button onClick={() => decreaseQuantity(index)}>-</Button>
                                    {supply.Quantity}
                                    <Button onClick={() => increaseQuantity(index)}>+</Button>
                                </TableCell>
                                <TableCell align="center">{supply.Expiration_Date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default Supply;
