// API key and endpoint
const apiKey = '88a889bce78f9ea1dc4fc0ef692e8ca4';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall'; // For UV Index and Air Quality Index (AQI)

// HTML Elements
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const cityName = document.getElementById('city-name');
const region = document.getElementById('region');
const weatherTime = document.getElementById('weather-time');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weather-condition');
const weatherIcon = document.getElementById('weather-icon');
const feelsLike = document.getElementById('feels-like');
const minTemp = document.getElementById('min-temp');
const maxTemp = document.getElementById('max-temp');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const uvIndex = document.getElementById('uv-index');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const aqi = document.getElementById('aqi');
const visibility = document.getElementById('visibility');
const clouds = document.getElementById('clouds');
const rain = document.getElementById('rain');
const snow = document.getElementById('snow');
const locationCoordinates = document.getElementById('location-coordinates');
const unitSelect = document.getElementById('unit-select');

// Retrieve city and unit preferences from localStorage
let currentCity = localStorage.getItem('city') || 'New York';
let currentUnit = localStorage.getItem('unit') || 'metric';
unitSelect.value = currentUnit === 'metric' ? 'Celsius' : 'Fahrenheit';

// Utility function to check if input is a ZIP code
function isZipCode(input) {
  return /^[0-9]{5}(?:-[0-9]{4})?$/.test(input); // Matches US ZIP codes
}

// Fetch weather data including UV Index and Air Quality
async function fetchWeatherData(query, unit) {
  let url;

  // Set the correct URL for ZIP code or city-based searches
  if (isZipCode(query)) {
    url = `${apiUrl}?zip=${query}&units=${unit}&appid=${apiKey}`;
  } else {
    url = `${apiUrl}?q=${query}&units=${unit}&appid=${apiKey}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Unable to fetch weather data. Status: ${response.status}`);
    }
    const data = await response.json();

    // Log the weather data for debugging
    console.log('Weather Data:', data);

    updateWeatherUI(data);

    // Fetch additional details like UV Index and Air Quality
    fetchAdditionalDetails(data.coord.lat, data.coord.lon, unit);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    alert('Unable to fetch weather data. Please check the city or ZIP code and try again.');
  }
}

// Fetch UV Index and Air Quality using the One Call API
async function fetchAdditionalDetails(lat, lon, unit) {
  try {
    const response = await fetch(`${oneCallUrl}?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Unable to fetch UV or Air Quality data. Status: ${response.status}`);
    }
    const data = await response.json();

    // Log the forecast data for debugging
    console.log('One Call API Data:', data);

    // Update UV Index
    uvIndex.textContent = data.current.uvi ? `UV Index: ${data.current.uvi}` : 'UV Index: Not Available';

    // Update Air Quality Index (optional - OWM API doesn't provide AQI directly in One Call)
    aqi.textContent = 'Air Quality Index: Not Available'; // Placeholder if AQI isn't part of the API

    // Update sunrise and sunset
    sunrise.textContent = `Sunrise: ${new Date(data.current.sunrise * 1000).toLocaleTimeString()}`;
    sunset.textContent = `Sunset: ${new Date(data.current.sunset * 1000).toLocaleTimeString()}`;
  } catch (error) {
    console.error('Error fetching UV or Air Quality data:', error.message);
    uvIndex.textContent = 'UV Index: Not Available';
    aqi.textContent = 'Air Quality Index: Not Available';
  }
}

// Update the weather UI
function updateWeatherUI(data) {
  // General weather information
  cityName.textContent = data.name || 'Unknown Location';
  region.textContent = data.sys.country || 'N/A';
  weatherTime.textContent = `Last Updated: ${new Date(data.dt * 1000).toLocaleString()}`;

  // Temperature and conditions
  temperature.textContent = `${Math.round(data.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}`;
  feelsLike.textContent = `Feels Like: ${Math.round(data.main.feels_like)}°${currentUnit === 'metric' ? 'C' : 'F'}`;
  minTemp.textContent = `Min Temp: ${Math.round(data.main.temp_min)}°${currentUnit === 'metric' ? 'C' : 'F'}`;
  maxTemp.textContent = `Max Temp: ${Math.round(data.main.temp_max)}°${currentUnit === 'metric' ? 'C' : 'F'}`;
  weatherCondition.textContent = data.weather[0].description || 'N/A';
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  // Additional details
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  wind.textContent = `Wind Speed: ${Math.round(data.wind.speed)} ${currentUnit === 'metric' ? 'm/s' : 'mph'}`;
  pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
  visibility.textContent = `Visibility: ${Math.round(data.visibility / 1000)} km`;
  clouds.textContent = `Cloud Coverage: ${data.clouds.all}%`;
  rain.textContent = data.rain ? `Rain: ${data.rain['1h']} mm` : 'Rain: Not Available';
  snow.textContent = data.snow ? `Snow: ${data.snow['1h']} mm` : 'Snow: Not Available';
  locationCoordinates.textContent = `Coordinates: Lat ${data.coord.lat}, Lon ${data.coord.lon}`;
}

// Event listeners
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    currentCity = query;
    localStorage.setItem('city', currentCity); // Save user's location
    fetchWeatherData(query, currentUnit);
  } else {
    alert('Please enter a city or ZIP code.');
  }
});

searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query) {
      currentCity = query;
      localStorage.setItem('city', currentCity); // Save user's location
      fetchWeatherData(query, currentUnit);
    } else {
      alert('Please enter a city or ZIP code.');
    }
  }
});

unitSelect.addEventListener('change', () => {
  currentUnit = unitSelect.value === 'Celsius' ? 'metric' : 'imperial';
  localStorage.setItem('unit', currentUnit); // Save user's unit preference
  fetchWeatherData(currentCity, currentUnit);
});

// On page load
document.addEventListener('DOMContentLoaded', () => {
  fetchWeatherData(currentCity, currentUnit);
});
