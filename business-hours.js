document.addEventListener("DOMContentLoaded", function () {
    // Business hours in Eastern Time (ET)
    const businessHoursET = {
        sunday: { open: null, close: null },  // Closed all day
        monday: { open: "10:00 AM", close: "11:00 PM" },
        tuesday: { open: "10:00 AM", close: "11:00 PM" },
        wednesday: { open: "10:00 AM", close: "11:00 PM" },
        thursday: { open: "10:00 AM", close: "11:00 PM" },
        friday: { open: "10:00 AM", close: "11:00 PM" },
        saturday: { open: "10:00 AM", close: "11:00 PM" }
    };

    // Holiday hours in Eastern Time (ET)
    const holidayHours = {
        "2025-01-01": { name: "New Year's Day", hours: "Closed" },
        "2025-01-20": { name: "Martin Luther King Jr. Day", hours: "10:00 AM - 6:00 PM" },
        "2025-02-17": { name: "Presidents' Day", hours: "10:00 AM - 6:00 PM" },
        "2025-04-20": { name: "Easter Sunday", hours: "Closed" },
        "2025-05-26": { name: "Memorial Day", hours: "10:00 AM - 6:00 PM" },
        "2025-07-04": { name: "Independence Day", hours: "Closed" },
        "2025-09-01": { name: "Labor Day", hours: "10:00 AM - 6:00 PM" },
        "2025-10-13": { name: "Columbus Day", hours: "10:00 AM - 6:00 PM" },
        "2025-11-11": { name: "Veterans Day", hours: "10:00 AM - 6:00 PM" },
        "2025-11-27": { name: "Thanksgiving Day", hours: "Closed" },
        "2025-12-24": { name: "Christmas Eve", hours: "10:00 AM - 6:00 PM" },
        "2025-12-25": { name: "Christmas Day", hours: "Closed" },
        "2025-12-31": { name: "New Year's Eve", hours: "10:00 AM - 6:00 PM" }
    };

    // Temporary unavailability periods (Eastern Time)
    const unavailableTimesET = {
        "2025-04-02": [
            { start: "1:00 PM", end: "2:00 PM", reason: "Test" },
            { start: "2:00 PM", end: "3:00 PM", reason: "Group Meeting" },
            { start: "4:30 PM", end: "5:30 PM", reason: "Work Meeting" }
        ]
    };

    // Detect user's time zone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById("user-timezone").textContent = userTimeZone;

    // Get current date/time in user's local time zone
    const currentDate = new Date();
    const todayDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const currentDay = currentDate.toLocaleString("en-US", { weekday: "long", timeZone: userTimeZone }).toLowerCase();

    // Function to convert ET time to user's local time zone
    function convertETtoUserTime(etTimeStr) {
        if (!etTimeStr) return "Closed";

        // Convert "10:00 AM" to a Date object in ET
        const [time, period] = etTimeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let estHours = hours;
        if (period === 'PM' && hours !== 12) estHours += 12;
        if (period === 'AM' && hours === 12) estHours = 0;

        // Create Date object in ET
        const etDate = new Date();
        etDate.setHours(estHours, minutes, 0, 0);

        // Convert to user's local time zone
        return etDate.toLocaleTimeString("en-US", {
            timeZone: userTimeZone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    }

    // Check if business is open
    function isBusinessOpen(dayOfWeek, todayDate) {
        const nowET = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
        const currentMinutesET = nowET.getHours() * 60 + nowET.getMinutes();

        let openTimeET, closeTimeET;

        if (holidayHours[todayDate]) {
            if (holidayHours[todayDate].hours === "Closed") return "Closed";
            [openTimeET, closeTimeET] = holidayHours[todayDate].hours.split(" - ");
        } else {
            const todayHoursET = businessHoursET[dayOfWeek];
            if (!todayHoursET || !todayHoursET.open || !todayHoursET.close) return "Closed";
            openTimeET = todayHoursET.open;
            closeTimeET = todayHoursET.close;
        }

        // Convert ET time to minutes
        const parseTime = (timeStr) => {
            const [time, period] = timeStr.split(" ");
            const [hours, minutes] = time.split(":").map(Number);
            let hour = hours;
            if (period === "PM" && hours !== 12) hour += 12;
            if (period === "AM" && hours === 12) hour = 0;
            return hour * 60 + minutes;
        };

        const openMinutes = parseTime(openTimeET);
        const closeMinutes = parseTime(closeTimeET);

        // Check for temporary unavailability
        if (unavailableTimesET[todayDate]) {
            for (const { start, end, reason } of unavailableTimesET[todayDate]) {
                const startMinutes = parseTime(start);
                const endMinutes = parseTime(end);
                if (currentMinutesET >= startMinutes && currentMinutesET < endMinutes) {
                    return `Temporarily Unavailable (${reason})`;
                }
            }
        }

        return (currentMinutesET >= openMinutes && currentMinutesET < closeMinutes) ? "Open" : "Closed";
    }

    // Display business hours
    const hoursContainer = document.getElementById("hours-container");
    hoursContainer.innerHTML = "";

    for (const [day, { open, close }] of Object.entries(businessHoursET)) {
        const convertedOpen = open ? convertETtoUserTime(open) : "Closed";
        const convertedClose = close ? convertETtoUserTime(close) : "Closed";

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
    statusElement.className = status.toLowerCase().replace(/\s+/g, "-");

    // Show holiday notice if applicable
    const holidayAlertElement = document.getElementById("holiday-alert");
    if (holidayHours[todayDate]) {
        holidayAlertElement.textContent = `Special Hours: ${holidayHours[todayDate].name} - ${holidayHours[todayDate].hours}`;
        holidayAlertElement.style.display = "block";
    } else {
        holidayAlertElement.style.display = "none";
    }

    // Helper function to capitalize first letter
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
