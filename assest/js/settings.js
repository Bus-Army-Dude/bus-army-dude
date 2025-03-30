'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // Get all necessary elements
    const settingsBtn = document.querySelector("[data-settings-btn]");
    const settingsModal = document.querySelector("[data-settings-modal]");
    const settingsClose = document.querySelector("[data-settings-close]");
    const settingsForm = settingsModal?.querySelector("[data-settings-form]");
    const currentLocationBtn = document.querySelector("[data-current-location-btn]");

    // Storage for current and temporary settings
    let currentSettings = null;
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
        currentSettings = JSON.parse(localStorage.getItem("weatherSettings")) || defaultSettings;
        
        // Initialize form with current settings
        if (settingsForm) {
            const tempUnit = settingsForm.querySelector("[name='temperature']");
            const windSpeedUnit = settingsForm.querySelector("[name='windSpeed']");
            const pressureUnit = settingsForm.querySelector("[name='pressure']");
            const timeFormat = settingsForm.querySelector("[name='timeFormat']");
            const locationToggle = settingsForm.querySelector("[name='location']");

            if (tempUnit) tempUnit.value = currentSettings.temperature;
            if (windSpeedUnit) windSpeedUnit.value = currentSettings.windSpeed;
            if (pressureUnit) pressureUnit.value = currentSettings.pressure;
            if (timeFormat) timeFormat.checked = currentSettings.timeFormat;
            if (locationToggle) locationToggle.checked = currentSettings.locationServices;
        }

        // Initialize temporary settings
        tempSettings = { ...currentSettings };
        
        // Apply current settings
        applySettings(currentSettings);
        
        return currentSettings;
    };

    // Store form values without applying them
    const storeFormValues = () => {
        if (!settingsForm) return;

        const formData = new FormData(settingsForm);
        tempSettings = {
            temperature: formData.get("temperature"),
            windSpeed: formData.get("windSpeed"),
            pressure: formData.get("pressure"),
            timeFormat: formData.get("timeFormat") === "on",
            locationServices: formData.get("location") === "on"
        };
    };

    // Apply settings
    const applySettings = (settings) => {
        if (!settings) return;

        updateWeatherUnits(settings);
        updateTimeDisplay(settings.timeFormat);
        updateLocationServices(settings.locationServices);
    };

    // Update weather units display
    const updateWeatherUnits = (settings) => {
        // Temperature conversion
        document.querySelectorAll("[data-temperature]").forEach(element => {
            const value = parseFloat(element.getAttribute("data-original-value"));
            if (!isNaN(value)) {
                const converted = convertTemperature(value, settings.temperature);
                element.textContent = `${Math.round(converted.value)}${converted.unit}`;
            }
        });

        // Wind speed conversion
        document.querySelectorAll("[data-wind-speed]").forEach(element => {
            const value = parseFloat(element.getAttribute("data-original-value"));
            if (!isNaN(value)) {
                const converted = convertWindSpeed(value, settings.windSpeed);
                element.textContent = `${Math.round(converted.value)} ${converted.unit}`;
            }
        });

        // Pressure conversion
        document.querySelectorAll("[data-pressure]").forEach(element => {
            const value = parseFloat(element.getAttribute("data-original-value"));
            if (!isNaN(value)) {
                const converted = convertPressure(value, settings.pressure);
                element.textContent = `${Math.round(converted.value)} ${converted.unit}`;
            }
        });
    };

    // Update time display format
    const updateTimeDisplay = (is24Hour) => {
        const formatTime = (date) => {
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

        // Update all time elements
        document.querySelectorAll("[data-time], [data-sunrise], [data-sunset], [data-forecast-time]").forEach(element => {
            const timeUnix = parseInt(element.getAttribute("data-original-value"));
            if (!isNaN(timeUnix)) {
                const date = new Date(timeUnix * 1000);
                element.textContent = formatTime(date);
            }
        });

        // Update current time if present
        const currentTimeElement = document.querySelector("[data-current-time]");
        if (currentTimeElement) {
            currentTimeElement.textContent = formatTime(new Date());
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
                localStorage.setItem("locationServicesEnabled", "false");
            } else {
                currentLocationBtn.classList.remove("disabled");
                currentLocationBtn.removeAttribute("disabled");
                currentLocationBtn.style.pointerEvents = "auto";
                currentLocationBtn.style.opacity = "1";
                localStorage.setItem("locationServicesEnabled", "true");
            }
        }
    };

    // Conversion helpers
    const convertTemperature = (celsius, unit) => {
        switch (unit) {
            case "fahrenheit":
                return { value: (celsius * 9/5) + 32, unit: "°F" };
            case "kelvin":
                return { value: celsius + 273.15, unit: "K" };
            default:
                return { value: celsius, unit: "°C" };
        }
    };

    const convertWindSpeed = (mps, unit) => {
        switch (unit) {
            case "kmh":
                return { value: mps * 3.6, unit: "km/h" };
            case "mph":
                return { value: mps * 2.237, unit: "mph" };
            case "knots":
                return { value: mps * 1.944, unit: "kts" };
            case "beaufort":
                return {
                    value: Math.min(Math.max(Math.ceil(Math.pow(mps / 0.836, 2/3)), 0), 12),
                    unit: "Bft"
                };
            default:
                return { value: mps, unit: "m/s" };
        }
    };

    const convertPressure = (hpa, unit) => {
        switch (unit) {
            case "inhg":
                return { value: hpa * 0.02953, unit: "inHg" };
            case "mmhg":
                return { value: hpa * 0.75006, unit: "mmHg" };
            case "kpa":
                return { value: hpa / 10, unit: "kPa" };
            case "mbar":
                return { value: hpa, unit: "mbar" };
            default:
                return { value: hpa, unit: "hPa" };
        }
    };

    // Event Listeners
    settingsForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(settingsForm);
        const newSettings = {
            temperature: formData.get("temperature"),
            windSpeed: formData.get("windSpeed"),
            pressure: formData.get("pressure"),
            timeFormat: formData.get("timeFormat") === "on",
            locationServices: formData.get("location") === "on"
        };

        // Save and apply immediately
        localStorage.setItem("weatherSettings", JSON.stringify(newSettings));
        currentSettings = newSettings;
        applySettings(newSettings);
        
        settingsModal?.classList.remove("active");
    });

    settingsBtn?.addEventListener("click", () => {
        settingsModal?.classList.add("active");
        loadSettings();
    });

    settingsClose?.addEventListener("click", () => {
        settingsModal?.classList.remove("active");
        // Revert any changes
        applySettings(currentSettings);
    });

    window.addEventListener("click", (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.remove("active");
            // Revert any changes
            applySettings(currentSettings);
        }
    });

    // Current Location button handling
    currentLocationBtn?.addEventListener("click", () => {
        const settings = currentSettings || loadSettings();
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

    // Update time display every second
    setInterval(() => {
        if (currentSettings?.timeFormat !== undefined) {
            updateTimeDisplay(currentSettings.timeFormat);
        }
    }, 1000);
});
