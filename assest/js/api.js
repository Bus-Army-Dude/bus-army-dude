'use strict';

const apiKey = "511c0d53e786d6e701870951d85c605d";

export const fetchData = (URL, callback) => {
    fetch(`${URL}`) // Removed the apiKey from the URL here as it will be added in the specific url functions if needed
        .then(res => res.json())
        .then(data => callback(data));
}

export const url = {
    currentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric&appid=${apiKey}`;
    },
    forecast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric&appid=${apiKey}`;
    },
    airPollution(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    },
    reverseGeo(lat, lon) {
        return `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`;
    },
    /**
     * @param {string} query search query e.g. :"london" , "New York"
     */
    geo(query) {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
    },
    weatherAlerts(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${apiKey}`;
    },
    weatherGovAlerts(lat, lon) {
        // Construct the weather.gov alerts URL based on latitude and longitude
        // Using the point query as discussed.
        return `https://api.weather.gov/alerts/active?point=${lon},${lat}`;
    }
}
