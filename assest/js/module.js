'use strict';

export const weekDayNames = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
];

export const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

export const getDate = (dateUnix, timezone) => {
    const date = new Date(dateUnix * 1000);
    const localDate = new Date(date.getTime() + (timezone * 1000));
    
    const day = weekDayNames[localDate.getUTCDay()];
    const month = monthNames[localDate.getUTCMonth()];
    const dateNum = localDate.getUTCDate();

    return `${day}, ${month}, ${dateNum}`;
};

export const getTime = function (timeUnix, timezone) {
    const date = new Date(timeUnix * 1000);
    const localDate = new Date(date.getTime() + (timezone * 1000));
    
    // Get settings from localStorage
    const settings = JSON.parse(localStorage.getItem("weatherSettings")) || { timeFormat: false };
    const is24Hour = settings.timeFormat;
    
    const hours = localDate.getUTCHours();
    const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
    
    if (is24Hour) {
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    } else {
        const period = hours >= 12 ? "PM" : "AM";
        return `${hours % 12 || 12}:${minutes} ${period}`;
    }
};

export const getHours = function (timeUnix, timezone) {
    const date = new Date(timeUnix * 1000);
    const localDate = new Date(date.getTime() + (timezone * 1000));
    
    // Get settings from localStorage
    const settings = JSON.parse(localStorage.getItem("weatherSettings")) || { timeFormat: false };
    const is24Hour = settings.timeFormat;
    
    const hours = localDate.getUTCHours();
    
    if (is24Hour) {
        return `${hours.toString().padStart(2, '0')}`;
    } else {
        const period = hours >= 12 ? "PM" : "AM";
        return `${hours % 12 || 12} ${period}`;
    }
};

// Helper function to format time with preview support
export const formatTime = (timeUnix, timezone, usePreview = false) => {
    const date = new Date(timeUnix * 1000);
    const localDate = new Date(date.getTime() + (timezone * 1000));
    
    let settings;
    if (usePreview) {
        settings = window.tempSettings || { timeFormat: false };
    } else {
        settings = JSON.parse(localStorage.getItem("weatherSettings")) || { timeFormat: false };
    }
    
    const is24Hour = settings.timeFormat;
    const hours = localDate.getUTCHours();
    const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
    
    if (is24Hour) {
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    } else {
        const period = hours >= 12 ? "PM" : "AM";
        return `${hours % 12 || 12}:${minutes} ${period}`;
    }
};

export const mps_to_kmh = mps => {
    const km_per_hour = mps * 3600 / 1000;
    return km_per_hour.toFixed(2);
};

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

// Add helper function to determine if time format is 24-hour
export const is24HourFormat = () => {
    const settings = JSON.parse(localStorage.getItem("weatherSettings")) || { timeFormat: false };
    return settings.timeFormat;
};
