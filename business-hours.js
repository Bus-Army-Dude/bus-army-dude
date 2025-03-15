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
        "2025-01-01": { name: "New Year's Day", hours: "10:00 AM - 04:00 PM" },
        "2025-01-20": { name: "Martin Luther King Jr. Day", hours: "Closed" },
        "2025-02-17": { name: "Presidents' Day", hours: "Closed" },
        "2025-02-27": { name: "Bus Army Dude's Birthday", hours: "Closed" },
        "2025-05-26": { name: "Memorial Day", hours: "Closed" },
        "2025-07-04": { name: "Independence Day", hours: "Closed" },
        "2025-09-01": { name: "Labor Day", hours: "Closed" },
        "2025-10-13": { name: "Columbus Day", hours: "10:00 AM - 11:00 PM" },
        "2025-11-11": { name: "Veterans Day", hours: "Closed" },
        "2025-11-27": { name: "Thanksgiving Day", hours: "Closed" },
        "2025-12-24": { name: "Christmas Eve", hours: "10:00 AM - 06:00 PM" },
        "2025-12-25": { name: "Christmas Day", hours: "Closed" },
        "2025-12-31": { name: "New Year's Eve", hours: "10:00 AM - 06:00 PM" }
    };

    // Get user's current timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Helper function to convert time from EST to user's timezone
    function convertTimeToTimezone(timeStr, fromTimezone = 'America/New_York', toTimezone) {
        // Parse the input time
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        
        // Convert to 24-hour format
        let hour24 = hours;
        if (period === 'PM' && hours !== 12) hour24 += 12;
        if (period === 'AM' && hours === 12) hour24 = 0;

        // Create a date object using the reference date (2025-03-15)
        const date = new Date('2025-03-15T00:00:00Z');
        date.setUTCHours(hour24);
        date.setUTCMinutes(minutes);

        // Convert from EST to target timezone
        const targetTime = date.toLocaleString('en-US', {
            timeZone: toTimezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return targetTime;
    }

    // Function to check if the business is currently open
    function isBusinessOpen(dayOfWeek) {
        const now = new Date('2025-03-15T15:26:39Z'); // Using provided UTC time
        const todayHours = businessHoursEST[dayOfWeek];
        
        if (!todayHours) return "Closed";

        const currentTimeInEST = now.toLocaleString("en-US", {
            timeZone: "America/New_York",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        const openTime = todayHours.open;
        const closeTime = todayHours.close;

        return (currentTimeInEST >= openTime && currentTimeInEST < closeTime) ? "Open" : "Closed";
    }

    // Get current day using the provided UTC time
    const currentDate = new Date('2025-03-15T15:26:39Z');
    const currentDay = currentDate.toLocaleString("en-US", { 
        weekday: "long",
        timeZone: userTimezone 
    }).toLowerCase();

    const todayDate = currentDate.toLocaleDateString("en-CA", { 
        timeZone: userTimezone 
    });

    // Set user's timezone display
    document.getElementById("user-timezone").textContent = userTimezone;

    // Render business hours
    const hoursContainer = document.getElementById("hours-container");
    hoursContainer.innerHTML = "";

    for (const [day, { open, close }] of Object.entries(businessHoursEST)) {
        const convertedOpen = convertTimeToTimezone(open, "America/New_York", userTimezone);
        const convertedClose = convertTimeToTimezone(close, "America/New_York", userTimezone);

        const dayElement = document.createElement("div");
        dayElement.classList.add("hours-row");

        if (day === currentDay) {
            dayElement.classList.add("current-day");
        }

        dayElement.innerHTML = `<strong>${capitalize(day)}:</strong> <span>${convertedOpen} - ${convertedClose}</span>`;
        hoursContainer.appendChild(dayElement);
    }

    // Check open/closed status
    const statusElement = document.getElementById("open-status");
    const status = isBusinessOpen(currentDay);
    statusElement.textContent = status;
    statusElement.className = status.toLowerCase();

    // Check for holiday hours
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
            const convertedOpen = convertTimeToTimezone(open, "America/New_York", userTimezone);
            const convertedClose = convertTimeToTimezone(close, "America/New_York", userTimezone);
            specialHours = `${convertedOpen} - ${convertedClose}`;
        }

        holidayNameElement.textContent = holidayDetails.name;
        holidayHoursElement.textContent = specialHours;
        holidayAlertElement.style.display = "block";
    } else {
        holidayAlertElement.style.display = "none";
    }

    // Helper function to capitalize first letter
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
