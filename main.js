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

            // Fetch current weather data from Open-Meteo API
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America%2FNew_York`);
            const weatherData = await weatherResponse.json();

            if (weatherData && weatherData.current_weather) {
                this.updateDisplay(weatherData.current_weather);
                this.getForecast(lat, lon); // Fetch 7-day forecast
                this.getSunMoonData(lat, lon); // Fetch sun & moon data
            } else {
                this.handleError();
            }
        } catch (error) {
            console.error('Weather API Error:', error);
            this.handleError();
        }
    },

    async getForecast(lat, lon) {
        try {
            const forecastResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset&timezone=America%2FNew_York`);
            const forecastData = await forecastResponse.json();

            this.displayForecast(forecastData.daily);
        } catch (error) {
            console.error('Forecast API Error:', error);
        }
    },

    displayForecast(dailyForecast) {
        const forecastContainer = document.querySelector('.forecast-container');
        forecastContainer.innerHTML = '';

        dailyForecast.forEach(day => {
            const date = new Date(day.timestamp * 1000); // Convert from UNIX timestamp to Date
            forecastContainer.innerHTML += `
                <div class="forecast-day">
                    <div class="forecast-date">${date.toLocaleDateString()}</div>
                    <div class="forecast-temp">
                        <span class="forecast-max-temp">${day.temperature_2m_max}°F</span> /
                        <span class="forecast-min-temp">${day.temperature_2m_min}°F</span>
                    </div>
                    <div class="forecast-precipitation">Precipitation: ${day.precipitation_sum}mm</div>
                    <div class="forecast-sunrise">Sunrise: ${day.sunrise}</div>
                    <div class="forecast-sunset">Sunset: ${day.sunset}</div>
                </div>
            `;
        });
    },

    async getSunMoonData(lat, lon) {
        try {
            const sunMoonResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset,moonrise,moonset&timezone=America%2FNew_York`);
            const sunMoonData = await sunMoonResponse.json();

            this.displaySunMoonData(sunMoonData.daily[0]);
        } catch (error) {
            console.error('Sun & Moon API Error:', error);
        }
    },

    displaySunMoonData(data) {
        const sunMoonSection = document.querySelector('.sun-moon-section');
        sunMoonSection.innerHTML = `
            <div class="sun-moon-info">
                <div class="sunrise">
                    <span>Sunrise: </span><span>${data.sunrise}</span>
                </div>
                <div class="sunset">
                    <span>Sunset: </span><span>${data.sunset}</span>
                </div>
                <div class="moonrise">
                    <span>Moonrise: </span><span>${data.moonrise}</span>
                </div>
                <div class="moonset">
                    <span>Moonset: </span><span>${data.moonset}</span>
                </div>
            </div>
        `;
    },

    updateDisplay(data) {
        const unitSystem = this.getUnitSystem();
        const temperature = data.temperature; // In Fahrenheit (already provided by Open-Meteo)
        const windSpeed = data.windspeed; // Wind speed in mph
        const humidity = data.humidity;
        const pressure = data.pressure;
        const weatherCode = data.weathercode;
        const locationName = "Your Location"; // Use a reverse geocoding API to get the name if needed
        const weatherCondition = this.getWeatherCondition(weatherCode);

        const iconClass = this.ICONS[weatherCondition] || 'wi wi-na'; // Default icon if no match

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
                            <span class="feels-like">Feels Like: ${data.feels_like}°F</span>
                        </div>
                    </div>
                    <div class="condition-text">
                        <i class="${iconClass}"></i> ${weatherCondition}
                    </div>
                </div>

                <hr>

                <div class="weather-details">
                    <div class="detail"><span class="label">Wind Speed</span><span class="value">${windSpeed} mph</span></div>
                    <div class="detail"><span class="label">Humidity</span><span class="value">${humidity}%</span></div>
                    <div class="detail"><span class="label">Pressure</span><span class="value">${pressure} hPa</span></div>
                </div>
            </div>
        `;
    },

    getWeatherCondition(weatherCode) {
        switch (weatherCode) {
            case 0: return 'Clear';
            case 1: return 'Clouds';
            case 2: return 'Clouds';
            case 3: return 'Clouds';
            case 45: return 'Fog';
            case 48: return 'Fog';
            case 51: return 'Drizzle';
            case 53: return 'Drizzle';
            case 55: return 'Drizzle';
            case 56: return 'Rain';
            case 57: return 'Rain';
            case 61: return 'Rain';
            case 63: return 'Rain';
            case 65: return 'Rain';
            case 66: return 'Snow';
            case 67: return 'Snow';
            case 71: return 'Snow';
            case 73: return 'Snow';
            case 75: return 'Snow';
            case 77: return 'Snow';
            case 80: return 'Thunderstorm';
            case 81: return 'Thunderstorm';
            case 82: return 'Thunderstorm';
            default: return 'Unknown';
        }
    },

    getUnitSystem() {
        return navigator.language.includes('US') ? 'imperial' : 'metric';
    },

    showLoading() {
        this.weatherSection.innerHTML = `
            <div class="weather-loading">
                <div class="loading-spinner"></div>
                <p>Loading weather data...</p>
            </div>
        `;
    },

    handleLocationError() {
        this.weatherSection.innerHTML = 'Unable to retrieve your location.';
    },

    handleError() {
        this.weatherSection.innerHTML = 'Weather data unavailable.';
    },
};

weatherModule.init();
