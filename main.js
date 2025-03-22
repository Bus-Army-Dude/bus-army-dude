// Initialize API key and base URL
const apiKey = '34ae2d4a53544561a07150106252203'; // Replace with your WeatherAPI key
const baseUrl = 'https://api.weatherapi.com/v1/forecast.json';

// Function to update the Air Quality section
function updateAirQuality(data) {
    const airQualityIndicator = document.querySelector('.air-quality-indicator');
    const airQualityStatus = document.querySelector('.air-quality-summary .aqi-status');
    const primaryPollutant = document.querySelector('.air-quality-summary .primary-pollutant');
    const airQualityDetails = document.querySelector('.air-quality-details');

    if (data.current.air_quality) {
        const airQualityIndex = data.current.air_quality["us-epa-index"];
        const airQualityDescription = getAirQualityDescription(airQualityIndex);
        const primaryPollutantValue = getPrimaryPollutant(data.current.air_quality);

        // Update AQI Circle and Description
        airQualityIndicator.className = 'air-quality-indicator';
        airQualityIndicator.classList.add(getAirQualityClass(airQualityIndex));
        airQualityIndicator.innerHTML = `<span class="aqi-value">${airQualityIndex}</span>`;
        airQualityStatus.textContent = airQualityDescription;
        primaryPollutant.textContent = `Primary Pollutant: ${primaryPollutantValue}`;

        // Update Pollutant Details
        const pollutants = [
            { name: 'O3 (Ozone)', value: data.current.air_quality.o3 },
            { name: 'CO (Carbon Monoxide)', value: data.current.air_quality.co },
            { name: 'NO2 (Nitrogen Dioxide)', value: data.current.air_quality.no2 },
            { name: 'PM10', value: data.current.air_quality.pm10 },
            { name: 'PM2.5', value: data.current.air_quality.pm2_5 },
            { name: 'SO2 (Sulfur Dioxide)', value: data.current.air_quality.so2 }
        ];

        airQualityDetails.innerHTML = pollutants.map(pollutant => `
            <div class="pollutant">
                <span class="pollutant-name">${pollutant.name}:</span>
                <span class="pollutant-value">${pollutant.value.toFixed(2)} µg/m³</span>
                <span class="pollutant-rating ${getAirQualityClass(airQualityIndex)}">${airQualityDescription}</span>
            </div>
        `).join('');
    } else {
        airQualityIndicator.innerHTML = `<span>N/A</span>`;
        airQualityStatus.textContent = 'Air Quality data not available.';
        primaryPollutant.textContent = '';
        airQualityDetails.innerHTML = '';
    }
}

// Helper functions for Air Quality
function getAirQualityDescription(aqi) {
    switch (aqi) {
        case 1: return "Good";
        case 2: return "Moderate";
        case 3: return "Unhealthy for Sensitive Groups";
        case 4: return "Unhealthy";
        case 5: return "Very Unhealthy";
        case 6: return "Hazardous";
        default: return "Unknown";
    }
}

function getPrimaryPollutant(airQuality) {
    const pollutants = [
        { name: 'Ozone', value: airQuality.o3 },
        { name: 'Carbon Monoxide', value: airQuality.co },
        { name: 'Nitrogen Dioxide', value: airQuality.no2 },
        { name: 'Sulfur Dioxide', value: airQuality.so2 },
        { name: 'PM10', value: airQuality.pm10 },
        { name: 'PM2.5', value: airQuality.pm2_5 }
    ];

    // Sort pollutants by their concentration levels
    pollutants.sort((a, b) => b.value - a.value);

    return pollutants[0].name; // Return the highest concentration pollutant
}

function getAirQualityClass(aqi) {
    switch (aqi) {
        case 1: return "good";
        case 2: return "moderate";
        case 3: return "unhealthy";
        case 4: return "very-unhealthy";
        case 5: return "hazardous";
        default: return "";
    }
}

// Function to update the HTML content with the weather data
async function fetchWeatherData(location) {
    const url = `${baseUrl}?key=${apiKey}&q=${location}&days=7&aqi=yes&alerts=no`;

    const loadingSpinner = document.querySelector('.weather-loading');
    const weatherContent = document.querySelector('.weather-content');

    // Show loading spinner
    if (loadingSpinner && weatherContent) {
        loadingSpinner.style.display = 'block';
        weatherContent.style.display = 'none';
    }

    try {
        console.log('Fetching weather for:', location);

        const response = await fetch(url); // Single fetch call
        console.log('HTTP Response Status:', response.status);

        if (!response.ok) {
            console.warn(`Failed for ${location}, falling back to default location.`);
            // Avoid infinite recursion by checking if it's already the fallback
            if (location !== 'New York, NY, USA') {
                fetchWeatherData('New York, NY, USA');
            } else {
                throw new Error('Default location also failed.');
            }
            return;
        }

        const data = await response.json(); // Parse JSON response
        console.log('API Response:', data); // Debug full API response

        if (!data || !data.current || !data.forecast) {
            throw new Error('Weather data is incomplete or invalid.');
        }

        updateDisplay(data); // Pass data to update the UI
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayError(`Unable to load weather data: ${error.message}`); // Provide detailed error message
    }
}

