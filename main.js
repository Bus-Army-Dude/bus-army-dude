// Weather Module
const weatherModule = {
    API_KEY: 'ebeec5fc4654e84d868f03b3ee28d73a', // Replace with your OpenWeather API key

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
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.API_KEY}`
            );

            if (!response.ok) throw new Error('Weather data fetch failed');

            const data = await response.json();
            this.updateDisplay(data);
        } catch (error) {
            this.handleError();
        }
    },

    updateDisplay(data) {
        if (!this.weatherSection) return;

        const temp = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        
        this.weatherSection.innerHTML = `
            <div class="weather-content">
                <div class="weather-primary">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
                         alt="${data.weather[0].description}"
                         class="weather-icon">
                    <div class="temperature">
                        <span class="temp-value">${temp}°C</span>
                        <span class="feels-like">Feels like ${feelsLike}°C</span>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="detail">
                        <span class="label">Humidity</span>
                        <span class="value">${data.main.humidity}%</span>
                    </div>
                    <div class="detail">
                        <span class="label">Wind</span>
                        <span class="value">${Math.round(data.wind.speed * 3.6)} km/h</span>
                    </div>
                    <div class="detail">
                        <span class="label">Pressure</span>
                        <span class="value">${data.main.pressure} hPa</span>
                    </div>
                </div>
            </div>
        `;
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

// Initialize modules when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Your existing initializations
    timeModule.init();
    countdownModule.init();
    weatherModule.init(); // Add weather initialization
});
