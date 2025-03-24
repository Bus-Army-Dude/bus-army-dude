// ========================
// Initialize API key and base URL
// ========================
const apiKey = '34ae2d4a53544561a07150106252203'; // Replace with your WeatherAPI key
const baseUrl = 'https://api.weatherapi.com/v1/forecast.json';

// ========================
// Fetch Weather Data Function
// ========================
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
    if (!response.ok) {
      throw new Error(`API returned error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Full API Response:', data);

    if (!data || !data.current || !data.forecast) {
      throw new Error('Weather data is incomplete or invalid.');
    }

    // Process and display weather alerts
    const alerts = (data.alerts && data.alerts.alert) ? data.alerts.alert : [];
    console.log('Fetched Alerts:', alerts);
    displayWeatherAlerts(alerts);

    // Update the main weather display
    updateDisplay(data);

  } catch (error) {
    console.error('Error fetching weather data:', error);
    displayError(`Unable to load weather data. ${error.message}`);
  } finally {
    if (loadingSpinner && weatherContent) {
      loadingSpinner.style.display = 'none';
      weatherContent.style.display = 'block';
    }
  }
}

// ========================
// Update Weather Display
// ========================
function updateDisplay(data) {
  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');
  if (loadingSpinner) loadingSpinner.style.display = 'none';
  if (weatherContent) weatherContent.style.display = 'block';

  // Location
  const locationNameElement = document.querySelector('.location-name');
  if (locationNameElement) {
    const city = data.location.name;
    const region = data.location.region;
    const country = data.location.country;
    locationNameElement.textContent = `${city}, ${region}, ${country}`;
  }

  // Last updated time
  const lastUpdatedElement = document.querySelector('.last-updated');
  if (lastUpdatedElement) {
    lastUpdatedElement.textContent = `Updated: ${new Date(data.current.last_updated).toLocaleString()}`;
  }

  // Temperature and feels like
  const tempValueElement = document.querySelector('.temp-value');
  const feelsLikeElement = document.querySelector('.feels-like');
  if (tempValueElement) {
    tempValueElement.textContent = `${data.current.temp_f}°F`;
  }
  if (feelsLikeElement) {
    feelsLikeElement.textContent = `Feels Like: ${data.current.feelslike_f}°F`;
  }

  // Condition (icon and text)
  const conditionTextElement = document.querySelector('.condition-text');
  if (conditionTextElement) {
    const conditionIcon = data.current.condition.icon;
    const condition = data.current.condition.text;
    conditionTextElement.innerHTML = `<img src="https:${conditionIcon}" alt="${condition}" class="condition-icon" /> ${condition}`;
  }

  // Weather Details: Wind Speed, Humidity, Pressure, Precipitation
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
    precipitationElement.textContent = precipitationChance > 0 ? `${precipitationChance}% chance of rain` : `None`;
  }

  // Update Air Quality Section
  updateAirQuality(data);

  // Update Forecast and Sun/Moon Sections
  updateForecast(data.forecast.forecastday);
  updateSunMoon(data.forecast.forecastday[0].astro);
}

// ========================
// Display Weather Alerts with Deduplication
// ========================
function displayWeatherAlerts(alerts, userLat, userLon) {
  const alertsContainer = document.querySelector('#weatherAlertsList');
  if (!alertsContainer) return;

  alertsContainer.innerHTML = '';

  const uniqueAlerts = alerts && alerts.length > 0
    ? alerts.filter((alert, index, self) =>
        index === self.findIndex(a => a.headline === alert.headline)
      )
    : [];

  // Debugging: Log the raw alerts data
  console.log("Raw Alerts Data:", uniqueAlerts);

  const relevantAlerts = uniqueAlerts.filter(alert => {
    if (alert.lat && alert.lon) { // Check if alert has coordinates
      const distance = calculateDistance(userLat, userLon, alert.lat, alert.lon);
      return distance <= 100; // Show alerts within 100km (adjust radius as needed)
    } else {
      return true; // Show alerts without coordinates (or handle differently)
    }
  });

  if (relevantAlerts.length > 0) {
    relevantAlerts.forEach(alert => {
      // Data Validation:
      let description = alert.description;
      if (!description || description.trim() === "") {
        description = "Description not available."; // Provide a fallback
      }

      let issuedBy = alert.certainty;
      if (issuedBy.toLowerCase() === "observed") {
          issuedBy = "Unknown (Observed)";
      }

      const effectiveDate = new Date(alert.effective);
      const expiresDate = new Date(alert.expires);

      const currentDate = new Date(); // Get current date

      //Date Validation.
      if (effectiveDate.getFullYear() > currentDate.getFullYear() + 1 || expiresDate.getFullYear() > currentDate.getFullYear() + 1){
          description = "Invalid date provided by API.";
          issuedBy = "Invalid Date.";
      }

      const effectiveString = effectiveDate.toLocaleString();
      const expiresString = expiresDate.toLocaleString();

      const alertItem = document.createElement('li');
      alertItem.classList.add('alert-item');
      alertItem.innerHTML = `
        <strong>${alert.headline || 'Weather Alert'}</strong>
        <p>${description}</p>
        <p><strong>Issued by:</strong> ${issuedBy}</p>
        <p><strong>Effective:</strong> ${effectiveString}</p>
        <p><strong>Expires:</strong> ${expiresString}</p>
      `;
      alertsContainer.appendChild(alertItem);
    });
  } else {
    const noAlertsMessage = document.createElement('li');
    noAlertsMessage.textContent = 'No weather alerts currently active within 100km.';
    alertsContainer.appendChild(noAlertsMessage);
  }
}

// Function to calculate the distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

// ========================
// Update Air Quality Section
// ========================
function updateAirQuality(data) {
  const airQualityContainer = document.querySelector('.air-quality');
  if (!airQualityContainer) {
    console.error('Air Quality container not found in HTML.');
    return;
  }
  
  const airQualityIndicator = airQualityContainer.querySelector('.air-quality-indicator');
  const airQualityStatus = airQualityContainer.querySelector('.air-quality-summary .aqi-status');
  const primaryPollutantElem = airQualityContainer.querySelector('.air-quality-summary .primary-pollutant');
  const airQualityDetailsEl = airQualityContainer.querySelector('.air-quality-details');

  if (!airQualityIndicator || !airQualityStatus || !primaryPollutantElem || !airQualityDetailsEl) {
    console.error('Missing one or more air quality DOM elements. Please check your HTML.');
    return;
  }

  if (data.current.air_quality) {
    const aqi = data.current.air_quality["us-epa-index"];
    const aqiDescription = getAirQualityDescription(aqi);
    const primaryPollutant = getPrimaryPollutant(data.current.air_quality);

    airQualityIndicator.className = 'air-quality-indicator';
    airQualityIndicator.classList.add(getAirQualityClass(aqi));
    airQualityIndicator.innerHTML = `<span class="aqi-value">${aqi}</span>`;

    airQualityStatus.textContent = aqiDescription;
    primaryPollutantElem.textContent = `Primary Pollutant: ${primaryPollutant}`;

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

// ========================
// Air Quality Helper Functions
// ========================
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

// ========================
// Update Forecast Section
// ========================

function formatForecastDate(dateObj) {
  // Option 1: Manual Formatting (Most Reliable)
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = dateObj.getDate();
  const weekdayShort = weekdays[dateObj.getDay()];
  return `${weekdayShort} ${day}`;

  // Option 2: toLocaleDateString (If Manual Formatting Doesn't Work)
  // If the above manual format does not work, try uncommenting the code below.
  // const options = { weekday: 'short', day: 'numeric' };
  // const formattedDate = dateObj.toLocaleDateString('en-US', options);
  // console.log("Formatted Date:", formattedDate); // Check the output
  // const [weekday, day] = formattedDate.match(/[A-Za-z]+|\d+/g);
  // return `${weekday} ${day}`;
}

// Updated Forecast Function
function updateForecast(forecastDays) {
  const forecastContainer = document.querySelector('.forecast-container');
  forecastContainer.innerHTML = ''; // Clear previous forecasts

  const today = new Date(); // Current date

  forecastDays.forEach((day, index) => {
    let dateLabel = '';
    if (index === 0) {
      dateLabel = 'Today';
    } else if (index === 1) {
      dateLabel = 'Tomorrow';
    } else {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + index);
      dateLabel = formatForecastDate(futureDate);
    }

    const forecastElement = document.createElement('div');
    forecastElement.classList.add('forecast-day');
    forecastElement.innerHTML = `
      <div class="date">${dateLabel}</div>
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

// ========================
// Update Sun & Moon Section
// ========================
function updateSunMoon(astroData) {
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
    sunriseElement.textContent = 'Sunrise: --';
    sunsetElement.textContent = 'Sunset: --';
    moonriseElement.textContent = 'Moonrise: --';
    moonsetElement.textContent = 'Moonset: --';
  }
}

// ========================
// Display Error Function
// ========================
function displayError(message) {
  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');

  if (loadingSpinner) loadingSpinner.style.display = 'none';
  if (weatherContent) {
    weatherContent.innerHTML = `<p class="error-message">Error: ${message}</p>`;
    weatherContent.style.display = 'block';
  }
}

// ========================
// Event Listeners and Initialization
// ========================
document.addEventListener('DOMContentLoaded', function () {
  const defaultLocation = 'New York, NY, USA';
  const lastLocation = localStorage.getItem('lastLocation') || defaultLocation;
  console.log('Fetching default city:', lastLocation);
  fetchWeatherData(lastLocation).catch(error => console.error('Failed to load default city:', error));
});

document.querySelector('#location-submit').addEventListener('click', function () {
  const locationInput = document.querySelector('#location-input').value.trim();
  if (locationInput) {
    localStorage.setItem('lastLocation', locationInput);
    console.log('User-input location:', locationInput);
    fetchWeatherData(locationInput);
  }
});
