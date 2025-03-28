'use strict';
import { fetchData, url } from "./api.js";
import * as module from "./module.js";

/**
 *
 * @param {NodeList} elements Elemetns node array
 * @param {String} eventType Event Type e.g: "click","mouseover"
 * @param {Function} callback callback function
 */
const addEventOnElements = (elements, eventType, callback) => {
    for (const element of elements)
        element.addEventListener(eventType, callback);
}
const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");
const toggleSearch = () => {
    searchView.classList.toggle("active");
}
addEventOnElements(searchTogglers, "click", toggleSearch);

// search integration

const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeOut = null;
let searchTimeOutDuration = 500;

searchField.addEventListener("input", () => {
    searchTimeOut ?? clearTimeout(searchTimeOut);
    if (!searchField.value) {
        searchResult.classList.remove("active");
        searchResult.innerHTML = "";
        searchField.classList.remove("searching");
    }
    else {
        searchField.classList.add("searching");
    }
    if (searchField.value) {
        clearTimeout(searchTimeOut)
        searchTimeOut = setTimeout(() => {
            fetchData(url.geo(searchField.value), (locations) => {
                searchField.classList.remove("searching");
                searchResult.classList.add("active");
                searchResult.innerHTML = `
                    <ul class="view-list" data-search-list></ul>
                `;
                const items = [];
                for (const { name, lat, lon, country, state } of locations) {
                    const searchItem = document.createElement("li");
                    searchItem.classList.add("view-item");
                    searchItem.innerHTML = `
                        <span class="m-icon">location_on</span>
                        <div>
                            <p class="item-title">${name}</p>
                            <p class="label-2 item-subtitle">${state || ""} ${country}</p>
                        </div>
                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler></a>
                    `;
                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler]"))
                }
                addEventOnElements(items, "click", () => {
                    toggleSearch();
                    searchResult.classList.remove("active")
                })
            });
        }, searchTimeOutDuration);
    }
});

const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]")

