// Initialize API key and base URL
const apiKey = '34ae2d4a53544561a07150106252203';  // Replace with your WeatherAPI key
const baseUrl = 'https://api.weatherapi.com/v1/current.json';

// Function to fetch weather data
async function fetchWeatherData(location) {
  const url = `${baseUrl}?key=${apiKey}&q=${location}&aqi=no`;

  // Show loading spinner
  document.querySelector('.weather-loading').style.display = 'block';
  document.querySelector('.weather-content').style.display = 'none';

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

  // Sun & Moon Times
  updateSunMoon(data);
}

// Function to update the Sun and Moon times section
function updateSunMoon(data) {
  const sunrise = new Date(data.location.localtime_epoch * 1000).toLocaleTimeString();
  const sunset = new Date(data.location.localtime_epoch * 1000).toLocaleTimeString();
  
  const sunMoonSection = document.querySelector('.sun-moon-section');
  sunMoonSection.innerHTML = `
    <div><strong>Sunrise:</strong> ${sunrise}</div>
    <div><strong>Sunset:</strong> ${sunset}</div>
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
  // Try to fetch the last used location from localStorage
  const lastLocation = localStorage.getItem('lastLocation') || 'New York';
  fetchWeatherData(lastLocation);
};

// Optional: Add event listeners for searching by location
document.querySelector('#searchLocationButton').addEventListener('click', function() {
  const location = document.querySelector('#locationInput').value;
  if (location) {
    // Store the location in localStorage to remember it for next time
    localStorage.setItem('lastLocation', location);
    fetchWeatherData(location);
  }
});
