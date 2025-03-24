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

// Fetch weather data from OpenWeather API
function fetchWeatherData(city) {
    const url = `${apiUrl}?q=${city}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                // Update the UI with the weather data
                const weather = data.weather[0];
                const main = data.main;
                const windData = data.wind;
                const sys = data.sys;
                const cloudsData = data.clouds;
                const coord = data.coord;
                const aqiData = data.main.pressure; // Placeholder for AQI if available

                // Update city, region, and time
                cityName.textContent = data.name;
                region.textContent = sys.country;
                weatherTime.textContent = new Date().toLocaleString();

                // Weather info
                temperature.textContent = `${Math.round(main.temp)}°C`;
                weatherCondition.textContent = weather.description;
                weatherIcon.src = `http://openweathermap.org/img/wn/${weather.icon}.png`;

                // Detailed weather info
                feelsLike.textContent = `Feels Like: ${Math.round(main.feels_like)}°C`;
                minTemp.textContent = `Min Temp: ${Math.round(main.temp_min)}°C`;
                maxTemp.textContent = `Max Temp: ${Math.round(main.temp_max)}°C`;
                humidity.textContent = `Humidity: ${main.humidity}%`;
                wind.textContent = `Wind: ${Math.round(windData.speed)} km/h`;
                pressure.textContent = `Pressure: ${main.pressure} hPa`;
                uvIndex.textContent = `UV Index: Not Available`; // You'll need a separate call for UV Index
                sunrise.textContent = `Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}`;
                sunset.textContent = `Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString()}`;
                aqi.textContent = `Air Quality Index: ${aqiData}`;
                visibility.textContent = `Visibility: ${Math.round(data.visibility / 1000)} km`;
                clouds.textContent = `Cloud Coverage: ${cloudsData.all}%`;
                rain.textContent = `Rain: ${data.rain ? data.rain['1h'] : 0} mm`;
                snow.textContent = `Snow: ${data.snow ? data.snow['1h'] : 0} mm`;
                lastUpdate.textContent = `Last Update: ${new Date().toLocaleString()}`;
                locationCoordinates.textContent = `Coordinates: Lat ${coord.lat}, Lon ${coord.lon}`;
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

// Optional: Allow pressing "Enter" key to trigger the search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Default city (you can set this to your location or any city)
let currentCity = 'New York';
fetchWeatherData(currentCity);

// Automatically refresh weather data every second
setInterval(() => {
    fetchWeatherData(currentCity);
}, 1000);  // Update every second (1000 milliseconds)
