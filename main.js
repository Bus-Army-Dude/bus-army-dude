const weatherModule = {
    API_URL: 'https://api.open-meteo.com/v1/forecast',
    
    init() {
        this.weatherSection = document.querySelector('.weather-section');
        if (!this.weatherSection) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => this.getWeatherData(position.coords.latitude, position.coords.longitude),
                () => this.handleLocationError()
            );
        }

        // Update weather every 5 minutes
        setInterval(() => this.getWeatherData(), 300000);
    },

    async getWeatherData(lat, lon) {
        try {
            this.showLoading();

            const response = await fetch(
                `${this.API_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max&timezone=auto`
            );
            const weatherData = await response.json();
            this.updateEnhancedDisplay(weatherData);
        } catch (error) {
            console.error('Weather Error:', error);
            this.handleError();
        }
    },

    updateEnhancedDisplay(data) {
        if (!this.weatherSection) return;

        const currentWeather = data.current_weather;
        const dailyForecast = data.daily;

        this.weatherSection.innerHTML = `
            <div class="weather-content">
                <div class="weather-header">
                    <div class="location-info">
                        <h2>Your Location</h2>
                        <span class="last-updated">Updated: ${this.formatTime(currentWeather.time)}</span>
                    </div>
                </div>

                <hr>

                <div class="weather-primary">
                    <div class="current-temp">
                        <div class="temperature">
                            <span class="temp-value">${Math.round(currentWeather.temperature)}°f</span>
                            <span class="feels-like">Wind Speed: ${Math.round(currentWeather.windspeed)} mph</span>
                        </div>
                    </div>
                    <div class="condition-text">Weather Code: ${currentWeather.weathercode}</div>
                </div>

                <hr>

                <div class="weather-details">
                    <div class="detail"><span class="label">Wind Direction</span><span class="value">${currentWeather.winddirection}°</span></div>
                </div>

                <hr>

                <div class="forecast-section">
                    <h3>7-Day Forecast</h3>
                    <div class="forecast-container">
                        ${dailyForecast.time.map((day, index) => `
                            <div class="forecast-day">
                                <div class="date">${this.formatDate(day)}</div>
                                <div class="forecast-temps">
                                    <span class="high">${Math.round(dailyForecast.temperature_2m_max[index])}°F</span>
                                    <span class="separator">/</span>
                                    <span class="low">${Math.round(dailyForecast.temperature_2m_min[index])}°F</span>
                                </div>
                                <div class="forecast-details">
                                    <div class="rain-chance"><span class="label">Precipitation:</span><span class="value">${dailyForecast.precipitation_sum[index]} in</span></div>
                                    <div class="condition">UV Index: ${dailyForecast.uv_index_max[index]}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    },

    formatTime(timeString) {
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },

    showLoading() {
        if (!this.weatherSection) return;
        this.weatherSection.innerHTML = `
            <div class="weather-loading">
                <div class="loading-spinner"></div>
                <p>Loading weather data...</p>
            </div>
        `;
    },

    handleError() {
        if (!this.weatherSection) return;
        this.weatherSection.innerHTML = `
            <div class="weather-error">
                <p>Unable to load weather data</p>
                <button onclick="weatherModule.init()" class="retry-button">Retry</button>
            </div>
        `;
    },

    handleLocationError() {
        if (!this.weatherSection) return;
        this.weatherSection.innerHTML = `
            <div class="weather-error">
                <p>Location access needed for weather</p>
                <button onclick="weatherModule.init()" class="retry-button">Enable Location</button>
            </div>
        `;
    }
};

weatherModule.init();
