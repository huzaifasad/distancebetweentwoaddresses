import React, { useState } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import { TextField, Paper } from '@mui/material';

const CountryAutocomplete = ({ onSelectCountry }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState('');

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      const countries = response.data.map(country => ({
        name: country.name.common,
        code: country.cca2
      }));
      setSuggestions(
        countries.filter(country => country.name.toLowerCase().includes(query.toLowerCase()))
      );
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

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
    onSelectCountry(suggestion);
  };

  const inputProps = {
    placeholder: "Enter country...",
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
          label="Country"
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

export default CountryAutocomplete;