export const updateWeather = (lat, lon) => {
    loading.style.display = "grid";
    container.classList.remove("fade-in");
    errorContent.style.display = "none";

    const currentWeatherSection = document.querySelector("[data-current-weather]");
    const highlightSection = document.querySelector("[data-highlights]");
    const hourlySection = document.querySelector("[data-hourly-forecast]");
    const forecastSection = document.querySelector("[data-5-day-forecast]");

    currentWeatherSection.innerHTML = "";
    highlightSection.innerHTML = "";
    hourlySection.innerHTML = "";
    forecastSection.innerHTML = "";

    if (window.location.hash == "#/current-location")
        currentLocationBtn.setAttribute("disabled", "");
    else
        currentLocationBtn.removeAttribute("disabled");

    //CURRENT WEATHER

    fetchData(url.currentWeather(lat,lon),(currentWeather)=>{
        const{
            weather,
            dt: dateUnix,
            sys:{sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
            main: {temp, feels_like, pressure, humidity},
            visibility,
            timezone
        } = currentWeather;
        const[{description,icon}] = weather;
        const card = document.createElement("div");
        card.classList.add("card","card-lg","current-weather-card");
        card.innerHTML=`
            <h2 class="title-2 card-title">Now</h2>
            <div class="weapper">
                <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>
                <img src="./assest/images/weather_icons/${icon}.png" width="64" height="64" alt="${description}" class="weather-icon">
            </div>
            <p class="body-3">${description}</p>
            <ul class="meta-list">
                <li class="meta-item">
                    <span class="m-icon">calendar_today</span>
                    <p class="title-3 meta-text">${module.getDate(dateUnix,timezone)}</p>
                </li>
                <li class="meta-item">
                    <span class="m-icon">location_on</span>
                    <p class="title-3 meta-text" data-location></p>
                </li>
            </ul>
        `
        fetchData(url.reverseGeo(lat,lon),([{name,country}])=>{
            card.querySelector("[data-location]").innerHTML=`${name}, ${country}`;
        })
        currentWeatherSection.appendChild(card);
        
        //today's highlights
        fetchData(url.airPollution(lat, lon), (airPollution) => {
            const [{
                main: { aqi },
                components: { no2, o3, so2, pm2_5 }
            }] = airPollution.list;

            const card = document.createElement("div");
            card.classList.add("card", "card-lg");
            card.innerHTML = `
                <h2 class="title-2" id="highlights-label">Today Highlights</h2>
                <div class="highlight-list">
                    <div class="card card-sm highlight-card one">
                        <h3 class="title-3">Air Quality Index</h3>
                        <div class="wrapper">
                            <span class="m-icon">air</span>
                            <ul class="card-list">
                                <li class="card-item">
                                    <p class="title-1">${pm2_5.toPrecision(3)}</p>
                                    <p class="label-1">PM<sub>2.5</sub></p>
                                </li>
                                <li class="card-item">
                                    <p class="title-1">${so2.toPrecision(3)}</p>
                                    <p class="label-1">SO<sub>2</sub></p>
                                </li>
                                <li class="card-item">
                                    <p class="title-1">${no2.toPrecision(3)}</p>
                                    <p class="label-1">No<sub>2</sub></p>
                                </li>
                                <li class="card-item">
                                    <p class="title-1">${o3.toPrecision(3)}</p>
                                    <p class="label-1">O<sub>3</sub></p>
                                </li>
                            </ul>
                        </div>
                        <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiText[aqi].message}">
                            ${module.aqiText[aqi].level}
                        </span>
                    </div>
                    <div class="card card-sm highlight-card two">
                        <h3 class="title-3">Sunrise & Sunset</h3>
                        <div class="wrapper">
                            <div class="card-list">
                                <div class="card-item">
                                    <span class="m-icon">clear_day</span>
                                    <div class="label-1">
                                        <p class="label-1">Sunrise</p>
                                        <p class="title-1">${module.getTime(sunriseUnixUTC, timezone)}</p>
                                    </div>
                                </div>
                                <div class="card-item">
                                    <span class="m-icon">clear_night</span>
                                    <div class="label-1">
                                        <p class="label">Sunset</p>
                                        <p class="title-1">${module.getTime(sunsetUnixUTC, timezone)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card card-sm highlight-card">
                        <h3 class="title-3">Humidity</h3>
                        <div class="wrapper">
                            <span class="m-icon">humidity_percentage</span>
                            <p class="title-1">${humidity}<sub>%</sub></p>
                        </div>
                    </div>
                    <div class="card card-sm highlight-card">
                        <h3 class="title-3">Pressure</h3>
                        <div class="wrapper">
                            <span class="m-icon">airwave</span>
                            <p class="title-1" data-pressure data-original-value="${pressure}">${Math.round(pressure)} <sub>hPa</sub></p>
                        </div>
                    </div>
                    <div class="card card-sm highlight-card">
                        <h3 class="title-3">Visibility</h3>
                        <div class="wrapper">
                            <span class="m-icon">visibility</span>
                            <p class="title-1">${visibility / 1000} <sub>KM</sub></p>
                        </div>
                    </div>
                    <div class="card card-sm highlight-card">
                        <h3 class="title-3">Feels Like</h3>
                        <div class="wrapper">
                            <span class="m-icon">thermostat</span>
                            <p class="title-1" data-temperature data-original-value="${feels_like}">${Math.round(feels_like)}&deg;</p>
                        </div>
                    </div>
                </div>
            `;
            highlightSection.appendChild(card);

            //24H forecast
            fetchData(url.forecast(lat, lon), (forecast) => {
                const {
                    list: forecastList,
                    city: { timezone }
                } = forecast;
                hourlySection.innerHTML = `
                    <h2 class="title-2">Today at</h2>
                    <div class="slider-container">
                        <ul class="slider-list" data-temp></ul>
                        <ul class="slider-list" data-wind></ul>
                    </div>
                `;
                for (const [index, data] of forecastList.entries()) {
                    if (index > 7)
                        break
                    const {
                        dt: dateTimeUnix,
                        main: { temp },
                        weather,
                        wind: { deg: windDirection, speed: windSpeed }
                    } = data;
                    const [{ icon, description }] = weather;
                    const tempLi = document.createElement("li");
                    tempLi.classList.add("slider-item");
                    tempLi.innerHTML = `
                        <div class="card card-sm slider-card">
                            <p class="body-3">${module.getTime(dateTimeUnix, timezone)}</p>
                            <img src="./assest/images/weather_icons/${icon}.png" width="48" height="48" loading="lazy" alt="${description}" class="weather-icon" title="${description}">
                            <p class="body-3" data-temperature data-original-value="${temp}">${Math.round(temp)}&deg;</p>
                        </div>
                        `;
                    hourlySection.querySelector("[data-temp]").appendChild(tempLi);
                    const windLi = document.createElement("li");
                    windLi.classList.add("slider-item");
                    windLi.innerHTML = `
                        <div class="card card-sm slider-card">
                            <p class="body-3">${module.getTime(dateTimeUnix, timezone)}</p>
                            <img src="./assest/images/weather_icons/direction.png" width="48" height="48" loading="lazy" alt="" class="weather-icon" style="transform: rotate(${windDirection - 180}deg)">
                            <p class="body-3" data-wind-speed data-original-value="${module.mps_to_kmh(windSpeed)}">${Math.round(module.mps_to_kmh(windSpeed))}</p>
                        </div>
                    `;
                    hourlySection.querySelector("[data-wind]").appendChild(windLi);
                }

                //5 day forecast
                forecastSection.innerHTML = `
                    <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>
                    <div class="card card-lg forecast-card">
                        <ul data-forecast-list></ul>
                    </div>
                `;
                for (let i = 7, len = forecastList.length; i < len; i += 8) {
                    const {
                        main: { temp_max },
                        weather,
                        dt_txt
                    } = forecastList[i];
                    const [{ icon, description }] = weather;
                    const date = new Date(dt_txt);
                    const li = document.createElement("li");
                    li.classList.add("card-item");
                    li.innerHTML = `
                        <div class="icon-wrapper">
                            <img src="./assest/images/weather_icons/${icon}.png" width="36" height="36" alt="${description}" class="weather-icon">
                            <span class="span">
                            <p class="title-2" data-temperature data-original-value="${temp_max}">${Math.round(temp_max)}&deg;</p>
                            </span>
                        </div>
                        <p class="label-1">${date.getDate()} ${module.monthNames[date.getMonth()]}</p>
                        <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
                    `;
                    forecastSection.querySelector("[data-forecast-list]").appendChild(li);

                }
                loading.style.display = "none";
                container.classList.add("fade-in");

                // APPLY SETTINGS HERE, AFTER ALL DATA IS RENDERED
                const savedSettings = JSON.parse(localStorage.getItem("weatherSettings"));
                if (savedSettings) {
                    applySettings(savedSettings);
                }
            });
        });
    });
};

// Load user settings and apply them
const loadUserSettings = () => {
    const settings = JSON.parse(localStorage.getItem("weatherSettings")) || {
        darkMode: document.documentElement.getAttribute("data-theme") === "dark", // Initialize with current theme
        temperature: "celsius",
        windSpeed: "ms", // Corrected to match the option value
        pressure: "hpa" // Corrected to match the option value
    };
    applySettings(settings);

    // Set initial dropdown values based on loaded settings
    const tempUnitControl = document.querySelector("[data-settings-temp]");
    if (tempUnitControl && settings.temperature) {
        tempUnitControl.value = settings.temperature;
    }

    const windSpeedUnitControl = document.querySelector("[data-settings-speed]");
    if (windSpeedUnitControl && settings.windSpeed) {
        // Ensure the stored value matches the select option value
        const storedWindSpeed = settings.windSpeed === 'm/s' ? 'ms' : settings.windSpeed;
        windSpeedUnitControl.value = storedWindSpeed;
    }

    const pressureUnitControl = document.querySelector("[data-settings-pressure]");
    if (pressureUnitControl && settings.pressure) {
        // Ensure the stored value matches the select option value
        const storedPressure = settings.pressure === 'hPa' ? 'hpa' : settings.pressure;
        pressureUnitControl.value = storedPressure;
    }

    const themeToggle = document.querySelector("[data-settings-theme]");
    if (themeToggle) {
        themeToggle.checked = settings.darkMode;
    }
};

const applySettings = (settings) => {
    document.documentElement.setAttribute("data-theme", settings.darkMode ? "dark" : "light");

    const temperatureElements = document.querySelectorAll("[data-temperature]");
    temperatureElements.forEach(element => {
        let tempValue = parseFloat(element.getAttribute("data-original-value"));
        let unit = '';

        if (settings.temperature === "fahrenheit") {
            tempValue = (tempValue * 9/5) + 32;
            unit = '°F';
        } else if (settings.temperature === "kelvin") {
            tempValue = tempValue + 273.15;
            unit = ' K';
        } else {
            unit = '°C';
        }

        // Check if the element is within the 5-day forecast
        const forecastItem = element.closest('[data-forecast-list] li');
        if (!forecastItem) {
            element.textContent = `${Math.round(tempValue)}${unit}`;
        }
    });

    const windSpeedElements = document.querySelectorAll("[data-wind-speed]");
    windSpeedElements.forEach(element => {
        let speedValue = parseFloat(element.getAttribute("data-original-value"));
        let unit = ' m/s';
        if (settings.windSpeed === "mph") {
            speedValue = speedValue * 2.23694;
            unit = ' mph';
        } else if (settings.windSpeed === "kph") {
            speedValue = speedValue * 3.6;
            unit = ' km/h';
        } else if (settings.windSpeed === "knots") {
            speedValue = speedValue * 1.94384;
            unit = ' knots';
        } else if (settings.windSpeed === "beaufort") {
            speedValue = Math.min(Math.max(Math.ceil(Math.pow(speedValue / 0.836, 2 / 3)), 0), 12);
            unit = ' Bft';
        }
        element.textContent = `${Math.round(speedValue)}${unit}`;
    });

    const pressureElements = document.querySelectorAll("[data-pressure]");
    pressureElements.forEach(element => {
        let pressureValue = parseFloat(element.getAttribute("data-original-value"));
        let unit = ' hPa';
        if (settings.pressure === "inhg") {
            pressureValue = pressureValue * 0.02953;
            unit = ' inHg';
        } else if (settings.pressure === "mmhg") {
            pressureValue = pressureValue * 0.75006;
            unit = ' mmHg';
        }
        element.textContent = `${Math.round(pressureValue)}${unit}`;
    });
};

// Load user settings on page load
document.addEventListener("DOMContentLoaded", () => {
    loadUserSettings();

    // Add event listeners for unit changes
    const temperatureUnitControl = document.querySelector("[data-settings-temp]");
    const windSpeedUnitControl = document.querySelector("[data-settings-speed]");
    const pressureUnitControl = document.querySelector("[data-settings-pressure]");
    const themeToggle = document.querySelector("[data-settings-theme]");

    if (temperatureUnitControl) {
        temperatureUnitControl.addEventListener("change", () => {
            const selectedUnit = temperatureUnitControl.value;
            const currentSettings = JSON.parse(localStorage.getItem("weatherSettings")) || {};
            currentSettings.temperature = selectedUnit;
            localStorage.setItem("weatherSettings", JSON.stringify(currentSettings));
            applySettings(currentSettings);
        });
    }

    if (windSpeedUnitControl) {
        windSpeedUnitControl.addEventListener("change", () => {
            const selectedUnit = windSpeedUnitControl.value;
            const currentSettings = JSON.parse(localStorage.getItem("weatherSettings")) || {};
            // Map the select value to the setting value
            currentSettings.windSpeed = selectedUnit === 'ms' ? 'm/s' : selectedUnit;
            localStorage.setItem("weatherSettings", JSON.stringify(currentSettings));
            applySettings(currentSettings);
        });
    }

    if (pressureUnitControl) {
        pressureUnitControl.addEventListener("change", () => {
            const selectedUnit = pressureUnitControl.value;
            const currentSettings = JSON.parse(localStorage.getItem("weatherSettings")) || {};
            // Map the select value to the setting value
            currentSettings.pressure = selectedUnit === 'hpa' ? 'hPa' : selectedUnit;
            localStorage.setItem("weatherSettings", JSON.stringify(currentSettings));
            applySettings(currentSettings);
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener("change", () => {
            const isDarkMode = themeToggle.checked;
            const currentSettings = JSON.parse(localStorage.getItem("weatherSettings")) || {};
            currentSettings.darkMode = isDarkMode;
            localStorage.setItem("weatherSettings", JSON.stringify(currentSettings));
            applySettings(currentSettings);
        });
    }
});

export const error404 = () => {
    errorContent.style.display = "flex"
};
