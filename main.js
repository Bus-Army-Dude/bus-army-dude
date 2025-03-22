// Initialize API key and base URL
const apiKey = '34ae2d4a53544561a07150106252203';  // Replace with your WeatherAPI key
const baseUrl = 'https://api.weatherapi.com/v1/current.json';

// Function to fetch weather data
async function fetchWeatherData(location) {
  const url = `${baseUrl}?key=${apiKey}&q=${location}&aqi=no`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Check if the response contains valid data
    if (data.error) {
      throw new Error(data.error.message);
    }

    // Update the DOM with the fetched weather data
    updateDisplay(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Show error message if fetching weather fails
    displayError(error.message);
  }
}

// Function to update the HTML content with the weather data
function updateDisplay(data) {
  // Hide the loading state
  document.querySelector('.weather-loading').style.display = 'none';
  
  // Show the weather content
  document.querySelector('.weather-content').style.display = 'block';

  // Location and Last Updated
  const locationName = data.location.name;
  const lastUpdated = new Date(data.current.last_updated).toLocaleString();
  
  document.querySelector('.location-name').textContent = locationName;
  document.querySelector('.last-updated').textContent = `Updated: ${lastUpdated}`;

  // Current Temperature and Feels Like
  const currentTemp = data.current.temp_f;
  const feelsLike = data.current.feelslike_f;
  
  document.querySelector('.temp-value').textContent = `${currentTemp}°F`;
  document.querySelector('.feels-like').textContent = `Feels Like: ${feelsLike}°F`;

  // Weather Condition
  const condition = data.current.condition.text;
  const conditionIcon = data.current.condition.icon;
  
  document.querySelector('.condition-text').innerHTML = `<i class="wi wi-na" style="background-image: url(${conditionIcon});"></i> ${condition}`;

  // Wind Speed, Humidity, and Pressure
  const windSpeed = data.current.wind_mph;
  const humidity = data.current.humidity;
  const pressure = data.current.pressure_in;
  
  document.querySelector('.weather-details .wind-speed .value').textContent = `${windSpeed} mph`;
  document.querySelector('.weather-details .humidity .value').textContent = `${humidity} %`;
  document.querySelector('.weather-details .pressure .value').textContent = `${pressure} hPa`;

  // Forecast Section (This section can be updated based on additional forecast API calls if needed)
  // Example: You can populate a forecast section here if you have forecast data from the API
  updateForecast(data.forecast);

  // Sun & Moon Times (Example - You may have to add this data in the API request or handle it separately)
  updateSunMoon(data);
}

// Function to update the Forecast section (if forecast data is available)
function updateForecast(forecastData) {
  if (!forecastData || !forecastData.forecastday) {
    return;
  }

  // Dynamically populate the forecast section with the forecast data
  const forecastContainer = document.querySelector('.forecast-container');
  forecastContainer.innerHTML = ''; // Clear any existing content

  forecastData.forecastday.forEach(day => {
    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');

    // Forecast data: Date, Condition, Temp
    const forecastDate = new Date(day.date).toLocaleDateString();
    const forecastCondition = day.day.condition.text;
    const forecastTemp = `${day.day.avgtemp_f}°F`;

    forecastItem.innerHTML = `
      <h4>${forecastDate}</h4>
      <div class="forecast-condition">${forecastCondition}</div>
      <div class="forecast-temp">${forecastTemp}</div>
    `;
    forecastContainer.appendChild(forecastItem);
  });
}

// Function to update the Sun and Moon times section
function updateSunMoon(data) {
  // Extracting sun and moon times from data
  const sunrise = new Date(data.forecast.forecastday[0].astro.sunrise).toLocaleTimeString();
  const sunset = new Date(data.forecast.forecastday[0].astro.sunset).toLocaleTimeString();
  const moonrise = new Date(data.forecast.forecastday[0].astro.moonrise).toLocaleTimeString();
  const moonset = new Date(data.forecast.forecastday[0].astro.moonset).toLocaleTimeString();

  const sunMoonSection = document.querySelector('.sun-moon-section');
  sunMoonSection.innerHTML = `
    <div><strong>Sunrise:</strong> ${sunrise}</div>
    <div><strong>Sunset:</strong> ${sunset}</div>
    <div><strong>Moonrise:</strong> ${moonrise}</div>
    <div><strong>Moonset:</strong> ${moonset}</div>
  `;
}

// Function to handle errors (e.g., invalid location or API errors)
function displayError(message) {
  document.querySelector('.weather-loading').style.display = 'none';
  const errorContainer = document.querySelector('.weather-content');
  errorContainer.innerHTML = `<p>Error: ${message}</p>`;
}

// Call the fetchWeatherData function when the page is ready or after a user input
window.onload = function () {
  // Example: Fetch weather data for a default location (e.g., New York)
  fetchWeatherData('New York');
};

// Optional: Add event listeners for searching by location
document.querySelector('#searchLocationButton').addEventListener('click', function() {
  const location = document.querySelector('#locationInput').value;
  if (location) {
    fetchWeatherData(location);
  }
});
