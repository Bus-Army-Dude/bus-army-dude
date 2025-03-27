const applySettings = (settings) => {
  document.documentElement.setAttribute("data-theme", settings.darkMode ? "dark" : "light");

  // Apply temperature unit conversion
  const temperatureElements = document.querySelectorAll("[data-temperature]");
  temperatureElements.forEach(element => {
    let tempValue = parseFloat(element.textContent);
    if (settings.temperature === "fahrenheit") {
      tempValue = (tempValue * 9/5) + 32;
      element.textContent = `${tempValue.toFixed(2)} °F`;
    } else if (settings.temperature === "kelvin") {
      tempValue = tempValue + 273.15;
      element.textContent = `${tempValue.toFixed(2)} K`;
    } else {
      element.textContent = `${tempValue.toFixed(2)} °C`;
    }
  });

  // Apply wind speed unit conversion
  const windSpeedElements = document.querySelectorAll("[data-wind-speed]");
  windSpeedElements.forEach(element => {
    let speedValue = parseFloat(element.textContent);
    if (settings.windSpeed === "mph") {
      speedValue = speedValue * 2.23694;
      element.textContent = `${speedValue.toFixed(2)} mph`;
    } else if (settings.windSpeed === "kph") {
      speedValue = speedValue * 3.6;
      element.textContent = `${speedValue.toFixed(2)} km/h`;
    } else if (settings.windSpeed === "knots") {
      speedValue = speedValue * 1.94384;
      element.textContent = `${speedValue.toFixed(2)} knots`;
    } else if (settings.windSpeed === "beaufort") {
      // Convert to Beaufort scale (simplified example)
      speedValue = Math.min(Math.max(Math.ceil(Math.pow(speedValue / 0.836, 2 / 3)), 0), 12);
      element.textContent = `${speedValue} Bft`;
    } else {
      element.textContent = `${speedValue.toFixed(2)} m/s`;
    }
  });

  // Apply pressure unit conversion
  const pressureElements = document.querySelectorAll("[data-pressure]");
  pressureElements.forEach(element => {
    let pressureValue = parseFloat(element.textContent);
    if (settings.pressure === "inhg") {
      pressureValue = pressureValue * 0.02953;
      element.textContent = `${pressureValue.toFixed(2)} inHg`;
    } else if (settings.pressure === "mmhg") {
      pressureValue = pressureValue * 0.75006;
      element.textContent = `${pressureValue.toFixed(2)} mmHg`;
    } else {
      element.textContent = `${pressureValue.toFixed(2)} hPa`;
    }
  });

  // Apply 24-hour time format
  const timeElements = document.querySelectorAll("[data-time]");
  timeElements.forEach(element => {
    let timeValue = element.textContent;
    if (settings.timeFormat) {
      // Convert to 24-hour format (simplified example)
      let [hours, minutes] = timeValue.split(":");
      let period = timeValue.split(" ")[1];
      hours = parseInt(hours);
      if (period === "PM" && hours < 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }
      element.textContent = `${hours.toString().padStart(2, "0")}:${minutes}`;
    } else {
      // Convert to 12-hour format (simplified example)
      let [hours, minutes] = timeValue.split(":");
      hours = parseInt(hours);
      let period = "AM";
      if (hours >= 12) {
        period = "PM";
        if (hours > 12) {
          hours -= 12;
        }
      } else if (hours === 0) {
        hours = 12;
      }
      element.textContent = `${hours.toString().padStart(2, "0")}:${minutes} ${period}`;
    }
  });

  // Apply location services setting (example implementation)
  if (settings.locationServices) {
    // Enable location services
    console.log("Location services enabled");
  } else {
    // Disable location services
    console.log("Location services disabled");
  }
};

// Event listeners for opening and closing the settings modal
settingsBtn.addEventListener("click", openSettingsModal);
settingsClose.addEventListener("click", closeSettingsModal);
settingsSave.addEventListener("click", saveSettings);

// Close the modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target === settingsModal) {
    closeSettingsModal();
  }
});

// Load settings on page load
loadSettings();
