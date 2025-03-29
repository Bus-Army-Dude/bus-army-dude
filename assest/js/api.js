'use strict';

const apiKey= "511c0d53e786d6e701870951d85c605d";

export const fetchData = (URL,callback)=>{
    fetch(`${URL}&appid=${apiKey}`)
    .then(res=>res.json())
    .then(data=>callback(data))
}

export const url ={
    currentWeather(lat,lon){
        return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`
    },
    forecast(lat,lon){
        return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric`
    },
    airPollution(lat,lon){
        return `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon&appid=${apiKey}`
    },
    reverseGeo(lat,lon){
        return `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon&limit=5&appid=${apiKey}`
    },
    /**
     * @param {string} query search query e.g. :"london" , "New Yourk"
     */
    geo(query){
        return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    },
    zip(query, countryCode) {
        if (countryCode) {
            return `https://api.openweathermap.org/data/2.5/weather?zip=${query},${countryCode}&units=metric`;
        } else {
            return `https://api.openweathermap.org/data/2.5/weather?zip=${query}&units=metric`;
        }
    }
}
