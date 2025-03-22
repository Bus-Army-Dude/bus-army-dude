// Initialize API key and base URL
const apiKey = '34ae2d4a53544561a07150106252203'; // Replace with your WeatherAPI key
const baseUrl = 'https://api.weatherapi.com/v1/forecast.json';

// Function to fetch weather data
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
    const response = await fetch(url);
    const data = await response.json();

    console.log('API Response:', data); // Debug the full API response

    if (!data || !data.current || !data.forecast) {
      throw new Error('Weather data is incomplete or invalid.');
    }

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
  if (loadingSpinner) loadingSpinner.style.display = 'none';
  if (weatherContent) weatherContent.style.display = 'block';

  // Weather details
  const windSpeedElement = document.querySelector('.weather-details .wind-speed .value');
  const humidityElement = document.querySelector('.weather-details .humidity .value');
  const pressureElement = document.querySelector('.weather-details .pressure .value');
  const precipitationElement = document.querySelector('.weather-details .precipitation .value');
  const airQualityElement = document.querySelector('.weather-details .air-quality .value');

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
    precipitationElement.textContent = data.current.precip_in ? `${data.current.precip_in} in` : 'N/A';
  }
  if (airQualityElement && data.current.air_quality) {
    const aqi = data.current.air_quality["us-epa-index"];
    airQualityElement.textContent = aqi ? `AQI: ${aqi}` : 'N/A';
  }
}

  // 7-Day Forecast and Sun & Moon
  updateForecast(data.forecast.forecastday);
  updateSunMoon(data.forecast.forecastday[0].astro);
}

// Function to update the 7-day forecast section
function updateForecast(forecastDays) {
  const forecastContainer = document.querySelector('.forecast-container');
  forecastContainer.innerHTML = ''; // Clear previous forecasts

  forecastDays.forEach(day => {
    const forecastElement = document.createElement('div');
    forecastElement.classList.add('forecast-day');
    forecastElement.innerHTML = `
      <div class="date">${day.date}</div>
      <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" class="forecast-icon" />
      <div class="forecast-temps">
        <span class="high">${day.day.maxtemp_f}°F</span>
        <span class="separator">/</span>
        <span class="low">${day.day.mintemp_f}°F</span>
      </div>
      <div class="forecast-details">
        <span class="condition">${day.day.condition.text}</span>
        <span class="precipitation">Precipitation: ${day.day.daily_chance_of_rain}%</span>
      </div>
    `;
    forecastContainer.appendChild(forecastElement);
  });
}

// Function to update the Sun and Moon times section
function updateSunMoon(astroData) {
  const sunMoonSection = document.querySelector('.sun-moon-section');
  if (sunMoonSection) {
    sunMoonSection.innerHTML = `
      <div><strong>Sunrise:</strong> ${astroData.sunrise}</div>
      <div><strong>Sunset:</strong> ${astroData.sunset}</div>
    `;
  }
}

// Function to get air quality description based on AQI
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

// Function to handle errors (e.g., invalid location or API errors)
function displayError(message) {
  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');

  if (loadingSpinner) loadingSpinner.style.display = 'none';
  if (weatherContent) {
    weatherContent.innerHTML = `<p class="error-message">Unable to load data: ${message}</p>`;
    weatherContent.style.display = 'block';
  }
}

// On page load, fetch weather data for the default or last saved location
window.onload = function () {
  const lastLocation = localStorage.getItem('lastLocation') || 'New York, NY, USA'; // Default location
  console.log('Fetching default city:', lastLocation);
  fetchWeatherData(lastLocation).catch(error => console.error('Failed to load default city:', error));
};

// Allow manual location input as a fallback
document.querySelector('#searchLocationButton').addEventListener('click', function () {
  const location = document.querySelector('#locationInput').value.trim();
  if (location) {
    localStorage.setItem('lastLocation', location);
    fetchWeatherData(location);
  }
});
