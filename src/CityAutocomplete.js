import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import { TextField, Paper } from '@mui/material';

const CityAutocomplete = ({ country, onSelectCity }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&country=${country.name}&city=${query}`);
      setSuggestions(
        response.data.map((place) => ({
          name: place.display_name,
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
        }))
      );
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    setValue('');
    setSuggestions([]);
  }, [country]);

  const onSuggestionsFetchRequested = ({ value }) => {
    if (value.length > 2) {
      fetchSuggestions(value);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    onSelectCity(suggestion);
  };

  const inputProps = {
    placeholder: "Enter city...",
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
          label="City"
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

export default CityAutocomplete;
