// main.js

const apiKey = 'NWS API does not require an API key';
const weatherApiBaseUrl = 'https://api.weather.gov';

// Get references to HTML elements (Weather tab)
const cityStateElement = document.querySelector('#weather .city-state');
const rainChanceElement = document.querySelector('#weather .rain-chance');
const temperatureElement = document.querySelector('#weather .temperature');
const weatherIconLarge = document.querySelector('#weather .weather-icon.large');
const todayForecastTimes = document.querySelector('#weather .today-forecast .forecast-times');
const sevenDayForecastContainer = document.querySelector('#weather .seven-day-forecast');
const realFeelTempElement = document.querySelector('#weather .real-feel-temp');
const windSpeedElement = document.querySelector('#weather .wind-speed');
const windUnitsElement = document.querySelector('#weather .wind-units');
const rainChanceDetailElement = document.querySelector('#weather .rain-chance-detail');
const uvIndexElement = document.querySelector('#weather .uv-index');

function updateWeatherUI(data) {
    if (data && data.properties) {
        const properties = data.properties;
        cityStateElement.textContent = properties.relativeLocation.properties.city + ', ' + properties.relativeLocation.properties.state;

        // Get forecast URL
        const forecastUrl = properties.forecast;
        fetchForecastData(forecastUrl);

        // Get hourly forecast URL
        const hourlyForecastUrl = properties.forecastHourly;
        fetchHourlyForecastData(hourlyForecastUrl);

        // You might also want to fetch current observations if needed
        // const observationStationsUrl = properties.observationStations;
        // fetchObservationData(observationStationsUrl);
    } else {
        console.error("Invalid weather data received:", data);
        cityStateElement.textContent = 'Weather data not available';
    }
}

async function fetchForecastData(forecastUrl) {
    try {
        const response = await fetch(forecastUrl);
        const data = await response.json();
        if (data && data.properties && data.properties.periods) {
            const periods = data.properties.periods;
            sevenDayForecastContainer.innerHTML = '<h4>7 - DAY FORECAST</h4>'; // Clear previous forecast
            periods.forEach(period => {
                if (period.isDaytime) { // Only show daytime forecasts for simplicity
                    const forecastItem = document.createElement('div');
                    forecastItem.classList.add('daily-forecast');
                    forecastItem.innerHTML = `
                        <span class="day">${period.name}</span>
                        <div class="weather-icon">{Icon}</div>
                        <span class="conditions">${period.shortForecast}</span>
                        <span class="high-low">${period.temperature}${period.temperatureUnit}</span>
                        <hr>
                    `;
                    sevenDayForecastContainer.appendChild(forecastItem);
                }
            });
        }
    } catch (error) {
        console.error("Error fetching 7-day forecast:", error);
    }
}

async function fetchHourlyForecastData(hourlyForecastUrl) {
    try {
        const response = await fetch(hourlyForecastUrl);
        const data = await response.json();
        if (data && data.properties && data.properties.periods) {
            const periods = data.properties.periods.slice(0, 6); // Get the first 6 hourly forecasts
            todayForecastTimes.innerHTML = ''; // Clear previous forecast
            periods.forEach(period => {
                const startTime = new Date(period.startTime);
                const hours = startTime.getHours();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
                const timeStr = `${formattedHours}:00 ${ampm}`;

                const forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');
                forecastItem.innerHTML = `
                    <span class="time">${timeStr}</span>
                    <div class="weather-icon">{Icon}</div>
                    <span class="temp">${period.temperature}°${period.temperatureUnit}</span>
                `;
                todayForecastTimes.appendChild(forecastItem);
            });
        }
    } catch (error) {
        console.error("Error fetching hourly forecast:", error);
    }
}

async function fetchWeatherDataByCoords(latitude, longitude) {
    const pointsUrl = `${weatherApiBaseUrl}/points/${latitude},${longitude}`;
    try {
        const response = await fetch(pointsUrl);
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error("Error fetching weather data from /points:", error);
        cityStateElement.textContent = 'Could not fetch weather data';
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchWeatherDataByCoords(latitude, longitude);
        }, error => {
            console.error("Error getting location:", error);
            // Default to Bowling Green, OH coordinates
            fetchWeatherDataByCoords(41.37, -83.65);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
        // Default to Bowling Green, OH coordinates
        fetchWeatherDataByCoords(41.37, -83.65);
    }
}

// Call getCurrentLocation when the script loads
getCurrentLocation();
