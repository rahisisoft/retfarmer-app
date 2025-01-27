import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import axiosInstance from "../utils/axiosInstance";

const AutocompleteInput = ({ apiUrl, onChange }) => {
    const [options, setOptions] = useState([]);
    
  
    const handleSearch = async (searchTerm) => {
      try {
        const response = await axiosInstance.post(apiUrl, { search: searchTerm });
        setOptions(response.data || []);
      } catch (error) {
        console.error("Error fetching autocomplete options:", error);
      }
    };
  
    return (
      <Autocomplete
  freeSolo
  options={options}
  getOptionLabel={(option) => option.label || ""}
  onInputChange={(event, value) => {  
    if (value) handleSearch(value);
  }}
  onChange={(event, value) => {
    onChange(value);
  }}
  renderInput={(params) => (
    <div ref={params.InputProps.ref} className="mb-3 form-floating">
      <input
        {...params.inputProps}
        className="form-control"
        placeholder="Category"        
      />
      <label>Category</label>
    </div>
  )}
/>
    );
  };

export default AutocompleteInput;