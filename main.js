// Initialize API key and base URL
const apiKey = '34ae2d4a53544561a07150106252203'; // Replace with your WeatherAPI key
const baseUrl = 'https://api.weatherapi.com/v1/forecast.json';

// Function to fetch weather data
async function fetchWeatherData(location) {
  const url = `${baseUrl}?key=${apiKey}&q=${location}&days=7&aqi=yes&alerts=yes`;

  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');

  // Show loading spinner
  if (loadingSpinner && weatherContent) {
    loadingSpinner.style.display = 'block';
    weatherContent.style.display = 'none';
  }

  try {
    console.log('Fetching weather data for location:', location); // Debug location
    const response = await fetch(url);

    // Check if the response was successful
    if (!response.ok) {
      throw new Error(`API returned error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data); // Debug API response

    if (!data || !data.current || !data.forecast) {
      throw new Error('Weather data is incomplete or invalid.');
    }

    updateDisplay(data); // Update the UI with the fetched data
    displayWeatherAlerts(data.alerts); // Display weather alerts if any

  } catch (error) {
    console.error('Error fetching weather data:', error);
    displayError('Unable to load weather data. Please try again.');
  }
}

// Function to update the HTML content with the weather data
function updateDisplay(data) {
  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');

  // Hide loading spinner and show content
  if (loadingSpinner) loadingSpinner.style.display = 'none';
  if (weatherContent) weatherContent.style.display = 'block';

  // Update location details
  const locationNameElement = document.querySelector('.location-name');
  if (locationNameElement) {
    const city = data.location.name;
    const stateOrRegion = data.location.region;
    const country = data.location.country;
    locationNameElement.textContent = `${city}, ${stateOrRegion}, ${country}`;
  }

  // Last Updated
  const lastUpdatedElement = document.querySelector('.last-updated');
  if (lastUpdatedElement) {
    lastUpdatedElement.textContent = `Updated: ${new Date(data.current.last_updated).toLocaleString()}`;
  }

  // Current Temperature and Feels Like
  const tempValueElement = document.querySelector('.temp-value');
  const feelsLikeElement = document.querySelector('.feels-like');
  if (tempValueElement) {
    tempValueElement.textContent = `${data.current.temp_f}°F`;
  }
  if (feelsLikeElement) {
    feelsLikeElement.textContent = `Feels Like: ${data.current.feelslike_f}°F`;
  }

  // Weather Condition
  const conditionTextElement = document.querySelector('.condition-text');
  if (conditionTextElement) {
    const conditionIcon = data.current.condition.icon;
    const condition = data.current.condition.text;
    conditionTextElement.innerHTML = `<img src="https:${conditionIcon}" alt="${condition}" /> ${condition}`;
  }

  // Weather Details
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
    const precipitationChance = data.forecast.forecastday[0].day.daily_chance_of_rain || 0; // Chance percentage
    precipitationElement.textContent =
      precipitationChance > 0
        ? `${precipitationChance}% chance of rain`
        : `None`;
  }

  // Update Air Quality Section
  updateAirQuality(data);

  // Update forecast and Sun/Moon data
  updateForecast(data.forecast.forecastday);
  updateSunMoon(data.forecast.forecastday[0].astro);
}

/// Function to display weather alerts
function displayWeatherAlerts(alerts) {
  const alertsContainer = document.querySelector('.weather-alerts');

  // Clear previous alerts
  if (alertsContainer) {
    alertsContainer.innerHTML = '';
  }

  if (alerts && alerts.length > 0) {
    alerts.forEach(alert => {
      const alertElement = document.createElement('div');
      alertElement.classList.add('alert');

      // Formatting date (if provided)
      const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleString();  // Change this format as needed
      };

      // Check for missing properties and set fallback values
      const headline = alert.headline || 'No headline available';
      const description = alert.description || 'No description available';
      const certainty = alert.certainty || 'Unknown certainty';
      const effective = alert.effective ? formatDate(alert.effective) : 'No effective date available';
      const expires = alert.expires ? formatDate(alert.expires) : 'No expiration date available';

      alertElement.innerHTML = `
        <strong>${headline}</strong>
        <p>${description}</p>
        <p><strong>Issued by:</strong> ${certainty}</p>
        <p><strong>Effective:</strong> ${effective}</p>
        <p><strong>Expires:</strong> ${expires}</p>
      `;
      alertsContainer.appendChild(alertElement);
    });
  } else {
    // If no alerts, show a message
    const noAlertsMessage = document.createElement('p');
    noAlertsMessage.textContent = 'No weather alerts at the moment.';
    alertsContainer.appendChild(noAlertsMessage);
  }
}

// Function to update the Air Quality section
function updateAirQuality(data) {
  const airQualityElement = document.querySelector('.weather-details .air-quality .value');
  const airQualityDetailsElement = document.querySelector('.air-quality-details'); // Ensure this exists in your HTML

  if (data.current.air_quality) {
    const airQualityIndex = data.current.air_quality["us-epa-index"];
    const airQualityDescription = getAirQualityDescription(airQualityIndex);
    const primaryPollutant = getPrimaryPollutant(data.current.air_quality);

    // Overall Air Quality
    airQualityElement.innerHTML = `
      <strong>${airQualityDescription}</strong> (AQI: ${airQualityIndex}) <br>
      Primary Pollutant: ${primaryPollutant}
    `;

    // Detailed Pollutant Information
    const pollutants = [
      { name: 'O3 (Ozone)', value: data.current.air_quality.o3 },
      { name: 'CO (Carbon Monoxide)', value: data.current.air_quality.co },
      { name: 'NO2 (Nitrogen Dioxide)', value: data.current.air_quality.no2 },
      { name: 'SO2 (Sulfur Dioxide)', value: data.current.air_quality.so2 },
      { name: 'PM10 (Particulate Matter < 10µm)', value: data.current.air_quality.pm10 },
      { name: 'PM2.5 (Particulate Matter < 2.5µm)', value: data.current.air_quality.pm2_5 },
    ];

    airQualityDetailsElement.innerHTML = pollutants.map(pollutant => `
      <div>
        <span><strong>${pollutant.name}:</strong></span>
        <span>${pollutant.value.toFixed(2)} µg/m³</span>
      </div>
    `).join('');
  } else {
    airQualityElement.textContent = 'Air Quality data not available.';
    airQualityDetailsElement.innerHTML = '';
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

// Helper function to determine the primary pollutant
function getPrimaryPollutant(airQuality) {
  const pollutants = [
    { name: 'Ozone', value: airQuality.o3 },
    { name: 'Carbon Monoxide', value: airQuality.co },
    { name: 'Nitrogen Dioxide', value: airQuality.no2 },
    { name: 'Sulfur Dioxide', value: airQuality.so2 },
    { name: 'PM10', value: airQuality.pm10 },
    { name: 'PM2.5', value: airQuality.pm2_5 },
  ];

  // Sort pollutants by their concentration levels
  pollutants.sort((a, b) => b.value - a.value);

  return pollutants[0].name; // Return the highest concentration pollutant
}

// Function to update forecast
function updateForecast(forecastDays) {
  const forecastContainer = document.querySelector('.forecast-container');
  forecastContainer.innerHTML = ''; // Clear previous forecasts

  // Get current date
  const currentDate = new Date();

  forecastDays.forEach((day, index) => {
    const forecastElement = document.createElement('div');
    forecastElement.classList.add('forecast-day');

    // Get the day of the week (Mon, Tue, etc.) and the day of the month
    const forecastDate = new Date(day.date);
    const dayOfWeek = forecastDate.toLocaleString('en-us', { weekday: 'short' });
    const dayOfMonth = forecastDate.getDate();

    // Set 'Today' for the current day
    const displayDay = (index === 0) ? 'Today' : `${dayOfWeek} ${dayOfMonth}`;

    forecastElement.innerHTML = `
      <div class="date">${displayDay}</div>
      <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" class="forecast-icon" />
      <div class="forecast-temps">
        <span class="high">${day.day.maxtemp_f}°F</span>
        <span class="separator">/</span>
        <span class="low">${day.day.mintemp_f}°F</span>
      </div>
    `;
    
    forecastContainer.appendChild(forecastElement);
  });
}

// Function to update Sun/Moon data
function updateSunMoon(astroData) {
  const sunTimes = document.querySelector('.sun-times');
  const moonTimes = document.querySelector('.moon-times');

  if (sunTimes && moonTimes) {
    sunTimes.innerHTML = `
      <strong>Sunrise:</strong> ${astroData.sunrise} <br>
      <strong>Sunset:</strong> ${astroData.sunset}
    `;
    moonTimes.innerHTML = `
      <strong>Moonrise:</strong> ${astroData.moonrise} <br>
      <strong>Moonset:</strong> ${astroData.moonset}
    `;
  }
}

// Function to handle errors
function displayError(message) {
  const errorMessageElement = document.querySelector('.error-message');
  if (errorMessageElement) {
    errorMessageElement.textContent = message;
  }
}

// Event listener for search input
const searchInput = document.querySelector('.search-input'); 

if (searchInput) {
  searchInput.addEventListener('input', function() {
    const location = searchInput.value.trim();

    // Debugging: Log the location entered
    console.log('Searching for location:', location);

    if (location) {
      fetchWeatherData(location); // Fetch weather for the entered location
    } else {
      // Optionally, clear the weather display or show a message
      console.log('No location entered.');
    }
  });
} else {
  console.error('Search input element not found.');
}

// Example usage: Fetch weather data for a default location initially
fetchWeatherData('New York');
