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

    // Complete holiday hours through 2025
    const holidayHours = {
        // 2025 Holidays
        "2025-01-01": { name: "New Year's Day", hours: "10:00 AM - 04:00 PM" },
        "2025-01-20": { name: "Martin Luther King Jr. Day", hours: "Closed" },
        "2025-02-17": { name: "Presidents' Day", hours: "Closed" },
        "2025-02-27": { name: "Bus Army Dude's Birthday", hours: "Closed" },
        "2025-03-15": { name: "Special Day", hours: "10:00 AM - 02:00 PM" }, // Current date
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

    // Create a function to get UTC date string in YYYY-MM-DD format
    function getUTCDateString(date) {
        return date.toISOString().split('T')[0];
    }

    // Enhanced time conversion function with UTC support
    function convertTimeToTimezone(time, toTimezone) {
        // Parse the input time
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":");
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        // Convert to 24-hour format
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        // Create date object using the current UTC date
        const utcNow = new Date("2025-03-15T15:17:39Z"); // Using provided UTC time
        const targetDate = new Date(Date.UTC(
            utcNow.getUTCFullYear(),
            utcNow.getUTCMonth(),
            utcNow.getUTCDate(),
            hours,
            minutes
        ));

        // Convert to target timezone
        return targetDate.toLocaleString("en-US", {
            timeZone: toTimezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    // Function to check if currently open based on UTC time
    function isBusinessOpen() {
        const utcNow = new Date("2025-03-15T15:17:39Z"); // Using provided UTC time
        const estNow = new Date(utcNow.toLocaleString("en-US", { timeZone: "America/New_York" }));
        const todayEST = getUTCDateString(estNow);
        
        // Check for holiday first
        if (holidayHours[todayEST]) {
            const holiday = holidayHours[todayEST];
            if (holiday.hours === "Closed") return "Closed";
            
            // Parse holiday hours
            const [openTime, closeTime] = holiday.hours.split(" - ");
            const holidayOpen = convertTimeToTimezone(openTime, "America/New_York");
            const holidayClose = convertTimeToTimezone(closeTime, "America/New_York");
            
            const currentTime = estNow.toLocaleString("en-US", {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: "America/New_York"
            });

            return currentTime >= holidayOpen && currentTime < holidayClose ? "Open" : "Closed";
        }

        // Regular business hours check
        const dayOfWeek = estNow.toLocaleString("en-US", { 
            weekday: "lowercase",
            timeZone: "America/New_York"
        });
        
        const regularHours = businessHoursEST[dayOfWeek];
        const currentTime = estNow.toLocaleString("en-US", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: "America/New_York"
        });

        const openTime = convertTimeToTimezone(regularHours.open, "America/New_York");
        const closeTime = convertTimeToTimezone(regularHours.close, "America/New_York");

        return currentTime >= openTime && currentTime < closeTime ? "Open" : "Closed";
    }

    // Update the display
    document.getElementById("user-timezone").textContent = userTimezone;
    
    // Display current UTC time
    const utcTimeDisplay = document.createElement("div");
    utcTimeDisplay.className = "utc-time";
    utcTimeDisplay.textContent = `UTC Time: 2025-03-15 15:17:39`;
    document.getElementById("hours-container").prepend(utcTimeDisplay);

    // Update status
    const status = isBusinessOpen();
    const statusElement = document.getElementById("open-status");
    statusElement.textContent = status;
    statusElement.className = status.toLowerCase();

    // Display holiday alert if applicable
    const todayEST = getUTCDateString(new Date("2025-03-15T15:17:39Z"));
    const holidayAlertElement = document.getElementById("holiday-alert");
    const holidayNameElement = document.getElementById("holiday-name");
    const holidayHoursElement = document.getElementById("holiday-hours");

    if (holidayHours[todayEST]) {
        const holidayDetails = holidayHours[todayEST];
        holidayNameElement.textContent = holidayDetails.name;
        holidayHoursElement.textContent = holidayDetails.hours;
        holidayAlertElement.style.display = "block";
    } else {
        holidayAlertElement.style.display = "none";
    }

    // Render regular business hours
    const hoursContainer = document.getElementById("hours-container");
    
    for (const [day, hours] of Object.entries(businessHoursEST)) {
        const convertedOpen = convertTimeToTimezone(hours.open, userTimezone);
        const convertedClose = convertTimeToTimezone(hours.close, userTimezone);

        const dayElement = document.createElement("div");
        dayElement.classList.add("hours-row");
        
        const currentDay = new Date("2025-03-15T15:17:39Z")
            .toLocaleString("en-US", { weekday: "long", timeZone: userTimezone })
            .toLowerCase();

        if (day === currentDay) {
            dayElement.classList.add("current-day");
        }

        dayElement.innerHTML = `<strong>${capitalize(day)}:</strong> <span>${convertedOpen} - ${convertedClose}</span>`;
        hoursContainer.appendChild(dayElement);
    }

    // Helper function to capitalize first letter
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
