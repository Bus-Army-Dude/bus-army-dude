document.addEventListener("DOMContentLoaded", function () {
    // Original business hours in EST
    const businessHoursEST = {
        sunday: { open: "10:00 AM", close: "11:00 PM" },
        monday: { open: "10:00 AM", close: "11:00 PM" },
        tuesday: { open: "10:00 AM", close: "11:00 PM" },
        wednesday: { open: "10:00 AM", close: "11:00 PM" },
        thursday: { open: "10:00 AM", close: "11:00 PM" },
        friday: { open: "10:00 AM", close: "11:00 PM" },
        saturday: { open: "10:00 AM", close: "11:00 PM" },
    };

    // Example of holiday hours
    const holidayHours = {
        "2025-12-25": { name: "Christmas Day", hours: "Closed" },
        "2025-01-01": { name: "New Year's Day", hours: "10:00 AM - 04:00 PM" },
    };

    // Get the user's timezone dynamically
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Get current day in user's timezone
    const currentDateUserTimezone = new Date();
    const currentDay = currentDateUserTimezone.toLocaleString("en-US", { weekday: "long", timeZone: userTimezone }).toLowerCase();
    const todayDate = currentDateUserTimezone.toLocaleDateString("en-CA", { timeZone: userTimezone });

    // Function to convert time from EST to any other timezone
    function convertTimeToTimezone(time, toTimezone) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();

        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":");
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        const localDate = new Date(year, month, day, hours, minutes);

        const estFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const estTimeString = estFormatter.format(localDate);
        const [estHourMinute, estAMPM] = estTimeString.split(' ');
        const [estHour, estMinute] = estHourMinute.split(':');
        let estHours = parseInt(estHour, 10);
        if (estAMPM === 'PM' && estHours !== 12) estHours += 12;
        if (estAMPM === 'AM' && estHours === 12) estHours = 0;

        const estDate = new Date(year, month, day, estHours, parseInt(estMinute));

        const targetFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: toTimezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return targetFormatter.format(estDate);
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
            dayElement.classList.add("current-day"); // Add a class for highlighting
        }

        dayElement.innerHTML = `<strong>${capitalize(day)}:</strong> <span>${convertedOpen} - ${convertedClose}</span>`;
        hoursContainer.appendChild(dayElement);
    }

    // Function to check if the business is open in the user's timezone
    function isBusinessOpen(businessHoursEST, dayOfWeek, userTimezone) {
        const todayHoursEST = businessHoursEST[dayOfWeek];
        if (!todayHoursEST) {
            return "Closed"; // Default to closed if no hours for today
        }

        const nowUser = new Date();

        function createESTDate(timeStr) {
            const [timePart, modifier] = timeStr.split(" ");
            let [hours, minutes] = timePart.split(":");
            hours = parseInt(hours, 10);
            minutes = parseInt(minutes, 10);

            if (modifier === "PM" && hours !== 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            const nowUserTime = new Date();
            const year = nowUserTime.getFullYear();
            const month = nowUserTime.getMonth();
            const dayOfMonth = nowUserTime.getDate();

            return new Date(year, month, dayOfMonth, hours, minutes);
        }

        const openTimeEST = todayHoursEST.open;
        const closeTimeEST = todayHoursEST.close;

        const openDateEST = createESTDate(openTimeEST);
        const closeDateEST = createESTDate(closeTimeEST);

        const estFormatterOpen = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: true });
        const openTimeUser = new Date(openDateEST.toLocaleString('en-US', estFormatterOpen, { timeZone: userTimezone }));
        const closeTimeUser = new Date(closeDateEST.toLocaleString('en-US', estFormatterOpen, { timeZone: userTimezone }));

        const nowUserCompare = new Date();

        const userFormatter = new Intl.DateTimeFormat('en-US', { timeZone: userTimezone, hour: '2-digit', minute: '2-digit', hour12: true });
        const nowUserTimeStr = userFormatter.format(nowUserCompare);

        const openFormatterUser = new Intl.DateTimeFormat('en-US', { timeZone: userTimezone, hour: '2-digit', minute: '2-digit', hour12: true });
        const closeFormatterUser = new Intl.DateTimeFormat('en-US', { timeZone: userTimezone, hour: '2-digit', minute: '2-digit', hour12: true });

        const openTimeUserStr = openFormatterUser.format(openTimeUser);
        const closeTimeUserStr = closeFormatterUser.format(closeTimeUser);

        if (nowUserTimeStr >= openTimeUserStr && nowUserTimeStr < closeTimeUserStr) {
            return "Open";
        } else {
            return "Closed";
        }
    }

    const statusElement = document.getElementById("open-status");
    const status = isBusinessOpen(businessHoursEST, currentDay, userTimezone);
    statusElement.textContent = status;
    statusElement.className = status.toLowerCase(); // Add class 'open' or 'closed' for styling

    // Function to capitalize the first letter of the day
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Check for holiday hours and apply timezone conversion
    const holidayAlertElement = document.getElementById("holiday-alert");
    const holidayNameElement = document.getElementById("holiday-name");
    const holidayHoursElement = document.getElementById("holiday-hours");

    if (holidayHours[todayDate]) {
        const holidayDetails = holidayHours[todayDate];

        let specialHours;
        if (holidayDetails.hours === "Closed") {
            specialHours = "Closed";
        } else {
            // Convert holiday hours to user's timezone
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
});
