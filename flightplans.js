// Sample flight plan data for X-Plane 12 (dynamically fetched or updated)
const flightPlan = null; // Change this to `null` to simulate "No flight scheduled"

// Function to display the flight plan data dynamically
function displayFlightPlan() {
    const flightStatus = document.getElementById('flight-status');
    
    if (flightStatus) {
        if (flightPlan === null) {
            flightStatus.innerHTML = `
                <p class="no-flight-scheduled">
                    <span class="status-icon"></span> No flights scheduled
                </p>`;
        } else {
            flightStatus.innerHTML = `
                <p class="flight-scheduled">
                    <span class="status-icon"></span> Flight Plan Scheduled
                </p>`;
        }
    }

    // Aircraft info
    const aircraftSection = document.getElementById('aircraft');
    if (aircraftSection) {
        if (flightPlan === null) {
            aircraftSection.innerHTML = "<p>No flight scheduled</p>";
        } else {
            aircraftSection.innerHTML = `
                <p><strong>Aircraft Type:</strong> ${flightPlan.aircraft.type}</p>
                <p><strong>Aircraft ID:</strong> ${flightPlan.aircraft.identification}</p>
            `;
        }
    }

    // Route info
    const routeSection = document.getElementById('route');
    if (routeSection) {
        if (flightPlan === null) {
            routeSection.innerHTML = "<p>No flight scheduled</p>";
        } else {
            routeSection.innerHTML = `
                <p><strong>Departure:</strong> ${flightPlan.route.departure}</p>
                <p><strong>Arrival:</strong> ${flightPlan.route.arrival}</p>
                <p><strong>Departure Runway:</strong> ${flightPlan.route.departureRunway}</p>
                <p><strong>Arrival Runway:</strong> ${flightPlan.route.arrivalRunway}</p>
                <p><strong>Flight Duration:</strong> ${flightPlan.route.duration}</p>
                <p><strong>Flight Path:</strong> ${flightPlan.route.path}</p>
            `;
        }
    }

    // Weather info
    const weatherSection = document.getElementById('weather');
    if (weatherSection) {
        if (flightPlan === null) {
            weatherSection.innerHTML = "<p>No flight scheduled</p>";
        } else {
            weatherSection.innerHTML = `
                <p><strong>Weather at Departure:</strong> ${flightPlan.weather.departureWeather}</p>
                <p><strong>Weather at Arrival:</strong> ${flightPlan.weather.arrivalWeather}</p>
                <p><strong>Hazardous Conditions:</strong> ${flightPlan.weather.hazardousConditions}</p>
            `;
        }
    }

    // Fuel info
    const fuelSection = document.getElementById('fuel');
    if (fuelSection) {
        if (flightPlan === null) {
            fuelSection.innerHTML = "<p>No flight scheduled</p>";
        } else {
            fuelSection.innerHTML = `
                <p><strong>Fuel Efficiency:</strong> ${flightPlan.fuel.fuelEfficiency}</p>
                <p><strong>Fuel Required:</strong> ${flightPlan.fuel.fuelRequired}</p>
            `;
        }
    }

    // Other factors
    const otherFactorsSection = document.getElementById('other-factors');
    if (otherFactorsSection) {
        if (flightPlan === null) {
            otherFactorsSection.innerHTML = "<p>No flight scheduled</p>";
        } else {
            otherFactorsSection.innerHTML = `
                <p><strong>Altitude:</strong> ${flightPlan.otherFactors.altitude}</p>
                <p><strong>Weight and Balance:</strong> ${flightPlan.otherFactors.weightAndBalance}</p>
                <p><strong>Communication:</strong> ${flightPlan.otherFactors.communication}</p>
                <p><strong>Emergency Procedures:</strong> ${flightPlan.otherFactors.emergencyProcedures}</p>
            `;
        }
    }
}

// Ensure the flight plan data is displayed once the page content is fully loaded
document.addEventListener('DOMContentLoaded', displayFlightPlan);
