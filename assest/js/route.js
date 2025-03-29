'use strict';

import { updateWeather, error404 } from './app.js';

const defaultLocation = '#/weather?lat=51.5073219&lon=-0.1276474';  // Default location (London)

// Load last known location from localStorage
const loadLastLocation = () => {
    const lastLocation = localStorage.getItem('lastKnownLocation');
    return lastLocation || defaultLocation;
};

// Save current location to localStorage
const saveLocation = (lat, lon) => {
    const locationString = `#/weather?lat=${lat}&lon=${lon}`;
    localStorage.setItem('lastKnownLocation', locationString);
};

// Function to get approximate location based on IP
const approximatelocation = async () => {
    try {
        let ipResponse = await fetch('https://api.ipify.org/?format=json');
        let ipData = await ipResponse.json();
        let ip = ipData.ip;

        let locationResponse = await fetch(`https://ipinfo.io/${ip}?token=c177813f87d9fa`);
        let locationData = await locationResponse.json();

        const [latitude, longitude] = locationData.loc.split(',');
        
        // Save and update weather with approximate location
        saveLocation(latitude, longitude);
        updateWeather(`lat=${latitude}`, `lon=${longitude}`);
    } catch (error) {
        console.error('Error fetching location data:', error);
        // Use last known location or default
        window.location.hash = loadLastLocation();
    }
};

// Function to get current location using geolocation
const currentLocation = () => {
    const settings = JSON.parse(localStorage.getItem("weatherSettings")) || { locationServices: true };
    
    if (!settings.locationServices) {
        // If location services are disabled, use last known location
        window.location.hash = loadLastLocation();
        return;
    }

    window.navigator.geolocation.getCurrentPosition(
        (res) => {
            const { latitude, longitude } = res.coords;
            saveLocation(latitude, longitude);
            updateWeather(`lat=${latitude}`, `lon=${longitude}`);
        },
        (err) => {
            console.error('Error fetching geolocation:', err);
            window.location.hash = loadLastLocation();
        }
    );
};

// Function to search for location based on the query
const searchedLocation = (query) => {
    const [lat, lon] = query.split('&');
    saveLocation(lat.split('=')[1], lon.split('=')[1]);
    updateWeather(...query.split('&'));
};

// Routes mapping
const routes = new Map([
    ['/current-location', currentLocation],
    ['/weather', searchedLocation],
    ['/approximatelocation', approximatelocation]
]);

// Function to check the current route and execute corresponding function
const checkHash = () => {
    const requestURL = window.location.hash.slice(1);
    const [route, query] = requestURL.includes('?') ? requestURL.split('?') : [requestURL];

    routes.has(route) ? routes.get(route)(query) : error404();
};

// Listen for changes to the hash in the URL
window.addEventListener('hashchange', checkHash);

// On page load, check the hash or use last known location
window.addEventListener('load', () => {
    if (!window.location.hash) {
        window.location.hash = loadLastLocation();
    } else {
        checkHash();
    }
});
