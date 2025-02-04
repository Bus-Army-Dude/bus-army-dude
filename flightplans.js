document.addEventListener('DOMContentLoaded', function() {
    // Full Flight Plan object with detailed information
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
            duration: "5 hours 08 minutes",
            path: "Direct Route - KTPA to KSAN",
            detailedRoute: "DORMR2 FROOT DCT ROZZI Y280 LEV DCT IAH J86 JCT DCT ELP DCT SSO J50 GBN J18 HOGGZ LUCKI1"
        },
        weather: {
            departureWeather: "Partly cloudy, 75°F",
            arrivalWeather: "Mostly cloudy, 55°F",
            hazardousConditions: "No hazardous conditions expected."
        },
        fuel: {
            fuelEfficiency: "2.77 gallons per mile",
            fuelRequired: "33,813 gallons for the journey",
            enrouteBurn: "26,797 lbs",
            blockFuel: "33,813 lbs"
        },
        loadSheet: {
            passengers: 180,
            emptyWeight: "91,894 lbs",
            estimatedZFW: "133,294 lbs",
            estimatedTOW: "166,607 lbs",
            estimatedLW: "139,810 lbs",
            cargo: "9,900 lbs",
            payload: "41,400 lbs",
            maxZFW: "138,300 lbs",
            maxTOW: "174,200 lbs",
            maxLW: "146,300 lbs"
        },
        atcFlightPlan: "(FPL-737800-IS -B738/M-SDE2E3FGHIRWXY/LB1 -KTPA1830 -N0452F340 DORMR2 FROOT DCT ROZZI Y280 LEV DCT IAH J86 JCT DCT ELP/N0454F360 DCT SSO J50 GBN J18 HOGGZ LUCKI1 -KSAN0444 KLAX -PBN/A1B1C1D1S1S2 DOF/250204 REG/N806SB EET/KZMA0002 KZJX0028 KZHU0051 KZAB0236 KZLA0409 OPR/737 PER/C RMK/TCAS)",
        flightDateTime: {
            date: "02-04-2025",
            time: "10:30 UTC"
        },
        arrivalTime: "15:38 UTC",
        airTime: "04:48",
        blockTime: "5:08",
        flightNumber: "737800",
        callSign: "737800",
        airFrame: "N806SB",
    };

    // Function to update the flight status dynamically
    function updateFlightStatus(status) {
        const statusContainer = document.getElementById('flight-status');
        const statusText = document.getElementById('flight-status-text');
        const icon = statusContainer.querySelector('.status-icon');
        const flightPlanContainer = document.getElementById('flightPlanContainer');

        // Reset previous classes
        statusContainer.classList.remove('flight-scheduled', 'flight-in-progress', 'flight-completed', 'flight-cancelled', 'no-flight-scheduled');
        icon.style.backgroundImage = ''; // Clear the previous icon

        // Show or hide the flight plan container based on status
        if (status === 'no-flight-scheduled' || status === 'loading' || status === 'cancelled') {
            flightPlanContainer.style.display = 'none'; // Hide flight plan for these statuses
        } else {
            flightPlanContainer.style.display = 'block'; // Show flight plan for other statuses
        }

        switch (status) {
            case 'scheduled':
                statusContainer.classList.add('flight-scheduled');
                statusText.textContent = 'Flight Scheduled';
                icon.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/190/190411.png")'; // Scheduled icon
                break;
            case 'in-progress':
                statusContainer.classList.add('flight-in-progress');
                statusText.textContent = 'Flight In Progress';
                icon.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/190/190423.png")'; // In progress icon
                break;
            case 'completed':
                statusContainer.classList.add('flight-completed');
                statusText.textContent = 'Flight Completed';
                icon.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/190/190413.png")'; // Completed icon
                break;
            case 'cancelled':
                statusContainer.classList.add('flight-cancelled');
                statusText.textContent = 'Flight Cancelled';
                icon.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/190/190414.png")'; // Cancelled icon
                break;
            case 'loading':
                statusContainer.classList.add('no-flight-scheduled');
                statusText.textContent = 'Loading...';
                icon.style.backgroundImage = ''; // Optional: remove icon during loading state
                break;
            case 'no-flight-scheduled':
            default:
                statusContainer.classList.add('no-flight-scheduled');
                statusText.textContent = 'No Flight Scheduled';
                icon.style.backgroundImage = ''; // No icon for this status
                break;
        }
    }

    // Example usage: Manually call the function to set a flight status
    updateFlightStatus('scheduled'); // This will set the status to "Flight Scheduled"

    // Populate the flight plan sections dynamically
    updateFlightInfo(flightPlan);

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
            <p><strong>Detailed Route:</strong> ${flightPlan.route.detailedRoute}</p>
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
            <p><strong>Enroute Burn:</strong> ${flightPlan.fuel.enrouteBurn}</p>
            <p><strong>Block Fuel:</strong> ${flightPlan.fuel.blockFuel}</p>
        `;
        
        // Load Sheet info
        document.getElementById('load-sheet').innerHTML = `
            <p><strong>Passengers:</strong> ${flightPlan.loadSheet.passengers}</p>
            <p><strong>Empty Weight:</strong> ${flightPlan.loadSheet.emptyWeight}</p>
            <p><strong>Estimated ZFW:</strong> ${flightPlan.loadSheet.estimatedZFW}</p>
            <p><strong>Estimated TOW:</strong> ${flightPlan.loadSheet.estimatedTOW}</p>
            <p><strong>Estimated LW:</strong> ${flightPlan.loadSheet.estimatedLW}</p>
            <p><strong>Cargo:</strong> ${flightPlan.loadSheet.cargo}</p>
            <p><strong>Payload:</strong> ${flightPlan.loadSheet.payload}</p>
            <p><strong>Max ZFW:</strong> ${flightPlan.loadSheet.maxZFW}</p>
            <p><strong>Max TOW:</strong> ${flightPlan.loadSheet.maxTOW}</p>
            <p><strong>Max LW:</strong> ${flightPlan.loadSheet.maxLW}</p>
        `;
        
        // ATC Flight Plan
        document.getElementById('atc-flight-plan').innerHTML = `
            <p><strong>ATC Flight Plan:</strong> ${flightPlan.atcFlightPlan}</p>
        `;
        
        // Flight Date and Time
        document.getElementById('flight-datetime').innerHTML = `
            <p><strong>Flight Date:</strong> ${flightPlan.flightDateTime.date}</p>
            <p><strong>Flight Time:</strong> ${flightPlan.flightDateTime.time}</p>
        `;
    }
});
