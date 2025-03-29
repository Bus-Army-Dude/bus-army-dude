'use strict';

const apiKey= "511c0d53e786d6e701870951d85c605d";
const visualCrossingApiKey = 'SKHA8C7GQCK9B27932ZNW7UXM'; // Replace with your actual key
const visualCrossingBaseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

export const fetchData = (URL,callback)=>{
    fetch(`${URL}&appid=${apiKey}`)
    .then(res=>res.json())
    .then(data=>callback(data))
}

function getVisualCrossingForecastUrl(lat, lon) {
  return `${visualCrossingBaseUrl}${lat},${lon}?unitGroup=metric&key=${visualCrossingApiKey}&include=days`;
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
    }
}

export { getVisualCrossingForecastUrl };
