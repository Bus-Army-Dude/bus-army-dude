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
    applySettings(settings);
    closeSettingsModal();
  };

  // Function to load settings from local storage
  const loadSettings = () => {
    const storedSettings = JSON.parse(localStorage.getItem("weatherSettings"));
    if (storedSettings) {
      tempSelect.value = storedSettings.temperature;
      speedSelect.value = storedSettings.windSpeed;
      pressureSelect.value = storedSettings.pressure;
      themeToggle.checked = storedSettings.darkMode;
      timeToggle.checked = storedSettings.timeFormat;
      locationToggle.checked = storedSettings.locationServices;
      applySettings(storedSettings);
    }
  };

  // Function to apply settings
  const applySettings = (settings) => {
    document.documentElement.setAttribute("data-theme", settings.darkMode ? "dark" : "light");

    // Apply temperature setting
    const temperatureElements = document.querySelectorAll("[data-temperature]");
    temperatureElements.forEach(element => {
      const originalTemp = parseFloat(element.getAttribute("data-original-value"));
      let tempValue = originalTemp;

      if (settings.temperature === "fahrenheit") {
        tempValue = (originalTemp * 9 / 5) + 32;
        element.textContent = `${Math.round(tempValue)}°F`;
      } else if (settings.temperature === "kelvin") {
        tempValue = originalTemp + 273.15;
        element.textContent = `${Math.round(tempValue)}K`;
      } else {
        element.textContent = `${Math.round(originalTemp)}°C`;
      }
    });

    // Apply wind speed setting
    const windSpeedElements = document.querySelectorAll("[data-wind-speed]");
    windSpeedElements.forEach(element => {
      const originalSpeed = parseFloat(element.getAttribute("data-original-value"));
      let speedValue = originalSpeed;

      if (settings.windSpeed === "mph") {
        speedValue = originalSpeed * 2.23694;
        element.textContent = `${Math.round(speedValue)} mph`;
      } else if (settings.windSpeed === "kph") {
        speedValue = originalSpeed * 3.6;
        element.textContent = `${Math.round(speedValue)} km/h`;
      } else if (settings.windSpeed === "knots") {
        speedValue = originalSpeed * 1.94384;
        element.textContent = `${Math.round(speedValue)} knots`;
      } else if (settings.windSpeed === "beaufort") {
        speedValue = Math.min(Math.max(Math.ceil(Math.pow(originalSpeed / 0.836, 2 / 3)), 0), 12);
        element.textContent = `${speedValue} Bft`;
      } else {
        element.textContent = `${Math.round(originalSpeed)} m/s`;
      }
    });

    // Apply pressure setting
    const pressureElements = document.querySelectorAll("[data-pressure]");
    pressureElements.forEach(element => {
      const originalPressure = parseFloat(element.getAttribute("data-original-value"));
      let pressureValue = originalPressure;

      if (settings.pressure === "inhg") {
        pressureValue = originalPressure * 0.02953;
        element.textContent = `${Math.round(pressureValue)} inHg`;
      } else if (settings.pressure === "mmhg") {
        pressureValue = originalPressure * 0.75006;
        element.textContent = `${Math.round(pressureValue)} mmHg`;
      } else {
        element.textContent = `${Math.round(originalPressure)} hPa`;
      }
    });

    // Apply time format setting
    const timeElements = document.querySelectorAll("[data-time]");
    timeElements.forEach(element => {
      let timeValue = element.getAttribute("data-original-value");
      if (settings.timeFormat) {
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

    if (settings.locationServices) {
      console.log("Location services enabled");
    } else {
      console.log("Location services disabled");
    }
  };

  // Event listeners for opening, closing, and saving settings
  settingsBtn.addEventListener("click", openSettingsModal);
  settingsClose.addEventListener("click", closeSettingsModal);
  settingsSave.addEventListener("click", saveSettings);

  window.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
      closeSettingsModal();
    }
  });

  // Load settings on page load
  loadSettings();
});
