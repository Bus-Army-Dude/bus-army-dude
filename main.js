// Replace YOUR_API_KEY with your actual OpenWeatherMap API key
const apiKey = '88a889bce78f9ea1dc4fc0ef692e8ca4';
const baseWeatherURL = 'https://api.openweathermap.org/data/2.5/weather';
const baseForecastURL = 'https://api.openweathermap.org/data/2.5/onecall';
const airPollutionURL = 'https://api.openweathermap.org/data/2.5/air_pollution';

// Function to fetch current weather by city or ZIP code
async function fetchWeather(location) {
  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');
  const weatherAlertsList = document.querySelector('#weatherAlertsList');

  try {
    loadingSpinner.style.display = 'block';
    weatherContent.style.display = 'none';
    weatherAlertsList.innerHTML = ''; // Clear previous alerts

    // Fetch current weather data
    const weatherResponse = await fetch(`${baseWeatherURL}?q=${location}&appid=${apiKey}&units=metric`);
    if (!weatherResponse.ok) {
      throw new Error('Weather data not available for the specified location.');
    }
    const weatherData = await weatherResponse.json();

    // Update UI with current weather data
    updateWeatherUI(weatherData);

    // Fetch additional data (forecast, alerts, air quality)
    const lat = weatherData.coord.lat;
    const lon = weatherData.coord.lon;
    await Promise.all([fetchForecast(lat, lon), fetchWeatherAlerts(lat, lon), fetchAirQuality(lat, lon)]);

  } catch (error) {
    console.error('Error:', error.message);
    document.querySelector('.weather-content').innerHTML = `<p>Error: Unable to fetch data for "${location}".</p>`;
  } finally {
    loadingSpinner.style.display = 'none';
    weatherContent.style.display = 'block';
  }
}

// Function to fetch the 7-day forecast
async function fetchForecast(lat, lon) {
  const forecastContainer = document.querySelector('.forecast-container');
  forecastContainer.innerHTML = ''; // Clear previous forecasts

  try {
    const forecastResponse = await fetch(`${baseForecastURL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&exclude=minutely,hourly,alerts`);
    if (!forecastResponse.ok) {
      throw new Error('Could not fetch forecast data.');
    }
    const forecastData = await forecastResponse.json();

    forecastData.daily.forEach((day, index) => {
      const date = new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
      const forecastElement = document.createElement('div');
      forecastElement.classList.add('forecast-day');
      forecastElement.innerHTML = `
        <div class="date">${index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : date}</div>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}" class="forecast-icon" />
        <div class="forecast-temps">
          <span class="high">${day.temp.max.toFixed(1)}°C</span>
          <span class="separator">/</span>
          <span class="low">${day.temp.min.toFixed(1)}°C</span>
        </div>
        <div class="forecast-details">
          <span class="condition">${day.weather[0].description}</span>
        </div>
      `;
      forecastContainer.appendChild(forecastElement);
    });

    // Update sunrise, sunset, moonrise, and moonset
    updateSunMoon(forecastData);

  } catch (error) {
    console.error('Error fetching forecast data:', error.message);
    forecastContainer.textContent = 'Unable to retrieve forecast data.';
  }
}

// Function to update sunrise, sunset, moonrise, and moonset
function updateSunMoon(data) {
  const astroData = data.daily[0]; // Today's data
  document.querySelector('.sunrise').textContent = `Sunrise: ${new Date(astroData.sunrise * 1000).toLocaleTimeString()}`;
  document.querySelector('.sunset').textContent = `Sunset: ${new Date(astroData.sunset * 1000).toLocaleTimeString()}`;
  document.querySelector('.moonrise').textContent = `Moonrise: ${new Date(astroData.moonrise * 1000).toLocaleTimeString()}`;
  document.querySelector('.moonset').textContent = `Moonset: ${new Date(astroData.moonset * 1000).toLocaleTimeString()}`;
}

