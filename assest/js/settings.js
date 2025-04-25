'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // Get all necessary elements
    const settingsBtn = document.querySelector("[data-settings-btn]");
    const settingsModal = document.querySelector("[data-settings-modal]");
    const settingsClose = document.querySelector("[data-settings-close]");
    const settingsForm = settingsModal?.querySelector("[data-settings-form]");
    const currentLocationBtn = document.querySelector("[data-current-location-btn]");

    // Storage for current settings
    let currentSettings = null;

    // Default settings
    const defaultSettings = {
        temperature: "celsius",
        windSpeed: "kmh",
        pressure: "hpa",
        timeFormat: false, // false = 12-hour, true = 24-hour
        locationServices: true,
        darkMode: localStorage.getItem('darkMode') === 'enabled' // Load initial dark mode state
    };

    // --- CORRECTED FUNCTION ---
    // Function to update theme attribute based on setting
    function updateTheme(isDark) {
        // Set the data-theme attribute on the root element (<html>)
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

        // Store the preference in localStorage for persistence
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');

        // *** REMOVED style.setProperty calls ***
        // The CSS file will now handle changing variables based on the [data-theme] attribute
    }
    // --- END OF CORRECTION ---

    // Load settings from localStorage
    const loadSettings = () => {
        // Combine stored settings with defaults in case new settings were added
        const storedSettings = JSON.parse(localStorage.getItem("weatherSettings"));
        currentSettings = { ...defaultSettings, ...storedSettings };

        // Handle dark mode specifically from its own storage item if needed
        currentSettings.darkMode = localStorage.getItem('darkMode') === 'enabled';

        // Initialize form with current settings
        if (settingsForm) {
            const tempUnit = settingsForm.querySelector("[name='temperature']");
            const windSpeedUnit = settingsForm.querySelector("[name='windSpeed']");
            const pressureUnit = settingsForm.querySelector("[name='pressure']");
            const timeFormat = settingsForm.querySelector("[name='timeFormat']");
            const locationToggle = settingsForm.querySelector("[name='location']");
            const darkModeToggleInput = settingsForm.querySelector("[name='darkMode']");

            if (tempUnit) tempUnit.value = currentSettings.temperature;
            if (windSpeedUnit) windSpeedUnit.value = currentSettings.windSpeed;
            if (pressureUnit) pressureUnit.value = currentSettings.pressure;
            if (timeFormat) timeFormat.checked = currentSettings.timeFormat;
            if (locationToggle) locationToggle.checked = currentSettings.locationServices;
            if (darkModeToggleInput) darkModeToggleInput.checked = currentSettings.darkMode;
        }

        // Apply current settings (including the theme)
        applySettings(currentSettings);

        return currentSettings;
    };

    // Apply settings immediately
    const applySettings = (settings) => {
        if (!settings) return;

        // Update all time displays with new format
        updateTimeDisplays(settings.timeFormat);

        // Update weather units
        updateWeatherUnits(settings);

        // Update location services UI
        updateLocationServicesUI(settings.locationServices);

        // Update dark mode theme attribute
        updateTheme(settings.darkMode);
    };

    // Update time displays across the app
    const updateTimeDisplays = (is24Hour) => {
        const formatTime = (date) => {
            // Ensure date is valid
            if (!(date instanceof Date) || isNaN(date)) {
                 console.error("Invalid date provided to formatTime:", date);
                 return "N/A"; // Or some placeholder
            }
            const hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');

            if (is24Hour) {
                return `${hours.toString().padStart(2, '0')}:${minutes}`;
            } else {
                const period = hours >= 12 ? "PM" : "AM";
                const displayHours = hours % 12 || 12; // Convert 0 hour to 12 for 12-hour format
                return `${displayHours}:${minutes} ${period}`;
            }
        };

        // Helper to update a single time element
        const updateElementTime = (element, attributeName) => {
            const timeUnix = parseInt(element.getAttribute(attributeName));
             if (!isNaN(timeUnix)) {
                 const date = new Date(timeUnix * 1000);
                 element.textContent = formatTime(date);
             } else {
                // Keep original text if attribute is missing or invalid
                console.warn(`Missing or invalid time attribute '${attributeName}' for element:`, element);
             }
        };

        // Update all time elements - Added checks for attributes
        document.querySelectorAll("[data-time]").forEach(element => {
            if(element.hasAttribute("data-original-value")) {
                updateElementTime(element, "data-original-value");
            } else if(element.hasAttribute("data-time")) { // Fallback to data-time if needed
                 updateElementTime(element, "data-time");
            }
        });
        document.querySelectorAll("[data-sunrise]").forEach(element => updateElementTime(element, "data-sunrise"));
        document.querySelectorAll("[data-sunset]").forEach(element => updateElementTime(element, "data-sunset"));
        document.querySelectorAll("[data-forecast-time]").forEach(element => updateElementTime(element, "data-forecast-time"));


        // Update current time if present - More robust update
        const currentTimeElement = document.querySelector("[data-current-time]");
        if (currentTimeElement) {
             // Store initial value if not already stored
             if (!currentTimeElement.hasAttribute('data-current-time-init')) {
                 currentTimeElement.setAttribute('data-current-time-init', 'true');
                 // Potentially store a reference time if needed, otherwise just format current time
             }
             currentTimeElement.textContent = formatTime(new Date()); // Update every second later
        }
    };

    // Update weather units display
    const updateWeatherUnits = (settings) => {
        // Temperature conversion
        document.querySelectorAll("[data-temperature]").forEach(element => {
            const valueCelsius = parseFloat(element.getAttribute("data-original-value-celsius")); // Assuming original is always Celsius
            if (!isNaN(valueCelsius)) {
                const converted = convertTemperature(valueCelsius, settings.temperature);
                element.textContent = `${Math.round(converted.value)}${converted.unit}`;
            } else {
                 console.warn("Missing or invalid data-original-value-celsius for element:", element);
            }
        });

        // Wind speed conversion
        document.querySelectorAll("[data-wind-speed]").forEach(element => {
            const valueMps = parseFloat(element.getAttribute("data-original-value-mps")); // Assuming original is m/s
            if (!isNaN(valueMps)) {
                const converted = convertWindSpeed(valueMps, settings.windSpeed);
                 // Handle Beaufort formatting separately if needed
                if (converted.unit === "Bft") {
                     element.textContent = `${converted.value} ${converted.unit}`; // No rounding needed
                 } else {
                    element.textContent = `${Math.round(converted.value)} ${converted.unit}`;
                 }
            } else {
                 console.warn("Missing or invalid data-original-value-mps for element:", element);
            }
        });

        // Pressure conversion
        document.querySelectorAll("[data-pressure]").forEach(element => {
            const valueHpa = parseFloat(element.getAttribute("data-original-value-hpa")); // Assuming original is hPa
            if (!isNaN(valueHpa)) {
                const converted = convertPressure(valueHpa, settings.pressure);
                // Decide on rounding precision for pressure (e.g., 1 decimal for inHg)
                const roundedValue = (converted.unit === "inHg") ? converted.value.toFixed(2) : Math.round(converted.value);
                element.textContent = `${roundedValue} ${converted.unit}`;
            } else {
                 console.warn("Missing or invalid data-original-value-hpa for element:", element);
            }
        });
    };

    // Update location services UI elements
    const updateLocationServicesUI = (enabled) => {
        if (currentLocationBtn) {
            currentLocationBtn.disabled = !enabled;
            currentLocationBtn.style.pointerEvents = enabled ? "auto" : "none";
            currentLocationBtn.style.opacity = enabled ? "1" : "0.5";
            // No need to manage localStorage here, form submit handles overall settings save
        }
    };

    // Conversion helpers (Keep these as they are)
    const convertTemperature = (celsius, unit) => { /* ... existing code ... */
        switch (unit) {
            case "fahrenheit": return { value: (celsius * 9 / 5) + 32, unit: "°F" };
            case "kelvin": return { value: celsius + 273.15, unit: "K" };
            default: return { value: celsius, unit: "°C" };
        }
    };
    const convertWindSpeed = (mps, unit) => { /* ... existing code ... */
        switch (unit) {
            case "kmh": return { value: mps * 3.6, unit: "km/h" };
            case "mph": return { value: mps * 2.237, unit: "mph" };
            case "knots": return { value: mps * 1.944, unit: "kts" };
            case "beaufort": return { value: Math.min(Math.max(Math.ceil(Math.pow(mps / 0.836, 2 / 3)), 0), 12), unit: "Bft" };
            default: return { value: mps, unit: "m/s" };
        }
    };
    const convertPressure = (hpa, unit) => { /* ... existing code ... */
         switch (unit) {
            case "inhg": return { value: hpa * 0.02953, unit: "inHg" };
            case "mmhg": return { value: hpa * 0.75006, unit: "mmHg" };
            case "kpa": return { value: hpa / 10, unit: "kPa" };
            case "mbar": return { value: hpa, unit: "mbar" }; // mbar is often same as hPa
            default: return { value: hpa, unit: "hPa" };
        }
    };

    // Event Listeners
    settingsForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        // Get form data
        const formData = new FormData(settingsForm);
        const newSettings = {
            temperature: formData.get("temperature"),
            windSpeed: formData.get("windSpeed"),
            pressure: formData.get("pressure"),
            timeFormat: formData.get("timeFormat") === "on",
            locationServices: formData.get("location") === "on",
            darkMode: formData.get("darkMode") === "on" // Get dark mode from form
        };

        // Save combined settings to localStorage
        // Note: darkMode preference is also saved separately by updateTheme
        localStorage.setItem("weatherSettings", JSON.stringify(newSettings));

        // Update current settings in memory
        currentSettings = newSettings;

        // Apply new settings immediately
        applySettings(newSettings);

        // Close modal
        settingsModal?.classList.remove("active");
    });

    settingsBtn?.addEventListener("click", () => {
        settingsModal?.classList.add("active");
        loadSettings(); // Load current settings into form when opened
    });

    settingsClose?.addEventListener("click", () => {
        settingsModal?.classList.remove("active");
    });

    // Close modal on outside click
    window.addEventListener("click", (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.remove("active");
        }
    });

    // Current Location button handling
    currentLocationBtn?.addEventListener("click", () => {
        // Ensure settings are loaded
        const settings = currentSettings || loadSettings();

        // Check if location services are enabled in settings
        if (!settings.locationServices) {
            alert("Location services are disabled in settings. Please enable them to use this feature.");
            return; // Stop if disabled
        }

        // Disable button while processing
        currentLocationBtn.disabled = true;
        currentLocationBtn.style.pointerEvents = "none";
        currentLocationBtn.style.opacity = "0.5";

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                // Maybe save coords to localStorage if needed elsewhere?
                // localStorage.setItem('userLatitude', latitude);
                // localStorage.setItem('userLongitude', longitude);

                // Trigger navigation/update based on new coords
                window.location.hash = `#/weather?lat=${latitude}&lon=${longitude}`;
                // If your app uses routing, trigger the update here instead of hash change

                // Re-enable button only if location services are still enabled
                if (currentSettings.locationServices) { // Check current setting again
                     currentLocationBtn.disabled = false;
                     currentLocationBtn.style.pointerEvents = "auto";
                     currentLocationBtn.style.opacity = "1";
                }
            },
            error => { // Handle geolocation error
                console.error("Geolocation error:", error);
                alert("Could not retrieve your current location. Please ensure location services are enabled in your browser/OS and try again.");
                // Re-enable button only if location services are still enabled
                 if (currentSettings.locationServices) { // Check current setting again
                     currentLocationBtn.disabled = false;
                     currentLocationBtn.style.pointerEvents = "auto";
                     currentLocationBtn.style.opacity = "1";
                 }
            }
        );
    });

    // Initialize settings on page load
    loadSettings();

    // --- Continuous Time Update ---
    let timeUpdateInterval = null;
    const startClock = () => {
        if (timeUpdateInterval) clearInterval(timeUpdateInterval); // Clear previous interval

        const updateClock = () => {
            const currentTimeElement = document.querySelector("[data-current-time]");
            if (currentTimeElement && currentSettings) { // Ensure settings are loaded
                 const formatTime = (date) => { // Re-declare or access formatTime
                     const is24Hour = currentSettings.timeFormat;
                     const hours = date.getHours();
                     const minutes = date.getMinutes().toString().padStart(2, '0');
                     if (is24Hour) return `${hours.toString().padStart(2, '0')}:${minutes}`;
                     else {
                         const period = hours >= 12 ? "PM" : "AM";
                         const displayHours = hours % 12 || 12;
                         return `${displayHours}:${minutes} ${period}`;
                     }
                 };
                 currentTimeElement.textContent = formatTime(new Date());
            }
        };
        updateClock(); // Update immediately
        timeUpdateInterval = setInterval(updateClock, 1000); // Update every second
    };
    // Start the clock after initial load
     startClock();

     // Re-start clock potentially needed if timeFormat changes drastically
     // Or ensure applySettings calls updateTimeDisplays which handles the format


});
