'use strict';

export const weekDayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
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

/**
 * @param {number} dateUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Date String. format: "Sunday 10, Jan"
 */
export const getDate = function(dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${weekDayName} ${date.getUTCDate()}, ${monthName}`;
}

/**
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Time string. format: "HH:MM AM/PM" or "HH:MM" based on settings
 */
export const getTime = function(timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const settings = JSON.parse(localStorage.getItem("weatherSettings")) || { timeFormat: false };

    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    if (settings.timeFormat) { // 24-hour format
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    } else { // 12-hour format
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes} ${period}`;
    }
}

/**
 * @param {number} timeUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Hour string. format: "HH AM/PM" or "HH" based on settings
 */
export const getHours = function(timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const settings = JSON.parse(localStorage.getItem("weatherSettings")) || { timeFormat: false };

    const hours = date.getUTCHours();

    if (settings.timeFormat) { // 24-hour format
        return hours.toString().padStart(2, '0');
    } else { // 12-hour format
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;
        return `${displayHours} ${period}`;
    }
}

/**
 * @param {number} mps Meters per second
 * @returns {number} Kilometers per hour
 */
export const mps_to_kmh = mps => {
    const km_per_hour = mps * 3600 / 1000;
    return km_per_hour.toFixed(2);
}

export const aqiText = {
    1: {
        level: "Good",
        message: "Air quality is considered satisfactory, and air pollution poses little or no risk."
    },
    2: {
        level: "Fair",
        message: "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution."
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
};

/**
 * Returns weather description based on the weather code
 * @param {number} code Weather code from API
 * @returns {string} Weather description
 */
export const getWeatherDesc = function(code) {
    if (code >= 200 && code < 300) return "Thunderstorm";
    if (code >= 300 && code < 400) return "Drizzle";
    if (code >= 500 && code < 600) return "Rain";
    if (code >= 600 && code < 700) return "Snow";
    if (code >= 700 && code < 800) return "Atmosphere";
    if (code === 800) return "Clear";
    if (code > 800) return "Clouds";
    return "Unknown";
}

/**
 * @param {number} value Original value in base unit
 * @param {string} unit Target unit from settings
 * @returns {Object} Converted value and unit symbol
 */
export const convertUnit = function(value, type) {
    const settings = JSON.parse(localStorage.getItem("weatherSettings")) || {
        temperature: "celsius",
        windSpeed: "ms",
        pressure: "hpa"
    };

    switch(type) {
        case "temperature":
            switch(settings.temperature) {
                case "fahrenheit":
                    return { value: (value * 9/5) + 32, unit: "°F" };
                case "kelvin":
                    return { value: value + 273.15, unit: "K" };
                default:
                    return { value, unit: "°C" };
            }

        case "windSpeed":
            switch(settings.windSpeed) {
                case "kph":
                    return { value: value * 3.6, unit: "km/h" };
                case "mph":
                    return { value: value * 2.237, unit: "mph" };
                case "knots":
                    return { value: value * 1.944, unit: "kts" };
                case "beaufort":
                    const bft = Math.min(Math.max(Math.ceil(Math.pow(value / 0.836, 2/3)), 0), 12);
                    return { value: bft, unit: "Bft" };
                default:
                    return { value, unit: "m/s" };
            }

        case "pressure":
            switch(settings.pressure) {
                case "inhg":
                    return { value: value * 0.02953, unit: "inHg" };
                case "mmhg":
                    return { value: value * 0.75006, unit: "mmHg" };
                case "kpa":
                    return { value: value / 10, unit: "kPa" };
                case "mbar":
                    return { value, unit: "mbar" };
                default:
                    return { value, unit: "hPa" };
            }

        default:
            return { value, unit: "" };
    }
}
