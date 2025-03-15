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
        const [timePart, modifier] = time.split(" ");
        const [hours, minutes] = timePart.split(":");
        let hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);

        if (modifier === "PM" && hour !== 12) hour += 12;
        if (modifier === "AM" && hour === 12) hour = 0;

        const nowEST = new Date();
        nowEST.toLocaleString('en-US', { timeZone: 'America/New_York' }); // Ensure it's in EST context

        nowEST.setHours(hour - 5, minute, 0, 0); // Subtract 5 for EST offset (can have issues with DST)

        const options = { timeZone: toTimezone, hour: '2-digit', minute: '2-digit', hour12: true };
        return nowEST.toLocaleString('en-US', options);
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

        // Function to create a Date object for a given time in EST on the current day
        function createESTDate(timeStr) {
            const [time, modifier] = timeStr.split(" ");
            let [hours, minutes] = time.split(":");
            hours = parseInt(hours, 10);
            minutes = parseInt(minutes, 10);

            if (modifier === "PM" && hours !== 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            const nowUserTime = new Date();
            const year = nowUserTime.getFullYear();
            const month = nowUserTime.getMonth();
            const dayOfMonth = nowUserTime.getDate();

            return new Date(Date.UTC(year, month, dayOfMonth, hours - 5, minutes, 0)); // Still using manual offset - let's try another way
        }

        const openTimeEST = todayHoursEST.open;
        const closeTimeEST = todayHoursEST.close;

        const openDateEST = createESTDate(openTimeEST);
        const closeDateEST = createESTDate(closeTimeEST);

        const openDateUser = new Date(openDateEST.toLocaleString('en-US', { timeZone: userTimezone }));
        const closeDateUser = new Date(closeDateEST.toLocaleString('en-US', { timeZone: userTimezone }));

        if (nowUser >= openDateUser && nowUser < closeDateUser) {
            return "Open";
        } else {
            return "Closed";
        }
    }

    // Set the open/closed status for today
    document.getElementById("open-status").textContent = isBusinessOpen(businessHoursEST, currentDay, userTimezone);

    // Check for holiday hours
    const holidayAlertElement = document.getElementById("holiday-alert");
    const holidayNameElement = document.getElementById("holiday-name");
    const holidayHoursElement = document.getElementById("holiday-hours");

    if (holidayHours[todayDate]) {
        const holidayDetails = holidayHours[todayDate];
        const specialHours = holidayDetails.hours === "Closed"
            ? "Closed"
            : convertTimeToTimezone(holidayDetails.hours, userTimezone);

        holidayNameElement.textContent = holidayDetails.name;
        holidayHoursElement.textContent = specialHours;
        holidayAlertElement.style.display = "block";
    } else {
        holidayAlertElement.style.display = "none";
    }

    // Function to capitalize the first letter of the day
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
