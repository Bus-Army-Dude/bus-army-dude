'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // Get all the necessary elements
    const settingsBtn = document.querySelector("[data-settings-btn]");
    const settingsModal = document.querySelector("[data-settings-modal]");
    const settingsClose = document.querySelector("[data-settings-close]");
    const settingsForm = settingsModal?.querySelector("[data-settings-form]");
    const currentLocationBtn = document.querySelector("[data-current-location-btn]");
    const searchField = document.querySelector("[data-search-field]"); // Get the search input field

    // Settings controls (form inputs)
    const tempUnit = settingsForm?.querySelector("[name='temperature']");
    const windSpeedUnit = settingsForm?.querySelector("[name='windSpeed']");
    const pressureUnit = settingsForm?.querySelector("[name='pressure']");
    const timeFormat = settingsForm?.querySelector("[name='timeFormat']");
    const locationToggle = settingsForm?.querySelector("[name='location']");

    // Default settings
    const defaultSettings = {
        temperature: "celsius",
        windSpeed: "kmh",
        pressure: "hpa",
        timeFormat: false,
        locationServices: true
    };

    // Load settings from localStorage
    const loadSettings = () => {
        const savedSettings = JSON.parse(localStorage.getItem("weatherSettings")) || defaultSettings;

        settingsForm?.querySelectorAll("[name='temperature']").forEach(input => {
            input.checked = input.value === savedSettings.temperature;
        });

        settingsForm?.querySelectorAll("[name='windSpeed']").forEach(input => {
            input.checked = input.value === savedSettings.windSpeed;
        });

        settingsForm?.querySelectorAll("[name='pressure']").forEach(input => {
            input.checked = input.value === savedSettings.pressure;
        });

        if (settingsForm?.querySelector("[name='timeFormat']")) {
            settingsForm.querySelector("[name='timeFormat']").checked = savedSettings.timeFormat;
        }
        if (settingsForm?.querySelector("[name='location']")) {
            settingsForm.querySelector("[name='location']").checked = savedSettings.locationServices;
        }

        applySettings(savedSettings);
    };

    // Save settings to localStorage
    const saveSettings = () => {
        if (!settingsForm) return defaultSettings;

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
        if (currentLocationBtn) {
            if (!settings.locationServices) {
                currentLocationBtn.classList.add("disabled");
                currentLocationBtn.setAttribute("disabled", "");
                currentLocationBtn.style.pointerEvents = "none"; // Prevent clicking
                currentLocationBtn.style.opacity = "0.5"; // Visually gray out
            } else {
                currentLocationBtn.classList.remove("disabled");
                currentLocationBtn.removeAttribute("disabled");
                currentLocationBtn.style.pointerEvents = "auto"; // Allow clicking
                currentLocationBtn.style.opacity = "1";
            }
        }

        updateWeatherUnits(settings);
        updateTimeFormats(settings.timeFormat);
    };

    // Update weather units display
    const updateWeatherUnits = (settings) => {
        document.querySelectorAll("[data-temperature]").forEach(element => {
            const value = parseFloat(element.getAttribute("data-original-value"));
            if (!isNaN(value)) {
                const [convertedValue, unit] = convertTemperature(value, settings.temperature);
                element.textContent = `${Math.round(convertedValue)}${unit}`;
            }
        });

        document.querySelectorAll("[data-wind-speed]").forEach(element => {
            const value = parseFloat(element.getAttribute("data-original-value"));
            if (!isNaN(value)) {
                const [convertedValue, unit] = convertWindSpeed(value, settings.windSpeed);
                element.textContent = `${Math.round(convertedValue)} ${unit}`;
            }
        });

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
                return [mps * 3.6, "(km/h)"]; // Corrected unit
            case "mph":
                return [mps * 2.237, "mph"];
            case "knots":
                return [mps * 1.944, "kn"];
            case "bft":
                return [Math.floor(Math.cbrt((mps / 0.836) ** 2)), "(bft)"]; // Corrected unit
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

    // Location services handling with override
    locationToggle?.addEventListener("change", async (event) => {
        // No immediate save or apply here
    });

    // Modal event listeners
    settingsBtn?.addEventListener("click", () => {
        settingsModal?.classList.add("active");
        loadSettings();
    });

    settingsClose?.addEventListener("click", () => {
        settingsModal?.classList.remove("active");
    });

    window.addEventListener("click", (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.remove("active");
        }
    });

    settingsForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const settings = saveSettings();
        applySettings(settings);
        settingsModal?.classList.remove("active");
    });

    settingsForm?.addEventListener("change", (event) => {
        // Only save and apply location settings immediately
        if (event.target.name === "location") {
            return; // Do not save or apply immediately for location
        } else {
            const settings = saveSettings();
            applySettings(settings);
        }
    });

    // Handle "Current Location" button click
    currentLocationBtn?.addEventListener("click", () => {
        // Disable the button temporarily
        currentLocationBtn.classList.add("disabled");
        currentLocationBtn.setAttribute("disabled", "");
        currentLocationBtn.style.pointerEvents = "none";
        currentLocationBtn.style.opacity = "0.5";

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                window.location.hash = `#/weather?lat=${latitude}&lon=${longitude}`;
                // Re-enable the button after successfully fetching location
                currentLocationBtn.classList.remove("disabled");
                currentLocationBtn.removeAttribute("disabled");
                currentLocationBtn.style.pointerEvents = "auto";
                currentLocationBtn.style.opacity = "1";
            },
            () => {
                alert("Could not retrieve your current location. Please ensure location services are enabled and try again.");
                // Re-enable the button even if fetching fails
                currentLocationBtn.classList.remove("disabled");
                currentLocationBtn.removeAttribute("disabled");
                currentLocationBtn.style.pointerEvents = "auto";
                currentLocationBtn.style.opacity = "1";
            }
        );
    });

    // Re-enable Current Location button when a new city is searched
    searchField?.addEventListener("focus", () => {
        const savedSettings = JSON.parse(localStorage.getItem("weatherSettings")) || defaultSettings;
        if (savedSettings.locationServices && currentLocationBtn?.classList.contains("disabled")) {
            currentLocationBtn.classList.remove("disabled");
            currentLocationBtn.removeAttribute("disabled");
            currentLocationBtn.style.pointerEvents = "auto";
            currentLocationBtn.style.opacity = "1";
        }
    });

    // Initialize settings
    loadSettings();
});
