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
    fetchData(url.currentWeather(lat, lon), (currentWeather) => {
        const {
            weather,
            dt: dateUnix,
            sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
            main: { temp, feels_like, pressure, humidity },
            visibility,
            timezone
        } = currentWeather;
        const [{ description, icon }] = weather;
        const card = document.createElement("div");
        card.classList.add("card", "card-lg", "current-weather-card");
        card.innerHTML = `
            <h2 class="title-2 card-title">Now</h2>
            <div class="wrapper">
                <p class="heading" data-temperature data-original-value="${temp}">${Math.round(temp)}&deg;</p>
                <img src="./assest/images/weather_icons/${icon}.png" width="64" height="64" alt="${description}" class="weather-icon">
            </div>
            <p class="body-3">${description}</p>
            <ul class="meta-list">
                <li class="meta-item">
                    <span class="m-icon">calendar_today</span>
                    <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
                </li>
                <li class="meta-item">
                    <span class="m-icon">location_on</span>
                    <p class="title-3 meta-text" data-location></p>
                </li>
            </ul>
        `
        fetchData(url.reverseGeo(lat, lon), ([{ name, country }]) => {
            card.querySelector("[data-location]").innerHTML = `${name}, ${country}`;
        });
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
                        <h3 class="title-3">Feels like</h3>
                        <div class="wrapper">
                            <span class="m-icon">thermostat</span>
                            <p class="title-1">${Math.round(feels_like)} <sub>&deg;C</sub></p>
                        </div>
                    </div>
                </div>
            `
            highlightSection.appendChild(card);

            // hourly forecast
            fetchData(url.hourlyWeather(lat, lon), (hourlyWeather) => {
                const hoursData = hourlyWeather.slice(0, 12);
                for (const { dt: dateUnix, temp, weather, pop, wind_speed } of hoursData) {
                    const [{ icon, description }] = weather;
                    const card = document.createElement("div");
                    card.classList.add("card", "card-sm", "forecast-hour-card");
                    card.innerHTML = `
                        <p class="card-title">${module.getTime(dateUnix, timezone)}</p>
                        <div class="wrapper">
                            <p class="heading">${Math.round(temp)}&deg;</p>
                            <img src="./assest/images/weather_icons/${icon}.png" width="32" height="32" alt="${description}" class="weather-icon">
                        </div>
                        <p class="body-3">${description}</p>
                        <ul class="meta-list">
                            <li class="meta-item">
                                <span class="m-icon">air</span>
                                <p class="meta-text">${Math.round(wind_speed * 3.6)} KM/h</p>
                            </li>
                            <li class="meta-item">
                                <span class="m-icon">water_drop</span>
                                <p class="meta-text">${Math.round(pop * 100)}%</p>
                            </li>
                        </ul>
                    `
                    hourlySection.appendChild(card);
                }
            });

            // 5-day forecast
            fetchData(url.forecast(lat, lon), (forecastData) => {
                for (const { dt: dateUnix, temp: { max, min }, weather, pop, wind_speed } of forecastData) {
                    const [{ icon, description }] = weather;
                    const card = document.createElement("div");
                    card.classList.add("card", "card-sm", "forecast-day-card");
                    card.innerHTML = `
                        <p class="card-title">${module.getDate(dateUnix, timezone)}</p>
                        <div class="wrapper">
                            <p class="heading">${Math.round(max)}&deg;</p>
                            <p class="label-1">${Math.round(min)}&deg;</p>
                            <img src="./assest/images/weather_icons/${icon}.png" width="32" height="32" alt="${description}" class="weather-icon">
                        </div>
                        <p class="body-3">${description}</p>
                        <ul class="meta-list">
                            <li class="meta-item">
                                <span class="m-icon">air</span>
                                <p class="meta-text">${Math.round(wind_speed * 3.6)} KM/h</p>
                            </li>
                            <li class="meta-item">
                                <span class="m-icon">water_drop</span>
                                <p class="meta-text">${Math.round(pop * 100)}%</p>
                            </li>
                        </ul>
                    `
                    forecastSection.appendChild(card);
                }
            });
        })
    }, (error) => {
        errorContent.style.display = "flex";
        loading.style.display = "none";
        if (window.location.hash == "#/current-location")
            currentLocationBtn.setAttribute("disabled", "");
    });
}

if (window.location.hash == "#/current-location")
    updateWeather();

currentLocationBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        updateWeather(latitude, longitude);
        window.location.hash = "#/weather";
    });
});
