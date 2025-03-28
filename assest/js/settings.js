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
    const distanceSelect = document.querySelector("[data-settings-distance]"); // Add this line
    const themeToggle = document.querySelector("[data-settings-theme]");
    const timeToggle = document.querySelector("[data-settings-time]");
    const locationToggle = document.querySelector("[data-settings-location]");
    
    // Default settings
    const defaultSettings = {
        temperature: "celsius",
        windSpeed: "ms",
        pressure: "hpa",
        distance: "km", // Add this line
        darkMode: true,
        timeFormat: false,
        locationServices: true
    };

    // Load settings from localStorage
    const loadSettings = () => {
        const savedSettings = JSON.parse(localStorage.getItem("weatherSettings")) || defaultSettings;
        
        // Apply saved settings to controls
        tempSelect.value = savedSettings.temperature;
        speedSelect.value = savedSettings.windSpeed;
        pressureSelect.value = savedSettings.pressure;
        distanceSelect.value = savedSettings.distance; // Add this line
        themeToggle.checked = savedSettings.darkMode;
        timeToggle.checked = savedSettings.timeFormat;
        locationToggle.checked = savedSettings.locationServices;
        
        // Apply settings immediately
        applySettings(savedSettings);
    };

    // Save settings to localStorage
    const saveSettings = () => {
        const settings = {
            temperature: tempSelect.value,
            windSpeed: speedSelect.value,
            pressure: pressureSelect.value,
            distance: distanceSelect.value, // Add this line
            darkMode: themeToggle.checked,
            timeFormat: timeToggle.checked,
            locationServices: locationToggle.checked
        };
        
        localStorage.setItem("weatherSettings", JSON.stringify(settings));
        applySettings(settings);
    };

    // Apply settings to the UI
    const applySettings = (settings) => {
        // Apply theme
        document.documentElement.setAttribute("data-theme", settings.darkMode ? "dark" : "light");
        
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
    };

    // Update all unit displays
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
                    unit = "mmHg";
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

    // Location toggle specific handling
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

    // Load settings on page load
    loadSettings();
});
