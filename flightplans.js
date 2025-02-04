document.addEventListener('DOMContentLoaded', function() {
    // Assuming you have a variable `isFlightScheduled` that indicates if a flight is scheduled
    const flightPlan = {
        aircraft: {
            type: "Boeing 737-800",
            identification: "N787BA"
        },
        route: {
            departure: "KTPA Airport",
            arrival: "KSAN Airport",
            departureRunway: "Runway 01L",
            arrivalRunway: "Runway 27",
            duration: "5 hours 12 minutes",
            path: "Direct Route - KTPA to KSAN"
        },
        weather: {
            departureWeather: "Clear skies, 75°F",
            arrivalWeather: "Cloudy, 65°F",
            hazardousConditions: "No hazardous conditions expected."
        },
        fuel: {
            fuelEfficiency: "2.77 gallons per mile",
            fuelRequired: "27,594 gallons for the journey"
        },
        otherFactors: {
            altitude: "34,000 feet",
            weightAndBalance: "Balanced load with 95% capacity.",
            communication: "Radio communication with ATC on frequency 118.5 MHz.",
            emergencyProcedures: "Follow standard emergency protocols if necessary."
        },
        flightDateTime: {
            date: "02-04-2025",
            time: "6:30 PM EST"
        }
    };

    // Flight Status
    const flightStatusContainer = document.getElementById('flight-status');
    const flightStatusText = document.createElement('p');
    const statusIcon = document.createElement('span');
    
    if (flightPlan.flightDateTime.date && flightPlan.flightDateTime.time) {
        // Flight is scheduled
        flightStatusContainer.classList.add('flight-scheduled');
        flightStatusContainer.classList.remove('no-flight-scheduled');
        flightStatusText.textContent = "Flight Plan Scheduled";
        statusIcon.classList.add('status-icon'); // You can add a checkmark icon here
    } else {
        // No flight scheduled
        flightStatusContainer.classList.add('no-flight-scheduled');
        flightStatusContainer.classList.remove('flight-scheduled');
        flightStatusText.textContent = "No flights scheduled";
        statusIcon.classList.add('status-icon'); // You can add a cross icon here
    }

    // Append the icon and text to the status container
    flightStatusContainer.appendChild(statusIcon);
    flightStatusContainer.appendChild(flightStatusText);

    // Now populate the other sections like Aircraft, Route, etc.
    updateFlightInfo(flightPlan);
});

function updateFlightInfo(flightPlan) {
    // Aircraft info
    document.getElementById('aircraft').innerHTML = `
        <p><strong>Aircraft Type:</strong> ${flightPlan.aircraft.type}</p>
        <p><strong>Aircraft ID:</strong> ${flightPlan.aircraft.identification}</p>
    `;
    
    // Route info
    document.getElementById('route').innerHTML = `
        <p><strong>Departure:</strong> ${flightPlan.route.departure}</p>
        <p><strong>Arrival:</strong> ${flightPlan.route.arrival}</p>
        <p><strong>Departure Runway:</strong> ${flightPlan.route.departureRunway}</p>
        <p><strong>Arrival Runway:</strong> ${flightPlan.route.arrivalRunway}</p>
        <p><strong>Flight Duration:</strong> ${flightPlan.route.duration}</p>
        <p><strong>Flight Path:</strong> ${flightPlan.route.path}</p>
    `;
    
    // Weather info
    document.getElementById('weather').innerHTML = `
        <p><strong>Weather at Departure:</strong> ${flightPlan.weather.departureWeather}</p>
        <p><strong>Weather at Arrival:</strong> ${flightPlan.weather.arrivalWeather}</p>
        <p><strong>Hazardous Conditions:</strong> ${flightPlan.weather.hazardousConditions}</p>
    `;
    
    // Fuel info
    document.getElementById('fuel').innerHTML = `
        <p><strong>Fuel Efficiency:</strong> ${flightPlan.fuel.fuelEfficiency}</p>
        <p><strong>Fuel Required:</strong> ${flightPlan.fuel.fuelRequired}</p>
    `;
    
    // Other factors
    document.getElementById('other-factors').innerHTML = `
        <p><strong>Altitude:</strong> ${flightPlan.otherFactors.altitude}</p>
        <p><strong>Weight and Balance:</strong> ${flightPlan.otherFactors.weightAndBalance}</p>
        <p><strong>Communication:</strong> ${flightPlan.otherFactors.communication}</p>
        <p><strong>Emergency Procedures:</strong> ${flightPlan.otherFactors.emergencyProcedures}</p>
    `;
    
    // Flight Date and Time
    document.getElementById('flight-datetime').innerHTML = `
        <p><strong>Flight Date:</strong> ${flightPlan.flightDateTime.date}</p>
        <p><strong>Flight Time:</strong> ${flightPlan.flightDateTime.time}</p>
    `;
}
