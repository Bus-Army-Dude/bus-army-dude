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
        }
    },

    async getWeatherData(lat, lon) {
    try {
        this.showLoading();

        // Call geocoding API to get the location name
        const locationResponse = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=421c8bcd4a38468e8d8152e997c9c902`);
        const locationData = await locationResponse.json();
        
        if (locationData.status.code !== 200) {
            throw new Error(`Geocoding API returned an error: ${locationData.status.message}`);
        }

        const locationName = locationData.results[0]?.formatted_address || 'Unknown Location';

        // Fetch weather data
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,pressure_msl,sunrise,sunset,moonphase&timezone=America%2FNew_York`);
        const weatherData = await weatherResponse.json();

        if (weatherData && weatherData.current_weather) {
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
        const { current_weather, daily } = data;
        const { temperature, feels_like, windspeed, humidity, weathercode, pressure_msl } = current_weather;
        const { temperature_2m_max, temperature_2m_min, precipitation_sum, sunrise, sunset, moonphase } = daily[0];

        const weatherCondition = this.getWeatherCondition(weathercode);
        const iconClass = this.ICONS[weatherCondition] || 'wi wi-na'; // Default icon if no match

        // Calculate sunrise and sunset times to a readable format
        const sunriseTime = this.formatTime(sunrise);
        const sunsetTime = this.formatTime(sunset);

        // Format Moon Phase
        const moonPhase = this.formatMoonPhase(moonphase);

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
                            <span class="temp-value">${temperature}°F</span>
                            <span class="feels-like">Feels Like: ${feels_like}°F</span>
                        </div>
                    </div>
                    <div class="condition-text">
                        <i class="wi ${iconClass}"></i> ${weatherCondition}
                    </div>
                </div>

                <hr>

                <div class="weather-details">
                    <div class="detail">
                        <span class="label">Wind Speed</span><span class="value">${windspeed} mph</span>
                    </div>
                    <div class="detail">
                        <span class="label">Humidity</span><span class="value">${humidity} %</span>
                    </div>
                    <div class="detail">
                        <span class="label">Pressure</span><span class="value">${pressure_msl} in</span>
                    </div>
                    <div class="detail">
                        <span class="label">Precipitation</span><span class="value">${precipitation_sum}%</span>
                    </div>
                </div>

                <hr>

                <div class="weather-forecast">
                    <div class="forecast-high-low">
                        <span class="high-temp">High: ${temperature_2m_max}°F</span> / 
                        <span class="low-temp">Low: ${temperature_2m_min}°F</span>
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
                    <div class="moon-phase">
                        <span>Moon Phase: </span><span>${moonPhase}</span>
                    </div>
                </div>
            </div>
        `;
    },

    getWeatherCondition(weathercode) {
        // Map the weather code to a human-readable condition
        switch (weathercode) {
            case 0: return 'Clear';
            case 1: return 'Partly Cloudy';
            case 2: return 'Mostly Cloudy';
            case 3: return 'Cloudy';
            case 45: return 'Fog';
            case 48: return 'Foggy';
            case 51: return 'Light Rain';
            case 53: return 'Moderate Rain';
            case 55: return 'Heavy Rain';
            case 61: return 'Light Showers';
            default: return 'Unknown';
        }
    },

    formatTime(time) {
        const date = new Date(time * 1000);
        return date.toLocaleTimeString();
    },

    formatMoonPhase(moonphase) {
        switch (moonphase) {
            case 0: return 'New Moon';
            case 1: return 'Waxing Crescent';
            case 2: return 'First Quarter';
            case 3: return 'Waxing Gibbous';
            case 4: return 'Full Moon';
            case 5: return 'Waning Gibbous';
            case 6: return 'Last Quarter';
            case 7: return 'Waning Crescent';
            default: return 'Unknown';
        }
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
