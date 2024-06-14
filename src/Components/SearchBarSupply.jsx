import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBarSupply = ({ onSearchChange }) => {
    const [searchTerm, setSearchTerm] = useState(''); // State to store the search term
  
    const handleSearch = () => {
      onSearchChange({ target: { value: searchTerm } });
    };

    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    return (
        <TextField
            label="Search Supply"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleSearch}>
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchBarSupply;
