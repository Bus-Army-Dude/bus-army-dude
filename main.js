// API key and endpoint (replace with your actual OpenWeather API key)
const apiKey = '88a889bce78f9ea1dc4fc0ef692e8ca4';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Elements from the HTML
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const cityName = document.getElementById('city-name');
const region = document.getElementById('region');
const weatherTime = document.getElementById('weather-time');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weather-condition');
const weatherIcon = document.getElementById('weather-icon');
const feelsLike = document.getElementById('feels-like');
const minTemp = document.getElementById('min-temp');
const maxTemp = document.getElementById('max-temp');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const uvIndex = document.getElementById('uv-index');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const aqi = document.getElementById('aqi');
const visibility = document.getElementById('visibility');
const clouds = document.getElementById('clouds');
const rain = document.getElementById('rain');
const snow = document.getElementById('snow');
const lastUpdate = document.getElementById('last-update');
const locationCoordinates = document.getElementById('location-coordinates');

// Getting units and city from localStorage (if set)
let units = localStorage.getItem('units') || 'metric'; // Default to metric if not set
let city = localStorage.getItem('city') || 'New York'; // Default to New York if not set

// Set the default units on page load
document.getElementById('unit-select').value = units;

// Update UI based on selected units
function updateWeatherData(data) {
    const weather = data.weather[0];
    const main = data.main;
    const windData = data.wind;
    const sys = data.sys;
    const cloudsData = data.clouds;
    const coord = data.coord;
    
    // Update city, region, and time
    cityName.textContent = data.name;
    region.textContent = sys.country;
    weatherTime.textContent = new Date().toLocaleString();

    // Weather info
    temperature.textContent = `${Math.round(main.temp)}°${units === 'metric' ? 'C' : 'F'}`;
    weatherCondition.textContent = weather.description;
    weatherIcon.src = `http://openweathermap.org/img/wn/${weather.icon}.png`;

    // Detailed weather info
    feelsLike.textContent = `Feels Like: ${Math.round(main.feels_like)}°${units === 'metric' ? 'C' : 'F'}`;
    minTemp.textContent = `Min Temp: ${Math.round(main.temp_min)}°${units === 'metric' ? 'C' : 'F'}`;
    maxTemp.textContent = `Max Temp: ${Math.round(main.temp_max)}°${units === 'metric' ? 'C' : 'F'}`;
    humidity.textContent = `Humidity: ${main.humidity}%`;
    
    // Wind (Speed is in km/h for metric, mph for imperial)
    wind.textContent = `Wind: ${units === 'metric' ? Math.round(windData.speed) : Math.round(windData.speed * 0.621371)} ${units === 'metric' ? 'km/h' : 'mph'}`;

    // Pressure (hPa)
    pressure.textContent = `Pressure: ${main.pressure} hPa`;

    // Visibility (meters for metric, miles for imperial)
    visibility.textContent = `Visibility: ${units === 'metric' ? (data.visibility / 1000) : (data.visibility / 1609.34)} ${units === 'metric' ? 'km' : 'miles'}`;

    // Rain (1h in mm for metric, inches for imperial)
    rain.textContent = `Rain: ${data.rain ? (units === 'metric' ? data.rain['1h'] : (data.rain['1h'] / 25.4)) : 0} ${units === 'metric' ? 'mm' : 'in'}`;

    // Snow (1h in mm for metric, inches for imperial)
    snow.textContent = `Snow: ${data.snow ? (units === 'metric' ? data.snow['1h'] : (data.snow['1h'] / 25.4)) : 0} ${units === 'metric' ? 'mm' : 'in'}`;

    // AQI (Not available in the current API, leaving placeholder)
    aqi.textContent = `Air Quality Index: Not Available`;

    // Sunrise and Sunset
    sunrise.textContent = `Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}`;
    sunset.textContent = `Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString()}`;
    
    // Last Update
    lastUpdate.textContent = `Last Update: ${new Date().toLocaleString()}`;

    // Coordinates
    locationCoordinates.textContent = `Coordinates: Lat ${coord.lat}, Lon ${coord.lon}`;
}

// Fetch weather data from OpenWeather API
function fetchWeatherData(city) {
    const url = `${apiUrl}?q=${city}&units=${units}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateWeatherData(data);
                localStorage.setItem('city', city); // Save the user's city choice
            } else {
                alert("Weather data not found!");
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("There was an error fetching the weather data. Please try again later.");
        });
}

// Event listener for the search button
searchButton.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert("Please enter a city or zip code.");
    }
});

// Allow pressing "Enter" key to trigger the search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Unit select change handler
document.getElementById('unit-select').addEventListener('change', (e) => {
    units = e.target.value;
    localStorage.setItem('units', units); // Save the user's unit choice
    fetchWeatherData(city); // Refetch data with the new units
});

// Default city (you can set this to your location or any city)
fetchWeatherData(city);

// Live updates every second (now refreshing every second)
setInterval(() => {
    fetchWeatherData(city); // Update data every second
}, 1000);