// Function to fetch weather alerts
async function fetchWeatherAlerts(lat, lon) {
  const weatherAlertsList = document.querySelector('#weatherAlertsList');
  weatherAlertsList.innerHTML = ''; // Clear previous alerts

  try {
    const alertsResponse = await fetch(`${baseForecastURL}?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=current,minutely,hourly,daily`);
    if (!alertsResponse.ok) {
      throw new Error('Unable to fetch weather alerts.');
    }
    const data = await alertsResponse.json();

    const alerts = data.alerts || [];
    if (alerts.length === 0) {
      weatherAlertsList.innerHTML = '<li>No weather alerts currently active.</li>';
    } else {
      alerts.forEach(alert => {
        const alertItem = document.createElement('li');
        alertItem.innerHTML = `
          <strong>${alert.event || 'Weather Alert'}</strong>
          <p>${alert.description || 'No description available.'}</p>
          <p><strong>Start:</strong> ${new Date(alert.start * 1000).toLocaleString()}</p>
          <p><strong>End:</strong> ${new Date(alert.end * 1000).toLocaleString()}</p>
        `;
        weatherAlertsList.appendChild(alertItem);
      });
    }
  } catch (error) {
    console.error('Error fetching weather alerts:', error.message);
    weatherAlertsList.innerHTML = '<li>Unable to retrieve weather alerts.</li>';
  }
}

// Function to fetch air quality data
async function fetchAirQuality(lat, lon) {
  const airQualityContainer = document.querySelector('.air-quality');
  const airQualityIndicator = airQualityContainer.querySelector('.air-quality-indicator');
  const airQualitySummary = airQualityContainer.querySelector('.air-quality-summary');
  const airQualityDetailsEl = airQualityContainer.querySelector('.air-quality-details');

  try {
    const airQualityResponse = await fetch(`${airPollutionURL}?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    if (!airQualityResponse.ok) {
      throw new Error('Unable to fetch air quality data.');
    }
    const data = await airQualityResponse.json();

    const aqi = data.list[0].main.aqi; // Air Quality Index
    const components = data.list[0].components; // Pollutants

    airQualityIndicator.innerHTML = `<span class="aqi-value">${aqi}</span>`;
    airQualitySummary.querySelector('.aqi-status').textContent = `AQI Level: ${getAirQualityDescription(aqi)}`;
    airQualityDetailsEl.innerHTML = `
      <div>CO (Carbon Monoxide): ${components.co.toFixed(2)} µg/m³</div>
      <div>NO2 (Nitrogen Dioxide): ${components.no2.toFixed(2)} µg/m³</div>
      <div>O3 (Ozone): ${components.o3.toFixed(2)} µg/m³</div>
      <div>SO2 (Sulfur Dioxide): ${components.so2.toFixed(2)} µg/m³</div>
      <div>PM2.5: ${components.pm2_5.toFixed(2)} µg/m³</div>
      <div>PM10: ${components.pm10.toFixed(2)} µg/m³</div>
    `;
  } catch (error) {
    console.error('Error fetching air quality data:', error.message);
    airQualityContainer.innerHTML = '<p>Error: Unable to retrieve air quality data.</p>';
  }
}

function getAirQualityDescription(aqi) {
  switch (aqi) {
    case 1: return 'Good';
    case 2: return 'Fair';
    case 3: return 'Moderate';
    case 4: return 'Poor';
    case 5: return 'Very Poor';
    default: return 'Unknown';
  }
}

// Function to update the main weather UI
function updateWeatherUI(data) {
  document.querySelector('.location-name').textContent = `${data.name}, ${data.sys.country}`;
  document.querySelector('.temp-value').textContent = `${data.main.temp}°C`;
  document.querySelector('.feels-like').textContent = `Feels Like: ${data.main.feels_like}°C`;

  const conditionTextElement = document.querySelector('.condition-text');
  conditionTextElement.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" class="condition-icon">
    ${data.weather[0].description}
  `;

  document.querySelector('.weather-details .wind-speed .value').textContent = `${data.wind.speed} m/s`;
  document.querySelector('.weather-details .humidity .value').textContent = `${data.main.humidity}%`;
  document.querySelector('.weather-details .pressure .value').textContent = `${data.main.pressure} hPa`;
  document.querySelector('.weather-details .precipitation .value').textContent = data.rain ? `${data.rain["1h"]} mm` : 'None';

  // Reset weather alerts for now (if present)
  document.querySelector('#weatherAlertsList').innerHTML = '<li>No weather alerts currently active.</li>';
}

// Handle location input and save to localStorage
document.querySelector('#location-submit').addEventListener('click', () => {
  const locationInput = document.querySelector('#location-input').value.trim();
  if (locationInput) {
    localStorage.setItem('lastLocation', locationInput); // Save the location for future visits
    fetchWeather(locationInput); // Fetch weather for the user-entered location
  }
});

// Fetch weather for default or last saved location on page load
document.addEventListener('DOMContentLoaded', () => {
  const defaultLocation = 'New York'; // Change this to your preferred default location
  const lastLocation = localStorage.getItem('lastLocation') || defaultLocation;
  fetchWeather(lastLocation);
});
