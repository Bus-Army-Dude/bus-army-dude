// main.js

// --- API Keys ---
const openWeatherMapApiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key
const weatherApiBaseUrlNWS = 'https://api.weather.gov';
const openWeatherMapBaseUrl = 'https://api.openweathermap.org/data/2.5';
const openWeatherMapGeoUrl = 'http://api.openweathermap.org/geo/1.0';

// --- HTML Element References ---
// Tabs
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');

// Weather Tab
const weatherCityStateElement = document.querySelector('#weather .city-state');
const weatherRainChanceElement = document.querySelector('#weather .rain-chance');
const weatherTemperatureElement = document.querySelector('#weather .temperature');
const weatherIconLarge = document.querySelector('#weather .weather-icon.large');
const weatherTodayForecastTimes = document.querySelector('#weather .today-forecast .forecast-times');
const weatherSevenDayForecastContainer = document.querySelector('#weather .seven-day-forecast');
const weatherRealFeelTempElement = document.querySelector('#weather .real-feel-temp');
const weatherWindSpeedElement = document.querySelector('#weather .wind-speed');
const weatherWindUnitsElement = document.querySelector('#weather .wind-units');
const weatherRainChanceDetailElement = document.querySelector('#weather .rain-chance-detail');
const weatherUvIndexElement = document.querySelector('#weather .uv-index');
const weatherSearchInput = document.querySelector('#weather .weather-search input');
const weatherMoreConditions = document.querySelector('#weather .more-conditions');
const weatherSeeMoreLink = document.querySelector('#weather .air-conditions .see-more');

// Cities Tab
const citiesSearchInput = document.querySelector('#cities .cities-search input');
const addedCitiesContainer = document.querySelector('#cities .added-cities');
const selectedCityDetailsContainer = document.querySelector('#cities .selected-city-details');
const selectedCityNameElement = document.querySelector('#cities .selected-city-details h3');
const selectedCityRainChanceElement = document.querySelector('#cities .selected-city-details .rain-chance');
const selectedCityTemperatureElement = document.querySelector('#cities .selected-city-details .temperature');
const selectedCityWeatherIconLarge = document.querySelector('#cities .selected-city-details .weather-icon.large');
const selectedCityTodayForecastTimes = document.querySelector('#cities .selected-city-details .forecast-times');
const selectedCityThreeDayForecastContainer = document.querySelector('#cities .selected-city-details .three-day-forecast');

let addedCities = []; // Array to store added cities (will be populated from local storage)
let selectedCity = null; // Currently selected city in the Cities tab

// Map Tab
// Assuming you will add a div with id="weather-map" in the Map tab's HTML
const weatherMapContainer = document.getElementById('weather-map');
const mapSearchInput = document.querySelector('#map .map-search input');
const mapControls = document.querySelector('#map .map-controls');
const citiesOnMapContainer = document.querySelector('#map .cities-on-map');

// Settings Tab
const unitOptions = document.querySelectorAll('#settings .unit-options .unit');
const timeFormatToggle = document.querySelector('#settings .general-settings input[type="checkbox"]'); // Assuming the 12-hour time toggle
const locationToggle = document.querySelector('#settings .general-settings .setting-item:nth-child(3) input[type="checkbox"]'); // Assuming Location toggle is the third item

let currentUnits = { temperature: 'celsius', wind: 'm/s', pressure: 'mm', precipitation: 'millimeters', distance: 'kilometers' };
let is12HourTime = false;
let useGeolocation = true;

// --- Helper Functions ---
function formatTime(date, is12Hour = is12HourTime) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
}

function displayWeatherIcon(iconCode, targetElement) {
    // Replace with your icon implementation (e.g., using an icon font class)
    targetElement.textContent = `[Icon: ${iconCode}]`;
}

function convertTemperature(temp, fromUnit) {
    if (currentUnits.temperature === 'fahrenheit' && fromUnit === 'celsius') {
        return (temp * 9/5) + 32;
    } else if (currentUnits.temperature === 'celsius' && fromUnit === 'fahrenheit') {
        return (temp - 32) * 5/9;
    }
    return temp;
}

function getTemperatureUnitSymbol() {
    return currentUnits.temperature === 'celsius' ? '°C' : '°F';
}

// --- Tab Switching Logic ---
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        button.classList.add('active');
        const targetPanelId = button.getAttribute('data-tab');
        document.getElementById(targetPanelId).classList.add('active');
        if (targetPanelId === 'cities') {
            displayAddedCities();
        } else if (targetPanelId === 'map') {
            initMap(); // Initialize map when the Map tab is shown
        }
    });
});

// --- Weather Tab Functionality ---
async function fetchNWSData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching data from NWS:', error);
        return null;
    }
}

