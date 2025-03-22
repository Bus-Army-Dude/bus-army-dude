// Initialize API key and base URL
const apiKey = '34ae2d4a53544561a07150106252203'; // Replace with your WeatherAPI key
const baseUrl = 'https://api.weatherapi.com/v1/forecast.json'; // Updated to the forecast endpoint

// Function to fetch weather data
async function fetchWeatherData(location) {
  const url = `${baseUrl}?key=${apiKey}&q=${location}&days=1&aqi=no&alerts=no`; // Added forecast and alerts query

  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');

  // Show loading spinner
  if (loadingSpinner && weatherContent) {
    loadingSpinner.style.display = 'block';
    weatherContent.style.display = 'none';
  } else {
    console.error('Required DOM elements not found.');
    return;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Debug API response
    console.log('Weather data received:', data);

    if (!data || !data.current) {
      throw new Error('Weather data is incomplete.');
    }

    // Update the DOM with the fetched weather data
    updateDisplay(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    displayError(error.message);
  }
}

// Function to update the HTML content with the weather data
function updateDisplay(data) {
  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');

  // Hide loading spinner and show content
  if (loadingSpinner && weatherContent) {
    loadingSpinner.style.display = 'none';
    weatherContent.style.display = 'block';
  }

  // Location and Last Updated
  document.querySelector('.location-name').textContent = data.location.name;
  document.querySelector('.last-updated').textContent = `Updated: ${new Date(data.current.last_updated).toLocaleString()}`;

  // Current Temperature and Feels Like
  document.querySelector('.temp-value').textContent = `${data.current.temp_f}°F`;
  document.querySelector('.feels-like').textContent = `Feels Like: ${data.current.feelslike_f}°F`;

  // Weather Condition
  const conditionIcon = data.current.condition.icon;
  const condition = data.current.condition.text;
  document.querySelector('.condition-text').innerHTML = `<img src="https:${conditionIcon}" alt="${condition}" /> ${condition}`;

  // Weather Details
  document.querySelector('.weather-details .wind-speed .value').textContent = `${data.current.wind_mph} mph`;
  document.querySelector('.weather-details .humidity .value').textContent = `${data.current.humidity} %`;
  document.querySelector('.weather-details .pressure .value').textContent = `${data.current.pressure_in} hPa`;

  // Sun & Moon Times
  updateSunMoon(data.forecast.forecastday[0].astro); // Fixed to use forecast data
}

// Function to update the Sun and Moon times section
function updateSunMoon(astroData) {
  const sunrise = astroData.sunrise;
  const sunset = astroData.sunset;

  const sunMoonSection = document.querySelector('.sun-moon-section');
  sunMoonSection.innerHTML = `
    <div><strong>Sunrise:</strong> ${sunrise}</div>
    <div><strong>Sunset:</strong> ${sunset}</div>
  `;
}

// Function to handle errors (e.g., invalid location or API errors)
function displayError(message) {
  const loadingSpinner = document.querySelector('.weather-loading');
  const errorContainer = document.querySelector('.weather-content');

  if (loadingSpinner) loadingSpinner.style.display = 'none';
  if (errorContainer) {
    errorContainer.innerHTML = `<p class="error-message">Error: ${message}</p>`;
    errorContainer.style.display = 'block';
  }
}

// On page load, fetch weather data
window.onload = function () {
  const lastLocation = localStorage.getItem('lastLocation') || 'New York';
  fetchWeatherData(lastLocation);
};

// Add event listeners for searching by location
document.querySelector('#searchLocationButton').addEventListener('click', function() {
  const location = document.querySelector('#locationInput').value.trim();
  if (location) {
    localStorage.setItem('lastLocation', location);
    fetchWeatherData(location);
  }
});
