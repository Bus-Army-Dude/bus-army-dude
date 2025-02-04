document.addEventListener('DOMContentLoaded', function () {
    // Sample flight plan data for X-Plane 12 (dynamically fetched or updated)
    const flightPlan = {
        aircraft: {
            type: "Boeing 787",
            identification: "N787BA",
        },
        route: {
            departure: "JFK Airport",
            arrival: "LAX Airport",
            departureRunway: "Runway 04L",
            arrivalRunway: "Runway 25R",
            duration: "5 hours 30 minutes",
            path: "Direct Route - JFK to LAX",
        },
        weather: {
            departureWeather: "Clear skies, 75°F",
            arrivalWeather: "Cloudy, 65°F",
            hazardousConditions: "No hazardous conditions expected.",
        },
        fuel: {
            fuelEfficiency: "3.5 gallons per mile",
            fuelRequired: "5,000 gallons for the journey",
        },
        otherFactors: {
            altitude: "35,000 feet",
            weightAndBalance: "Balanced load with 85% capacity.",
            communication: "Radio communication with ATC on frequency 118.5 MHz.",
            emergencyProcedures: "Follow standard emergency protocols if necessary.",
        },
    };

    // Function to display the flight plan data dynamically
    function displayFlightPlan() {
        // Aircraft info
        const aircraftSection = document.getElementById('aircraft');
        aircraftSection.innerHTML = `
            <p><strong>Aircraft Type:</strong> ${flightPlan.aircraft.type}</p>
            <p><strong>Aircraft ID:</strong> ${flightPlan.aircraft.identification}</p>
        `;

        // Route info
        const routeSection = document.getElementById('route');
        routeSection.innerHTML = `
            <p><strong>Departure:</strong> ${flightPlan.route.departure}</p>
            <p><strong>Arrival:</strong> ${flightPlan.route.arrival}</p>
            <p><strong>Departure Runway:</strong> ${flightPlan.route.departureRunway}</p>
            <p><strong>Arrival Runway:</strong> ${flightPlan.route.arrivalRunway}</p>
            <p><strong>Flight Duration:</strong> ${flightPlan.route.duration}</p>
            <p><strong>Flight Path:</strong> ${flightPlan.route.path}</p>
        `;

        // Weather info
        const weatherSection = document.getElementById('weather');
        weatherSection.innerHTML = `
            <p><strong>Weather at Departure:</strong> ${flightPlan.weather.departureWeather}</p>
            <p><strong>Weather at Arrival:</strong> ${flightPlan.weather.arrivalWeather}</p>
            <p><strong>Hazardous Conditions:</strong> ${flightPlan.weather.hazardousConditions}</p>
        `;

        // Fuel info
        const fuelSection = document.getElementById('fuel');
        fuelSection.innerHTML = `
            <p><strong>Fuel Efficiency:</strong> ${flightPlan.fuel.fuelEfficiency}</p>
            <p><strong>Fuel Required:</strong> ${flightPlan.fuel.fuelRequired}</p>
        `;

        // Other factors
        const otherFactorsSection = document.getElementById('other-factors');
        otherFactorsSection.innerHTML = `
            <p><strong>Altitude:</strong> ${flightPlan.otherFactors.altitude}</p>
            <p><strong>Weight and Balance:</strong> ${flightPlan.otherFactors.weightAndBalance}</p>
            <p><strong>Communication:</strong> ${flightPlan.otherFactors.communication}</p>
            <p><strong>Emergency Procedures:</strong> ${flightPlan.otherFactors.emergencyProcedures}</p>
        `;
    }
});

// Call the display function when the page is loaded
window.onload = function() {
    displayFlightPlan();
};
