'use strict';

// Weekday and month names
export const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Converts Unix timestamp to a readable date globally
export const getDate = function (dateUnix, timezoneOffset) {
    const date = new Date((dateUnix + timezoneOffset) * 1000); // Apply timezone offset in seconds
    const weekDayName = weekDayNames[date.getUTCDay()]; // Use UTC day
    const monthName = monthNames[date.getUTCMonth()]; // Use UTC month

    return `${weekDayName} ${date.getUTCDate()}, ${monthName}`;
};

// Converts Unix timestamp to a readable time globally with AM/PM
export const getTime = function (timeUnix, timezoneOffset) {
    const date = new Date((timeUnix + timezoneOffset) * 1000); // Apply timezone offset in seconds
    const hours = date.getUTCHours(); // Use UTC hours
    const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Use UTC minutes
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12}:${minutes} ${period}`;
};

// Converts Unix timestamp to only hours globally with AM/PM
export const getHours = function (timeUnix, timezoneOffset) {
    const date = new Date((timeUnix + timezoneOffset) * 1000); // Apply timezone offset in seconds
    const hours = date.getUTCHours(); // Use UTC hours
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12} ${period}`;
};

// Converts meters per second to kilometers per hour
export const mps_to_kmh = mps => {
    const km_per_hour = mps * 3600 / 1000;
    return km_per_hour.toFixed(2);
};

// Air Quality Index descriptions
export const aqiText = {
    1: {
        level: "Good",
        message: "Air quality is considered satisfactory, and air pollution poses little or no risk"
    },
    2: {
        level: "Fair",
        message: "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution"
    },
    3: {
        level: "Moderate",
        message: "Members of sensitive groups may experience health effects. The general public is not likely to be affected"
    },
    4: {
        level: "Poor",
        message: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects"
    },
    5: {
        level: "Very Poor",
        message: "Health warnings of emergency conditions. The entire population is more likely to be affected"
    }
};
