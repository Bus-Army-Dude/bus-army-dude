// Set flightPlan to empty or undefined for no flight
let flightPlan; // Or set as flightPlan = {}; for empty object

// Function to display the flight plan data dynamically
function displayFlightPlan() {
    // Check if flight plan is available (empty or undefined will trigger this)
    if (!flightPlan || !flightPlan.aircraft || !flightPlan.route) {
        // Display "No flights scheduled" if no flight plan
        document.getElementById('flight-status').textContent = "No flights scheduled";
        return;
    }

    // Update flight status
    const flightStatus = document.getElementById('flight-status');
    if (flightStatus) {
        flightStatus.textContent = "Flight Plan Scheduled";
    }

    // Aircraft info
    const aircraftSection = document.getElementById('aircraft');
    if (aircraftSection) {
        aircraftSection.innerHTML = `
            <p><strong>Aircraft Type:</strong> ${flightPlan.aircraft.type}</p>
            <p><strong>Aircraft ID:</strong> ${flightPlan.aircraft.identification}</p>
        `;
    }

    // Route info
    const routeSection = document.getElementById('route');
    if (routeSection) {
        routeSection.innerHTML = `
            <p><strong>Departure:</strong> ${flightPlan.route.departure}</p>
            <p><strong>Arrival:</strong> ${flightPlan.route.arrival}</p>
            <p><strong>Departure Runway:</strong> ${flightPlan.route.departureRunway}</p>
            <p><strong>Arrival Runway:</strong> ${flightPlan.route.arrivalRunway}</p>
            <p><strong>Flight Duration:</strong> ${flightPlan.route.duration}</p>
            <p><strong>Flight Path:</strong> ${flightPlan.route.path}</p>
        `;
    }

    // Weather info
    const weatherSection = document.getElementById('weather');
    if (weatherSection) {
        weatherSection.innerHTML = `
            <p><strong>Weather at Departure:</strong> ${flightPlan.weather.departureWeather}</p>
            <p><strong>Weather at Arrival:</strong> ${flightPlan.weather.arrivalWeather}</p>
            <p><strong>Hazardous Conditions:</strong> ${flightPlan.weather.hazardousConditions}</p>
        `;
    }

    // Fuel info
    const fuelSection = document.getElementById('fuel');
    if (fuelSection) {
        fuelSection.innerHTML = `
            <p><strong>Fuel Efficiency:</strong> ${flightPlan.fuel.fuelEfficiency}</p>
            <p><strong>Fuel Required:</strong> ${flightPlan.fuel.fuelRequired}</p>
        `;
    }

    // Other factors
    const otherFactorsSection = document.getElementById('other-factors');
    if (otherFactorsSection) {
        otherFactorsSection.innerHTML = `
            <p><strong>Altitude:</strong> ${flightPlan.otherFactors.altitude}</p>
            <p><strong>Weight and Balance:</strong> ${flightPlan.otherFactors.weightAndBalance}</p>
            <p><strong>Communication:</strong> ${flightPlan.otherFactors.communication}</p>
            <p><strong>Emergency Procedures:</strong> ${flightPlan.otherFactors.emergencyProcedures}</p>
        `;
    }
}

// Ensure the flight plan data is displayed once the page content is fully loaded
document.addEventListener('DOMContentLoaded', displayFlightPlan);
