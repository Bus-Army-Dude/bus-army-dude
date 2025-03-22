const weatherModule = {
    weatherSection: document.querySelector('.weather-section'),
    ICONS: {
        'Clear': 'wi wi-day-sunny',
        'Clouds': 'wi wi-day-cloudy',
        'Rain': 'wi wi-day-rain',
        'Snow': 'wi wi-day-snow',
        'Thunderstorm': 'wi wi-day-thunderstorm',
        'Drizzle': 'wi wi-day-showers',
        'Mist': 'wi wi-day-fog',
        'Fog': 'wi wi-day-fog',
        'Haze': 'wi wi-day-fog',
        'Dust': 'wi wi-day-dust',
        'Mostly Cloudy': 'wi wi-day-cloudy',
    },

    init() {
        if (!this.weatherSection) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => this.getWeatherData(position.coords.latitude, position.coords.longitude),
                () => this.handleLocationError()
            );
        } else {
            console.error('Geolocation is not supported');
            this.handleLocationError();
        }
    },

    async getWeatherData(lat, lon) {
    try {
        this.showLoading();

        // Call geocoding API to get the location name
        const locationResponse = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=421c8bcd4a38468e8d8152e997c9c902`);
        const locationData = await locationResponse.json();
        
        // Log location data to check if it is returning valid data
        console.log('Location Data:', locationData);

        if (locationData.status.code !== 200 || !locationData.results.length) {
            throw new Error(`Geocoding API returned an error: ${locationData.status.message}`);
        }

        const locationName = locationData.results[0]?.formatted_address || 'Unknown Location';

        // Fetch weather data from WeatherAPI
        const weatherResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=34ae2d4a53544561a07150106252203&q=${lat},${lon}&days=1`);
        const weatherData = await weatherResponse.json();

        // Log weather data to check if it is returning valid data
        console.log('Weather Data:', weatherData);

        if (weatherData && weatherData.current) {
            this.updateDisplay(weatherData, locationName);
        } else {
            throw new Error('Weather API returned invalid data');
        }
    } catch (error) {
        console.error('Error:', error.message);
        this.handleError(error);
    }
}

    updateDisplay(data, locationName) {
        const { current, forecast } = data;
        const { temp_c, feelslike_c, wind_kph, humidity, condition, pressure_mb } = current;
        const { maxtemp_c, mintemp_c, totalprecip_mm, astro } = forecast.forecastday[0];

        const weatherCondition = condition.text || 'Unknown';
        const iconClass = this.ICONS[weatherCondition] || 'wi wi-na'; // Default icon if no match

        // Calculate sunrise and sunset times
        const sunriseTime = this.formatTime(astro.sunrise);
        const sunsetTime = this.formatTime(astro.sunset);

        this.weatherSection.innerHTML = `
            <div class="weather-content">
                <div class="weather-header">
                    <div class="location-info">
                        <h2 class="location-name">${locationName}</h2>
                        <span class="last-updated">Updated: ${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                <hr>

                <div class="weather-primary">
                    <div class="current-temp">
                        <div class="temperature">
                            <span class="temp-value">${temp_c}°C</span>
                            <span class="feels-like">Feels Like: ${feelslike_c}°C</span>
                        </div>
                    </div>
                    <div class="condition-text">
                        <i class="wi ${iconClass}"></i> ${weatherCondition}
                    </div>
                </div>

                <hr>

                <div class="weather-details">
                    <div class="detail">
                        <span class="label">Wind Speed</span><span class="value">${wind_kph} kph</span>
                    </div>
                    <div class="detail">
                        <span class="label">Humidity</span><span class="value">${humidity} %</span>
                    </div>
                    <div class="detail">
                        <span class="label">Pressure</span><span class="value">${pressure_mb} mb</span>
                    </div>
                    <div class="detail">
                        <span class="label">Precipitation</span><span class="value">${totalprecip_mm} mm</span>
                    </div>
                </div>

                <hr>

                <div class="weather-forecast">
                    <div class="forecast-high-low">
                        <span class="high-temp">High: ${maxtemp_c}°C</span> / 
                        <span class="low-temp">Low: ${mintemp_c}°C</span>
                    </div>
                </div>

                <hr>

                <div class="sun-moon-section">
                    <div class="sunrise">
                        <span>Sunrise: </span><span>${sunriseTime}</span>
                    </div>
                    <div class="sunset">
                        <span>Sunset: </span><span>${sunsetTime}</span>
                    </div>
                </div>
            </div>
        `;
    },

    formatTime(timeString) {
        const time = new Date(timeString);
        return time.toLocaleTimeString();
    },

    showLoading() {
        this.weatherSection.innerHTML = '<div class="loading">Loading weather data...</div>';
    },

    handleError(error) {
        this.weatherSection.innerHTML = `<div class="error">Error: ${error.message}. Please try again later.</div>`;
    },

    handleLocationError() {
        this.weatherSection.innerHTML = '<div class="error">Unable to retrieve location. Please enable location services.</div>';
    }
};

weatherModule.init();
