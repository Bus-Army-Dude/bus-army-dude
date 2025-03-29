'use strict';

import { updateWeather, error404 } from './app.js';

const defaultLocation = '#/weather?lat=51.5073219&lon=-0.1276474';  // Default location for London

// Function to get approximate location based on IP
const approximatelocation = async () => {
  try {
    let ipResponse = await fetch('https://api.ipify.org/?format=json');
    let ipData = await ipResponse.json();
    let ip = ipData.ip;

    let locationResponse = await fetch(`https://ipinfo.io/${ip}?token=c177813f87d9fa`);
    let locationData = await locationResponse.json();

    const [latitude, longitude] = locationData.loc.split(',');

    // Update weather based on IP-provided location
    updateWeather(`lat=${latitude}`, `lon=${longitude}`);

    // Update URL to reflect approximate location
    window.location.hash = '#/approximatelocation';
  } catch (error) {
    console.error('Error fetching location data:', error);
    // Fallback to default location in case of error
    window.location.hash = defaultLocation;
  }
};

// Function to get current location using geolocation
const currentLocation = () => {
  window.navigator.geolocation.getCurrentPosition(
    (res) => {
      const { latitude, longitude } = res.coords;
      updateWeather(`lat=${latitude}`, `lon=${longitude}`);
    },
    (err) => {
      console.error('Error fetching geolocation:', err);
      window.location.hash = '#/approximatelocation'; // Redirect to approximate location
    }
  );
};

// Function to search for location based on the query
const searchedLocation = (query) => {
  const isPostalCode = /^\d{5}(-\d{4})?$/.test(query); // Check if the query is a postal code (US ZIP code format)
  
  if (isPostalCode) {
    // If postal code, call the API with the postal code format
    updateWeather(`zip=${query},us`); // For U.S. postal code (add the country if needed)
  } else {
    // Otherwise, treat it as a city
    updateWeather(...query.split('&'));
  }
};

// Routes mapping
const routes = new Map([
  ['/current-location', currentLocation],   // Route for current location
  ['/weather', searchedLocation],           // Route for searched location
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
