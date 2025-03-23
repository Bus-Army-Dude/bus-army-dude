// ========================
// Initialize API key and base URL
// ========================
const apiKey = '34ae2d4a53544561a07150106252203'; // Replace with your WeatherAPI key
const baseUrl = 'https://api.weatherapi.com/v1'; // Updated base URL

// Get references to the input and button
const locationInput = document.querySelector('#location-input');
const locationSubmitButton = document.querySelector('#location-submit');

// Create a container for the autocomplete suggestions
const suggestionsContainer = document.createElement('div');
suggestionsContainer.className = 'autocomplete-suggestions';
locationInput.parentNode.insertBefore(suggestionsContainer, locationInput.nextSibling);

// Function to fetch autocomplete suggestions
async function fetchLocationSuggestions(query) {
    if (!query.trim()) {
        suggestionsContainer.innerHTML = ''; // Clear suggestions if input is empty
        return;
    }

    const autocompleteUrl = `${baseUrl}/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(autocompleteUrl);
        if (!response.ok) {
            throw new Error(`Autocomplete API returned error: ${response.statusText}`);
        }
        const data = await response.json();
        displaySuggestions(data);
    } catch (error) {
        console.error('Error fetching location suggestions:', error);
        suggestionsContainer.innerHTML = `<div class="suggestion-item error">Error loading suggestions</div>`;
    }
}

// Function to display the autocomplete suggestions
function displaySuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    if (suggestions && suggestions.length > 0) {
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = `${suggestion.name}, ${suggestion.region}, ${suggestion.country}`;
            suggestionItem.addEventListener('click', function() {
                locationInput.value = this.textContent;
                suggestionsContainer.innerHTML = ''; // Clear suggestions after selection
            });
            suggestionsContainer.appendChild(suggestionItem);
        });
    } else {
        suggestionsContainer.innerHTML = `<div class="suggestion-item no-results">No matching locations found</div>`;
    }
}

// Event listener for input changes to trigger autocomplete
locationInput.addEventListener('input', function() {
    const query = this.value;
    fetchLocationSuggestions(query);
});

// Optional: Clear suggestions when input loses focus
locationInput.addEventListener('blur', function() {
    // Delay clearing to allow click on suggestion
    setTimeout(() => {
        suggestionsContainer.innerHTML = '';
    }, 200);
});

// Event listener for the submit button
locationSubmitButton.addEventListener('click', function() {
    const location = locationInput.value.trim();
    if (location) {
        localStorage.setItem('lastLocation', location);
        console.log('User-input location:', location);
        fetchWeatherData(location);
    }
});

// ========================
// Fetch Weather Data Function
// ========================
async function fetchWeatherData(location) {
    const url = `${baseUrl}/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=7&aqi=yes&alerts=yes`;
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
        const alerts = (data.alerts && data.alerts.alert) ? data.alerts.alert :;
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
function displayWeatherAlerts(alerts) {
    const alertsContainer = document.querySelector('#weatherAlertsList');
    if (!alertsContainer) return;

    alertsContainer.innerHTML = '';

    const uniqueAlerts = alerts && alerts.length > 0
        ? alerts.filter((alert, index, self) =>
            index === self.findIndex(a => a.headline === alert.headline)
        )
        :;

    if (uniqueAlerts.length > 0) {
        uniqueAlerts.forEach(alert => {
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
                <span class="pollutant-value">${pollutant.value !== undefined ? pollutant.value.toFixed(2) : 'N/A'} µg/m³</span>
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
    pollutants.sort((a, b) => (b.value || -Infinity) - (a.value || -Infinity));
    return pollutants[0]?.name || 'N/A';
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
    return dateObj.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
}

// Updated Forecast Function
function updateForecast(forecastDays) {
    const forecastContainer = document.querySelector('.forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecasts

    // Use the current date as the reference for labels
    const today = new Date();

    forecastDays.forEach((day, index) => {
        let dateLabel = "";
        if (index === 0) {
            dateLabel = "Today";
        } else if (index === 1) {
            dateLabel = "Tomorrow";
        } else {
            // Create a new date object by adding 'index' days to today
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
