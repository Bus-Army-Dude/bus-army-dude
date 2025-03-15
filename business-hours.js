document.addEventListener("DOMContentLoaded", function () {
    const businessHours = {
        sunday: "10:00 AM - 11:00 PM",
        monday: "10:00 AM - 11:00 PM",
        tuesday: "10:00 AM - 11:00 PM",
        wednesday: "10:00 AM - 11:00 PM",
        thursday: "10:00 AM - 11:00 PM",
        friday: "10:00 AM - 11:00 PM",
        saturday: "10:00 AM - 11:00 PM",
    };

    const holidayHours = {
        "2025-05-26": { name: "Memorial Day", hours: "Closed" },
        "2025-07-04": { name: "Independence Day", hours: "Closed" },
        "2025-09-01": { name: "Labor Day", hours: "Closed" },
        "2025-09-01": { name: "Columbus Day", hours: "10:00 AM - 11:00 PM" },
        "2025-11-11": { name: "Veterans Day", hours: "Closed" },
        "2025-11-27": { name: "Thanksgiving Day", hours: "Closed" },
        "2025-12-24": { name: "Christmas Eve", hours: "10:00 AM - 6:00 PM" },
        "2025-12-25": { name: "Christmas Day", hours: "Closed" },
        "2025-12-31": { name: "New Year's Eve", hours: "Closed" },
        "2026-01-01": { name: "New Year's Day", hours: "Closed" },
        "2026-01-20": { name: "Martin Luther King Jr. Day", hours: "Closed" },
    };

    const hoursContainer = document.getElementById("hours-container");

    const currentDay = new Date().toLocaleString("en-US", { weekday: "long", timeZone: "America/New_York" }).toLowerCase();
    const todayDate = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    document.getElementById("user-timezone").textContent = userTimezone;

    // Render business hours in user's timezone
    for (const [day, hours] of Object.entries(businessHours)) {
        const convertedHours = convertHoursToUserTimezone(hours, "America/New_York", userTimezone);
        const dayElement = document.createElement("div");
        dayElement.classList.add("hours-row");
        if (day === currentDay) {
            dayElement.classList.add("highlight");
        }
        dayElement.innerHTML = `<strong>${capitalize(day)}:</strong> <span>${convertedHours}</span>`;
        hoursContainer.appendChild(dayElement);
    }

    if (holidayHours[todayDate]) {
        const holidayDetails = holidayHours[todayDate];
        const specialHours = holidayDetails.hours === "Closed" 
            ? "Closed" 
            : convertHoursToUserTimezone(holidayDetails.hours, "America/New_York", userTimezone);
        document.getElementById("holiday-name").textContent = holidayDetails.name;
        document.getElementById("holiday-hours").textContent = specialHours;
        document.getElementById("holiday-alert").style.display = "block";
    } else {
        document.getElementById("holiday-alert").style.display = "none";
    }

    updateStatus();

    function updateStatus() {
        let currentHours = businessHours[currentDay];
        if (holidayHours[todayDate]) {
            currentHours = holidayHours[todayDate].hours;
        }
        if (currentHours === "Closed") {
            setStatus("Closed", "red");
            return;
        }

        const [openStr, closeStr] = currentHours.split(" - ");
        const openDateUser = convertTimeToTarget(openStr, "America/New_York", userTimezone);
        const closeDateUser = convertTimeToTarget(closeStr, "America/New_York", userTimezone);
        const nowUser = new Date();
        if (nowUser >= openDateUser && nowUser <= closeDateUser) {
            setStatus("Open", "green");
        } else {
            setStatus("Closed", "red");
        }
    }

    function setStatus(statusText, color) {
        const statusElement = document.getElementById("open-status");
        statusElement.textContent = statusText;
        statusElement.style.color = color;
    }

    // Helper function to convert time string to user's timezone
    function convertTimeToTarget(timeStr, fromTz, toTz) {
        const today = new Date().toLocaleDateString("en-US", { timeZone: fromTz });
        const dateTimeStr = `${today} ${timeStr}`;
        const dateInFromTz = new Date(dateTimeStr).toLocaleString("en-US", { timeZone: fromTz });
        const dateInUserTz = new Date(dateInFromTz).toLocaleString("en-US", { timeZone: toTz });
        return new Date(dateInUserTz);
    }

    function convertHoursToUserTimezone(hours, fromTimezone, toTimezone) {
        if (hours === "Closed") return hours;
        const [openStr, closeStr] = hours.split(" - ");
        const openDate = convertTimeToTarget(openStr, fromTimezone, toTimezone);
        const closeDate = convertTimeToTarget(closeStr, fromTimezone, toTimezone);
        const openFormatted = openDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        const closeFormatted = closeDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        return `${openFormatted} - ${closeFormatted}`;
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
