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
        "2025-12-25": { name: "Christmas Day", hours: "Closed" },
        "2025-11-27": { name: "Thanksgiving Day", hours: "Closed" },
    };

    const hoursContainer = document.getElementById("hours-container");
    const currentDay = new Date().toLocaleString("en-US", { weekday: "long", timeZone: "America/New_York" }).toLowerCase();
    const todayDate = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" }); // ISO format for holidays
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Display the user's detected timezone
    document.getElementById('user-timezone').textContent = userTimezone;

    // Render business hours dynamically
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

    // Capitalize the first letter of the day
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Show holiday alert only on matching holiday date
    const holidayAlert = document.getElementById("holiday-alert");
    if (holidayHours[todayDate]) {
        const holidayDetails = holidayHours[todayDate];
        const specialHours = holidayDetails.hours === "Closed" 
            ? "Closed" 
            : convertHoursToUserTimezone(holidayDetails.hours, "America/New_York", userTimezone);

        document.getElementById("holiday-name").textContent = holidayDetails.name;
        document.getElementById("holiday-hours").textContent = specialHours;
        holidayAlert.style.display = "block";
    } else {
        // Hide the holiday alert if there's no holiday
        holidayAlert.style.display = "none";
    }

    // Update Open/Closed Status
    updateStatus();

    function updateStatus() {
        const nowInUserTz = new Date().toLocaleString("en-US", { timeZone: userTimezone });
        let currentDayHours = businessHours[currentDay];

        // Check if today has special holiday hours
        if (holidayHours[todayDate]) {
            currentDayHours = holidayHours[todayDate].hours;
        }

        // If hours are "Closed," reflect it
        if (currentDayHours === "Closed") {
            setStatus("Closed", "red");
            return;
        }

        // Parse and compare open and close times
        const [openTime, closeTime] = currentDayHours.split(" - ").map(time => convertTo24Hour(time));
        const now = new Date(nowInUserTz);

        const openDateTime = new Date(`${now.toLocaleDateString()} ${openTime}`);
        const closeDateTime = new Date(`${now.toLocaleDateString()} ${closeTime}`);

        // Determine the Open/Closed status
        if (now >= openDateTime && now <= closeDateTime) {
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

    // Convert time to 24-hour format
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

    // Convert business hours to user’s timezone
    function convertHoursToUserTimezone(hours, fromTimezone, toTimezone) {
        if (hours === "Closed") return hours; // No conversion needed for "Closed"
        const [openTime, closeTime] = hours.split(" - ");
        const openDate = new Date(`1970-01-01T${convertTo24Hour(openTime)}Z`);
        const closeDate = new Date(`1970-01-01T${convertTo24Hour(closeTime)}Z`);

        const openTimeConverted = openDate.toLocaleTimeString("en-US", { timeZone: toTimezone, hour: "2-digit", minute: "2-digit" });
        const closeTimeConverted = closeDate.toLocaleTimeString("en-US", { timeZone: toTimezone, hour: "2-digit", minute: "2-digit" });

        return `${openTimeConverted} - ${closeTimeConverted}`;
    }
});
