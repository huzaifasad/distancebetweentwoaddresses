import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import { TextField, Paper } from '@mui/material';

const AddressAutocomplete = ({ city, onSelectAddress }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}, ${city.name}`);
      setSuggestions(
        response.data.map((place) => ({
          address: place.display_name,
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
        }))
      );
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    setValue('');
    setSuggestions([]);
  }, [city]);

  const onSuggestionsFetchRequested = ({ value }) => {
    if (value.length > 2) {
      fetchSuggestions(value);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion.address;

  const renderSuggestion = (suggestion) => <div>{suggestion.address}</div>;

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    onSelectAddress(suggestion);
  };

  const inputProps = {
    placeholder: "Enter address...",
    value,
    onChange
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      onSuggestionSelected={onSuggestionSelected}
      inputProps={inputProps}
      renderInputComponent={(inputProps) => (
        <TextField
          {...inputProps}
          label="Address"
          variant="outlined"
          fullWidth
        />
      )}
      renderSuggestionsContainer={({ containerProps, children }) => (
        <Paper {...containerProps} square>
          {children}
        </Paper>
      )}
    />
  );
};

export default AddressAutocomplete;
