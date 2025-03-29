'use strict';

import { updateWeather, error404 } from './app.js';

const defaultLocation = '#/weather?lat=51.5073219&lon=-0.1276474';  // Default location for London

// Function to get approximate location based on IP
const approximatelocation = async () => {
  // First check if location services are enabled in settings
  const settings = JSON.parse(localStorage.getItem("weatherSettings"));
  if (settings && !settings.locationServices) {
    console.log("Location services disabled in settings");
    window.location.hash = defaultLocation;
    return;
  }

  try {
    let ipResponse = await fetch('https://api.ipify.org/?format=json');
    let ipData = await ipResponse.json();
    let ip = ipData.ip;

    let locationResponse = await fetch(`https://ipinfo.io/${ip}?token=c177813f87d9fa`);
    let locationData = await locationResponse.json();

    const [latitude, longitude] = locationData.loc.split(',');
    updateWeather(`lat=${latitude}`, `lon=${longitude}`);
    window.location.hash = '#/approximatelocation';
  } catch (error) {
    console.error('Error fetching location data:', error);
    window.location.hash = defaultLocation;
  }
};

// Function to get current location using geolocation
const currentLocation = () => {
  // Check if location services are enabled in settings
  const settings = JSON.parse(localStorage.getItem("weatherSettings"));
  if (settings && !settings.locationServices) {
    console.log("Location services disabled in settings");
    window.location.hash = defaultLocation;
    return;
  }

  window.navigator.geolocation.getCurrentPosition(
    (res) => {
      const { latitude, longitude } = res.coords;
      updateWeather(`lat=${latitude}`, `lon=${longitude}`);
    },
    (err) => {
      console.error('Error fetching geolocation:', err);
      window.location.hash = '#/approximatelocation';
    }
  );
};

// Function to search for location based on the query (handle both city names and postal codes)
const searchedLocation = (query) => {
  // Check if the query is a postal code (e.g., 43402)
  const isPostalCode = /^\d{5}(-\d{4})?$/.test(query); // US ZIP Code regex
  
  if (isPostalCode) {
    // If it's a postal code, add the country code (e.g., US or CA)
    updateWeather(`zip=${query},us`); // Modify country code as needed
  } else {
    // Otherwise, treat the query as a city name
    updateWeather(`q=${query}`);
  }
};

// Routes mapping
const routes = new Map([
  ['/current-location', currentLocation],    // Route for current location
  ['/weather', searchedLocation],            // Route for searched location (handles both cities and postal codes)
  ['/approximatelocation', approximatelocation] // Route for approximate location
]);

// Function to check the current route and execute corresponding function
const checkHash = () => {
  const requestURL = window.location.hash.slice(1); // Strip the '#' character

  // Split route and query, if query exists
  const [route, query] = requestURL.includes('?') ? requestURL.split('?') : [requestURL];

  // Execute corresponding route function if it exists, else show 404
  if (routes.has(route)) {
    routes.get(route)(query);
  } else {
    error404(); // Handle 404 if route doesn't exist
  }
};

// Listen for changes to the hash in the URL
window.addEventListener('hashchange', checkHash);

// On page load, check the hash or default to current location
window.addEventListener('load', () => {
  if (!window.location.hash) {
    window.location.hash = '#/current-location'; // Default to current location
  } else {
    checkHash();
  }
});
