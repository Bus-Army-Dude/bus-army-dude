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

function displayWeatherAlerts(alerts) {
  const alertsContainer = document.querySelector('#weatherAlertsList'); // Target the ul with id "weatherAlertsList"
  
  // Clear previous alerts
  alertsContainer.innerHTML = '';

  if (alerts && alerts.length > 0) {
    alerts.forEach(alert => {
      const alertItem = document.createElement('li'); // Create an li element for each alert
      alertItem.classList.add('alert-item');
      alertItem.innerHTML = `
        <strong>${alert.headline}</strong>
        <p>${alert.description}</p>
        <p><strong>Issued by:</strong> ${alert.certainty}</p>
        <p><strong>Effective:</strong> ${alert.effective}</p>
        <p><strong>Expires:</strong> ${alert.expires}</p>
      `;
      alertsContainer.appendChild(alertItem);
    });
  } else {
    // If no alerts, show a message
    const noAlertsMessage = document.createElement('li');
    noAlertsMessage.textContent = 'No weather alerts currently active.';
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
  const currentDayOfWeek = currentDate.toLocaleString('en-us', { weekday: 'short' });
  const currentDayOfMonth = currentDate.getDate();

  // Add 'Today' label to the first forecast item and order the rest
  let forecastWithToday = forecastDays.map((day, index) => {
    const forecastDate = new Date(day.date);
    const dayOfWeek = forecastDate.toLocaleString('en-us', { weekday: 'short' });
    const dayOfMonth = forecastDate.getDate();

    // Check if this day is today
    const displayDay = (dayOfWeek === currentDayOfWeek && dayOfMonth === currentDayOfMonth)
      ? 'Today' 
      : `${dayOfWeek} ${dayOfMonth}`;

    return {
      ...day,
      displayDay, // Add the displayDay property to each forecast
    };
  });

  // Sort so 'Today' is first, then next 6 days
  forecastWithToday = forecastWithToday.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Sort by date so Today appears first, then the next days
    return dateA - dateB;
  });

  // Limit the forecast to 7 days (today + 6 more)
  forecastWithToday.slice(0, 7).forEach((day) => {
    const forecastElement = document.createElement('div');
    forecastElement.classList.add('forecast-day');

    // Precipitation percentage (if available)
    const precipitationChance = day.day.daily_chance_of_rain || 0;

    forecastElement.innerHTML = `
      <div class="date">${day.displayDay}</div>
      <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" class="forecast-icon" />
      <div class="forecast-temps">
        <span class="high">${day.day.maxtemp_f}°F</span> /
        <span class="low">${day.day.mintemp_f}°F</span>
      </div>
      <div class="forecast-condition">${day.day.condition.text}</div>
      <div class="precipitation">Precipitation: ${precipitationChance}%</div>
    `;
    forecastContainer.appendChild(forecastElement);
  });
}
// Function to update Sun and Moon times
function updateSunMoon(astroData) {
  const sunElement = document.querySelector('.sun-moon .sunrise');
  const moonElement = document.querySelector('.sun-moon .moonrise');

  if (sunElement && moonElement) {
    sunElement.textContent = `Sunrise: ${astroData.sunrise}`;
    moonElement.textContent = `Moonrise: ${astroData.moonrise}`;
  }
}

// Function to display error messages
function displayError(message) {
  const errorElement = document.querySelector('.weather-error');
  if (errorElement) {
    errorElement.textContent = message;
  }
}

// Listen for the submit button click for manual location input
const submitButton = document.getElementById('location-submit');
submitButton.addEventListener('click', () => {
  const locationInput = document.getElementById('location-input').value;
  if (locationInput) {
    fetchWeatherData(locationInput); // Fetch weather data for manually entered location
  } else {
    alert('Please enter a location!');
  }
});

// Optional: Allow pressing Enter key to submit manual location
const inputField = document.getElementById('location-input');
inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    submitButton.click();
  }
});
