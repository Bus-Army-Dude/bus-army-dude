document.addEventListener('DOMContentLoaded', function() {
    // Assuming you have a variable `isFlightScheduled` that indicates if a flight is scheduled
    const isFlightScheduled = true; // Set this based on your condition or flight data

    const flightStatusContainer = document.getElementById('flight-status');
    const flightStatusText = document.createElement('p');
    const statusIcon = document.createElement('span');
    
    if (isFlightScheduled) {
        // Flight is scheduled
        flightStatusContainer.classList.add('flight-scheduled');
        flightStatusContainer.classList.remove('no-flight-scheduled');
        flightStatusText.textContent = "Flight Plan Scheduled";
        statusIcon.classList.add('status-icon'); // Attach icon styles here (e.g., a checkmark)
    } else {
        // No flight scheduled
        flightStatusContainer.classList.add('no-flight-scheduled');
        flightStatusContainer.classList.remove('flight-scheduled');
        flightStatusText.textContent = "No flights scheduled";
        statusIcon.classList.add('status-icon'); // Attach icon styles here (e.g., a cross mark)
    }

    // Append the icon and text to the status container
    flightStatusContainer.appendChild(statusIcon);
    flightStatusContainer.appendChild(flightStatusText);

    // Now populate the other sections like Aircraft, Route, etc.
    updateFlightInfo();
});

function updateFlightInfo() {
    // Simulate dynamic population with flight plan data
    const flightPlan = {
        aircraft: {
            type: "Boeing 787",
            identification: "N787BA"
        },
        route: {
            departure: "JFK Airport",
            arrival: "LAX Airport",
            departureRunway: "Runway 04L",
            arrivalRunway: "Runway 25R",
            duration: "5 hours 30 minutes",
            path: "Direct Route - JFK to LAX"
        },
        weather: {
            departureWeather: "Clear skies, 75°F",
            arrivalWeather: "Cloudy, 65°F",
            hazardousConditions: "No hazardous conditions expected."
        },
        fuel: {
            fuelEfficiency: "3.5 gallons per mile",
            fuelRequired: "5,000 gallons for the journey"
        },
        otherFactors: {
            altitude: "35,000 feet",
            weightAndBalance: "Balanced load with 85% capacity.",
            communication: "Radio communication with ATC on frequency 118.5 MHz.",
            emergencyProcedures: "Follow standard emergency protocols if necessary."
        },
        flightDateTime: {
            date: "02-03-2025",
            time: "12:30 AM EST"
        }
    };

    // Populate sections dynamically with flight data
    document.getElementById('aircraft').innerHTML = `
        <p><strong>Aircraft Type:</strong> ${flightPlan.aircraft.type}</p>
        <p><strong>Aircraft ID:</strong> ${flightPlan.aircraft.identification}</p>
    `;
    document.getElementById('route').innerHTML = `
        <p><strong>Departure:</strong> ${flightPlan.route.departure}</p>
        <p><strong>Arrival:</strong> ${flightPlan.route.arrival}</p>
        <p><strong>Departure Runway:</strong> ${flightPlan.route.departureRunway}</p>
        <p><strong>Arrival Runway:</strong> ${flightPlan.route.arrivalRunway}</p>
        <p><strong>Flight Duration:</strong> ${flightPlan.route.duration}</p>
        <p><strong>Flight Path:</strong> ${flightPlan.route.path}</p>
    `;
    document.getElementById('weather').innerHTML = `
        <p><strong>Weather at Departure:</strong> ${flightPlan.weather.departureWeather}</p>
        <p><strong>Weather at Arrival:</strong> ${flightPlan.weather.arrivalWeather}</p>
        <p><strong>Hazardous Conditions:</strong> ${flightPlan.weather.hazardousConditions}</p>
    `;
    document.getElementById('fuel').innerHTML = `
        <p><strong>Fuel Efficiency:</strong> ${flightPlan.fuel.fuelEfficiency}</p>
        <p><strong>Fuel Required:</strong> ${flightPlan.fuel.fuelRequired}</p>
    `;
    document.getElementById('other-factors').innerHTML = `
        <p><strong>Altitude:</strong> ${flightPlan.otherFactors.altitude}</p>
        <p><strong>Weight and Balance:</strong> ${flightPlan.otherFactors.weightAndBalance}</p>
        <p><strong>Communication:</strong> ${flightPlan.otherFactors.communication}</p>
        <p><strong>Emergency Procedures:</strong> ${flightPlan.otherFactors.emergencyProcedures}</p>
    `;
    document.getElementById('flight-datetime').innerHTML = `
        <p><strong>Flight Date:</strong> ${flightPlan.flightDateTime.date}</p>
        <p><strong>Flight Time:</strong> ${flightPlan.flightDateTime.time}</p>
    `;
}
