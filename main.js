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

            // Fetch current weather data from OpenWeatherMap API
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`);
            const weatherData = await weatherResponse.json();

            if (weatherData.cod === 200) {
                this.updateDisplay(weatherData);
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
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${this.apiKey}&units=imperial`);
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
            const date = new Date(day.dt * 1000);
            const iconClass = this.ICONS[day.weather[0].main] || 'wi wi-na'; // Default icon if no match

            forecastContainer.innerHTML += `
                <div class="forecast-day">
                    <div class="forecast-date">${date.toLocaleDateString()}</div>
                    <div class="forecast-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="forecast-temp">${day.temp.day.toFixed(1)}°F</div>
                    <div class="forecast-condition">${day.weather[0].description}</div>
                </div>
            `;
        });
    },

    async getSunMoonData(lat, lon) {
        try {
            const sunMoonResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${this.apiKey}&units=imperial`);
            const sunMoonData = await sunMoonResponse.json();

            this.displaySunMoonData(sunMoonData);
        } catch (error) {
            console.error('Sun & Moon API Error:', error);
        }
    },

    displaySunMoonData(sunMoonData) {
        const sunriseTime = new Date(sunMoonData.current.sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(sunMoonData.current.sunset * 1000).toLocaleTimeString();
        const moonriseTime = new Date(sunMoonData.daily[0].moonrise * 1000).toLocaleTimeString();
        const moonsetTime = new Date(sunMoonData.daily[0].moonset * 1000).toLocaleTimeString();

        const sunMoonSection = document.querySelector('.sun-moon-section');
        sunMoonSection.innerHTML = `
            <div class="sun-moon-info">
                <div class="sunrise">
                    <span>Sunrise: </span><span>${sunriseTime}</span>
                </div>
                <div class="sunset">
                    <span>Sunset: </span><span>${sunsetTime}</span>
                </div>
                <div class="moonrise">
                    <span>Moonrise: </span><span>${moonriseTime}</span>
                </div>
                <div class="moonset">
                    <span>Moonset: </span><span>${moonsetTime}</span>
                </div>
            </div>
        `;
    },

    updateDisplay(data) {
        const unitSystem = this.getUnitSystem();
        const unitSuffix = unitSystem === 'imperial' ? '°F' : '°C';
        const windSpeedUnit = unitSystem === 'imperial' ? 'mph' : 'm/s';
        const temperature = unitSystem === 'imperial' ? data.main.temp : (data.main.temp - 32) * 5 / 9;
        const feelsLike = unitSystem === 'imperial' ? data.main.feels_like : (data.main.feels_like - 32) * 5 / 9;
        const windSpeed = unitSystem === 'imperial' ? data.wind.speed : data.wind.speed * 0.44704;

        const iconClass = this.ICONS[data.weather[0].main] || 'wi wi-na';

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
