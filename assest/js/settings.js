'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // Get all the necessary elements
    const settingsBtn = document.querySelector("[data-settings-btn]");
    const settingsModal = document.querySelector("[data-settings-modal]");
    const settingsClose = document.querySelector("[data-settings-close]");
    const settingsForm = settingsModal?.querySelector("[data-settings-form]");
    const currentLocationBtn = document.querySelector("[data-current-location-btn]");
    const searchField = document.querySelector("[data-search-field]");

    // Temporary storage for unsaved changes
    let tempSettings = null;

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
        
        // Initialize form with saved settings
        if (settingsForm) {
            const tempUnit = settingsForm.querySelector("[name='temperature']");
            const windSpeedUnit = settingsForm.querySelector("[name='windSpeed']");
            const pressureUnit = settingsForm.querySelector("[name='pressure']");
            const timeFormat = settingsForm.querySelector("[name='timeFormat']");
            const locationToggle = settingsForm.querySelector("[name='location']");

            if (tempUnit) tempUnit.value = savedSettings.temperature;
            if (windSpeedUnit) windSpeedUnit.value = savedSettings.windSpeed;
            if (pressureUnit) pressureUnit.value = savedSettings.pressure;
            if (timeFormat) timeFormat.checked = savedSettings.timeFormat;
            if (locationToggle) locationToggle.checked = savedSettings.locationServices;
        }

        // Initialize temporary settings
        tempSettings = { ...savedSettings };
        
        // Apply current settings immediately
        applySettings(savedSettings, false);
        
        return savedSettings;
    };

    // Preview settings without saving
    const previewSettings = () => {
        if (!settingsForm) return;

        const formData = new FormData(settingsForm);
        tempSettings = {
            temperature: formData.get("temperature"),
            windSpeed: formData.get("windSpeed"),
            pressure: formData.get("pressure"),
            timeFormat: formData.get("timeFormat") === "on",
            locationServices: formData.get("location") === "on"
        };

        // Apply preview changes
        applySettings(tempSettings, true);
    };

    // Save settings to localStorage and apply them
    const saveSettings = () => {
        if (!tempSettings) return defaultSettings;

        // Save to localStorage
        localStorage.setItem("weatherSettings", JSON.stringify(tempSettings));
        
        // Force update location services state in localStorage
        localStorage.setItem("locationServicesEnabled", tempSettings.locationServices.toString());
        
        return tempSettings;
    };

    // Apply settings to the UI
    const applySettings = (settings, isPreview = false) => {
        // Remove any duplicate current conditions cards
        const currentConditionsCards = document.querySelectorAll(".current-weather");
        if (currentConditionsCards.length > 1) {
            for (let i = 1; i < currentConditionsCards.length; i++) {
                currentConditionsCards[i].remove();
            }
        }

        updateWeatherUnits(settings);
        updateTimeFormats(settings.timeFormat);
        
        if (!isPreview) {
            updateLocationServices(settings.locationServices);
        }
    };

    // Update location services
    const updateLocationServices = (enabled) => {
        if (currentLocationBtn) {
            if (!enabled) {
                currentLocationBtn.classList.add("disabled");
                currentLocationBtn.setAttribute("disabled", "");
                currentLocationBtn.style.pointerEvents = "none";
                currentLocationBtn.style.opacity = "0.5";
                // Store the disabled state
                localStorage.setItem("locationServicesEnabled", "false");
            } else {
                currentLocationBtn.classList.remove("disabled");
                currentLocationBtn.removeAttribute("disabled");
                currentLocationBtn.style.pointerEvents = "auto";
                currentLocationBtn.style.opacity = "1";
                // Store the enabled state
                localStorage.setItem("locationServicesEnabled", "true");
            }
        }
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

    // Conversion helpers remain the same...
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

    const convertWindSpeed = (mps, unit) => {
        switch (unit) {
            case "kmh":
                return [mps * 3.6, "km/h"];
            case "mph":
                return [mps * 2.237, "mph"];
            case "knots":
                return [mps * 1.944, "kn"];
            case "beaufort":
                return [Math.floor(Math.cbrt((mps / 0.836) ** 2)), "Bft"];
            default: // m/s
                return [mps, "m/s"];
        }
    };

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
        const updateTimeElement = (element) => {
            const timeUnix = parseInt(element.getAttribute("data-original-value"));
            if (!isNaN(timeUnix)) {
                element.textContent = formatTime(timeUnix, is24Hour);
            }
        };

        // Update all time displays
        document.querySelectorAll("[data-sunrise], [data-sunset], [data-forecast-time]").forEach(updateTimeElement);

        // Update current time if present
        const currentTimeElement = document.querySelector("[data-current-time]");
        if (currentTimeElement) {
            const currentTime = Math.floor(Date.now() / 1000);
            currentTimeElement.textContent = formatTime(currentTime, is24Hour);
        }
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

    // Event Listeners
    settingsForm?.addEventListener("change", () => {
        previewSettings(); // Only preview changes
    });

    settingsForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const settings = saveSettings(); // Save settings
        applySettings(settings, false); // Apply changes immediately
        settingsModal?.classList.remove("active");
    });

    settingsBtn?.addEventListener("click", () => {
        settingsModal?.classList.add("active");
        loadSettings();
    });

    settingsClose?.addEventListener("click", () => {
        settingsModal?.classList.remove("active");
        // Revert changes by reloading saved settings
        const savedSettings = JSON.parse(localStorage.getItem("weatherSettings")) || defaultSettings;
        applySettings(savedSettings, false);
    });

    window.addEventListener("click", (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.remove("active");
            // Revert changes when clicking outside
            const savedSettings = JSON.parse(localStorage.getItem("weatherSettings")) || defaultSettings;
            applySettings(savedSettings, false);
        }
    });

    // Handle page loads and navigation
    window.addEventListener("load", () => {
        const savedSettings = JSON.parse(localStorage.getItem("weatherSettings")) || defaultSettings;
        applySettings(savedSettings, false);
    });

    // Current Location button handling
    currentLocationBtn?.addEventListener("click", () => {
        // Check if location services are enabled in settings
        const settings = JSON.parse(localStorage.getItem("weatherSettings")) || defaultSettings;
        if (!settings.locationServices) {
            alert("Location services are disabled in settings. Please enable them to use this feature.");
            return;
        }

        currentLocationBtn.classList.add("disabled");
        currentLocationBtn.setAttribute("disabled", "");
        currentLocationBtn.style.pointerEvents = "none";
        currentLocationBtn.style.opacity = "0.5";

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                localStorage.setItem('userLatitude', latitude);
                localStorage.setItem('userLongitude', longitude);
                window.location.hash = `#/weather?lat=${latitude}&lon=${longitude}`;
                
                if (settings.locationServices) {
                    currentLocationBtn.classList.remove("disabled");
                    currentLocationBtn.removeAttribute("disabled");
                    currentLocationBtn.style.pointerEvents = "auto";
                    currentLocationBtn.style.opacity = "1";
                }
            },
            () => {
                alert("Could not retrieve your current location. Please ensure location services are enabled and try again.");
                if (settings.locationServices) {
                    currentLocationBtn.classList.remove("disabled");
                    currentLocationBtn.removeAttribute("disabled");
                    currentLocationBtn.style.pointerEvents = "auto";
                    currentLocationBtn.style.opacity = "1";
                }
            }
        );
    });

    // Initialize settings
    loadSettings();

    // Prevent duplicate cards on page load
    document.addEventListener("DOMContentLoaded", () => {
        const currentConditionsCards = document.querySelectorAll(".current-weather");
        if (currentConditionsCards.length > 1) {
            for (let i = 1; i < currentConditionsCards.length; i++) {
                currentConditionsCards[i].remove();
            }
        }
    });
});
