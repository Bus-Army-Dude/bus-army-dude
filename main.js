// Initialize API key and base URL
const apiKey = '34ae2d4a53544561a07150106252203'; // Replace with your WeatherAPI key
const baseUrl = 'https://api.weatherapi.com/v1/forecast.json';

// Function to fetch weather data
async function fetchWeatherData(location) {
  const url = `${baseUrl}?key=${apiKey}&q=${location}&days=7&aqi=yes&alerts=no`;

  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');

  // Debugging DOM elements
  console.log('DOM Element - Loading Spinner:', loadingSpinner);
  console.log('DOM Element - Weather Content:', weatherContent);

  // Show loading spinner
  if (loadingSpinner && weatherContent) {
    loadingSpinner.style.display = 'block';
    weatherContent.style.display = 'none';
  }

  try {
    console.log('Fetching weather data for location:', location); // Debug location
    const response = await fetch(url);
    const data = await response.json();

    console.log('API Response:', data); // Debug API response

    if (!data || !data.current || !data.forecast) {
      throw new Error('Weather data is incomplete or invalid.');
    }

    updateDisplay(data);
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
    const weatherCondition = data.current.condition.text || 'None';

    // Dynamically show precipitation based on data
    precipitationElement.textContent =
      precipitationChance > 0
        ? `${precipitationChance}% chance (${weatherCondition})`
        : `None`;
  }

  // Update Air Quality Section
  updateAirQuality(data);

  // Update forecast and Sun/Moon data
  updateForecast(data.forecast.forecastday);
  updateSunMoon(data.forecast.forecastday[0].astro);
}

function updateAirQuality(data) {
    const airQualityOverview = document.querySelector('.air-quality-overview');
    const airQualityDetails = document.querySelector('.air-quality-details');

    if (data.current.air_quality) {
        const airQualityIndex = data.current.air_quality["us-epa-index"];
        const airQualityDescription = getAirQualityDescription(airQualityIndex);
        const primaryPollutant = getPrimaryPollutant(data.current.air_quality);

        // Update overview
        airQualityOverview.innerHTML = `
            ${airQualityDescription} (AQI: ${airQualityIndex})
            <span>Primary Pollutant: ${primaryPollutant}</span>
        `;

        // Update details
        const pollutants = [
            { name: 'O3 (Ozone)', value: data.current.air_quality.o3 },
            { name: 'CO (Carbon Monoxide)', value: data.current.air_quality.co },
            { name: 'NO2 (Nitrogen Dioxide)', value: data.current.air_quality.no2 },
            { name: 'PM10', value: data.current.air_quality.pm10 },
            { name: 'PM2.5', value: data.current.air_quality.pm2_5 },
            { name: 'SO2 (Sulfur Dioxide)', value: data.current.air_quality.so2 }
        ];

        airQualityDetails.innerHTML = pollutants.map(pollutant => `
            <div>
                <span class="pollutant-name">${pollutant.name}:</span>
                <span class="pollutant-value">${pollutant.value.toFixed(2)} µg/m³</span>
                <span class="pollutant-rating ${getAirQualityClass(airQualityIndex)}">${airQualityDescription}</span>
            </div>
        `).join('');
    } else {
        // Fallback message for missing air quality data
        airQualityOverview.innerHTML = `Air Quality data not available`;
        airQualityDetails.innerHTML = '';
    }
}

// Helper functions
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
    return pollutants[0].name; // Return the pollutant with the highest concentration
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

// Function to update forecast
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

// Function to update Sun & Moon times
function updateSunMoon(astroData) {
  const sunMoonSection = document.querySelector('.sun-moon-section');
  if (sunMoonSection) {
    sunMoonSection.innerHTML = `
      <div><strong>Sunrise:</strong> ${astroData.sunrise}</div>
      <div><strong>Sunset:</strong> ${astroData.sunset}</div>
    `;
  }
}

// Function to display errors (e.g., API errors or incomplete data)
function displayError(message) {
  const loadingSpinner = document.querySelector('.weather-loading');
  const weatherContent = document.querySelector('.weather-content');

  if (loadingSpinner) loadingSpinner.style.display = 'none';
  if (weatherContent) {
    weatherContent.innerHTML = `<p class="error-message">Error: ${message}</p>`;
    weatherContent.style.display = 'block';
  }
}

// On page load, fetch weather data for default or last saved location
window.onload = function () {
  const defaultLocation = 'New York, NY, USA';
  const lastLocation = localStorage.getItem('lastLocation') || defaultLocation;
  console.log('Fetching default city:', lastLocation);
  fetchWeatherData(lastLocation).catch(error => console.error('Failed to load default city:', error));
};

// Allow user to manually input location
document.querySelector('#searchLocationButton').addEventListener('click', function () {
  const locationInput = document.querySelector('#locationInput').value.trim();
  if (locationInput) {
    // Save the location for future sessions
    localStorage.setItem('lastLocation', locationInput);
    console.log('User-input location:', locationInput);
    fetchWeatherData(locationInput);
  }
});
