import axios from 'axios';

const API_KEY = 'BUVXA3ERKWD8HN9CZAXXGGDB6';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

export const fetchWeatherData = async (location, unit = 'metric') => {
    try {
        const url = `${BASE_URL}/${encodeURIComponent(location)}/today?unitGroup=${unit}&include=current&key=${API_KEY}&contentType=json`;
        
        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Weather Data:', response.data);
        
        return {
            location: response.data.resolvedAddress,
            temperature: response.data.currentConditions.temp,
            feelsLike: response.data.currentConditions.feelslike,
            humidity: response.data.currentConditions.humidity,
            windSpeed: response.data.currentConditions.windspeed,
            description: response.data.currentConditions.conditions
        };
    } catch (error) {
        console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
        
        // Provide a more detailed error message
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response received from the server');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Request setup error: ${error.message}`);
        }
    }
};

export const convertTemperature = (temp, toUnit) => {
    if (toUnit === 'fahrenheit') {
        return (temp * 9/5) + 32;
    }
    return temp;
};