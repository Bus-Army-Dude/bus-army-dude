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
        "2025-02-17": { name: "Presidents' Day", hours: "Closed" },
        "2025-03-15": { name: "Out Of Office", hours: "10:00 AM - 12:00 PM" },
        "2025-12-25": { name: "Christmas Day", hours: "Closed" }
    };

    // Temporary Unavailability
    const temporaryHours = {
        "2025-04-02": [
            { from: "6:30 PM", to: "7:30 PM", reason: "Personal Break" }
        ],
        "2025-04-03": [
            { from: "2:00 PM", to: "3:00 PM", reason: "Doctor's Appointment" }
        ]
    };

    // Get user's current timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userTimezoneElement = document.getElementById("user-timezone");
    userTimezoneElement.textContent = userTimezone; // Populate the user's timezone in the UI

    // Helper function to convert time from EST to user's timezone
    function convertTimeToTimezone(timeStr, toTimezone) {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        let estHours = hours;
        if (period === 'PM' && hours !== 12) estHours += 12;
        if (period === 'AM' && hours === 12) estHours = 0;

        const dateEST = new Date(`2025-04-02T${estHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00-04:00`);

        return dateEST.toLocaleString('en-US', {
            timeZone: toTimezone,
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    // Get current date/time in user's timezone
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleString("en-US", { weekday: "long", timeZone: userTimezone }).toLowerCase();
    const todayDate = currentDate.toLocaleDateString("en-CA", { timeZone: userTimezone });

    // Function to check if the business is currently open
    function isBusinessOpen(dayOfWeek, todayDate) {
        const nowEST = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const currentHourEST = nowEST.getHours();
        const currentMinuteEST = nowEST.getMinutes();
        const currentMinutesEST = currentHourEST * 60 + currentMinuteEST;

        let openTimeEST, closeTimeEST;

        if (holidayHours[todayDate]) {
            const holidayDetails = holidayHours[todayDate];
            if (holidayDetails.hours === "Closed") return "Closed";
            [openTimeEST, closeTimeEST] = holidayDetails.hours.split(" - ");
        } else {
            const todayHoursEST = businessHoursEST[dayOfWeek];
            if (!todayHoursEST || !todayHoursEST.open) return "Closed";
            openTimeEST = todayHoursEST.open;
            closeTimeEST = todayHoursEST.close;
        }

        if (!openTimeEST || !closeTimeEST) return "Closed";

        const parseTime = (timeStr) => {
            const [time, period] = timeStr.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            let hour = hours;
            if (period === 'PM' && hours !== 12) hour += 12;
            if (period === 'AM' && hours === 12) hour = 0;
            return hour * 60 + minutes;
        };

        const openMinutes = parseTime(openTimeEST);
        const closeMinutes = parseTime(closeTimeEST);

        // Check if currently within temporary unavailable period
        if (temporaryHours[todayDate]) {
            for (const { from, to } of temporaryHours[todayDate]) {
                const fromMinutes = parseTime(from);
                const toMinutes = parseTime(to);
                if (currentMinutesEST >= fromMinutes && currentMinutesEST < toMinutes) {
                    return "Temporarily Unavailable";
                }
            }
        }

        return currentMinutesEST >= openMinutes && currentMinutesEST < closeMinutes ? "Open" : "Closed";
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
    statusElement.className = status.toLowerCase().replace(/\s+/g, "-");

    // Check for holiday hours
    const holidayAlertElement = document.getElementById("holiday-alert");
    const holidayNameElement = document.getElementById("holiday-name");
    const holidayHoursElement = document.getElementById("holiday-hours");

    if (holidayHours[todayDate]) {
        const holidayDetails = holidayHours[todayDate];
        let specialHours = holidayDetails.hours === "Closed" ? "Closed" : holidayDetails.hours;

        holidayNameElement.textContent = holidayDetails.name;
        holidayHoursElement.textContent = specialHours;
        holidayAlertElement.style.display = "block";
    } else {
        holidayAlertElement.style.display = "none";
    }

    // Check for temporary unavailability
    const tempAlertElement = document.getElementById("temporary-alert");
    const tempHoursElement = document.getElementById("temporary-hours");

    if (temporaryHours[todayDate]) {
        const activeTemp = temporaryHours[todayDate].find(({ from, to }) => {
            const nowEST = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
            const currentMinutesEST = nowEST.getHours() * 60 + nowEST.getMinutes();

            const parseTime = (timeStr) => {
                const [time, period] = timeStr.split(' ');
                const [hours, minutes] = time.split(':').map(Number);
                let hour = hours;
                if (period === 'PM' && hours !== 12) hour += 12;
                if (period === 'AM' && hours === 12) hour = 0;
                return hour * 60 + minutes;
            };

            return currentMinutesEST >= parseTime(from) && currentMinutesEST < parseTime(to);
        });

        if (activeTemp) {
            tempHoursElement.textContent = `${convertTimeToTimezone(activeTemp.from, userTimezone)} - ${convertTimeToTimezone(activeTemp.to, userTimezone)}`;
            tempAlertElement.style.display = "block";
        } else {
            tempAlertElement.style.display = "none";
        }
    } else {
        tempAlertElement.style.display = "none";
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