// Function to update the HTML content with the weather data
function updateDisplay(data) {
    const loadingSpinner = document.querySelector('.weather-loading');
    const weatherContent = document.querySelector('.weather-content');

    // Hide loading spinner and show content
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (weatherContent) weatherContent.style.display = 'block';

    // Update location details
    const locationNameElement = document.querySelector('.location-name');
    if (locationNameElement) {
        const city = data.location.name;
        const stateOrRegion = data.location.region;
        const country = data.location.country;
        locationNameElement.textContent = `${city}, ${stateOrRegion}, ${country}`;
    }

    // Last Updated
    const lastUpdatedElement = document.querySelector('.last-updated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = `Updated: ${new Date(data.current.last_updated).toLocaleString()}`;
    }

    // Current Temperature and Feels Like
    const tempValueElement = document.querySelector('.temp-value');
    const feelsLikeElement = document.querySelector('.feels-like');
    if (tempValueElement) {
        tempValueElement.textContent = `${data.current.temp_f}°F`;
    }
    if (feelsLikeElement) {
        feelsLikeElement.textContent = `Feels Like: ${data.current.feelslike_f}°F`;
    }

    // Weather Condition
    const conditionTextElement = document.querySelector('.condition-text');
    if (conditionTextElement) {
        const conditionIcon = data.current.condition.icon;
        const condition = data.current.condition.text;
        conditionTextElement.innerHTML = `<img src="https:${conditionIcon}" alt="${condition}" /> ${condition}`;
    }

    // Weather Details
    const windSpeedElement = document.querySelector('.weather-details .wind-speed .value');
    const humidityElement = document.querySelector('.weather-details .humidity .value');
    const pressureElement = document.querySelector('.weather-details .pressure .value');
    const precipitationElement = document.querySelector('.weather-details .precipitation .value');

    if (windSpeedElement) {
        windSpeedElement.textContent = data.current.wind_mph ? `${data.current.wind_mph} mph` : 'N/A';
    }
    if (humidityElement) {
        humidityElement.textContent = data.current.humidity ? `${data.current.humidity} %` : 'N/A';
    }
    if (pressureElement) {
        pressureElement.textContent = data.current.pressure_in ? `${data.current.pressure_in} hPa` : 'N/A';
    }
    if (precipitationElement) {
        const precipitationChance = data.forecast.forecastday[0].day.daily_chance_of_rain || 0;
        const weatherCondition = data.current.condition.text || 'None';

        // Dynamically show precipitation based on data
        precipitationElement.textContent =
            precipitationChance > 0
                ? `${precipitationChance}% chance (${weatherCondition})`
                : `None`;
    }

    // Update Air Quality Section
    updateAirQuality(data);

    // Update forecast and Sun/Moon data
    updateForecast(data.forecast.forecastday);
    updateSunMoon(data.forecast.forecastday[0].astro);
}

// Function to update the Sun and Moon times
function updateSunMoon(astro) {
    const sunRiseElement = document.querySelector('.sunrise-time');
    const sunSetElement = document.querySelector('.sunset-time');
    const moonRiseElement = document.querySelector('.moonrise-time');
    const moonSetElement = document.querySelector('.moonset-time');

    if (sunRiseElement && sunSetElement && moonRiseElement && moonSetElement) {
        sunRiseElement.textContent = `Sunrise: ${astro.sunrise}`;
        sunSetElement.textContent = `Sunset: ${astro.sunset}`;
        moonRiseElement.textContent = `Moonrise: ${astro.moonrise}`;
        moonSetElement.textContent = `Moonset: ${astro.moonset}`;
    }
}

// Function to update the forecast data
function updateForecast(forecastDays) {
    const forecastContainer = document.querySelector('.forecast-container');
    
    if (!forecastContainer) return;

    forecastContainer.innerHTML = ''; // Clear existing forecast data

    forecastDays.forEach(day => {
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-day');
        
        const date = new Date(day.date);
        const dayOfWeek = date.toLocaleString('en-us', { weekday: 'long' });
        
        // Create forecast item for each day
        forecastElement.innerHTML = `
            <div class="forecast-date">${dayOfWeek}, ${date.toLocaleDateString()}</div>
            <div class="forecast-icon">
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            </div>
            <div class="forecast-temp">
                <span class="high">${day.day.maxtemp_f}°F</span> / <span class="low">${day.day.mintemp_f}°F</span>
            </div>
            <div class="forecast-condition">${day.day.condition.text}</div>
        `;
        
        forecastContainer.appendChild(forecastElement);
    });
}

// Function to display error messages
function displayError(message) {
    const errorContainer = document.querySelector('.error-message');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }
}

// Add event listener to change location
document.querySelector('.location-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const location = document.querySelector('.location-input').value;
    if (location) {
        fetchWeatherData(location);
    }
});

// Load default location when the page loads
window.addEventListener('DOMContentLoaded', function () {
    fetchWeatherData('New York, NY, USA');
});

// Function to format date for the Last Updated section
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-us', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
}