async function updateWeatherUI_NWS(data) {
    if (data && data.properties) {
        const properties = data.properties;
        weatherCityStateElement.textContent = properties.relativeLocation.properties.city + ', ' + properties.relativeLocation.properties.state;

        const forecastUrl = properties.forecast;
        const hourlyForecastUrl = properties.forecastHourly;

        const forecastData = await fetchNWSData(forecastUrl);
        const hourlyForecastData = await fetchNWSData(hourlyForecastUrl);

        display7DayForecast_NWS(forecastData);
        displayHourlyForecast_NWS(hourlyForecastData);

        // Extract and display more details if available in the NWS API response
        // Example:
        // weatherRealFeelTempElement.textContent = properties.apparentTemperature.value;
        // weatherWindSpeedElement.textContent = properties.windSpeed.value;
        // weatherWindUnitsElement.textContent = properties.windSpeed.unit;
        // weatherUvIndexElement.textContent = properties.uvIndex.value;
    } else {
        console.error("Invalid NWS weather data received:", data);
        weatherCityStateElement.textContent = 'Weather data not available';
    }
}

function display7DayForecast_NWS(data) {
    if (data && data.properties && data.properties.periods) {
        const periods = data.properties.periods;
        weatherSevenDayForecastContainer.innerHTML = '<h4>7 - DAY FORECAST</h4>';
        periods.forEach(period => {
            if (period.isDaytime) {
                const forecastItem = document.createElement('div');
                forecastItem.classList.add('daily-forecast');
                forecastItem.innerHTML = `
                    <span class="day">${period.name}</span>
                    <div class="weather-icon">{Icon}</div>
                    <span class="conditions">${period.shortForecast}</span>
                    <span class="high-low">${period.temperature}${period.temperatureUnit}</span>
                    <hr>
                `;
                weatherSevenDayForecastContainer.appendChild(forecastItem);
            }
        });
    }
}

