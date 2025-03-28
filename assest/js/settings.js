document.addEventListener("DOMContentLoaded", () => {
    const settingsBtn = document.querySelector("[data-settings-btn]");
    const settingsModal = document.querySelector("[data-settings-modal]");
    const settingsClose = document.querySelector("[data-settings-close]");
    const settingsSave = document.querySelector("[data-settings-save]");
    const tempSelect = document.querySelector("[data-settings-temp]");
    const speedSelect = document.querySelector("[data-settings-speed]");
    const pressureSelect = document.querySelector("[data-settings-pressure]");
    const themeToggle = document.querySelector("[data-settings-theme]");
    const timeToggle = document.querySelector("[data-settings-time]");
    const locationToggle = document.querySelector("[data-settings-location]");
    const currentWeatherSection = document.querySelector("[data-current-weather]"); // Assuming you have this element
    const forecastSection = document.querySelector("[data-forecast-section]"); // Assuming you have this element
    const loading = document.querySelector(".loading"); // Assuming you have this element
    const container = document.querySelector(".container"); // Assuming you have this element

    let watchId = null; // Store the watch ID for stopping location tracking
    let lat, lon; // Store latitude and longitude globally

    // Function to open the settings modal
    const openSettingsModal = () => {
        settingsModal.classList.add("active");
    };

    // Function to close the settings modal
    const closeSettingsModal = () => {
        settingsModal.classList.remove("active");
    };

    // Function to save settings to local storage
    const saveSettings = () => {
        const settings = {
            temperature: tempSelect.value,
            windSpeed: speedSelect.value,
            pressure: pressureSelect.value,
            darkMode: themeToggle.checked,
            timeFormat: timeToggle.checked,
            locationServices: locationToggle.checked,
        };
        localStorage.setItem("weatherSettings", JSON.stringify(settings));
        applySettings(settings);
        closeSettingsModal();
    };

    // Function to load settings from local storage
    const loadSettings = () => {
        const storedSettings = JSON.parse(localStorage.getItem("weatherSettings"));
        if (storedSettings) {
            tempSelect.value = storedSettings.temperature;
            speedSelect.value = storedSettings.windSpeed;
            pressureSelect.value = storedSettings.pressure;
            themeToggle.checked = storedSettings.darkMode;
            timeToggle.checked = storedSettings.timeFormat;
            locationToggle.checked = storedSettings.locationServices;
            applySettings(storedSettings);
        }
    };

    // Function to apply settings
    const applySettings = (settings) => {
        document.documentElement.setAttribute("data-theme", settings.darkMode ? "dark" : "light");

        // Apply temperature setting
        const temperatureElements = document.querySelectorAll("[data-temperature]");
        temperatureElements.forEach(element => {
            const originalTemp = parseFloat(element.getAttribute("data-original-value"));
            let tempValue = originalTemp;

            if (settings.temperature === "fahrenheit") {
                tempValue = (originalTemp * 9 / 5) + 32;
                element.textContent = `${Math.round(tempValue)}°F`;
            } else if (settings.temperature === "kelvin") {
                tempValue = originalTemp + 273.15;
                element.textContent = `${Math.round(tempValue)}K`;
            } else {
                element.textContent = `${Math.round(originalTemp)}°C`;
            }
        });

        // Apply wind speed setting (Add your wind speed logic here)
        // Apply pressure setting (Add your pressure logic here)
        // Apply time format setting (Add your time format logic here)

        if (settings.locationServices) {
            console.log("Location services enabled");
            startLocationTracking();
        } else {
            console.log("Location services disabled");
            stopLocationTracking();
            useDefaultLocation();
        }
    };

    const startLocationTracking = () => {
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    lat = latitude;
                    lon = longitude;
                    console.log("Location updated:", latitude, longitude);
                    updateLocationUI(latitude, longitude);
                    fetchWeatherData(latitude, longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const stopLocationTracking = () => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
            console.log("Location tracking stopped");
            resetLocationUI();
            fetchWeatherData(41.1448, -83.6497); // Fetch default location weather
        }
    };

    const useDefaultLocation = () => {
        const defaultLat = 41.1448;
        const defaultLon = -83.6497;
        lat = defaultLat;
        lon = defaultLon;
        console.log("Using default location:", defaultLat, defaultLon);
        updateLocationUI(defaultLat, defaultLon);
        fetchWeatherData(defaultLat, defaultLon);
    };

    const updateLocationUI = (latitude, longitude) => {
        const locationElement = document.querySelector("[data-location]");
        if (locationElement) {
            fetchData(url.reverseGeo(latitude, longitude), ([{ name, country }]) => {
                locationElement.textContent = `${name}, ${country}`;
            });
        }
    };

    const resetLocationUI = () => {
        const locationElement = document.querySelector("[data-location]");
        if (locationElement) {
            locationElement.textContent = "Location services disabled";
        }
    };

    // Fetch Weather Data
    const fetchWeatherData = (latitude, longitude) => {
        // Your existing fetchData and URL logic here.
        // Replace with your actual API calls.
        // Example:
        fetchData(url.currentWeather(latitude, longitude), (currentWeather) => {
            // Your existing logic for current weather
            // Update currentWeatherSection
        });

        fetchData(url.forecast(latitude, longitude), (forecastData) => {
            // Your existing logic for 5 day forecast
            // Update forecastSection
        });
    };

    // Event listeners
    settingsBtn.addEventListener("click", openSettingsModal);
    settingsClose.addEventListener("click", closeSettingsModal);
    settingsSave.addEventListener("click", saveSettings);
    window.addEventListener("click", (event) => {
        if (event.target === settingsModal) {
            closeSettingsModal();
        }
    });

    // Initial load
    if (navigator.geolocation) {
        startLocationTracking();
    } else {
        useDefaultLocation();
    }
    loadSettings();
});
