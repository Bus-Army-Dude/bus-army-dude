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
        "2025-03-15": { name: "Out Of Office", hours: "10:00 AM - 02:00 PM" },
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
    function convertTimeToTimezone(timeStr, toTimezone) {
        // Parse the input time
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        // Convert to 24-hour format for EST time
        let estHours = hours;
        if (period === 'PM' && hours !== 12) estHours += 12;
        if (period === 'AM' && hours === 12) estHours = 0;

        // Create date object for the reference date (2025-03-15)
        const baseDate = new Date('2025-03-15T00:00:00-05:00'); // EST base date

        // Set the hours and minutes in EST
        baseDate.setHours(estHours, minutes, 0, 0);

        // Convert to target timezone
        const targetTime = baseDate.toLocaleString('en-US', {
            timeZone: toTimezone,
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        return targetTime;
    }

    // Set user's timezone display
    document.getElementById("user-timezone").textContent = userTimezone;

    // Get current date/time in user's timezone
    const currentDate = new Date('2025-03-15T15:31:16Z');
    const currentDay = currentDate.toLocaleString("en-US", {
        weekday: "long",
        timeZone: userTimezone
    }).toLowerCase();

    const todayDate = currentDate.toLocaleDateString("en-CA", {
        timeZone: userTimezone
    });

    // Function to check if the business is currently open in user's timezone
    function isBusinessOpen(dayOfWeek) {
        const nowUserTimezone = new Date(); // Current time in user's timezone
        const todayHoursEST = businessHoursEST[dayOfWeek];

        if (!todayHoursEST) return "Closed";

        // Convert business hours from EST to user's timezone
        const openTimeUser = convertTimeToTimezone(todayHoursEST.open, userTimezone);
        const closeTimeUser = convertTimeToTimezone(todayHoursEST.close, userTimezone);

        // Get current time in user's timezone in the same format
        const nowFormattedUser = nowUserTimezone.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

        // Helper function to compare times
        function compareTimes(time1, time2) {
            const [t1, p1] = time1.split(' ');
            const [h1, m1] = t1.split(':').map(Number);
            const [t2, p2] = time2.split(' ');
            const [h2, m2] = t2.split(':').map(Number);

            let hours1 = h1;
            if (p1 === 'PM' && h1 !== 12) hours1 += 12;
            if (p1 === 'AM' && h1 === 12) hours1 = 0;

            let hours2 = h2;
            if (p2 === 'PM' && h2 !== 12) hours2 += 12;
            if (p2 === 'AM' && h2 === 12) hours2 = 0;

            if (hours1 < hours2) return -1;
            if (hours1 > hours2) return 1;
            if (m1 < m2) return -1;
            if (m1 > m2) return 1;
            return 0;
        }

        const isOpen = compareTimes(nowFormattedUser, openTimeUser) >= 0 && compareTimes(nowFormattedUser, closeTimeUser) < 0;

        return isOpen ? "Open" : "Closed";
    }

    // Render business hours
    const hoursContainer = document.getElementById("hours-container");
    hoursContainer.innerHTML = "";

    // Display regular hours in user's timezone
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

    // Update status in user's timezone
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

    // Helper function to capitalize first letter
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
