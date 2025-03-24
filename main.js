// API key and endpoint
const apiKey = '88a889bce78f9ea1dc4fc0ef692e8ca4';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall';  // API for UV Index and Air Quality Index (AQI)

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

// Fetch weather data (current and forecast) including UV and AQI
function fetchWeatherData(query, unit) {
    let url;

    // Set the correct URL for ZIP code or city-based searches
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

                // Update general weather data
                document.getElementById('city-name').textContent = data.name;
                document.getElementById('region').textContent = sys.country;
                document.getElementById('weather-time').textContent = new Date().toLocaleString();
                document.getElementById('temperature').textContent = `${Math.round(main.temp)}°${unit === 'metric' ? 'C' : 'F'}`;
                document.getElementById('weather-condition').textContent = weather.description;
                document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${weather.icon}.png`;

                // Other weather details
                document.getElementById('feels-like').textContent = `Feels Like: ${Math.round(main.feels_like)}°${unit === 'metric' ? 'C' : 'F'}`;
                document.getElementById('min-temp').textContent = `Min Temp: ${Math.round(main.temp_min)}°${unit === 'metric' ? 'C' : 'F'}`;
                document.getElementById('max-temp').textContent = `Max Temp: ${Math.round(main.temp_max)}°${unit === 'metric' ? 'C' : 'F'}`;
                document.getElementById('humidity').textContent = `Humidity: ${main.humidity}%`;
                document.getElementById('wind').textContent = `Wind: ${Math.round(windData.speed)} ${unit === 'metric' ? 'km/h' : 'mph'}`;
                document.getElementById('pressure').textContent = `Pressure: ${unit === 'metric' ? main.pressure + ' hPa' : (main.pressure * 0.02953).toFixed(2) + ' inHg'}`;
                document.getElementById('sunrise').textContent = `Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}`;
                document.getElementById('sunset').textContent = `Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString()}`;
                document.getElementById('visibility').textContent = `Visibility: ${unit === 'metric' ? (Math.round(data.visibility / 1000)) + ' km' : (Math.round(data.visibility / 1609)) + ' miles'}`;
                document.getElementById('clouds').textContent = `Cloud Coverage: ${data.clouds.all}%`;

                // Log the weather data for debugging
                console.log('Weather Data:', data);

                // Fetch UV Index and Air Quality data using the OneCall API
                fetch(`${oneCallUrl}?lat=${coord.lat}&lon=${coord.lon}&units=${unit}&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(forecastData => {
                        // Log the forecast data to check UV and AQI values
                        console.log('Forecast Data (UV & AQI):', forecastData);

                        // Update the UV Index if available
                        if (forecastData.current && forecastData.current.uvi !== undefined) {
                            document.getElementById('uv-index').textContent = `UV Index: ${forecastData.current.uvi}`;
                        } else {
                            document.getElementById('uv-index').textContent = 'UV Index: Not Available';
                        }

                        // Update the Air Quality Index if available
                        if (forecastData.current && forecastData.current.aqi !== undefined) {
                            document.getElementById('aqi').textContent = `Air Quality Index: ${forecastData.current.aqi}`;
                        } else {
                            document.getElementById('aqi').textContent = 'Air Quality Index: Not Available';
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching UV or Air Quality data:", error);
                        document.getElementById('uv-index').textContent = 'UV Index: Not Available';
                        document.getElementById('aqi').textContent = 'Air Quality Index: Not Available';
                    });
            } else {
                alert("Weather data not found for the entered city or ZIP code.");
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("There was an error fetching the weather data. Please try again later.");
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
