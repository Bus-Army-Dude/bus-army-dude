const weatherModule = {
    weatherSection: document.querySelector('.weather-section'),
    ICONS: {
        'Clear sky': 'wi wi-day-sunny',
        'Partly cloudy': 'wi wi-day-cloudy',
        'Cloudy': 'wi wi-cloudy',
        'Light rain': 'wi wi-day-showers',
        'Moderate rain': 'wi wi-day-rain',
        'Thunderstorms': 'wi wi-day-thunderstorm',
        'Snow': 'wi wi-day-snow',
        'Fog': 'wi wi-day-fog',
    },

    apiKey: 'ebeec5fc4654e84d868f03b3ee28d73a', // Replace with your OpenWeatherMap API key

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

            // Fetch weather data from OpenWeatherMap API
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`);
            const weatherData = await response.json();

            if (weatherData.cod === 200) {
                this.updateDisplay(weatherData);
            } else {
                this.handleError();
            }
        } catch (error) {
            console.error('Weather API Error:', error);
            this.handleError();
        }
    },

    updateDisplay(data) {
        const unitSystem = this.getUnitSystem();
        const unitSuffix = unitSystem === 'imperial' ? '°F' : '°C';
        const windSpeedUnit = unitSystem === 'imperial' ? 'mph' : 'm/s';
        const temperature = unitSystem === 'imperial' ? data.main.temp : (data.main.temp - 32) * 5 / 9;
        const feelsLike = unitSystem === 'imperial' ? data.main.feels_like : (data.main.feels_like - 32) * 5 / 9;
        const windSpeed = unitSystem === 'imperial' ? data.wind.speed : data.wind.speed * 0.44704; // Convert from m/s to mph

        const iconClass = this.ICONS[data.weather[0].main] || 'wi wi-na'; // Default icon if no match

        this.weatherSection.innerHTML = `
            <div class="weather-content">
                <div class="weather-header">
                    <div class="location-info">
                        <h2>${data.name}, ${data.sys.country}</h2>
                        <span class="last-updated">Updated: ${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                <hr>

                <div class="weather-primary">
                    <div class="current-temp">
                        <div class="temperature">
                            <span class="temp-value">${temperature.toFixed(1)}${unitSuffix}</span>
                            <span class="feels-like">Feels Like: ${feelsLike.toFixed(1)}${unitSuffix}</span>
                        </div>
                    </div>
                    <div class="condition-text">
                        <i class="${iconClass}"></i> ${data.weather[0].description}
                    </div>
                </div>

                <hr>

                <div class="weather-details">
                    <div class="detail"><span class="label">Wind Speed</span><span class="value">${windSpeed.toFixed(1)} ${windSpeedUnit}</span></div>
                    <div class="detail"><span class="label">Humidity</span><span class="value">${data.main.humidity}%</span></div>
                    <div class="detail"><span class="label">Pressure</span><span class="value">${data.main.pressure} hPa</span></div>
                    <div class="detail"><span class="label">UV Index</span><span class="value">${data.main.pressure}</span></div>
                    <div class="detail"><span class="label">Precipitation</span><span class="value">${data.main.pressure}</span></div>
                </div>
            </div>
        `;
    },

    getUnitSystem() {
        return navigator.language.includes('US') ? 'imperial' : 'metric';
    },

    showLoading() {
        this.weatherSection.innerHTML = 'Loading...';
    },

    handleLocationError() {
        this.weatherSection.innerHTML = 'Unable to retrieve your location.';
    },

    handleError() {
        this.weatherSection.innerHTML = 'Weather data unavailable.';
    },
};

weatherModule.init();
