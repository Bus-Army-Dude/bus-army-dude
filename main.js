// Initialize API key and base URL
const apiKey = '34ae2d4a53544561a07150106252203'; // Replace with your WeatherAPI key
const baseUrl = 'https://api.weatherapi.com/v1/forecast.json';

// Function to get user's location
function getUserLocation() {
  if (navigator.geolocation) {
    // Request user's location
    navigator.geolocation.getCurrentPosition(fetchWeatherByLocation, handleLocationError);
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Function to fetch weather using user's coordinates
function fetchWeatherByLocation(position) {
  const { latitude, longitude } = position.coords;
  const location = `${latitude},${longitude}`; // Format: "latitude,longitude"
  fetchWeatherData(location);
}

// Function to handle location errors
function handleLocationError(error) {
  console.error("Error retrieving location:", error);
  alert("Unable to fetch your location. Please enter a location manually.");
}

// Function to fetch weather data
async function fetchWeatherData(location) {
  const url = `${baseUrl}?key=${apiKey}&q=${location}&days=1&aqi=no&alerts=no`;

  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');

  // Show loading spinner
  if (loadingSpinner && weatherContent) {
    loadingSpinner.style.display = 'block';
    weatherContent.style.display = 'none';
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

  // Update weather data on the page
  document.querySelector('.location-name').textContent = data.location.name;
  document.querySelector('.last-updated').textContent = `Updated: ${new Date(data.current.last_updated).toLocaleString()}`;
  document.querySelector('.temp-value').textContent = `${data.current.temp_f}°F`;
  document.querySelector('.feels-like').textContent = `Feels Like: ${data.current.feelslike_f}°F`;

  const conditionIcon = data.current.condition.icon;
  const condition = data.current.condition.text;
  document.querySelector('.condition-text').innerHTML = `<img src="https:${conditionIcon}" alt="${condition}" /> ${condition}`;

  document.querySelector('.weather-details .wind-speed .value').textContent = `${data.current.wind_mph} mph`;
  document.querySelector('.weather-details .humidity .value').textContent = `${data.current.humidity} %`;
  document.querySelector('.weather-details .pressure .value').textContent = `${data.current.pressure_in} hPa`;

  updateSunMoon(data.forecast.forecastday[0].astro);
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
  const weatherContent = document.querySelector('.weather-content');

  if (loadingSpinner) loadingSpinner.style.display = 'none';
  if (weatherContent) {
    weatherContent.innerHTML = `<p class="error-message">Error: ${message}</p>`;
    weatherContent.style.display = 'block';
  }
}

// On page load, try fetching the user's location
window.onload = function () {
  getUserLocation();
};

// Allow manual location input as a fallback
document.querySelector('#searchLocationButton').addEventListener('click', function() {
  const location = document.querySelector('#locationInput').value.trim();
  if (location) {
    fetchWeatherData(location);
  }
});
