document.addEventListener("DOMContentLoaded", function() {
    const businessHours = {
        sunday: "10:00 AM - 11:00 PM",
        monday: "10:00 AM - 11:00 PM",
        tuesday: "10:00 AM - 11:00 PM",
        wednesday: "10:00 AM - 11:00 PM",
        thursday: "10:00 AM - 11:00 PM",
        friday: "10:00 AM - 11:00 PM",
        saturday: "10:00 AM - 11:00 PM"
    };

    const holidayHours = {
        "2025-03-14": { name: "Test Event", hours: "Closed" },
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
        "2026-02-27": { name: "Bus Army Dude's Birthday", hours: "Closed" },
        "2026-05-26": { name: "Memorial Day", hours: "Closed" },
        "2026-07-04": { name: "Independence Day", hours: "Closed" },
        "2026-09-01": { name: "Labor Day", hours: "Closed" },
        "2026-09-01": { name: "Columbus Day", hours: "10:00 AM - 11:00 PM" },
        "2026-11-11": { name: "Veterans Day", hours: "Closed" },
        "2026-11-27": { name: "Thanksgiving Day", hours: "Closed" },
        "2026-12-24": { name: "Christmas Eve", hours: "10:00 AM - 6:00 PM" },
        "2026-12-25": { name: "Christmas Day", hours: "Closed" },
        "2026-12-31": { name: "New Year's Eve", hours: "Closed" },
        "2027-01-01": { name: "New Year's Day", hours: "Closed" }
    };

    const hoursContainer = document.getElementById("hours-container");
    const currentDay = new Date().toLocaleString("en-US", { weekday: 'long' }).toLowerCase();
    const todayDate = new Date().toISOString().split('T')[0];
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Display user's timezone
    document.getElementById('user-timezone').textContent = userTimezone;

    // Render business hours
    for (const [day, hours] of Object.entries(businessHours)) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("hours-row");
        if (day === currentDay) {
            dayElement.classList.add("highlight");
        }
        dayElement.id = day;
        dayElement.innerHTML = `<strong>${capitalize(day)}:</strong> <span>${hours}</span>`;
        hoursContainer.appendChild(dayElement);
    }

    // Highlight today's hours
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Check for holiday hours
    if (holidayHours[todayDate]) {
        const holidayAlert = document.getElementById("holiday-alert");
        document.getElementById("holiday-name").textContent = holidayHours[todayDate].name;
        document.getElementById("holiday-hours").textContent = holidayHours[todayDate].hours;
        holidayAlert.style.display = "block";
    }

    // Update open/closed status
    updateStatus();

    function updateStatus() {
        const now = new Date();
        let currentDayHours = businessHours[currentDay];

        // Check if today is a holiday and use holiday hours if available
        if (holidayHours[todayDate]) {
            currentDayHours = holidayHours[todayDate].hours;
        }

        // If hours are "Closed" for holidays, set status accordingly
        if (currentDayHours === "Closed") {
            setStatus("Closed", "red");
            return;
        }

        const [openTime, closeTime] = currentDayHours.split(" - ").map(time => convertTo24Hour(time));
        const openDate = new Date(`${now.toDateString()} ${openTime}`);
        const closeDate = new Date(`${now.toDateString()} ${closeTime}`);

        if (now >= openDate && now <= closeDate) {
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

    function convertTo24Hour(time) {
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":");
        if (hours === "12") {
            hours = "00";
        }
        if (modifier === "PM" && hours !== "12") {
            hours = parseInt(hours, 10) + 12;
        }
        return `${hours}:${minutes}`;
    }
});
