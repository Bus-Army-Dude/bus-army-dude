document.addEventListener("DOMContentLoaded", function() {
    const businessHours = {
        sunday: "9:00 AM - 5:00 PM",
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 5:00 PM",
        saturday: "9:00 AM - 5:00 PM"
    };

    const holidayHours = {
        "2025-12-25": "Closed",
        "2025-01-01": "10:00 AM - 2:00 PM"
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
        dayElement.textContent = `${capitalize(day)}: ${hours}`;
        hoursContainer.appendChild(dayElement);
    }

    // Highlight today's hours
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Check for holiday hours
    if (holidayHours[todayDate]) {
        const holidayAlert = document.getElementById("holiday-alert");
        document.getElementById("holiday-name").textContent = "Today's Holiday";
        document.getElementById("holiday-hours").textContent = holidayHours[todayDate];
        holidayAlert.style.display = "block";
    }

    // Update open/closed status
    updateStatus();

    function updateStatus() {
        const now = new Date();
        const currentDayHours = businessHours[currentDay];
        const [openTime, closeTime] = currentDayHours.split(" - ").map(time => convertTo24Hour(time));
        const openDate = new Date(`${now.toDateString()} ${openTime}`);
        const closeDate = new Date(`${now.toDateString()} ${closeTime}`);

        const statusElement = document.getElementById("open-status");
        if (now >= openDate && now <= closeDate) {
            statusElement.textContent = "Open";
            statusElement.style.color = "green";
        } else {
            statusElement.textContent = "Closed";
            statusElement.style.color = "red";
        }
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
