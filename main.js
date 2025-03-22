async function fetchWeatherData(location) {
    const apiKey = '34ae2d4a53544561a07150106252203';  // Replace with your actual API key
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=yes`;

    try {
        const response = await fetch(apiUrl);
        
        // Log the response for debugging
        console.log('Response:', response);

        const data = await response.json();

        // Log the returned data for debugging
        console.log('Data:', data);

        if (data.error) {
            throw new Error(data.error.message);
        }

        updateWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayError('Unable to load weather data.');
    }
}

// Function to update the UI with the fetched weather data
function updateWeatherData(data) {
    const location = data.location;
    const current = data.current;
    const forecast = data.forecast.forecastday;
    const airQuality = data.current.air_quality;
    const astro = data.astronomy.astro;

    // Location info
    document.querySelector('.location-name').textContent = `${location.name}, ${location.region}, ${location.country}`;
    document.querySelector('.last-updated').textContent = `Updated: ${formatDate(data.current.last_updated)}`;

    // Weather primary info
    document.querySelector('.temp-value').textContent = `${current.temp_f}°F`;
    document.querySelector('.feels-like').textContent = `Feels Like: ${current.feelslike_f}°F`;
    document.querySelector('.condition-text img').src = `https:${current.condition.icon}`;
    document.querySelector('.condition-text span').textContent = current.condition.text;

    // Weather details
    document.querySelector('.wind-speed .value').textContent = `${current.wind_mph} mph`;
    document.querySelector('.humidity .value').textContent = `${current.humidity} %`;
    document.querySelector('.pressure .value').textContent = `${current.pressure_mb} hPa`;
    document.querySelector('.precipitation .value').textContent = `${current.precip_in} in`;
    
    // Air quality
    document.querySelector('.air-quality .value').textContent = `AQI: ${airQuality.us_epa_index}`;
    document.querySelector('.air-quality-details').innerHTML = `
        <div><strong>PM2.5:</strong> ${airQuality.pm25}</div>
        <div><strong>PM10:</strong> ${airQuality.pm10}</div>
        <div><strong>O3:</strong> ${airQuality.o3}</div>
    `;

    // Update forecast
    updateForecast(forecast);

    // Update sun and moon data
    updateSunMoon(astro);

    // Show weather content and hide loading spinner
    document.querySelector('.weather-content').style.display = 'block';
    document.querySelector('.weather-loading').style.display = 'none';
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
    const errorContainer = document.querySelector('.weather-container');
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = message;
    errorContainer.appendChild(errorMessage);
}

// Add event listener to change location
document.getElementById('searchLocationButton').addEventListener('click', function () {
    const location = document.getElementById('locationInput').value;
    if (location) {
        // Show loading spinner
        document.querySelector('.weather-loading').style.display = 'block';
        document.querySelector('.weather-content').style.display = 'none';
        
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
