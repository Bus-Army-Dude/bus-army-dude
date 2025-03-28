'use strict';
import { fetchData, url } from "./api.js";
import * as module from "./module.js";

// Global variables for settings
let geolocationAllowed = true;
let currentSettings = null;

// Load settings from localStorage
const loadStoredSettings = () => {
    const stored = localStorage.getItem("weatherSettings");
    if (stored) {
        currentSettings = JSON.parse(stored);
        geolocationAllowed = currentSettings.locationServices ?? true;
        return currentSettings;
    }
    return null;
};

// Save settings to localStorage
const saveSettings = (settings) => {
    localStorage.setItem("weatherSettings", JSON.stringify(settings));
    currentSettings = settings;
    geolocationAllowed = settings.locationServices;
    applySettings(settings);
};

// Initialize settings
document.addEventListener("DOMContentLoaded", () => {
    loadStoredSettings();
    initializeSettingsModal();
});

const initializeSettingsModal = () => {
    const settingsBtn = document.querySelector("[data-settings-btn]");
    const settingsModal = document.querySelector("[data-settings-modal]");
    const settingsClose = document.querySelector("[data-settings-close]");
    const saveBtn = document.querySelector("[data-settings-save]");
    
    // Settings controls
    const tempSelect = document.querySelector("[data-settings-temp]");
    const speedSelect = document.querySelector("[data-settings-speed]");
    const pressureSelect = document.querySelector("[data-settings-pressure]");
    const themeToggle = document.querySelector("[data-settings-theme]");
    const timeToggle = document.querySelector("[data-settings-time]");
    const locationToggle = document.querySelector("[data-settings-location]");
    
    // Load stored settings
    const settings = loadStoredSettings();
    if (settings) {
        tempSelect.value = settings.temperature;
        speedSelect.value = settings.windSpeed;
        pressureSelect.value = settings.pressure;
        themeToggle.checked = settings.darkMode;
        timeToggle.checked = settings.timeFormat;
        locationToggle.checked = settings.locationServices;
    }

    // Modal controls
    settingsBtn.addEventListener("click", () => {
        settingsModal.classList.add("active");
    });

    settingsClose.addEventListener("click", () => {
        settingsModal.classList.remove("active");
    });

    // Save settings
    saveBtn.addEventListener("click", () => {
        const newSettings = {
            temperature: tempSelect.value,
            windSpeed: speedSelect.value,
            pressure: pressureSelect.value,
            darkMode: themeToggle.checked,
            timeFormat: timeToggle.checked,
            locationServices: locationToggle.checked,
            lastCity: currentSettings?.lastCity || null,
            lastLat: currentSettings?.lastLat || null,
            lastLon: currentSettings?.lastLon || null
        };
        
        saveSettings(newSettings);
        settingsModal.classList.remove("active");
        
        // Refresh weather if coordinates exist
        if (newSettings.lastLat && newSettings.lastLon) {
            updateWeather(newSettings.lastLat, newSettings.lastLon);
        }
    });

    // Location services toggle
    locationToggle.addEventListener("change", (event) => {
        geolocationAllowed = event.target.checked;
        const locationBtn = document.querySelector("[data-current-location-btn]");
        
        if (!geolocationAllowed) {
            locationBtn.classList.add("disabled");
            locationBtn.setAttribute("disabled", "");
        } else {
            locationBtn.classList.remove("disabled");
            locationBtn.removeAttribute("disabled");
        }
    });
};

// Your existing functions
const addEventOnElements = (elements, eventType, callback) => {
    for (const element of elements)
        element.addEventListener(eventType, callback);
}

const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");
const toggleSearch = () => {
    searchView.classList.toggle("active");
}
addEventOnElements(searchTogglers, "click", toggleSearch);

// Search functionality
const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeOut = null;
const searchTimeOutDuration = 500;

searchField.addEventListener("input", () => {
    searchTimeOut ?? clearTimeout(searchTimeOut);
    if (!searchField.value) {
        searchResult.classList.remove("active");
        searchResult.innerHTML = "";
        searchField.classList.remove("searching");
    } else {
        searchField.classList.add("searching");
    }
    if (searchField.value) {
        searchTimeOut = setTimeout(() => {
            fetchData(url.geo(searchField.value), (locations) => {
                searchField.classList.remove("searching");
                searchResult.classList.add("active");
                searchResult.innerHTML = `
                    <ul class="view-list" data-search-list></ul>
                `;
                
                const items = [];
                for (const { name, lat, lon, country, state } of locations) {
                    const searchItem = document.createElement("li");
                    searchItem.classList.add("view-item");
                    searchItem.innerHTML = `
                        <span class="m-icon">location_on</span>
                        <div>
                            <p class="item-title">${name}</p>
                            <p class="label-2 item-subtitle">${state || ""} ${country}</p>
                        </div>
                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler></a>
                    `;
                    
                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler]"));

                    // Save city info when selected
                    searchItem.querySelector("[data-search-toggler]").addEventListener("click", () => {
                        if (currentSettings) {
                            currentSettings.lastCity = name;
                            currentSettings.lastLat = lat;
                            currentSettings.lastLon = lon;
                            saveSettings(currentSettings);
                        }
                    });
                }
                
                addEventOnElements(items, "click", () => {
                    toggleSearch();
                    searchResult.classList.remove("active");
                });
            });
        }, searchTimeOutDuration);
    }
});

