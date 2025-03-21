// Weather Module
const weatherModule = {
    API_KEY: '63267bdce7584921903213518252103', // Replace with your WeatherAPI.com key

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
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${this.API_KEY}&q=${lat},${lon}&aqi=yes`
            );

            if (!response.ok) throw new Error('Weather data fetch failed');

            const data = await response.json();
            this.updateDisplay(data);
        } catch (error) {
            console.error('Weather Error:', error);
            this.handleError();
        }
    },

    updateDisplay(data) {
        if (!this.weatherSection) return;

        const { current, location } = data;
        
        this.weatherSection.innerHTML = `
            <div class="weather-content">
                <div class="weather-primary">
                    <img src="${current.condition.icon}" 
                         alt="${current.condition.text}"
                         class="weather-icon">
                    <div class="temperature">
                        <span class="temp-value">${current.temp_c}°C</span>
                        <span class="feels-like">Feels like ${current.feelslike_c}°C</span>
                    </div>
                </div>
                <div class="location-info">
                    <span class="condition-text">${current.condition.text}</span>
                    <span class="location-name">${location.name}</span>
                </div>
                <div class="weather-details">
                    <div class="detail">
                        <span class="label">Humidity</span>
                        <span class="value">${current.humidity}%</span>
                    </div>
                    <div class="detail">
                        <span class="label">Wind</span>
                        <span class="value">${current.wind_kph} km/h</span>
                    </div>
                    <div class="detail">
                        <span class="label">UV Index</span>
                        <span class="value">${current.uv}</span>
                    </div>
                </div>
                ${current.air_quality ? `
                <div class="air-quality">
                    <span class="label">Air Quality (US EPA)</span>
                    <span class="value">${this.getAirQualityText(current.air_quality["us-epa-index"])}</span>
                </div>
                ` : ''}
            </div>
        `;
    },

    getAirQualityText(index) {
        const aqiTexts = {
            1: 'Good',
            2: 'Moderate',
            3: 'Unhealthy for sensitive groups',
            4: 'Unhealthy',
            5: 'Very Unhealthy',
            6: 'Hazardous'
        };
        return aqiTexts[index] || 'Unknown';
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
