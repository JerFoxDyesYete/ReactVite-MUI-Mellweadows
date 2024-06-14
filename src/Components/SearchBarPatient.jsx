import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBarPatient = ({ onSearchChange }) => { // Pass onSearchChange function as a prop
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        onSearchChange({ target: { value: searchTerm } }); // Call the onSearchChange function with the search term
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <TextField
            label="Search Patient"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleSearch}> {/* Call handleSearch on click */}
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchBarPatient;
