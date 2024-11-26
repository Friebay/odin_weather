import './styles.css';
import { fetchWeatherData, convertTemperature } from './weatherApi';

class WeatherApp {
    constructor() {
        this.initializeElements();
        this.initEventListeners();
    }

    initializeElements() {
        this.locationSearchInput = document.getElementById('location-search');
        this.weatherDataElement = document.getElementById('weather-data');
        this.containerElement = document.querySelector('.container');
        this.loadingSpinner = this.createLoadingSpinner();
    }

    createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.classList.add('loading-spinner');
        this.containerElement.insertBefore(spinner, this.weatherDataElement);
        return spinner;
    }

    initEventListeners() {
        if (this.locationSearchInput) {
            this.locationSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLocationSearch();
                }
            });
        }

        const temperatureRadios = document.querySelectorAll('input[name="unit"]');
        temperatureRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateTemperatureDisplay());
        });
    }

    async handleLocationSearch() {
        const location = this.locationSearchInput.value.trim();
        if (!location) return;

        // Start loading state
        this.containerElement.classList.add('loading');

        try {
            const weatherData = await fetchWeatherData(location);
            this.displayWeatherData(weatherData);
        } catch (error) {
            this.weatherDataElement.innerHTML = `<p>Error: ${error.message}</p>`;
        } finally {
            // End loading state
            this.containerElement.classList.remove('loading');
        }
    }

    displayWeatherData(data) {
        const unit = document.querySelector('input[name="unit"]:checked').value;
        const temp = convertTemperature(data.temperature, unit);
        const feelsLike = convertTemperature(data.feelsLike, unit);

        // Set background color based on temperature
        this.setBackgroundColor(temp, unit);

        this.weatherDataElement.innerHTML = `
            <h2>${data.location}</h2>
            <p>Temperature: ${temp.toFixed(1)}°${unit === 'celsius' ? 'C' : 'F'}</p>
            <p>Feels Like: ${feelsLike.toFixed(1)}°${unit === 'celsius' ? 'C' : 'F'}</p>
            <p>Humidity: ${data.humidity}%</p>
            <p>Wind Speed: ${data.windSpeed} m/s</p>
            <p>Description: ${data.description}</p>
        `;
    }

    setBackgroundColor(temp, unit) {
        // Normalize temperature for background color calculation
        const normalizedTemp = unit === 'fahrenheit' 
            ? (temp - 32) * 5/9  // Convert to Celsius
            : temp;

        let backgroundColor;
        if (normalizedTemp <= -30) {
            backgroundColor = 'rgb(0, 0, 255)'; // Deep blue
        } else if (normalizedTemp < 0) {
            // Linear interpolation from blue to white
            const t = (normalizedTemp + 30) / 30;
            backgroundColor = `rgb(${255 * (1 - t)}, ${255 * (1 - t)}, 255)`;
        } else if (normalizedTemp <= 30) {
            // Linear interpolation from white to orange
            const t = normalizedTemp / 30;
            backgroundColor = `rgb(255, ${255 * (1 - t)}, 0)`;
        } else {
            backgroundColor = 'rgb(255, 0, 0)'; // Deep orange/red
        }

        document.body.style.backgroundColor = backgroundColor;
    }

    updateTemperatureDisplay() {
        const lastWeatherData = this.weatherDataElement.querySelector('h2');
        if (lastWeatherData) {
            this.handleLocationSearch();
        }
    }
}

// Ensure DOM is fully loaded before initializing the app
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});