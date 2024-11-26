import axios from 'axios';

const API_KEY = 'BUVXA3ERKWD8HN9CZAXXGGDB6';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

export const fetchWeatherData = async (location, unit = 'metric') => {
    try {
        const url = `${BASE_URL}/${location}/today?unitGroup=${unit}&include=current&key=${API_KEY}&contentType=json`;
        
        const response = await axios.get(`${CORS_PROXY}${url}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
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
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

export const convertTemperature = (temp, toUnit) => {
    if (toUnit === 'fahrenheit') {
        return (temp * 9/5) + 32;
    }
    return temp;
};