// Weather functionality to add to your existing script
const WEATHER_API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeather API key

// Add this to your existing initialization
function initializePage() {
    updateTime();
    tiktokShoutouts.init();
    updateNewYearCountdown();
    initializeWeather(); // New weather function
    
    // Your existing intervals
    setInterval(updateTime, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(updateNewYearCountdown, 1000);
    setInterval(updateWeather, 300000); // Update weather every 5 minutes
}

function initializeWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => getWeatherData(position.coords.latitude, position.coords.longitude),
            handleLocationError
        );
    }
}

async function getWeatherData(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${WEATHER_API_KEY}`
        );
        const data = await response.json();
        updateWeatherDisplay(data);
    } catch (error) {
        handleWeatherError();
    }
}

function updateWeatherDisplay(data) {
    const weatherSection = document.querySelector('.weather-section');
    if (!weatherSection) return;

    const current = data.current;
    const temp = Math.round(current.temp);
    const feelsLike = Math.round(current.feels_like);
    
    weatherSection.innerHTML = `
        <div class="weather-content">
            <div class="weather-primary">
                <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" 
                     alt="${current.weather[0].description}"
                     class="weather-icon">
                <div class="temperature">
                    <span class="temp-value">${temp}°C</span>
                    <span class="feels-like">Feels like ${feelsLike}°C</span>
                </div>
            </div>
            <div class="weather-details">
                <div class="detail">
                    <span class="label">Humidity</span>
                    <span class="value">${current.humidity}%</span>
                </div>
                <div class="detail">
                    <span class="label">Wind</span>
                    <span class="value">${Math.round(current.wind_speed * 3.6)} km/h</span>
                </div>
                <div class="detail">
                    <span class="label">UV Index</span>
                    <span class="value">${Math.round(current.uvi)}</span>
                </div>
            </div>
        </div>
    `;
}

function handleLocationError() {
    const weatherSection = document.querySelector('.weather-section');
    if (weatherSection) {
        weatherSection.innerHTML = `
            <div class="weather-error">
                <p>Location access needed for weather</p>
                <button onclick="initializeWeather()" class="retry-button">
                    Enable Location
                </button>
            </div>
        `;
    }
}

function handleWeatherError() {
    const weatherSection = document.querySelector('.weather-section');
    if (weatherSection) {
        weatherSection.innerHTML = `
            <div class="weather-error">
                <p>Unable to load weather</p>
                <button onclick="initializeWeather()" class="retry-button">
                    Retry
                </button>
            </div>
        `;
    }
}
