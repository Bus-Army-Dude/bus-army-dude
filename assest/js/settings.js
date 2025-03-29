'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // Get all the necessary elements
    const settingsBtn = document.querySelector("[data-settings-btn]");
    const settingsModal = document.querySelector("[data-settings-modal]");
    const settingsClose = document.querySelector("[data-settings-close]");
    const saveBtn = document.querySelector("[data-settings-save]");

    // Settings controls
    const tempSelect = document.querySelector("[data-settings-temp]");
    const speedSelect = document.querySelector("[data-settings-speed]");
    const pressureSelect = document.querySelector("[data-settings-pressure]");
    const timeToggle = document.querySelector("[data-settings-time]");
    const locationToggle = document.querySelector("[data-settings-location]");

    // Default settings
    const defaultSettings = {
        temperature: "celsius",
        windSpeed: "ms",
        pressure: "hpa",
        timeFormat: false,  // false = 12-hour, true = 24-hour
        locationServices: true
    };

    // Load settings from localStorage
    const loadSettings = () => {
        const savedSettings = JSON.parse(localStorage.getItem("weatherSettings")) || defaultSettings;

        // Apply saved settings to controls
        tempSelect.value = savedSettings.temperature;
        speedSelect.value = savedSettings.windSpeed;
        pressureSelect.value = savedSettings.pressure;
        timeToggle.checked = savedSettings.timeFormat;
        locationToggle.checked = savedSettings.locationServices;

        // Apply settings immediately (for initial load)
        applySettings(savedSettings);
    };

    // Save settings to localStorage
    const saveSettings = () => {
        const settings = {
            temperature: tempSelect.value,
            windSpeed: speedSelect.value,
            pressure: pressureSelect.value,
            timeFormat: timeToggle.checked,  // Save the 24-hour toggle status
            locationServices: locationToggle.checked
        };

        localStorage.setItem("weatherSettings", JSON.stringify(settings));
        applySettings(settings);
    };

    // Apply settings to the UI
    const applySettings = (settings) => {
        // Handle location services
        const locationBtn = document.querySelector("[data-current-location-btn]");
        if (!settings.locationServices) {
            locationBtn.classList.add("disabled");
            locationBtn.setAttribute("disabled", "");
        } else {
            locationBtn.classList.remove("disabled");
            locationBtn.removeAttribute("disabled");
        }

        // Update unit displays
        updateUnits(settings);

        // Update sunrise and sunset times
        updateSunriseSunset(settings.timeFormat);

        // Update "Today at" time
        updateTodayAtTime(settings.timeFormat);

        // Re-render hourly forecast
        if (typeof renderHourlyForecast === 'function') {
            renderHourlyForecast();
        }
    };

    const updateTodayAtTime = (is24HourFormat) => {
        const todayTimeElement = document.querySelector("[data-today-time]");
        const timezoneOffset = parseInt(localStorage.getItem("timezoneOffset")) || 0;

        if (todayTimeElement) {
            const now = new Date();
            const currentTimeUnix = Math.floor(now.getTime() / 1000);
            todayTimeElement.textContent = formatSunriseSunsetTime(currentTimeUnix, timezoneOffset, is24HourFormat);
        }
    };

    const updateSunriseSunset = (is24HourFormat) => {
        const sunriseElement = document.querySelector("[data-sunrise]");
        const sunsetElement = document.querySelector("[data-sunset]");
        const timezoneOffset = parseInt(localStorage.getItem("timezoneOffset")) || 0; // Retrieve timezone offset

        if (sunriseElement && sunsetElement) {
            const sunriseTimeUnix = parseInt(sunriseElement.getAttribute("data-original-value"));
            const sunsetTimeUnix = parseInt(sunsetElement.getAttribute("data-original-value"));

            if (!isNaN(sunriseTimeUnix) && !isNaN(sunsetTimeUnix)) {
                sunriseElement.textContent = formatSunriseSunsetTime(sunriseTimeUnix, timezoneOffset, is24HourFormat);
                sunsetElement.textContent = formatSunriseSunsetTime(sunsetTimeUnix, timezoneOffset, is24HourFormat);
            }
        }
    };

    const formatSunriseSunsetTime = function (timeUnix, timezone, is24Hour) {
        const date = new Date(timeUnix * 1000);
        const localDate = new Date(date.getTime() + (timezone * 1000)); // Apply timezone offset

        const hours = localDate.getUTCHours();
        const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');

        if (is24Hour) {
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        } else {
            const period = hours >= 12 ? "PM" : "AM";
            const displayHours = hours % 12 || 12;
            return `${displayHours}:${minutes} ${period}`;
        }
    };

    const updateUnits = (settings) => {
        // Temperature units
        document.querySelectorAll("[data-temperature]").forEach(element => {
            const value = parseFloat(element.getAttribute("data-original-value"));
            if (!isNaN(value)) {
                let converted = value;
                let unit = "°C";

                if (settings.temperature === "fahrenheit") {
                    converted = (value * 9/5) + 32;
                    unit = "°F";
                } else if (settings.temperature === "kelvin") {
                    converted = value + 273.15;
                    unit = "K";
                }

                element.textContent = `${Math.round(converted)}${unit}`;
            }
        });

        // Wind speed units
        document.querySelectorAll("[data-wind-speed]").forEach(element => {
            const value = parseFloat(element.getAttribute("data-original-value"));
            if (!isNaN(value)) {
                let converted = value;
                let unit = "m/s";

                switch(settings.windSpeed) {
                    case "kph":
                        converted = value * 3.6;
                        unit = "km/h";
                        break;
                    case "mph":
                        converted = value * 2.237;
                        unit = "mph";
                        break;
                    case "knots":
                        converted = value * 1.944;
                        unit = "knots";
                        break;
                }

                element.textContent = `${Math.round(converted)} ${unit}`;
            }
        });

        // Pressure units
        document.querySelectorAll("[data-pressure]").forEach(element => {
            const value = parseFloat(element.getAttribute("data-original-value"));
            if (!isNaN(value)) {
                let converted = value;
                let unit = "hPa";

                if (settings.pressure === "inhg") {
                    converted = value * 0.02953;
                    unit = "inHg";
                } else if (settings.pressure === "mmhg") {
                    converted = value * 0.75006;
                }
                element.textContent = `${Math.round(converted)} ${unit}`;
            }
        });
    };

    // Event Listeners
    settingsBtn.addEventListener("click", () => settingsModal.classList.add("active"));
    settingsClose.addEventListener("click", () => settingsModal.classList.remove("active"));

    saveBtn.addEventListener("click", () => {
        saveSettings();
        settingsModal.classList.remove("active");
    });

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.remove("active");
        }
    });

    // Location toggle specific handling (no change needed here)
    locationToggle.addEventListener("change", (event) => {
        const locationBtn = document.querySelector("[data-current-location-btn]");
        if (!event.target.checked) {
            locationBtn.classList.add("disabled");
            locationBtn.setAttribute("disabled", "");
        } else {
            locationBtn.classList.remove("disabled");
            locationBtn.removeAttribute("disabled");
        }
    });

    timeToggle.addEventListener("change", () => {
    // Update immediately on toggle change
    const savedSettings = {
        temperature: tempSelect.value,
        windSpeed: speedSelect.value,
        pressure: pressureSelect.value,
        timeFormat: timeToggle.checked,
        locationServices: locationToggle.checked
    };

    // Apply settings and update time displays
    applySettings(savedSettings);
});

    // Load settings on page load
    loadSettings();
});
