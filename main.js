// Initialize API key and base URL
const apiKey = '34ae2d4a53544561a07150106252203'; // Replace with your WeatherAPI key
const baseUrl = 'https://api.weatherapi.com/v1/forecast.json';

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
            displayError('Unable to fetch weather data. Using default location (New York, NY, USA).');
            fetchWeatherData('New York, NY, USA'); // Recursive call
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

// Function to display errors (e.g., API errors or incomplete data)
function displayError(message) {
    const loadingSpinner = document.querySelector('.weather-loading');
    const weatherContent = document.querySelector('.weather-content');

    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (weatherContent) {
        weatherContent.innerHTML = `<p class="error-message">Error: ${message}</p>`;
        weatherContent.style.display = 'block';
    }
}

// On page load, fetch weather data for default or last saved location
window.onload = function () {
    const defaultLocation = 'New York, NY, USA'; // Set a default location
    const lastLocation = localStorage.getItem('lastLocation') || defaultLocation;
    console.log('Fetching default city:', lastLocation);
    fetchWeatherData(lastLocation).catch(error => console.error('Failed to load default city:', error));
};

// Allow user to manually input location
document.querySelector('#searchLocationButton').addEventListener('click', function () {
    const locationInput = document.querySelector('#locationInput').value.trim();
    if (locationInput) {
        // Save the location for future sessions
        localStorage.setItem('lastLocation', locationInput);
        console.log('User-input location:', locationInput);
        fetchWeatherData(locationInput);
    }
});
