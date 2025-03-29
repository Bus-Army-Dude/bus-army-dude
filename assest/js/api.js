'use strict';

const apiKey = "511c0d53e786d6e701870951d85c605d";

export const fetchData = (URL, callback) => {
    fetch(`${URL}&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => callback(data))
        .catch(error => {
            console.error("Error fetching data:", error);
            callback(null); // Return null on error so we can handle it
        });
}

export const url = {
    currentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`
    },
    forecast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric`
    },
    airPollution(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}`
    },
    reverseGeo(lat, lon) {
        return `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5`
    },
    /**
     * @param {string} query search query e.g. :"london" , "New York"  
     */
    geo(query) {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    }
}
