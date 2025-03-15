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
        const dateEST = new Date(`2025-01-01T${time}:00-05:00`); // Using a fixed date for time manipulation, assuming EST offset
        const options = { timeZone: toTimezone, hour: '2-digit', minute: '2-digit', hour12: true };
        return dateEST.toLocaleString('en-US', options);
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

            // Create a date in EST (using "America/New_York" timezone)
            return new Date(nowUserTime.toLocaleString('en-US', {
                timeZone: 'America/New_York',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$1-$2T$4:$5:$6'));
        }

        const openTimeEST = todayHoursEST.open;
        const closeTimeEST = todayHoursEST.close;

        const openDateEST = createESTDate(openTimeEST);
        const closeDateEST = createESTDate(closeTimeEST);

        // Convert EST times to user's timezone for comparison
        const openDateUser = new Date(openDateEST.toLocaleString('en-US', { timeZone: userTimezone }));
        const closeDateUser = new Date(closeDateEST.toLocaleString('en-US', { timeZone: userTimezone }));

        // Compare current time in user's timezone
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
