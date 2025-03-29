'use strict';

// API key for OpenWeatherMap
const apiKey = "511c0d53e786d6e701870951d85c605d";

// Function to fetch data from the API
export const fetchData = (URL, callback) => {
    fetch(`${URL}&appid=${apiKey}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => callback(data))
        .catch(error => console.error("Error fetching data:", error));
};

// URLs for various API endpoints
export const url = {
    currentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`;
    },
    forecast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric`;
    },
    airPollution(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}`;
    },
    reverseGeo(lat, lon) {
        return `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5`;
    },
    geo(query) {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
    }
};

// Conversion functions for various weather data
export const convertTemperature = (temp, unit) => {
    if (unit === "fahrenheit") {
        return (temp * 9 / 5 + 32).toFixed(1); // Celsius to Fahrenheit
    } else if (unit === "kelvin") {
        return (temp + 273.15).toFixed(1); // Celsius to Kelvin
    } else {
        return temp.toFixed(1); // Default is Celsius
    }
};

export const convertWindSpeed = (speed, unit) => {
    if (unit === "kmh") {
        return (speed * 3.6).toFixed(1); // Meters per second to km/h
    } else if (unit === "mph") {
        return (speed * 2.23694).toFixed(1); // Meters per second to mph
    } else {
        return speed.toFixed(1); // Default is m/s
    }
};

export const convertPressure = (pressure, unit) => {
    if (unit === "inHg") {
        return (pressure * 0.02953).toFixed(2); // hPa to inches of mercury
    } else if (unit === "atm") {
        return (pressure * 0.000986923).toFixed(3); // hPa to atmospheres
    } else {
        return pressure.toFixed(1); // Default is hPa
    }
};

// Function to process visibility data
export const convertVisibility = (visibilityMeters) => {
    const visibilityKm = (visibilityMeters / 1000).toFixed(1); // Convert to kilometers
    const visibilityMiles = (visibilityMeters * 0.000621371).toFixed(1); // Convert to miles

    // Handle visibility cap at 10,000 meters
    if (visibilityMeters >= 10000) {
        return `Visibility is excellent, likely greater than 10 km (6.2 miles).`;
    }

    return `Visibility: ${visibilityKm} km (${visibilityMiles} miles).`;
};

// Function to fetch and display visibility data
export const displayVisibility = (lat, lon) => {
    const currentWeatherURL = url.currentWeather(lat, lon);

    fetchData(currentWeatherURL, (data) => {
        if (data.visibility) {
            const visibilityMessage = convertVisibility(data.visibility);
            console.log(visibilityMessage);
            document.querySelector("[data-visibility-display]").textContent = visibilityMessage;
        } else {
            console.warn("Visibility data not available.");
            document.querySelector("[data-visibility-display]").textContent = "Visibility data not available.";
        }
    });
};