// Weather update functionality
const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]");

export const updateWeather = (lat, lon) => {
    loading.style.display = "grid";
    container.classList.remove("fade-in");
    errorContent.style.display = "none";

    const currentWeatherSection = document.querySelector("[data-current-weather]");
    const highlightSection = document.querySelector("[data-highlights]");
    const hourlySection = document.querySelector("[data-hourly-forecast]");
    const forecastSection = document.querySelector("[data-5-day-forecast]");

    currentWeatherSection.innerHTML = "";
    highlightSection.innerHTML = "";
    hourlySection.innerHTML = "";
    forecastSection.innerHTML = "";

    if (window.location.hash === "#/current-location" && !geolocationAllowed) {
        const error = new Error("Location services are disabled in settings");
        error.code = "LOCATION_DISABLED";
        loading.style.display = "none";
        container.classList.add("fade-in");
        errorContent.style.display = "flex";
        errorContent.querySelector(".body-1").textContent = error.message;
        return;
    }

    if (window.location.hash === "#/current-location")
        currentLocationBtn.setAttribute("disabled", "");
    else
        currentLocationBtn.removeAttribute("disabled");

    // Continue with your existing weather fetching code...
    fetchData(url.currentWeather(lat, lon), (currentWeather) => {
        // Your existing weather data handling code...
        // Make sure to apply settings after loading weather data
        if (currentSettings) {
            applySettings(currentSettings);
        }
    });
};

// Apply settings to weather display
const applySettings = (settings) => {
    // Apply theme
    document.documentElement.setAttribute("data-theme", settings.darkMode ? "dark" : "light");

    // Apply temperature units
    document.querySelectorAll("[data-temperature]").forEach(element => {
        const originalTemp = parseFloat(element.getAttribute("data-original-value"));
        let displayTemp = originalTemp;
        let unit = "°C";

        switch (settings.temperature) {
            case "fahrenheit":
                displayTemp = (originalTemp * 9/5) + 32;
                unit = "°F";
                break;
            case "kelvin":
                displayTemp = originalTemp + 273.15;
                unit = "K";
                break;
        }
        element.textContent = `${Math.round(displayTemp)}${unit}`;
    });

    // Apply wind speed units
    document.querySelectorAll("[data-wind-speed]").forEach(element => {
        const originalSpeed = parseFloat(element.getAttribute("data-original-value"));
        let displaySpeed = originalSpeed;
        let unit = "m/s";

        switch (settings.windSpeed) {
            case "kph":
                displaySpeed = originalSpeed * 3.6;
                unit = "km/h";
                break;
            case "mph":
                displaySpeed = originalSpeed * 2.23694;
                unit = "mph";
                break;
            case "knots":
                displaySpeed = originalSpeed * 1.94384;
                unit = "knots";
                break;
            case "beaufort":
                displaySpeed = Math.min(Math.round(Math.pow(originalSpeed / 0.836, 2/3)), 12);
                unit = "Bft";
                break;
        }
        element.textContent = `${Math.round(displaySpeed)} ${unit}`;
    });

    // Apply pressure units
    document.querySelectorAll("[data-pressure]").forEach(element => {
        const originalPressure = parseFloat(element.getAttribute("data-original-value"));
        let displayPressure = originalPressure;
        let unit = "hPa";

        switch (settings.pressure) {
            case "inhg":
                displayPressure = originalPressure * 0.02953;
                unit = "inHg";
                break;
            case "mmhg":
                displayPressure = originalPressure * 0.75006;
                unit = "mmHg";
                break;
        }
        element.textContent = `${Math.round(displayPressure)} ${unit}`;
    });
};

export const error404 = () => {
    errorContent.style.display = "flex";
};

// Initialize last known location if available
document.addEventListener("DOMContentLoaded", () => {
    const settings = loadStoredSettings();
    if (settings?.lastLat && settings?.lastLon) {
        updateWeather(settings.lastLat, settings.lastLon);
    }
});

// Debug logging
console.log('Location Services Status:', geolocationAllowed);

// Test geolocation access
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log("Geolocation success:", position);
        },
        (error) => {
            console.log("Geolocation error:", error);
        }
    );
} else {
    console.log("Geolocation is not supported");
}
