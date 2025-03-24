// API key and endpoint
const apiKey = '88a889bce78f9ea1dc4fc0ef692e8ca4';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall';  // 7-day forecast and other data
const aqiUrl = 'https://api.openweathermap.org/data/2.5/air_pollution';  // API for AQI data

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
const unitSelect = document.getElementById('unit-select');
const forecastContainer = document.getElementById('forecast-container');  // 7-day forecast container

// Retrieve city and unit preferences from localStorage
let currentCity = localStorage.getItem('city') || 'New York';
let currentUnit = localStorage.getItem('unit') || 'metric';
unitSelect.value = currentUnit === 'metric' ? 'Celsius' : 'Fahrenheit';

// Function to determine if the input is a valid ZIP code or city
function isZipCode(input) {
    return /^[0-9]{5}(?:-[0-9]{4})?$/.test(input);  // Matches US ZIP codes
}

// Function to fetch weather data from OpenWeather API
function fetchWeatherData(query, unit) {
    let url;
    
    if (isZipCode(query)) {
        url = `${apiUrl}?zip=${query}&units=${unit}&appid=${apiKey}`;
    } else {
        url = `${apiUrl}?q=${query}&units=${unit}&appid=${apiKey}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const weather = data.weather[0];
                const main = data.main;
                const windData = data.wind;
                const sys = data.sys;
                const coord = data.coord;

                // Update UI with the weather data
                cityName.textContent = data.name;
                region.textContent = sys.country;
                weatherTime.textContent = new Date().toLocaleString();
                temperature.textContent = `${Math.round(main.temp)}°${unit === 'metric' ? 'C' : 'F'}`;
                weatherCondition.textContent = weather.description;
                weatherIcon.src = `http://openweathermap.org/img/wn/${weather.icon}.png`;

                feelsLike.textContent = `Feels Like: ${Math.round(main.feels_like)}°${unit === 'metric' ? 'C' : 'F'}`;
                minTemp.textContent = `Min Temp: ${Math.round(main.temp_min)}°${unit === 'metric' ? 'C' : 'F'}`;
                maxTemp.textContent = `Max Temp: ${Math.round(main.temp_max)}°${unit === 'metric' ? 'C' : 'F'}`;
                humidity.textContent = `Humidity: ${main.humidity}%`;
                wind.textContent = `Wind: ${Math.round(windData.speed)} ${unit === 'metric' ? 'km/h' : 'mph'}`;
                pressure.textContent = `Pressure: ${unit === 'metric' ? main.pressure + ' hPa' : (main.pressure * 0.02953).toFixed(2) + ' inHg'}`;
                sunrise.textContent = `Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}`;
                sunset.textContent = `Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString()}`;
                visibility.textContent = `Visibility: ${unit === 'metric' ? (Math.round(data.visibility / 1000)) + ' km' : (Math.round(data.visibility / 1609)) + ' miles'}`;
                clouds.textContent = `Cloud Coverage: ${data.clouds.all}%`;

                // Rain and snow values
                const rainValue = unit === 'metric' ? (data.rain ? data.rain['1h'] : 0) : (data.rain ? (data.rain['1h'] * 0.03937) : 0);
                const snowValue = unit === 'metric' ? (data.snow ? data.snow['1h'] : 0) : (data.snow ? (data.snow['1h'] * 0.03937) : 0);
                rain.textContent = `Rain: ${rainValue.toFixed(2)} ${unit === 'metric' ? 'mm' : 'in'}`;
                snow.textContent = `Snow: ${snowValue.toFixed(2)} ${unit === 'metric' ? 'mm' : 'in'}`;

                lastUpdate.textContent = `Last Update: ${new Date().toLocaleString()}`;
                locationCoordinates.textContent = `Coordinates: Lat ${coord.lat}, Lon ${coord.lon}`;

                // Fetch 7-day forecast from OneCall API
                fetch(`${oneCallUrl}?lat=${coord.lat}&lon=${coord.lon}&units=${unit}&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(forecastData => {
                        // Update UV Index
                        if (forecastData.current) {
                            uvIndex.textContent = `UV Index: ${forecastData.current.uvi}`;
                        }

                        // Display 7-day forecast
                        const dailyForecast = forecastData.daily;
                        forecastContainer.innerHTML = ''; // Clear previous forecast
                        dailyForecast.forEach((day, index) => {
                            if (index === 0) return; // Skip the current day, only show future days

                            const date = new Date(day.dt * 1000).toLocaleDateString();
                            const dayTemp = `${Math.round(day.temp.day)}°${unit === 'metric' ? 'C' : 'F'}`;
                            const nightTemp = `${Math.round(day.temp.night)}°${unit === 'metric' ? 'C' : 'F'}`;
                            const forecastIcon = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
                            const description = day.weather[0].description;

                            // Append forecast data to container
                            forecastContainer.innerHTML += `
                                <div class="forecast-day">
                                    <div>${date}</div>
                                    <img src="${forecastIcon}" alt="${description}">
                                    <div>Day: ${dayTemp}</div>
                                    <div>Night: ${nightTemp}</div>
                                    <div>${description}</div>
                                </div>
                            `;
                        });
                    });

                // Fetch AQI data
                fetchAQIData(coord.lat, coord.lon);
            } else {
                alert("Weather data not found for the entered city or ZIP code.");
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("There was an error fetching the weather data. Please try again later.");
        });
}

// Function to fetch AQI data
function fetchAQIData(lat, lon) {
    const url = `${aqiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(aqiData => {
            const aqiValue = aqiData.list[0].main.aqi;
            aqi.textContent = `Air Quality Index: ${aqiValue}`;
        })
        .catch(error => {
            console.error("Error fetching AQI data:", error);
            aqi.textContent = "Air Quality Index: Not Available";
        });
}

// Event listener for the search button
searchButton.addEventListener('click', function() {
    const query = searchInput.value.trim(); // Get the value from input
    if (query) {
        currentCity = query; // Update currentCity with user input
        localStorage.setItem('city', currentCity); // Save city or ZIP code
        fetchWeatherData(query, currentUnit); // Fetch weather data
    } else {
        alert("Please enter a city or ZIP code.");
    }
});

// Event listener for the Enter key in the search input
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const query = searchInput.value.trim(); // Get the value from input
        if (query) {
            currentCity = query; // Update currentCity with user input
            localStorage.setItem('city', currentCity); // Save city or ZIP code
            fetchWeatherData(query, currentUnit); // Fetch weather data
        } else {
            alert("Please enter a city or ZIP code.");
        }
    }
});

// Event listener for the unit select dropdown
unitSelect.addEventListener('change', function() {
    currentUnit = unitSelect.value === 'Celsius' ? 'metric' : 'imperial';
    localStorage.setItem('unit', currentUnit); // Save selected unit
    fetchWeatherData(currentCity, currentUnit); // Fetch weather data
});

// Real-time updates (refresh weather every 1 second)
setInterval(() => {
    fetchWeatherData(currentCity, currentUnit);
}, 1000); // 1 second refresh interval
