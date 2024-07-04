import React, { useState } from 'react';
import axios from 'axios';
import CountryAutocomplete from './CountryAutocomplete';
import CityAutocomplete from './CityAutocomplete';
import AddressAutocomplete from './AddressAutocomplete';
import { Button, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import 'tailwindcss/tailwind.css';

const DistanceCalculator = () => {
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [startAddress, setStartAddress] = useState(null);
  const [endAddress, setEndAddress] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = '5b3ce3597851110001cf6248220d30fbcf704caa9155048951a3fee9'; // Replace with your actual API key

  const calculateDistance = async (start, end) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
        {
          coordinates: [[start.lng, start.lat], [end.lng, end.lat]],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { features } = response.data;
      if (features.length > 0) {
        const totalDistanceInMeters = features[0].properties.summary.distance;
        const totalDistanceInKilometers = totalDistanceInMeters / 1000;
        setDistance(totalDistanceInKilometers);
      }
    } catch (error) {
      setError('Error calculating distance');
      console.error('Error calculating distance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = () => {
    if (startAddress && endAddress) {
      calculateDistance(startAddress, endAddress);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-6 bg-white shadow-lg rounded-lg">
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom className="text-center">
            Distance Calculator
          </Typography>
          <div className="space-y-4">
            <CountryAutocomplete onSelectCountry={(country) => setCountry(country)} />
            {country && (
              <CityAutocomplete country={country} onSelectCity={(city) => setCity(city)} />
            )}
            {city && (
              <>
                <AddressAutocomplete city={city} onSelectAddress={(addr) => setStartAddress(addr)} />
                <AddressAutocomplete city={city} onSelectAddress={(addr) => setEndAddress(addr)} />
              </>
            )}
            <div className="text-center">
              <Button
                onClick={handleCalculate}
                variant="contained"
                color="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Calculate Distance'}
              </Button>
            </div>
            {distance !== null && (
              <Typography variant="body1" className="mt-4 text-center text-green-600">
                The distance between the addresses is <strong>{distance.toFixed(2)}</strong> kilometers.
              </Typography>
            )}
            {error && (
              <Typography variant="body1" className="mt-4 text-center text-red-600">
                {error}
              </Typography>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistanceCalculator;
