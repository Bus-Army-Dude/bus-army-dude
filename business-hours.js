document.addEventListener("DOMContentLoaded", function () {
    // Original business hours in EST (you said 10:00 AM - 11:00 PM EST)
    const businessHoursEST = {
        sunday: { open: "10:00 AM", close: "11:00 PM" },
        monday: { open: "10:00 AM", close: "11:00 PM" },
        tuesday: { open: "10:00 AM", close: "11:00 PM" },
        wednesday: { open: "10:00 AM", close: "11:00 PM" },
        thursday: { open: "10:00 AM", close: "11:00 PM" },
        friday: { open: "10:00 AM", close: "11:00 PM" },
        saturday: { open: "10:00 AM", close: "11:00 PM" },
    };

    // Example of holiday hours (can be expanded as needed)
    const holidayHours = {
        "2025-12-25": { name: "Christmas Day", hours: "Closed" },
        "2025-01-01": { name: "New Year's Day", hours: "10:00 AM - 04:00 PM" },
    };

    // Get the user's timezone dynamically
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; 

    // Get current day in user's timezone
    const currentDay = new Date().toLocaleString("en-US", { weekday: "long", timeZone: userTimezone }).toLowerCase();
    const currentTime = new Date().toLocaleString("en-US", { timeZone: userTimezone, hour: '2-digit', minute: '2-digit', hour12: true });
    const todayDate = new Date().toLocaleDateString("en-CA", { timeZone: userTimezone });

    // Function to convert time from EST to any other timezone
    function convertTimeToTimezone(time, fromTimezone, toTimezone) {
        const date = new Date(`2025-01-01T${time}:00.000Z`); // Using a random date to manipulate time
        const options = { timeZone: toTimezone, hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleString('en-US', options);
    }

    // Loop through business hours to convert them to the user's timezone
    for (const [day, { open, close }] of Object.entries(businessHoursEST)) {
        const convertedOpen = convertTimeToTimezone(open, "America/New_York", userTimezone);
        const convertedClose = convertTimeToTimezone(close, "America/New_York", userTimezone);

        const dayElement = document.createElement("div");
        dayElement.classList.add("hours-row");
        if (day === currentDay) {
            dayElement.classList.add("highlight");
        }

        // Check if it's Open or Closed based on the current time
        let status = "Closed";
        if (currentTime >= convertedOpen && currentTime <= convertedClose) {
            status = "Open";
        }

        dayElement.innerHTML = `<strong>${capitalize(day)}:</strong> <span>${convertedOpen} - ${convertedClose}</span> <strong>Status: ${status}</strong>`;
        document.getElementById("hours-container").appendChild(dayElement);
    }

    // Check if today is a holiday and if there are special holiday hours
    if (holidayHours[todayDate]) {
        const holidayDetails = holidayHours[todayDate];
        const specialHours = holidayDetails.hours === "Closed"
            ? "Closed"
            : convertTimeToTimezone(holidayDetails.hours, "America/New_York", userTimezone);
        
        document.getElementById("holiday-name").textContent = holidayDetails.name;
        document.getElementById("holiday-hours").textContent = specialHours;
    }

    // Function to capitalize the first letter of the day (e.g., sunday -> Sunday)
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
