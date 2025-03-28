'use strict';

import { updateWeather, error404 } from "./app.js";

// Default location if geolocation fails
const defaultLocation = "#/weather?lat=51.5073219&lon=-0.1276474";

// Function to get approximate location using IP address
const approximatelocation = async () => {
    try {
        let ipResponse = await fetch("https://api.ipify.org/?format=json");
        let ipData = await ipResponse.json();
        let ip = ipData.ip;

        let locationResponse = await fetch(`https://ipinfo.io/${ip}?token=c177813f87d9fa`);
        let locationData = await locationResponse.json();

        const [latitude, longitude] = locationData.loc.split(",");
        updateWeather(`lat=${latitude}&lon=${longitude}`);
        window.location.hash = "#/approximatelocation";
    } catch (error) {
        console.error("Error fetching location data:", error);
        // Fallback to default location
        updateWeather("lat=51.5073219", "lon=-0.1276474");
    }
};

// Function to get current geolocation of the user
const currentLocation = () => {
    window.navigator.geolocation.getCurrentPosition(
        (res) => {
            const { latitude, longitude } = res.coords;
            updateWeather(`lat=${latitude}&lon=${longitude}`);
        },
        (err) => {
            console.error("Geolocation error:", err);
            approximatelocation(); // Fallback to approximate location
            alert("Unable to retrieve your location. Using approximate location instead.");
        }
    );
};

// Function to handle searched location from the query string
const searchedLocation = (query) => {
    const params = new URLSearchParams(query);
    const lat = params.get("lat");
    const lon = params.get("lon");
    updateWeather(lat, lon);
};

// Routes for different hash paths
const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather", searchedLocation],
    ["/approximatelocation", approximatelocation]
]);

// Function to check the current hash and trigger the correct route
const checkHash = () => {
    const requestURL = window.location.hash.slice(1);
    const [route, query] = requestURL.includes("?") ? requestURL.split("?") : [requestURL];
    
    // Call the route handler if it exists, otherwise show a 404 error
    routes.get(route) ? routes.get(route)(query) : error404();
};

// Event listener for hash changes
window.addEventListener("hashchange", checkHash);

// Event listener for page load
window.addEventListener("load", () => {
    if (!window.location.hash) {
        // Check if geolocation permissions are granted
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
            if (result.state === "granted") {
                // If granted, use current location
                window.location.hash = "#/current-location";
            } else {
                // If not granted, use approximate location
                approximatelocation();
            }
        });
    } else {
        checkHash(); // If there's already a hash, handle it
    }
});
