// Enhanced Weather Module with US metrics
const weatherModule = {
    API_KEY: '63267bdce7584921903213518252103',

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
        setInterval(() => this.init(), 300000);
    },

    async getWeatherData(lat, lon) {
        try {
            this.showLoading();
            const [current, forecast, astronomy] = await Promise.all([
                this.getCurrentWeather(lat, lon),
                this.getForecast(lat, lon),
                this.getAstronomy(lat, lon)
            ]);

            this.updateEnhancedDisplay(current, forecast, astronomy);
        } catch (error) {
            console.error('Weather Error:', error);
            this.handleError();
        }
    },

    async getCurrentWeather(lat, lon) {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${this.API_KEY}&q=${lat},${lon}&aqi=yes`
        );
        return response.json();
    },

    async getForecast(lat, lon) {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${this.API_KEY}&q=${lat},${lon}&days=3&aqi=yes`
        );
        return response.json();
    },

    async getAstronomy(lat, lon) {
        const response = await fetch(
            `https://api.weatherapi.com/v1/astronomy.json?key=${this.API_KEY}&q=${lat},${lon}`
        );
        return response.json();
    },

    updateEnhancedDisplay(current, forecast, astronomy) {
        if (!this.weatherSection) return;

        const curr = current.current;
        const loc = current.location;
        const astro = astronomy.astronomy.astro;
        const forecastDays = forecast.forecast.forecastday;

        this.weatherSection.innerHTML = `
            <div class="weather-content">
                <!-- Current Weather Header -->
                <div class="weather-header">
                    <div class="location-info">
                        <h2>${loc.name}, ${loc.region}</h2>
                        <span class="last-updated">Updated: ${this.formatTime(curr.last_updated)}</span>
                    </div>
                </div>
                
                <hr> <!-- Added line separator -->
                
                <!-- Current Conditions -->
                <div class="weather-primary">
                    <div class="current-temp">
                        <img src="${curr.condition.icon}" 
                             alt="${curr.condition.text}"
                             class="weather-icon">
                        <div class="temperature">
                            <span class="temp-value">${Math.round(curr.temp_f)}°F</span>
                            <span class="feels-like">Feels like ${Math.round(curr.feelslike_f)}°F</span>
                        </div>
                    </div>
                    <div class="condition-text">${curr.condition.text}</div>
                </div>

                <hr> <!-- Added line separator -->

                <!-- Current Details -->
                <div class="weather-details">
                    <div class="detail">
                        <span class="label">Humidity</span>
                        <span class="value">${curr.humidity}%</span>
                    </div>
                    <div class="detail">
                        <span class="label">Wind</span>
                        <span class="value">${Math.round(curr.wind_mph)} mph ${curr.wind_dir}</span>
                    </div>
                    <div class="detail">
                        <span class="label">Pressure</span>
                        <span class="value">${curr.pressure_in} inHg</span>
                    </div>
                    <div class="detail">
                        <span class="label">Visibility</span>
                        <span class="value">${curr.vis_miles} mi</span>
                    </div>
                    <div class="detail">
                        <span class="label">UV Index</span>
                        <span class="value">${curr.uv}</span>
                    </div>
                    <div class="detail">
                        <span class="label">Precipitation</span>
                        <span class="value">${curr.precip_in}" today</span>
                    </div>
                </div>

                <hr> <!-- Added line separator -->

                <!-- Air Quality -->
                ${curr.air_quality ? `
                <div class="air-quality-section">
                    <h3>Air Quality</h3>
                    <div class="aqi-value">
                        <span class="label"><b>EPA Index:</b></span>
                    <span class="value ${this.getAirQualityClass(curr.air_quality["us-epa-index"])}">
                        ${this.getAirQualityText(curr.air_quality["us-epa-index"])}
                    </span>
                    </div>
                </div>
                ` : ''}

                <hr> <!-- Added line separator -->

                <!-- Astronomy -->
                <div class="astronomy-section">
                    <h3>Sun & Moon</h3>
                    <div class="astronomy-details">
                        <div class="sun-times">
                            <div class="detail">
                                <span class="label"><b>Sunrise:</b></span>
                                <span class="value">${astro.sunrise}</span>
                            </div>
                            <div class="detail">
                                <span class="label"><b>Sunset:</b></span>
                                <span class="value">${astro.sunset}</span>
                            </div>
                        </div>
                        <div class="moon-info">
                            <div class="detail">
                                <span class="label"><b>Moon Phase:</b></span>
                                <span class="value">${astro.moon_phase}</span>
                            </div>
                            <div class="detail">
                                <span class="label"><b>Moon Illumination:</b></span>
                                <span class="value">${astro.moon_illumination}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr> <!-- Added line separator -->

                <!-- 3-Day Forecast -->
                <div class="forecast-section">
                    <h3>3-Day Forecast</h3>
                    <div class="forecast-container">
                        ${forecastDays.map(day => `
                            <div class="forecast-day">
                                <div class="date">${this.formatDate(day.date)}</div>
                                <img src="${day.day.condition.icon}" 
                                     alt="${day.day.condition.text}" 
                                     class="forecast-icon">
                                <div class="forecast-temps">
                                    <span class="high">${Math.round(day.day.maxtemp_f)}°</span>
                                    <span class="separator">/</span>
                                    <span class="low">${Math.round(day.day.mintemp_f)}°</span>
                                </div>
                                <div class="forecast-details">
                                    <div class="rain-chance">
                                        <span class="label">Rain:</span>
                                        <span class="value">${day.day.daily_chance_of_rain}%</span>
                                    </div>
                                    <div class="condition">
                                        ${day.day.condition.text}
                                    </div>
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

    getAirQualityText(index) {
        const aqiTexts = {
            1: 'Good',
            2: 'Moderate',
            3: 'Unhealthy for Sensitive Groups',
            4: 'Unhealthy',
            5: 'Very Unhealthy',
            6: 'Hazardous'
        };
        return aqiTexts[index] || 'Unknown';
    },

    getAirQualityClass(index) {
        const aqiClasses = {
            1: 'aqi-good',
            2: 'aqi-moderate',
            3: 'aqi-sensitive',
            4: 'aqi-unhealthy',
            5: 'aqi-very-unhealthy',
            6: 'aqi-hazardous'
        };
        return aqiClasses[index] || '';
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
                <button onclick="weatherModule.init()" class="retry-button">
                    Retry
                </button>
            </div>
        `;
    },

    handleLocationError() {
        if (!this.weatherSection) return;
        this.weatherSection.innerHTML = `
            <div class="weather-error">
                <p>Location access needed for weather</p>
                <button onclick="weatherModule.init()" class="retry-button">
                    Enable Location
                </button>
            </div>
        `;
    }
};

// Initialize the weather module on page load
weatherModule.init();
});
