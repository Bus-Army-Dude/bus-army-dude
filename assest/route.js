'use strict';

import { updateWeather, error404 } from './app.js';

const defaultLocation = '#/weather?lat=51.5073219&lon=-0.1276474';

// Replace your currentLocation function with this:
const currentLocation = () => {
    // Check settings first
    const settings = JSON.parse(localStorage.getItem("weatherSettings")) || { locationServices: true };
    
    if (!settings.locationServices) {
        console.log("Location services disabled");
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
            // Try approximate location as fallback
            approximatelocation();
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
};

const searchedLocation = (query) => updateWeather(...query.split('&'));

const routes = new Map([
  ['/current-location', currentLocation],
  ['/weather', searchedLocation],
  ['/approximatelocation', approximatelocation]
]);

const checkHash = () => {
  const requestURL = window.location.hash.slice(1);
  const [route, query] = requestURL.includes('?') ? requestURL.split('?') : [requestURL];

  if (routes.has(route)) {
    routes.get(route)(query);
  } else {
    error404();
  }
};

window.addEventListener('hashchange', checkHash);

window.addEventListener('load', () => {
  if (!window.location.hash) {
    window.location.hash = '#/current-location';
  } else {
    checkHash();
  }
});
