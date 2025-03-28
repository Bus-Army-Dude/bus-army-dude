'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // Get all the necessary elements
    const settingsBtn = document.querySelector("[data-settings-toggler]");
    const settingsModal = document.querySelector("[data-settings]");
    const settingsClose = document.querySelector("[data-settings-close]");
    const settingsForm = document.querySelector("[data-settings-form]");
    const currentLocationBtn = document.querySelector("[data-current-location-btn]");
    
    // Settings controls (form inputs)
    const tempUnit = settingsForm.querySelector("[name='temperature']");
    const windSpeedUnit = settingsForm.querySelector("[name='windSpeed']");
    const pressureUnit = settingsForm.querySelector("[name='pressure']");
    const timeFormat = settingsForm.querySelector("[name='timeFormat']");
    const locationToggle = settingsForm.querySelector("[name='location']");

    // Default settings
    const defaultSettings = {
        temperature: "celsius",
        windSpeed: "kmh",
        pressure: "hpa",
        timeFormat: false, // false = 12-hour, true = 24-hour
        locationServices: true
    };

    // Load settings from localStorage
    const loadSettings = () => {
        const savedSettings = JSON.parse(localStorage.getItem("weatherSettings")) || defaultSettings;

        // Apply saved settings to form controls
        settingsForm.querySelectorAll("[name='temperature']").forEach(input => {
            input.checked = input.value === savedSettings.temperature;
        });

        settingsForm.querySelectorAll("[name='windSpeed']").forEach(input => {
            input.checked = input.value === savedSettings.windSpeed;
        });

        settingsForm.querySelectorAll("[name='pressure']").forEach(input => {
            input.checked = input.value === savedSettings.pressure;
        });

        settingsForm.querySelector("[name='timeFormat']").checked = savedSettings.timeFormat;
        settingsForm.querySelector("[name='location']").checked = savedSettings.locationServices;

        // Apply settings immediately
        applySettings(savedSettings);
    };

    // Save settings to localStorage
    const saveSettings = () => {
        const formData = new FormData(settingsForm);
        const settings = {
            temperature: formData.get("temperature"),
            windSpeed: formData.get("windSpeed"),
            pressure: formData.get("pressure"),
            timeFormat: formData.get("timeFormat") === "on",
            locationServices: formData.get("location") === "on"
        };

        localStorage.setItem("weatherSettings", JSON.stringify(settings));
        return settings;
    };

    // Apply settings to the UI
    const applySettings = (settings) => {
        // Handle location services button state
        if (!settings.locationServices) {
            currentLocationBtn.classList.add("disabled");
            currentLocationBtn.setAttribute("disabled", "");
            
            // Only redirect if currently on current-location
            if (window.location.hash === '#/current-location') {
                const lastLocation = localStorage.getItem('lastSearchedLocation');
                if (lastLocation) {
                    window.location.hash = lastLocation;
                } else {
                    window.location.hash = '#/weather?lat=51.5073219&lon=-0.1276474'; // Default location
                }
            }
        } else {
            currentLocationBtn.classList.remove("disabled");
            currentLocationBtn.removeAttribute("disabled");
        }

        // Update unit displays
        updateWeatherUnits(settings);

        // Update time formats
        updateTimeFormats(settings.timeFormat);
    };

    // Update weather units display
    const updateWeatherUnits = (settings) => {
        // Temperature conversion
        document.querySelectorAll("[data-temperature]").forEach(element => {
            const value = parseFloat(element.getAttribute("data-original-value"));
            if (!isNaN(value)) {
                const [convertedValue, unit] = convertTemperature(value, settings.temperature);
                element.textContent = `${Math.round(convertedValue)}${unit}`;
            }
        });

        // Wind speed conversion
        document.querySelectorAll("[data-wind-speed]").forEach(element => {
            const value = parseFloat(element.getAttribute("data-original-value"));
            if (!isNaN(value)) {
                const [convertedValue, unit] = convertWindSpeed(value, settings.windSpeed);
                element.textContent = `${Math.round(convertedValue)} ${unit}`;
            }
        });

        // Pressure conversion
        document.querySelectorAll("[data-pressure]").forEach(element => {
            const value = parseFloat(element.getAttribute("data-original-value"));
            if (!isNaN(value)) {
                const [convertedValue, unit] = convertPressure(value, settings.pressure);
                element.textContent = `${Math.round(convertedValue)} ${unit}`;
            }
        });
    };

    // Temperature conversion helper
    const convertTemperature = (celsius, unit) => {
        switch (unit) {
            case "fahrenheit":
                return [(celsius * 9/5) + 32, "°F"];
            case "kelvin":
                return [celsius + 273.15, "K"];
            default: // celsius
                return [celsius, "°C"];
        }
    };

    // Wind speed conversion helper
    const convertWindSpeed = (mps, unit) => {
        switch (unit) {
            case "kmh":
                return [mps * 3.6, "km/h"];
            case "mph":
                return [mps * 2.237, "mph"];
            case "knots":
                return [mps * 1.944, "kn"];
            case "bft":
                return [Math.floor(Math.cbrt((mps / 0.836) ** 2)), "bft"];
            default: // m/s
                return [mps, "m/s"];
        }
    };

    // Pressure conversion helper
    const convertPressure = (hpa, unit) => {
        switch (unit) {
            case "inhg":
                return [hpa * 0.02953, "inHg"];
            case "mmhg":
                return [hpa * 0.75006, "mmHg"];
            case "kpa":
                return [hpa / 10, "kPa"];
            case "mbar":
                return [hpa, "mbar"];
            default: // hPa
                return [hpa, "hPa"];
        }
    };

    // Update time formats
    const updateTimeFormats = (is24Hour) => {
        updateSunriseSunset(is24Hour);
        updateCurrentTime(is24Hour);
        updateHourlyForecast(is24Hour);
    };

    // Update sunrise/sunset times
    const updateSunriseSunset = (is24Hour) => {
        const elements = {
            sunrise: document.querySelector("[data-sunrise]"),
            sunset: document.querySelector("[data-sunset]")
        };

        for (const [key, element] of Object.entries(elements)) {
            if (element) {
                const timeUnix = parseInt(element.getAttribute("data-original-value"));
                if (!isNaN(timeUnix)) {
                    element.textContent = formatTime(timeUnix, is24Hour);
                }
            }
        }
    };

    // Update current time display
    const updateCurrentTime = (is24Hour) => {
        const currentTimeElement = document.querySelector("[data-current-time]");
        if (currentTimeElement) {
            const currentTime = Math.floor(Date.now() / 1000);
            currentTimeElement.textContent = formatTime(currentTime, is24Hour);
        }
    };

    // Update hourly forecast times
    const updateHourlyForecast = (is24Hour) => {
        document.querySelectorAll("[data-forecast-time]").forEach(element => {
            const timeUnix = parseInt(element.getAttribute("data-original-value"));
            if (!isNaN(timeUnix)) {
                element.textContent = formatTime(timeUnix, is24Hour);
            }
        });
    };

    // Time formatting helper
    const formatTime = (timeUnix, is24Hour) => {
        const date = new Date(timeUnix * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');

        if (is24Hour) {
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        } else {
            const period = hours >= 12 ? "PM" : "AM";
            const displayHours = hours % 12 || 12;
            return `${displayHours}:${minutes} ${period}`;
        }
    };

    // Location services handling
    let locationTempSetting = localStorage.getItem("locationServices") === "true";
    
    locationToggle.addEventListener("change", async (event) => {
        locationTempSetting = event.target.checked;
        
        if (event.target.checked) {
            try {
                const permission = await new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(
                        () => resolve(true),
                        () => resolve(false),
                        { timeout: 5000 }
                    );
                });

                if (!permission) {
                    event.target.checked = false;
                    locationTempSetting = false;
                    alert("Please enable location access in your browser settings to use location services.");
                }
            } catch (error) {
                console.error("Error requesting location permission:", error);
                event.target.checked = false;
                locationTempSetting = false;
            }
        }
        
        localStorage.setItem("locationServices", locationTempSetting);
    });

    // Modal event listeners
    settingsBtn?.addEventListener("click", () => settingsModal.classList.add("active"));
    settingsClose?.addEventListener("click", () => settingsModal.classList.remove("active"));

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.remove("active");
        }
    });

    // Form submission handler
    settingsForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const settings = saveSettings();
        applySettings(settings);
        settingsModal.classList.remove("active");
    });

    // Save settings when any setting changes
    settingsForm?.addEventListener("change", (event) => {
        if (event.target.name !== "location") { // Don't auto-save location changes
            const settings = saveSettings();
            applySettings(settings);
        }
    });

    // Initialize
    loadSettings();
});
