// API key and endpoint
const apiKey = '88a889bce78f9ea1dc4fc0ef692e8ca4';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall'; // API for UV Index and Air Quality Index (AQI)

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

// Retrieve city and unit preferences from localStorage
let currentCity = localStorage.getItem('city') || 'New York';
let currentUnit = localStorage.getItem('unit') || 'metric';
unitSelect.value = currentUnit === 'metric' ? 'Celsius' : 'Fahrenheit';

// Function to determine if the input is a valid ZIP code or city
function isZipCode(input) {
    return /^[0-9]{5}(?:-[0-9]{4})?$/.test(input); // Matches US ZIP codes
}

// Fetch weather data (current and forecast) including UV and AQI
function fetchWeatherData(query, unit) {
    let url;

    // Set the correct URL for ZIP code or city-based searches
    if (isZipCode(query)) {
        url = `<span class="math-inline">\{apiUrl\}?zip\=</span>{query}&units=<span class="math-inline">\{unit\}&appid\=</span>{apiKey}`;
    } else {
        url = `<span class="math-inline">\{apiUrl\}?q\=</span>{query}&units=<span class="math-inline">\{unit\}&appid\=</span>{apiKey}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.cod === 200) {
                const weather = data.weather[0];
                const main = data.main;
                const windData = data.wind;
                const sys = data.sys;
                const coord = data.coord;

                // Update general weather data
                cityName.textContent = data.name;
                region.textContent = sys.country;

                // Last update (from the 'dt' property of weather data)
                const lastUpdated = new Date(data.dt * 1000).toLocaleString();
                weatherTime.textContent = lastUpdated;
                temperature.textContent = `<span class="math-inline">\{Math\.round\(main\.temp\)\}°</span>{unit === 'metric' ? 'C' : 'F'}`;
                weatherCondition.textContent = weather.description;
                weatherIcon.src = `http://openweathermap.org/img/wn/${weather.icon}.png`;

                // Other weather details
                feelsLike.textContent = `Feels Like: <span class="math-inline">\{Math\.round\(main\.feels\_like\)\}°</span>{unit === 'metric' ? 'C' : 'F'}`;
                minTemp.textContent = `Min Temp: <span class="math-inline">\{Math\.round\(main\.temp\_min\)\}°</span>{unit === 'metric' ? 'C' : 'F'}`;
                maxTemp.textContent = `Max Temp: <span class="math-inline">\{Math\.round\(main\.temp\_max\)\}°</span>{unit === 'metric' ? 'C' : 'F'}`;
                humidity.textContent = `Humidity: ${main.humidity}%`;
                wind.textContent = `Wind: ${Math.round(windData.speed)} ${unit === 'metric' ? 'km/h' : 'mph'}`;
                pressure.textContent = `Pressure: ${unit === 'metric' ? main.pressure + ' hPa' : (main.pressure * 0.02953).toFixed(2) + ' inHg'}`;
                sunrise.textContent = `Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}`;
                sunset.textContent = `Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString()}`;
                visibility.textContent = `Visibility: ${unit === 'metric' ? (Math.round(data.visibility / 1000)) + ' km' : (Math.round(data.visibility / 1609)) + ' miles'}`;
                clouds.textContent = `Cloud Coverage: ${data.clouds.all}%`;

                // Coordinates (lat, lon)
                locationCoordinates.textContent = `Coordinates: Lat ${coord.lat}, Lon ${coord.lon}`;

                // Rain and Snow - only show if present
                rain.textContent = data.rain && data.rain['1h'] ? `Rain: ${data.rain['1h']} mm/h` : 'Rain: Not Available';
                snow.textContent = data.snow && data.snow['1h'] ? `Snow: ${data.snow['1h']} mm/h` : 'Snow: Not Available';

                // Log the weather data for debugging
                console.log('Weather Data:', data);

                // Fetch UV Index and Air Quality data using the OneCall API
                fetch(`<span class="math-inline">\{oneCallUrl\}?lat\=</span>{coord.lat}&lon=<span class="math-inline">\{coord\.lon\}&units\=</span>{unit}&appid=${apiKey}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(forecastData => {
                        // Log the forecast data to check UV and AQI values
                        console.log('Forecast Data (UV & AQI):', forecastData);

                        // Update the UV Index if available
                        uvIndex.textContent = forecastData.current && forecastData.current.uvi !== undefined ? `UV Index: ${forecastData.current.uvi}` : 'UV Index: Not Available';

                        // Update the Air Quality Index if available
                        aqi.textContent = forecastData.current && forecastData.current.aqi !== undefined ? `Air Quality Index: ${forecastData.current.aqi}` : 'Air Quality Index: Not Available';
                    })
                    .catch(error => {
                        console.error("Error fetching UV or Air Quality data:", error);
                        uvIndex.textContent = 'UV Index: Not Available';
                        aqi.textContent = 'Air Quality Index: Not Available';
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
searchButton.addEventListener('click', function () {
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
searchInput.addEventListener('keypress', function (event) {
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
unitSelect.addEventListener('change', function () {
    currentUnit = unitSelect.value === 'Celsius' ? 'metric' : 'imperial';
    localStorage.setItem('unit', currentUnit); // Save selected unit
    fetchWeatherData(currentCity, currentUnit); // Fetch weather data
});

//
