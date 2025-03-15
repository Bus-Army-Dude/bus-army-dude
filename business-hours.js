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
        "2025-03-15": { name: "Special Day", hours: "10:00 AM - 02:00 PM" },
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
    function convertTimeToTimezone(time, toTimezone) {
        const now = new Date("2025-03-15T15:21:28Z"); // Using the current UTC time
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":");
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        // Create date object in EST
        const estDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        
        // Convert to user's timezone
        return estDate.toLocaleString("en-US", {
            timeZone: toTimezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    // Function to check if currently open
    function isBusinessOpen(dayOfWeek) {
        const now = new Date("2025-03-15T15:21:28Z");
        const todayDate = now.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
        
        // Check for holiday
        if (holidayHours[todayDate]) {
            const holiday = holidayHours[todayDate];
            if (holiday.hours === "Closed") return "Closed";
            
            const [openTime, closeTime] = holiday.hours.split(" - ");
            const currentTime = now.toLocaleTimeString("en-US", {
                timeZone: userTimezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const openTimeConverted = convertTimeToTimezone(openTime, userTimezone);
            const closeTimeConverted = convertTimeToTimezone(closeTime, userTimezone);

            return currentTime >= openTimeConverted && currentTime < closeTimeConverted ? "Open" : "Closed";
        }

        // Regular business hours check
        const todayHours = businessHoursEST[dayOfWeek];
        if (!todayHours) return "Closed";

        const currentTime = now.toLocaleTimeString("en-US", {
            timeZone: userTimezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const openTimeConverted = convertTimeToTimezone(todayHours.open, userTimezone);
        const closeTimeConverted = convertTimeToTimezone(todayHours.close, userTimezone);

        return currentTime >= openTimeConverted && currentTime < closeTimeConverted ? "Open" : "Closed";
    }

    // Set user's timezone display
    document.getElementById("user-timezone").textContent = userTimezone;

    // Get current day
    const currentDateUserTimezone = new Date("2025-03-15T15:21:28Z");
    const currentDay = currentDateUserTimezone.toLocaleString("en-US", { 
        weekday: "long",
        timeZone: userTimezone 
    }).toLowerCase();

    const todayDate = currentDateUserTimezone.toLocaleDateString("en-CA", { 
        timeZone: userTimezone 
    });

    // Render business hours
    const hoursContainer = document.getElementById("hours-container");
    hoursContainer.innerHTML = "";

    // Display regular hours
    for (const [day, { open, close }] of Object.entries(businessHoursEST)) {
        const convertedOpen = convertTimeToTimezone(open, userTimezone);
        const convertedClose = convertTimeToTimezone(close, userTimezone);

        const dayElement = document.createElement("div");
        dayElement.classList.add("hours-row");

        if (day === currentDay) {
            dayElement.classList.add("current-day");
        }

        dayElement.innerHTML = `<strong>${capitalize(day)}:</strong> <span>${convertedOpen} - ${convertedClose}</span>`;
        hoursContainer.appendChild(dayElement);
    }

    // Update open/closed status
    const status = isBusinessOpen(currentDay);
    const statusElement = document.getElementById("open-status");
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

    // Helper function to capitalize
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
