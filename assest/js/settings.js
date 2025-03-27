document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.querySelector("[data-settings-btn]");
  const settingsModal = document.querySelector("[data-settings-modal]");
  const settingsClose = document.querySelector("[data-settings-close]");
  const settingsSave = document.querySelector("[data-settings-save]");
  const tempSelect = document.querySelector("[data-settings-temp]");
  const speedSelect = document.querySelector("[data-settings-speed]");
  const pressureSelect = document.querySelector("[data-settings-pressure]");
  const themeToggle = document.querySelector("[data-settings-theme]");
  const timeToggle = document.querySelector("[data-settings-time]");
  const locationToggle = document.querySelector("[data-settings-location]");

  // Function to open the settings modal
  const openSettingsModal = () => {
    settingsModal.classList.add("active");
  };

  // Function to close the settings modal
  const closeSettingsModal = () => {
    settingsModal.classList.remove("active");
  };

  // Function to save settings to local storage
  const saveSettings = () => {
    const settings = {
      temperature: tempSelect.value,
      windSpeed: speedSelect.value,
      pressure: pressureSelect.value,
      darkMode: themeToggle.checked,
      timeFormat: timeToggle.checked,
      locationServices: locationToggle.checked,
    };
    localStorage.setItem("weatherSettings", JSON.stringify(settings));
    closeSettingsModal();
    applySettings(settings);
  };

  // Function to load settings from local storage
  const loadSettings = () => {
    const settings = JSON.parse(localStorage.getItem("weatherSettings"));
    if (settings) {
      tempSelect.value = settings.temperature;
      speedSelect.value = settings.windSpeed;
      pressureSelect.value = settings.pressure;
      themeToggle.checked = settings.darkMode;
      timeToggle.checked = settings.timeFormat;
      locationToggle.checked = settings.locationServices;
      applySettings(settings);
    }
  };

  // Function to apply settings
  const applySettings = (settings) => {
    document.documentElement.setAttribute("data-theme", settings.darkMode ? "dark" : "light");

    // Apply temperature unit conversion
    const temperatureElements = document.querySelectorAll("[data-temperature]");
    temperatureElements.forEach(element => {
      let tempValue = parseFloat(element.getAttribute("data-original-value"));
      if (settings.temperature === "fahrenheit") {
        tempValue = (tempValue * 9/5) + 32;
        element.textContent = `${Math.round(tempValue)} °F`;
      } else if (settings.temperature === "kelvin") {
        tempValue = tempValue + 273.15;
        element.textContent = `${Math.round(tempValue)} K`;
      } else {
        element.textContent = `${Math.round(tempValue)} °C`;
      }
    });

    // Apply wind speed unit conversion
    const windSpeedElements = document.querySelectorAll("[data-wind-speed]");
    windSpeedElements.forEach(element => {
      let speedValue = parseFloat(element.getAttribute("data-original-value"));
      if (settings.windSpeed === "mph") {
        speedValue = speedValue * 2.23694;
        element.textContent = `${Math.round(speedValue)} mph`;
      } else if (settings.windSpeed === "kph") {
        speedValue = speedValue * 3.6;
        element.textContent = `${Math.round(speedValue)} km/h`;
      } else if (settings.windSpeed === "knots") {
        speedValue = speedValue * 1.94384;
        element.textContent = `${Math.round(speedValue)} knots`;
      } else if (settings.windSpeed === "beaufort") {
        // Convert to Beaufort scale (simplified example)
        speedValue = Math.min(Math.max(Math.ceil(Math.pow(speedValue / 0.836, 2 / 3)), 0), 12);
        element.textContent = `${speedValue} Bft`;
      } else {
        element.textContent = `${Math.round(speedValue)} m/s`;
      }
    });

    // Apply pressure unit conversion
    const pressureElements = document.querySelectorAll("[data-pressure]");
    pressureElements.forEach(element => {
      let pressureValue = parseFloat(element.getAttribute("data-original-value"));
      if (settings.pressure === "inhg") {
        pressureValue = pressureValue * 0.02953;
        element.textContent = `${Math.round(pressureValue)} inHg`;
      } else if (settings.pressure === "mmhg") {
        pressureValue = pressureValue * 0.75006;
        element.textContent = `${Math.round(pressureValue)} mmHg`;
      } else {
        element.textContent = `${Math.round(pressureValue)} hPa`;
      }
    });

    // Apply 24-hour time format
    const timeElements = document.querySelectorAll("[data-time]");
    timeElements.forEach(element => {
      let timeValue = element.getAttribute("data-original-value");
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
});
