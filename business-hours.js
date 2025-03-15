document.addEventListener("DOMContentLoaded", function () {
    // Business hours in EST (Eastern Standard Time)
    const businessHoursEST = {
        sunday: { open: "10:00 AM", close: "11:00 PM" },
        monday: { open: "10:00 AM", close: "11:00 PM" },
        tuesday: { open: "10:00 AM", close: "11:00 PM" },
        wednesday: { open: "10:00 AM", close: "11:00 PM" },
        thursday: { open: "10:00 AM", close: "11:00 PM" },
        friday: { open: "10:00 AM", close: "11:00 PM" },
        saturday: { open: "10:00 AM", close: "11:00 PM" },
    };

    // Holiday hours
    const holidayHours = {
        "2025-12-25": { name: "Christmas Day", hours: "Closed" },
        "2025-01-01": { name: "New Year's Day", hours: "10:00 AM - 04:00 PM" },
    };

    // Get user's current timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Get the current day in the user's timezone
    const currentDateUserTimezone = new Date();
    const currentDay = currentDateUserTimezone.toLocaleString("en-US", { weekday: "long", timeZone: userTimezone }).toLowerCase();
    const todayDate = currentDateUserTimezone.toLocaleDateString("en-CA", { timeZone: userTimezone });

    // Helper function to convert time from EST to user's timezone
    function convertTimeToTimezone(time, toTimezone) {
        const now = new Date();
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":");
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        const estDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

        const estTimeString = estDate.toLocaleString("en-US", {
            timeZone: 'America/New_York',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const userTimeString = estDate.toLocaleString("en-US", {
            timeZone: toTimezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return userTimeString;
    }

    // Set user's timezone display
    document.getElementById("user-timezone").textContent = userTimezone;

    // Render business hours in user's timezone
    const hoursContainer = document.getElementById("hours-container");
    hoursContainer.innerHTML = "";

    for (const [day, { open, close }] of Object.entries(businessHoursEST)) {
        const convertedOpen = convertTimeToTimezone(open, userTimezone);
        const convertedClose = convertTimeToTimezone(close, userTimezone);

        const dayElement = document.createElement("div");
        dayElement.classList.add("hours-row");

        if (day === currentDay) {
            dayElement.classList.add("current-day"); // Highlight current day
        }

        dayElement.innerHTML = `<strong>${capitalize(day)}:</strong> <span>${convertedOpen} - ${convertedClose}</span>`;
        hoursContainer.appendChild(dayElement);
    }

    // Function to check if the business is currently open
    function isBusinessOpen(dayOfWeek) {
        const todayHours = businessHoursEST[dayOfWeek];

        if (!todayHours) return "Closed"; // If no hours for today, assume closed

        const openTimeUser = convertTimeToTimezone(todayHours.open, userTimezone);
        const closeTimeUser = convertTimeToTimezone(todayHours.close, userTimezone);

        const currentTime = currentDateUserTimezone.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: userTimezone
        });

        return currentTime >= openTimeUser && currentTime < closeTimeUser ? "Open" : "Closed";
    }

    const statusElement = document.getElementById("open-status");
    const status = isBusinessOpen(currentDay);
    statusElement.textContent = status;
    statusElement.className = status.toLowerCase(); // Add class 'open' or 'closed' for styling

    // Check for holiday hours and display them
    const holidayAlertElement = document.getElementById("holiday-alert");
    const holidayNameElement = document.getElementById("holiday-name");
    const holidayHoursElement = document.getElementById("holiday-hours");

    if (holidayHours[todayDate]) {
        const holidayDetails = holidayHours[todayDate];

        let specialHours;
        if (holidayDetails.hours === "Closed") {
            specialHours = "Closed";
        } else {
            const [open, close] = holidayDetails.hours.split(" - ");
            const convertedOpen = convertTimeToTimezone(open, userTimezone);
            const convertedClose = convertTimeToTimezone(close, userTimezone);
            specialHours = `${convertedOpen} - ${convertedClose}`;
        }

        holidayNameElement.textContent = holidayDetails.name;
        holidayHoursElement.textContent = specialHours;
        holidayAlertElement.style.display = "block";
    } else {
        holidayAlertElement.style.display = "none";
    }

    // Helper function to capitalize the first letter of a string
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
