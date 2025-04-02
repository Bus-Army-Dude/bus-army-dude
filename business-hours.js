document.addEventListener("DOMContentLoaded", function () {
    // Business hours in EST (Eastern Standard Time)
    const businessHoursEST = {
        sunday: { open: null, close: null },  // Closed all day
        monday: { open: "10:00 AM", close: "11:00 PM" },
        tuesday: { open: "10:00 AM", close: "11:00 PM" },
        wednesday: { open: "10:00 AM", close: "11:00 PM" },
        thursday: { open: "10:00 AM", close: "11:00 PM" },
        friday: { open: "10:00 AM", close: "11:00 PM" },
        saturday: { open: "10:00 AM", close: "11:00 PM" }
    };

    // Holiday hours
    const holidayHours = {
        "2025-01-01": { name: "New Year's Day", hours: "Closed" },
        "2025-01-20": { name: "Martin Luther King Jr. Day", hours: "Closed" },
        "2025-02-17": { name: "Presidents' Day", hours: "Closed" },
        "2025-02-27": { name: "Bus Army Dude's Birthday", hours: "Closed" },
        "2025-03-15": { name: "Out Of Office", hours: "10:00 AM - 12:00 PM" },
        "2025-05-26": { name: "Memorial Day", hours: "Closed" },
        "2025-07-04": { name: "Independence Day", hours: "Closed" },
        "2025-09-01": { name: "Labor Day", hours: "Closed" },
        "2025-10-13": { name: "Columbus Day", hours: "10:00 AM - 11:00 PM" },
        "2025-11-11": { name: "Veterans Day", hours: "Closed" },
        "2025-11-27": { name: "Thanksgiving Day", hours: "Closed" },
        "2025-12-24": { name: "Christmas Eve", hours: "10:00 AM - 06:00 PM" },
        "2025-12-25": { name: "Christmas Day", hours: "Closed" },
        "2025-12-31": { name: "New Year's Eve", hours: "10:00 AM - 06:00 PM" },
        "2026-01-01": { name: "New Year's Day", hours: "Closed" }
    };

    // Get user's current timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Helper function to convert time from EST to user's timezone
    function convertTimeToTimezone(timeStr, toTimezone) {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        let estHours = hours;
        if (period === 'PM' && hours !== 12) estHours += 12;
        if (period === 'AM' && hours === 12) estHours = 0;

        const dateEST = new Date('2025-03-15T' + estHours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':00-04:00');

        const targetTime = dateEST.toLocaleString('en-US', {
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
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleString("en-US", {
        weekday: "long",
        timeZone: userTimezone
    }).toLowerCase();

    const todayDate = currentDate.toLocaleDateString("en-CA", {
        timeZone: userTimezone
    });

    // Function to check if the business is currently open (comparing times in EST)
    function isBusinessOpen(dayOfWeek, todayDate) {
        const now = new Date();
        const nowEST = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const currentHourEST = nowEST.getHours();
        const currentMinuteEST = nowEST.getMinutes();

        let openTimeEST;
        let closeTimeEST;

        if (holidayHours[todayDate]) {
            const holidayDetails = holidayHours[todayDate];
            if (holidayDetails.hours === "Closed") {
                return "Closed";
            } else {
                [openTimeEST, closeTimeEST] = holidayDetails.hours.split(" - ");
            }
        } else {
            const todayHoursEST = businessHoursEST[dayOfWeek];
            if (!todayHoursEST) return "Closed";
            openTimeEST = todayHoursEST.open;
            closeTimeEST = todayHoursEST.close;
        }

        if (!openTimeEST || !closeTimeEST) {
            return "Closed";
        }

        const parseTime = (timeStr) => {
            const [time, period] = timeStr.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            let hour = hours;
            if (period === 'PM' && hours !== 12) hour += 12;
            if (period === 'AM' && hours === 12) hour = 0;
            return { hour, minute: minutes };
        };

        const openTime = parseTime(openTimeEST);
        const closeTime = parseTime(closeTimeEST);

        const currentMinutes = currentHourEST * 60 + currentMinuteEST;
        const openMinutes = openTime.hour * 60 + openTime.minute;
        const closeMinutes = closeTime.hour * 60 + closeTime.minute;

        const isOpen = (currentMinutes >= openMinutes && currentMinutes < closeMinutes);
        return isOpen ? "Open" : "Closed";
    }

    // Render business hours
    const hoursContainer = document.getElementById("hours-container");
    hoursContainer.innerHTML = "";

    for (const [day, { open, close }] of Object.entries(businessHoursEST)) {
        const convertedOpen = open ? convertTimeToTimezone(open, userTimezone) : "Closed";
        const convertedClose = close ? convertTimeToTimezone(close, userTimezone) : "Closed";

        const dayElement = document.createElement("div");
        dayElement.classList.add("hours-row");

        if (day === currentDay) {
            dayElement.classList.add("current-day");
        }

        dayElement.innerHTML = `<strong>${capitalize(day)}:</strong> <span>${convertedOpen} - ${convertedClose}</span>`;
        hoursContainer.appendChild(dayElement);
    }

    // Update status
    const statusElement = document.getElementById("open-status");
    const status = isBusinessOpen(currentDay, todayDate);
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
