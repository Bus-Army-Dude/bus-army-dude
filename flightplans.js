// Sample flight plan data for X-Plane 12 (dynamically fetched or updated)
const flightPlan = {
    aircraft: {
        type: "Boeing 787", // Aircraft type (e.g., Boeing 787)
        identification: "N787BA", // Aircraft identification (e.g., N787BA)
    },
    route: {
        departure: "JFK Airport", // Departure airport (e.g., JFK Airport)
        arrival: "LAX Airport", // Arrival airport (e.g., LAX Airport)
        departureRunway: "Runway 04L", // Departure runway (e.g., Runway 04L)
        arrivalRunway: "Runway 25R", // Arrival runway (e.g., Runway 25R)
        duration: "5 hours 30 minutes", // Flight duration (e.g., 5 hours 30 minutes)
        path: "Direct Route - JFK to LAX", // Flight path (e.g., Direct Route - JFK to LAX)
    },
    weather: {
        departureWeather: "Clear skies, 75°F", // Weather at departure (e.g., Clear skies, 75°F)
        arrivalWeather: "Cloudy, 65°F", // Weather at arrival (e.g., Cloudy, 65°F)
        hazardousConditions: "No hazardous conditions expected.", // Hazardous conditions (e.g., No hazardous conditions expected)
    },
    fuel: {
        fuelEfficiency: "3.5 gallons per mile", // Fuel efficiency (e.g., 3.5 gallons per mile)
        fuelRequired: "5,000 gallons for the journey", // Fuel required (e.g., 5,000 gallons for the journey)
    },
    otherFactors: {
        altitude: "35,000 feet", // Altitude (e.g., 35,000 feet)
        weightAndBalance: "Balanced load with 85% capacity.", // Weight and balance (e.g., Balanced load with 85% capacity)
        communication: "Radio communication with ATC on frequency 118.5 MHz.", // Communication info (e.g., Radio communication with ATC on frequency 118.5 MHz)
        emergencyProcedures: "Follow standard emergency protocols if necessary.", // Emergency procedures (e.g., Follow standard emergency protocols if necessary)
    },
    flightDateTime: {
        date: "2025-02-03", // Date of the flight (e.g., 2025-02-03)
        time: "15:30 UTC", // Time of the flight (e.g., 15:30 UTC)
    },
};

// Function to display the flight plan data dynamically
function displayFlightPlan() {
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

    // Flight Date and Time
    const flightDateTimeSection = document.getElementById('flight-datetime');
    if (flightDateTimeSection) {
        if (flightPlan.flightDateTime.date && flightPlan.flightDateTime.time) {
            flightDateTimeSection.innerHTML = `
                <p><strong>Flight Date:</strong> ${flightPlan.flightDateTime.date}</p>
                <p><strong>Flight Time:</strong> ${flightPlan.flightDateTime.time}</p>
            `;
        } else {
            flightDateTimeSection.innerHTML = "<p>No flight scheduled.</p>";
        }
    }
}

// Ensure the flight plan data is displayed once the page content is fully loaded
document.addEventListener('DOMContentLoaded', displayFlightPlan);
