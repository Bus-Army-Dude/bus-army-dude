document.addEventListener("DOMContentLoaded", function () {
    // Business hours in EST (Eastern Standard Time) using 24-hour format
    const businessHoursEST = {
        sunday: { open: 10, close: 23 },    // 10:00 AM - 11:00 PM
        monday: { open: 10, close: 23 },
        tuesday: { open: 10, close: 23 },
        wednesday: { open: 10, close: 23 },
        thursday: { open: 10, close: 23 },
        friday: { open: 10, close: 23 },
        saturday: { open: 10, close: 23 }
    };

    // Holiday hours (using ISO dates)
    const holidayHours = {
        // 2025
        "2025-01-01": { name: "New Year's Day", open: 10, close: 16 },
        "2025-01-20": { name: "Martin Luther King Jr. Day", open: null, close: null, hours: "Closed" },
        "2025-02-17": { name: "Presidents' Day", open: null, close: null, hours: "Closed" },
        "2025-02-27": { name: "Bus Army Dude's Birthday", open: null, close: null, hours: "Closed" },
        "2025-03-15": { name: "Out Of Office", open: 10, close: 14 },
        "2025-05-26": { name: "Memorial Day", open: null, close: null, hours: "Closed" },
        "2025-07-04": { name: "Independence Day", open: null, close: null, hours: "Closed" },
        "2025-09-01": { name: "Labor Day", open: null, close: null, hours: "Closed" },
        "2025-10-13": { name: "Columbus Day", open: 10, close: 23 },
        "2025-11-11": { name: "Veterans Day", open: null, close: null, hours: "Closed" },
        "2025-11-27": { name: "Thanksgiving Day", open: null, close: null, hours: "Closed" },
        "2025-12-24": { name: "Christmas Eve", open: 10, close: 18 },
        "2025-12-25": { name: "Christmas Day", open: null, close: null, hours: "Closed" },
        "2025-12-31": { name: "New Year's Eve", open: 10, close: 18 },
    
        // 2026
        "2026-01-01": { name: "New Year's Day", open: null, close: null, hours: "Closed" },
        "2026-01-19": { name: "Martin Luther King Jr. Day", open: null, close: null, hours: "Closed" },
        "2026-02-16": { name: "Presidents' Day", open: null, close: null, hours: "Closed" },
        "2026-02-27": { name: "Bus Army Dude's Birthday", open: null, close: null, hours: "Closed" },
        "2026-05-25": { name: "Memorial Day", open: null, close: null, hours: "Closed" },
        "2026-07-04": { name: "Independence Day", open: null, close: null, hours: "Closed" },
        "2026-09-07": { name: "Labor Day", open: null, close: null, hours: "Closed" },
        "2026-10-12": { name: "Columbus Day", open: 10, close: 23 },
        "2026-11-11": { name: "Veterans Day", open: null, close: null, hours: "Closed" },
        "2026-11-26": { name: "Thanksgiving Day", open: null, close: null, hours: "Closed" },
        "2026-12-24": { name: "Christmas Eve", open: 10, close: 18 },
        "2026-12-25": { name: "Christmas Day", open: null, close: null, hours: "Closed" },
        "2026-12-31": { name: "New Year's Eve", open: 10, close: 18 },
    
        // 2027
        "2027-01-01": { name: "New Year's Day", open: null, close: null, hours: "Closed" },
        "2027-01-18": { name: "Martin Luther King Jr. Day", open: null, close: null, hours: "Closed" },
        "2027-02-15": { name: "Presidents' Day", open: null, close: null, hours: "Closed" },
        "2027-02-27": { name: "Bus Army Dude's Birthday", open: null, close: null, hours: "Closed" },
        "2027-05-31": { name: "Memorial Day", open: null, close: null, hours: "Closed" },
        "2027-07-04": { name: "Independence Day", open: null, close: null, hours: "Closed" },
        "2027-09-06": { name: "Labor Day", open: null, close: null, hours: "Closed" },
        "2027-10-11": { name: "Columbus Day", open: 10, close: 23 },
        "2027-11-11": { name: "Veterans Day", open: null, close: null, hours: "Closed" },
        "2027-11-25": { name: "Thanksgiving Day", open: null, close: null, hours: "Closed" },
        "2027-12-24": { name: "Christmas Eve", open: 10, close: 18 },
        "2027-12-25": { name: "Christmas Day", open: null, close: null, hours: "Closed" },
        "2027-12-31": { name: "New Year's Eve", open: 10, close: 18 },
    
        // 2028
        "2028-01-01": { name: "New Year's Day", open: null, close: null, hours: "Closed" },
        "2028-01-17": { name: "Martin Luther King Jr. Day", open: null, close: null, hours: "Closed" },
        "2028-02-21": { name: "Presidents' Day", open: null, close: null, hours: "Closed" },
        "2028-02-27": { name: "Bus Army Dude's Birthday", open: null, close: null, hours: "Closed" },
        "2028-05-29": { name: "Memorial Day", open: null, close: null, hours: "Closed" },
        "2028-07-04": { name: "Independence Day", open: null, close: null, hours: "Closed" },
        "2028-09-04": { name: "Labor Day", open: null, close: null, hours: "Closed" },
        "2028-10-09": { name: "Columbus Day", open: 10, close: 23 },
        "2028-11-11": { name: "Veterans Day", open: null, close: null, hours: "Closed" },
        "2028-11-23": { name: "Thanksgiving Day", open: null, close: null, hours: "Closed" },
        "2028-12-24": { name: "Christmas Eve", open: 10, close: 18 },
        "2028-12-25": { name: "Christmas Day", open: null, close: null, hours: "Closed" },
        "2028-12-31": { name: "New Year's Eve", open: 10, close: 18 },
    
        // 2029
        "2029-01-01": { name: "New Year's Day", open: null, close: null, hours: "Closed" },
        "2029-01-15": { name: "Martin Luther King Jr. Day", open: null, close: null, hours: "Closed" },
        "2029-02-19": { name: "Presidents' Day", open: null, close: null, hours: "Closed" },
        "2029-02-27": { name: "Bus Army Dude's Birthday", open: null, close: null, hours: "Closed" },
        "2029-05-28": { name: "Memorial Day", open: null, close: null, hours: "Closed" },
        "2029-07-04": { name: "Independence Day", open: null, close: null, hours: "Closed" },
        "2029-09-03": { name: "Labor Day", open: null, close: null, hours: "Closed" },
        "2029-10-08": { name: "Columbus Day", open: 10, close: 23 },
        "2029-11-11": { name: "Veterans Day", open: null, close: null, hours: "Closed" },
        "2029-11-22": { name: "Thanksgiving Day", open: null, close: null, hours: "Closed" },
        "2029-12-24": { name: "Christmas Eve", open: 10, close: 18 },
        "2029-12-25": { name: "Christmas Day", open: null, close: null, hours: "Closed" },
        "2029-12-31": { name: "New Year's Eve", open: 10, close: 18 }
    };

    // Get user's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Function to get timezone offset in hours between EST and user's timezone
    function getTimezoneOffsetFromEST() {
        const now = new Date();
        
        // Get EST time
        const estTime = now.toLocaleString("en-US", { timeZone: "America/New_York" });
        const estDate = new Date(estTime);
        
        // Get user's local time
        const userTime = now.toLocaleString("en-US", { timeZone: userTimezone });
        const userDate = new Date(userTime);
        
        // Calculate hours difference
        return (userDate - estDate) / (1000 * 60 * 60);
    }

    // Calculate offset once
    const tzOffset = getTimezoneOffsetFromEST();

    // Function to adjust hours based on timezone difference
    function adjustHoursForTimezone(estHour) {
        let adjustedHour = estHour + tzOffset;
        
        // Handle day wraparound
        if (adjustedHour >= 24) {
            adjustedHour -= 24;
        } else if (adjustedHour < 0) {
            adjustedHour += 24;
        }
        
        return adjustedHour;
    }

    // Function to format hour to 12-hour format with AM/PM
    function formatHour(hour) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:00 ${period}`;
    }

    // Get current time in user's timezone
    function getCurrentUserTime() {
        const now = new Date();
        return now.getHours() + (now.getMinutes() / 60);
    }

    // Display timezone
    document.getElementById("user-timezone").textContent = userTimezone;

    // Render adjusted business hours
    const hoursContainer = document.getElementById("hours-container");
    hoursContainer.innerHTML = "";

    const currentDate = new Date();
    const currentDay = currentDate.toLocaleString("en-US", { weekday: "long" }).toLowerCase();

    for (const [day, hours] of Object.entries(businessHoursEST)) {
        const adjustedOpen = adjustHoursForTimezone(hours.open);
        const adjustedClose = adjustHoursForTimezone(hours.close);
        
        const dayElement = document.createElement("div");
        dayElement.classList.add("hours-row");
        
        if (day === currentDay) {
            dayElement.classList.add("current-day");
        }
        
        dayElement.innerHTML = `
            <strong>${day.charAt(0).toUpperCase() + day.slice(1)}:</strong> 
            <span>${formatHour(adjustedOpen)} - ${formatHour(adjustedClose)}</span>
        `;
        hoursContainer.appendChild(dayElement);
    }

    // Check if business is currently open
    function isBusinessOpen() {
        const currentTime = getCurrentUserTime();
        const todayHours = businessHoursEST[currentDay];
        
        if (!todayHours) return false;

        const adjustedOpen = adjustHoursForTimezone(todayHours.open);
        const adjustedClose = adjustHoursForTimezone(todayHours.close);
        
        // Handle cases where business hours cross midnight
        if (adjustedClose < adjustedOpen) {
            return currentTime >= adjustedOpen || currentTime < adjustedClose;
        }
        
        return currentTime >= adjustedOpen && currentTime < adjustedClose;
    }

    // Update status display
    const statusElement = document.getElementById("open-status");
    const isOpen = isBusinessOpen();
    statusElement.textContent = isOpen ? "Open" : "Closed";
    statusElement.className = isOpen ? "open" : "closed";

    // Handle holiday hours
    const today = currentDate.toISOString().split('T')[0];
    const holidayAlertElement = document.getElementById("holiday-alert");
    const holidayNameElement = document.getElementById("holiday-name");
    const holidayHoursElement = document.getElementById("holiday-hours");

    if (holidayHours[today]) {
        const holiday = holidayHours[today];
        holidayNameElement.textContent = holiday.name;
        
        if (holiday.hours === "Closed") {
            holidayHoursElement.textContent = "Closed";
        } else {
            const adjustedOpen = adjustHoursForTimezone(holiday.open);
            const adjustedClose = adjustHoursForTimezone(holiday.close);
            holidayHoursElement.textContent = `${formatHour(adjustedOpen)} - ${formatHour(adjustedClose)}`;
        }
        
        holidayAlertElement.style.display = "block";
    } else {
        holidayAlertElement.style.display = "none";
    }
});