function displayHourlyForecast_NWS(data) {
    if (data && data.properties && data.properties.periods) {
        const periods = data.properties.periods.slice(0, 6);
        weatherTodayForecastTimes.innerHTML = '';
        periods.forEach(period => {
            const startTime = new Date(period.startTime);
            const hours = startTime.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
            const timeStr = formatTime(startTime);

            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <span class="time">${timeStr}</span>
                <div class="weather-icon">{Icon}</div>
                <span class="temp">${period.temperature}°${period.temperatureUnit}</span>
            `;
            weatherTodayForecastTimes.appendChild(forecastItem);
        });
    }
}

async function getNWSCoordinates(latitude, longitude) {
    const pointsUrl = `${weatherApiBaseUrlNWS}/points/${latitude},${longitude}`;
    const data = await fetchNWSData(pointsUrl);
    if (data) {
        updateWeatherUI_NWS(data);
    }
}

function getCurrentLocation() {
    if (useGeolocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getNWSCoordinates(latitude, longitude);
        }, error => {
            console.error("Error getting location:", error);
            getNWSCoordinates(41.37, -83.65); // Default to Bowling Green, OH
        });
    } else {
        console.log("Geolocation is disabled or not supported.");
        getNWSCoordinates(41.37, -83.65); // Default to Bowling Green, OH
    }
}

weatherSearchInput.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        const query = weatherSearchInput.value;
        // Implement geocoding service here to convert query to coordinates
        // Then call getNWSCoordinates with the coordinates
        console.log('Weather search:', query);
        // Example (replace with actual geocoding):
        if (query === 'Bowling Green, OH') {
            getNWSCoordinates(41.37, -83.65);
        }
    }
});

weatherSeeMoreLink.addEventListener('click', () => {
    weatherMoreConditions.classList.toggle('visible');
    weatherSeeMoreLink.textContent = weatherMoreConditions.classList.contains('visible') ? 'See less' : 'See more';
});

// --- Cities Tab Functionality ---
function loadAddedCities() {
    const storedCities = localStorage.getItem('addedCities');
    if (storedCities) {
        addedCities = JSON.parse(storedCities);
        displayAddedCities();
    } else {
        addedCities = [{ name: 'Bilbao', country: 'ES' }, { name: 'Barcelona', country: 'ES' }, { name: 'Madrid', country: 'ES' }, { name: 'Malaga', country: 'ES' }];
        displayAddedCities();
    }
}

function saveAddedCities() {
    localStorage.setItem('addedCities', JSON.stringify(addedCities));
}

async function fetchWeatherDataOWM(city, country) {
    const url = `${openWeatherMapBaseUrl}/weather?q=${city},${country}&appid=${openWeatherMapApiKey}&units=metric`;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather from OpenWeatherMap:', error);
        return null;
    }
}

async function fetchForecastDataOWM(city, country) {
    const url = `${openWeatherMapBaseUrl}/forecast?q=${city},${country}&appid=${openWeatherMapApiKey}&units=metric`;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching forecast from OpenWeatherMap:', error);
        return null;
    }
}

function displayAddedCities() {
    addedCitiesContainer.innerHTML = '';
    addedCities.forEach(cityData => {
        const cityItem = document.createElement('div');
        cityItem.classList.add('city-item');
        if (selectedCity && selectedCity.name === cityData.name && selectedCity.country === cityData.country) {
            cityItem.classList.add('selected');
        }
        cityItem.addEventListener('click', () => showCityDetails(cityData));

        fetchWeatherDataOWM(cityData.name, cityData.country)
            .then(weatherData => {
                let temperature = 'N/A';
                let iconCode = '';
                if (weatherData && weatherData.main && weatherData.weather && weatherData.weather.length > 0) {
                    temperature = Math.round(convertTemperature(weatherData.main.temp, 'celsius')) + getTemperatureUnitSymbol();
                    iconCode = weatherData.weather[0].icon;
                }
                cityItem.innerHTML = `
                    <div class="weather-icon">${iconCode ? `<img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">` : '{Icon}'}</div>
                    <div class="city-info">
                        <h4 class="city-name">${cityData.name}</h4>
                        <span class="time">${formatTime(new Date())}</span>
                    </div>
                    <span class="temp">${temperature}</span>
                `;
                addedCitiesContainer.appendChild(cityItem);
            });
    });
}

async function showCityDetails(cityData) {
    selectedCity = cityData;
    displayAddedCities(); // Update selection highlighting

    selectedCityNameElement.textContent = `${cityData.name}, ${cityData.country}`;
    selectedCityDetailsContainer.innerHTML = '<p>Loading forecast...</p>';

    const weatherData = await fetchWeatherDataOWM(cityData.name, cityData.country);
    const forecastData = await fetchForecastDataOWM(cityData.name, cityData.country);

    if (weatherData && forecastData) {
        const currentWeather = weatherData.main;
        const currentConditions = weatherData.weather[0];
        const forecastList = forecastData.list;

        selectedCityRainChanceElement.textContent = (currentWeather.humidity ? currentWeather.humidity : 'N/A') + '%';
        selectedCityTemperatureElement.textContent = Math.round(convertTemperature(currentWeather.temp, 'celsius')) + getTemperatureUnitSymbol();
        displayWeatherIcon(currentConditions.icon, selectedCityWeatherIconLarge); // Need to implement proper icon display

        selectedCityTodayForecastTimes.innerHTML = '';
        const todayForecast = forecastList.slice(0, 8); // Get forecast for today (approx.)
        todayForecast.forEach(item => {
            const time = formatTime(new Date(item.dt * 1000));
            const temp = Math.round(convertTemperature(item.main.temp, 'celsius')) + getTemperatureUnitSymbol();
            const iconCode = item.weather[0].icon;
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <span class="time">${time}</span>
                <div class="weather-icon">${iconCode ? `<img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">` : '{Icon}'}</div>
                <span class="temp">${temp}</span>
            `;
            selectedCityTodayForecastTimes.appendChild(forecastItem);
        });

        selectedCityThreeDayForecastContainer.innerHTML = '<h4>3-Day Forecast</h4>';
        const dailyForecast = {};
        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!dailyForecast[date]) {
                dailyForecast[date] = item; // Just take the first forecast for the day as a summary
            }
        });

        let dayCounter = 0;
        for (const date in dailyForecast) {
            if (dayCounter < 3) {
                const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                const tempHigh = Math.round(convertTemperature(dailyForecast[date].main.temp_max, 'celsius')) + getTemperatureUnitSymbol();
                const tempLow = Math.round(convertTemperature(dailyForecast[date].main.temp_min, 'celsius')) + getTemperatureUnitSymbol();
                const iconCode = dailyForecast[date].weather[0].icon;
                const forecastItem = document.createElement('div');
                forecastItem.classList.add('daily-forecast');
                forecastItem.innerHTML = `
                    <span class="day">${day}</span>
                    <div class="weather-icon">${iconCode ? `<img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">` : '{Icon}'}</div>
                    <span class="high-low">${tempHigh}/${tempLow}</span>
                `;
                selectedCityThreeDayForecastContainer.appendChild(forecastItem);
                dayCounter++;
            }
        }

    } else {
        selectedCityDetailsContainer.innerHTML = '<p>Could not load forecast for this city.</p>';
    }
}

citiesSearchInput.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        const query = citiesSearchInput.value;
        const geoUrl = `${openWeatherMapGeoUrl}/direct?q=${query}&limit=1&appid=${openWeatherMapApiKey}`;
        try {
            const response = await fetch(geoUrl);
            const geoData = await response.json();
            if (geoData && geoData.length > 0) {
                const city = { name: geoData[0].name, country: geoData[0].country };
                if (!addedCities.some(c => c.name === city.name && c.country === city.country)) {
                    addedCities.push(city);
                    saveAddedCities();
                    displayAddedCities();
                }
                citiesSearchInput.value = '';
            } else {
                alert('City not found.');
            }
        } catch (error) {
            console.error('Error during geocoding:', error);
            alert('Could not search for city.');
        }
    }
});

// Load added cities on startup or when the Cities tab is shown
loadAddedCities();

// --- Map Tab Functionality ---
function initMap() {
    // Placeholder for initializing a map using a library like Leaflet
    if (typeof L !== 'undefined' && weatherMapContainer) {
        const map = L.map(weatherMapContainer).setView([41.37, -83.65], 10); // Example: Bowling Green
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add markers for added cities (you'll need to fetch coordinates if not already stored)
        addedCities.forEach(cityData => {
            // Example using OpenWeatherMap Geocoding API to get coordinates
            const geoUrl = `${openWeatherMapGeoUrl}/direct?q=${cityData.name},${cityData.country}&limit=1&appid=${openWeatherMapApiKey}`;
            fetch(geoUrl)
                .then(response => response.json())
                .then(geoData => {
                    if (geoData && geoData.length > 0) {
                        L.marker([geoData[0].lat, geoData[0].lon]).addTo(map)
                            .bindPopup(cityData.name);
                    }
                });
        });

        // Placeholder for map controls functionality
        if (mapControls) {
            // Example: Add event listeners to buttons
        }
    } else {
        if (weatherMapContainer) {
            weatherMapContainer.innerHTML = '<p>Map functionality requires a mapping library (e.g., Leaflet) to be included.</p>';
        }
    }
}

mapSearchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = mapSearchInput.value;
        // Implement geocoding and map panning here
        console.log('Map search:', query);
        // Example using OpenWeatherMap Geocoding API to get coordinates and then pan the map
        if (typeof L !== 'undefined' && map) {
            const geoUrl = `${openWeatherMapGeoUrl}/direct?q=${query}&limit=1&appid=${openWeatherMapApiKey}`;
            fetch(geoUrl)
                .then(response => response.json())
                .then(geoData => {
                    if (geoData && geoData.length > 0) {
                        map.setView([geoData[0].lat, geoData[0].lon], 10);
                    } else {
                        alert('Location not found on map.');
                    }
                });
        }
    }
});

// --- Settings Tab Functionality ---
function loadSettings() {
    const storedUnits = localStorage.getItem('currentUnits');
    if (storedUnits) {
        currentUnits = JSON.parse(storedUnits);
        updateUnitDisplay();
    }
    const storedTimeFormat = localStorage.getItem('is12HourTime');
    if (storedTimeFormat) {
        is12HourTime = JSON.parse(storedTimeFormat) === true;
        timeFormatToggle.checked = is12HourTime;
    }
    const storedGeolocation = localStorage.getItem('useGeolocation');
    if (storedGeolocation) {
        useGeolocation = JSON.parse(storedGeolocation) === true;
        locationToggle.checked = useGeolocation;
    }
}

function saveSettings() {
    localStorage.setItem('currentUnits', JSON.stringify(currentUnits));
    localStorage.setItem('is12HourTime', JSON.stringify(is12HourTime));
    localStorage.setItem('useGeolocation', JSON.stringify(useGeolocation));
}

function updateUnitDisplay() {
    unitOptions.forEach(option => {
        const [unitType, unitValue] = option.textContent.toLowerCase().split(' ');
        if (currentUnits[unitType] === unitValue) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    displayAddedCities(); // Update displayed temperatures in Cities tab
    // You might need to refresh the Weather tab as well if units have changed
}

unitOptions.forEach(option => {
    option.addEventListener('click', () => {
        const [unitType, unitValue] = option.textContent.toLowerCase().split(' ');
        currentUnits[unitType] = unitValue;
        updateUnitDisplay();
        saveSettings();
    });
});

timeFormatToggle.addEventListener('change', () => {
    is12HourTime = timeFormatToggle.checked;
    saveSettings();
    // You might need to refresh any displayed times
});

locationToggle.addEventListener('change', () => {
    useGeolocation = locationToggle.checked;
    saveSettings();
    if (useGeolocation) {
        getCurrentLocation();
    } else {
        // Optionally set a default location or clear weather data
        getNWSCoordinates(41.37, -83.65); // Default to Bowling Green, OH
    }
});

loadSettings();
updateUnitDisplay(); // Ensure initial unit display is correct

// --- Initial Load ---
getCurrentLocation();
