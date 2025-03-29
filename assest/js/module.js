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
    const date = new Date((dateUnix + timezone) * 1000);
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
}

export const getTime = function (timeUnix, timezone) {
    const date = new Date(timeUnix * 1000); // We are now directly using the timestamp without adding the timezone here
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? "PM" : "AM";

    return `${hours % 12 || 12}:${minutes} ${period}`;
}

export const aqiText = {
    1: {
        level: "Good",
        message: "Air quality is satisfactory, and air pollution poses little or no risk."
    },
    2: {
        level: "Fair",
        message: "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution."
    },
    3: {
        level: "Moderate",
        message: "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
    },
    4: {
        level: "Poor",
        message: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
    },
    5: {
        level: "Very Poor",
        message: "Health warnings of emergency conditions. The entire population is more likely to be affected."
    }
}
