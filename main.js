// Function to get weather data from API
async function getWeather(location) {
  const apiKey = '34ae2d4a53544561a07150106252203'; // Replace with your actual API key
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=7&aqi=no&alerts=no`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Location not found');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    showError(error.message);
    return null;
  }
}

// Function to update the current weather section
function updateCurrentWeather(current) {
  const currentWeatherContainer = document.querySelector('.current-weather');
  currentWeatherContainer.innerHTML = `
    <h2>Current Weather</h2>
    <h3>${current.condition.text}</h3>
    <img src="${current.condition.icon}" alt="${current.condition.text}" />
    <p>Temperature: ${current.temp_c}°C</p>
    <p>Feels Like: ${current.feelslike_c}°C</p>
    <p>Humidity: ${current.humidity}%</p>
    <p>Wind: ${current.wind_kph} kph</p>
  `;
}

// Function to update the 7-day forecast section
function updateForecast(forecast) {
  const forecastContainer = document.querySelector('.forecast-container');
  forecastContainer.innerHTML = ''; // Clear any previous forecast

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  forecast.forEach((day) => {
    const forecastDate = new Date(day.date);

    let dayLabel;

    // Check if the date is today
    if (forecastDate.toDateString() === today.toDateString()) {
      dayLabel = 'Today';
    } else {
      const dayOfWeek = daysOfWeek[forecastDate.getDay()]; // Get day of the week (Mon, Tue, etc.)
      const dayOfMonth = forecastDate.getDate(); // Get the day number (24, 25, etc.)
      dayLabel = `${dayOfWeek} ${dayOfMonth}`;
    }

    // Create the forecast card
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');
    forecastCard.innerHTML = `
      <h3>${dayLabel}</h3>
      <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" />
      <p>${day.day.avgtemp_f}°F</p>
      <p>${day.day.condition.text}</p>
    `;
    
    forecastContainer.appendChild(forecastCard);
  });
}

// Function to show error in the search bar
function showError(message) {
  const locationInput = document.querySelector('#locationInput');
  locationInput.classList.add('error'); // Add error class for styling

  const errorIcon = document.createElement('span');
  errorIcon.classList.add('error-icon');
  errorIcon.innerText = '!';
  locationInput.parentElement.appendChild(errorIcon);

  // Tooltip functionality
  errorIcon.title = message;
}

// Function to clear error when location is valid again
function clearError() {
  const locationInput = document.querySelector('#locationInput');
  locationInput.classList.remove('error');

  const errorIcon = locationInput.parentElement.querySelector('.error-icon');
  if (errorIcon) {
    errorIcon.remove();
  }
}

// Function to fetch and display the weather data
async function displayWeather(location) {
  clearError(); // Clear previous errors

  const weatherData = await getWeather(location);

  if (weatherData) {
    updateCurrentWeather(weatherData.current);
    updateForecast(weatherData.forecast.forecastday);
  }
}

// Event listener for search functionality (Click)
document.querySelector('#searchButton').addEventListener('click', () => {
  const locationInput = document.querySelector('#locationInput').value;
  if (locationInput) {
    displayWeather(locationInput);
  }
});

// Event listener for pressing Enter key
document.querySelector('#locationInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const locationInput = document.querySelector('#locationInput').value;
    if (locationInput) {
      displayWeather(locationInput);
    }
  }
});

// Load default weather for a specific location on page load
document.addEventListener('DOMContentLoaded', () => {
  const defaultLocation = 'New York'; // Default location for initial load
  displayWeather(defaultLocation);
});
