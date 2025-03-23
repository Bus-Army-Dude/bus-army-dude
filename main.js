// Initialize API key and base URL
const apiKey = '34ae2d4a53544561a07150106252203'; // Replace with your WeatherAPI key
const baseUrl = 'https://api.weatherapi.com/v1/forecast.json';

// Function to fetch weather data
async function fetchWeatherData(location) {
  const url = `${baseUrl}?key=${apiKey}&q=${encodeURIComponent(location)}&days=7&aqi=yes&alerts=yes`;
  
  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');

  // Show loading spinner
  if (loadingSpinner && weatherContent) {
    loadingSpinner.style.display = 'block';
    weatherContent.style.display = 'none';
  }

  try {
    console.log('Fetching weather data for location:', location);
    console.log('API Request URL:', url);
    
    const response = await fetch(url);
    console.log('HTTP Response Status:', response.status);
    
    // Check HTTP status
    if (!response.ok) {
      throw new Error(`API returned error: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Full API Response:', data);
    
    // Check if required data exists
    if (!data || !data.current || !data.forecast) {
      throw new Error('Weather data is incomplete or invalid.');
    }
    
    // Update Weather Alerts (if any)
    const alerts = (data.alerts && data.alerts.alert) ? data.alerts.alert : [];
    console.log('Fetched Alerts:', alerts);
    displayWeatherAlerts(alerts);
    
    // Update all weather display sections
    updateDisplay(data);

  } catch (error) {
    console.error('Error fetching weather data:', error);
    displayError(`Unable to load weather data. ${error.message}`);
  } finally {
    // Hide loading spinner and show content regardless of outcome
    if (loadingSpinner && weatherContent) {
      loadingSpinner.style.display = 'none';
      weatherContent.style.display = 'block';
    }
  }
}

// Function to update the HTML content with the weather data
function updateDisplay(data) {
  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');
  
  if (loadingSpinner) loadingSpinner.style.display = 'none';
  if (weatherContent) weatherContent.style.display = 'block';
  
  // Location details update
  const locationNameElement = document.querySelector('.location-name');
  if (locationNameElement) {
    const city = data.location.name;
    const stateOrRegion = data.location.region;
    const country = data.location.country;
    locationNameElement.textContent = `${city}, ${stateOrRegion}, ${country}`;
  }
  
  // Last updated time
  const lastUpdatedElement = document.querySelector('.last-updated');
  if (lastUpdatedElement) {
    lastUpdatedElement.textContent = `Updated: ${new Date(data.current.last_updated).toLocaleString()}`;
  }
  
  // Current temperature and feels-like
  const tempValueElement = document.querySelector('.temp-value');
  const feelsLikeElement = document.querySelector('.feels-like');
  if (tempValueElement) {
    tempValueElement.textContent = `${data.current.temp_f}°F`;
  }
  if (feelsLikeElement) {
    feelsLikeElement.textContent = `Feels Like: ${data.current.feelslike_f}°F`;
  }
  
  // Weather condition (with icon)
  const conditionTextElement = document.querySelector('.condition-text');
  if (conditionTextElement) {
    const conditionIcon = data.current.condition.icon;
    const condition = data.current.condition.text;
    conditionTextElement.innerHTML = `<img src="https:${conditionIcon}" alt="${condition}" class="condition-icon" /> ${condition}`;
  }
  
  // Weather details: wind, humidity, pressure, precipitation
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
    // Use daily chance of rain from forecast for percentage
    const precipitationChance = data.forecast.forecastday[0].day.daily_chance_of_rain || 0;
    precipitationElement.textContent = precipitationChance > 0 
      ? `${precipitationChance}% chance of rain` 
      : `None`;
  }
  
  // Update Air Quality Section
  updateAirQuality(data);
  
  // Update Forecast Section
  updateForecast(data.forecast.forecastday);
  
  // Update Sun & Moon Section
  updateSunMoon(data.forecast.forecastday[0].astro);
}

// Function to display weather alerts
function displayWeatherAlerts(alerts) {
  const alertsContainer = document.querySelector('#weatherAlertsList');
  if (!alertsContainer) return;
  
  // Clear previous alerts
  alertsContainer.innerHTML = '';
  
  if (alerts && alerts.length > 0) {
    alerts.forEach(alert => {
      const alertItem = document.createElement('li');
      alertItem.classList.add('alert-item');
      alertItem.innerHTML = `
        <strong>${alert.headline || 'Weather Alert'}</strong>
        <p>${alert.description || 'No description provided.'}</p>
        <p><strong>Issued by:</strong> ${alert.certainty || 'Unknown'}</p>
        <p><strong>Effective:</strong> ${alert.effective || 'Unknown'}</p>
        <p><strong>Expires:</strong> ${alert.expires || 'Unknown'}</p>
      `;
      alertsContainer.appendChild(alertItem);
    });
  } else {
    const noAlertsMessage = document.createElement('li');
    noAlertsMessage.textContent = 'No weather alerts currently active.';
    alertsContainer.appendChild(noAlertsMessage);
  }
}

// Function to update the Air Quality section with a circular indicator and details
function updateAirQuality(data) {
  const airQualityIndicator = document.querySelector('.air-quality-indicator');
  const airQualityStatus = document.querySelector('.air-quality-summary .aqi-status');
  const primaryPollutantElem = document.querySelector('.air-quality-summary .primary-pollutant');
  const airQualityDetailsEl = document.querySelector('.air-quality-details');
  
  if (data.current.air_quality) {
    const aqi = data.current.air_quality["us-epa-index"];
    const aqiDescription = getAirQualityDescription(aqi);
    const primaryPollutant = getPrimaryPollutant(data.current.air_quality);
    
    // Update the circular indicator
    airQualityIndicator.className = 'air-quality-indicator';
    airQualityIndicator.classList.add(getAirQualityClass(aqi));
    airQualityIndicator.innerHTML = `<span class="aqi-value">${aqi}</span>`;
    
    // Update summary info
    airQualityStatus.textContent = aqiDescription;
    primaryPollutantElem.textContent = `Primary Pollutant: ${primaryPollutant}`;
    
    // Build detailed pollutant breakdown
    const pollutants = [
      { name: 'O3 (Ozone)', value: data.current.air_quality.o3 },
      { name: 'CO (Carbon Monoxide)', value: data.current.air_quality.co },
      { name: 'NO2 (Nitrogen Dioxide)', value: data.current.air_quality.no2 },
      { name: 'PM10', value: data.current.air_quality.pm10 },
      { name: 'PM2.5', value: data.current.air_quality.pm2_5 },
      { name: 'SO2 (Sulfur Dioxide)', value: data.current.air_quality.so2 }
    ];
    
    airQualityDetailsEl.innerHTML = pollutants.map(pollutant => `
      <div class="pollutant">
        <span class="pollutant-name">${pollutant.name}:</span>
        <span class="pollutant-value">${pollutant.value.toFixed(2)} µg/m³</span>
        <span class="pollutant-rating ${getAirQualityClass(aqi)}">${aqiDescription}</span>
      </div>
    `).join('');
  } else {
    airQualityIndicator.innerHTML = `<span>N/A</span>`;
    airQualityStatus.textContent = 'Air Quality data not available.';
    primaryPollutantElem.textContent = '';
    airQualityDetailsEl.innerHTML = '';
  }
}

// Helper function to get Air Quality Description
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

// Helper function to get the primary pollutant
function getPrimaryPollutant(airQuality) {
  const pollutants = [
    { name: 'Ozone', value: airQuality.o3 },
    { name: 'Carbon Monoxide', value: airQuality.co },
    { name: 'Nitrogen Dioxide', value: airQuality.no2 },
    { name: 'Sulfur Dioxide', value: airQuality.so2 },
    { name: 'PM10', value: airQuality.pm10 },
    { name: 'PM2.5', value: airQuality.pm2_5 }
  ];
  
  pollutants.sort((a, b) => b.value - a.value);
  return pollutants[0].name;
}

// Helper function to get the CSS class for AQI styling
function getAirQualityClass(aqi) {
  switch (aqi) {
    case 1: return "good";
    case 2: return "moderate";
    case 3: return "unhealthy";
    case 4: return "very-unhealthy";
    case 5: return "hazardous";
    default: return "";
  }
}

// Function to update forecast section
function updateForecast(forecastDays) {
  const forecastContainer = document.querySelector('.forecast-container');
  forecastContainer.innerHTML = '';
  
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

// Function to update Sun & Moon info
function updateSunMoon(astroData) {
  // Ensure your HTML has elements for sunrise, sunset, moonrise, and moonset.
  const sunriseElement = document.querySelector('.sunrise');
  const sunsetElement = document.querySelector('.sunset');
  const moonriseElement = document.querySelector('.moonrise');
  const moonsetElement = document.querySelector('.moonset');
  
  if (astroData) {
    sunriseElement.textContent = `Sunrise: ${astroData.sunrise || '--'}`;
    sunsetElement.textContent = `Sunset: ${astroData.sunset || '--'}`;
    moonriseElement.textContent = `Moonrise: ${astroData.moonrise || '--'}`;
    moonsetElement.textContent = `Moonset: ${astroData.moonset || '--'}`;
  } else {
    sunriseElement.textContent = `Sunrise: --`;
    sunsetElement.textContent = `Sunset: --`;
    moonriseElement.textContent = `Moonrise: --`;
    moonsetElement.textContent = `Moonset: --`;
  }
}

// Function to display errors
function displayError(message) {
  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');
  
  if (loadingSpinner) loadingSpinner.style.display = 'none';
  if (weatherContent) {
    weatherContent.innerHTML = `<p class="error-message">Error: ${message}</p>`;
    weatherContent.style.display = 'block';
  }
}

// On page load, fetch weather for default or last saved location
window.onload = function () {
  const defaultLocation = 'New York, NY, USA';
  const lastLocation = localStorage.getItem('lastLocation') || defaultLocation;
  console.log('Fetching default city:', lastLocation);
  fetchWeatherData(lastLocation).catch(error => console.error('Failed to load default city:', error));
};

// Allow manual location input
document.querySelector('#location-submit').addEventListener('click', function () {
  const locationInput = document.querySelector('#location-input').value.trim();
  if (locationInput) {
    localStorage.setItem('lastLocation', locationInput);
    console.log('User-input location:', locationInput);
    fetchWeatherData(locationInput);
  }
});
