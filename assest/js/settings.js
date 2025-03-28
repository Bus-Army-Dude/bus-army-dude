document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.querySelector("[data-settings-btn]");
  const settingsModal = document.querySelector("[data-settings-modal]");
  const settingsClose = document.querySelector("[data-settings-close]");
  const tempSelect = document.querySelector("[data-settings-temp]");
  const speedSelect = document.querySelector("[data-settings-speed]");
  const pressureSelect = document.querySelector("[data-settings-pressure]");
  const themeToggle = document.querySelector("[data-settings-theme]");
  const timeToggle = document.querySelector("[data-settings-time]");
  const locationToggle = document.querySelector("[data-settings-location]");
  const locationBtn = document.querySelector("[data-current-location-btn]");
  const locationDisplay = document.querySelector("[data-location-display]");
  const citySelect = document.querySelector("[data-city-select]");
  const saveBtn = document.querySelector("[data-settings-save]");  // Save button
  
  // Track changes locally
  let tempSettings = {
    temperature: "celsius",
    windSpeed: "ms",
    pressure: "hpa",
    darkMode: false,
    timeFormat: false,
    locationServices: true,
    city: ""
  };

  // Set initial values for locationAllowed and selectedCity
  let locationAllowed = true; // Default location access is allowed
  let selectedCity = ""; // Default to no city selected

  // Function to update the Current Location button state
  const updateLocationButtonState = () => {
    if (!locationAllowed) {
      locationBtn.classList.add("disabled");
      locationBtn.setAttribute("disabled", true);
      locationBtn.style.pointerEvents = "none";
    } else {
      locationBtn.classList.remove("disabled");
      locationBtn.removeAttribute("disabled");
      locationBtn.style.pointerEvents = "auto";
    }
  };

  // Function to open the settings modal
  const openSettingsModal = () => {
    settingsModal.classList.add("active");
  };

  // Function to close the settings modal
  const closeSettingsModal = () => {
    settingsModal.classList.remove("active");
  };

  // Function to save settings to local storage (for persistence)
  const saveSettingsToLocalStorage = () => {
    localStorage.setItem("weatherSettings", JSON.stringify(tempSettings));
    applySettings(tempSettings);  // Apply the saved settings after saving
  };

  // Function to load settings from local storage
  const loadSettings = () => {
    const storedSettings = JSON.parse(localStorage.getItem("weatherSettings"));
    if (storedSettings) {
      // Set the tempSettings object with stored values
      tempSettings = storedSettings;

      tempSelect.value = storedSettings.temperature;
      speedSelect.value = storedSettings.windSpeed;
      pressureSelect.value = storedSettings.pressure;
      themeToggle.checked = storedSettings.darkMode;
      timeToggle.checked = storedSettings.timeFormat;
      locationToggle.checked = storedSettings.locationServices;
      selectedCity = storedSettings.city || ""; // Load saved city or default
      locationAllowed = storedSettings.locationServices || true; // Load saved location preference or default to true

      applySettings(storedSettings);  // Apply settings on load
    }
  };

  // Function to apply settings live
  const applySettings = (settings) => {
    document.documentElement.setAttribute("data-theme", settings.darkMode ? "dark" : "light");

    locationAllowed = settings.locationServices;
    updateLocationButtonState();

    if (selectedCity) {
      locationDisplay.textContent = `City: ${selectedCity}`;
    } else {
      locationDisplay.textContent = "Location not set";
    }

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

    const speedElements = document.querySelectorAll("[data-wind-speed]");
    speedElements.forEach(element => {
      const originalSpeed = parseFloat(element.getAttribute("data-original-value"));
      let speedValue = originalSpeed;

      if (settings.windSpeed === "kmh") {
        speedValue = originalSpeed * 3.6;
        element.textContent = `${Math.round(speedValue)} km/h`;
      } else if (settings.windSpeed === "mph") {
        speedValue = originalSpeed * 2.23694;
        element.textContent = `${Math.round(speedValue)} mph`;
      } else {
        element.textContent = `${Math.round(originalSpeed)} m/s`;
      }
    });

    const pressureElements = document.querySelectorAll("[data-pressure]");
    pressureElements.forEach(element => {
      const originalPressure = parseFloat(element.getAttribute("data-original-value"));
      let pressureValue = originalPressure;

      if (settings.pressure === "hpa") {
        element.textContent = `${Math.round(pressureValue)} hPa`;
      } else if (settings.pressure === "inHg") {
        pressureValue = originalPressure * 0.02953;
        element.textContent = `${Math.round(pressureValue)} inHg`;
      } else {
        pressureValue = originalPressure * 0.0002953;
        element.textContent = `${Math.round(pressureValue)} atm`;
      }
    });
  };

  // Function to fetch location based on the selected city
  const fetchLocation = () => {
    if (!locationAllowed) {
      alert("Location services are disabled. Enable them in settings to fetch your location.");
      console.error("Location fetching is disabled by user settings!");
      return;
    }

    const city = selectedCity || "Default City"; // Fallback to a default city if none selected

    // Fetch location info based on selected city (you can use a weather API here)
    locationDisplay.textContent = `City: ${city}`;
    console.log(`Fetching location for city: ${city}`);
  };

  settingsBtn.addEventListener("click", openSettingsModal);
  settingsClose.addEventListener("click", closeSettingsModal);

  window.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
      closeSettingsModal();
    }
  });

  // Event listeners for toggling settings
  locationToggle.addEventListener("change", (event) => {
    tempSettings.locationServices = event.target.checked;  // Store temporary change
    updateLocationButtonState();
  });

  tempSelect.addEventListener("change", (event) => {
    tempSettings.temperature = event.target.value;
  });

  speedSelect.addEventListener("change", (event) => {
    tempSettings.windSpeed = event.target.value;
  });

  pressureSelect.addEventListener("change", (event) => {
    tempSettings.pressure = event.target.value;
  });

  themeToggle.addEventListener("change", (event) => {
    tempSettings.darkMode = event.target.checked;
  });

  timeToggle.addEventListener("change", (event) => {
    tempSettings.timeFormat = event.target.checked;
  });

  citySelect.addEventListener("change", (event) => {
    selectedCity = event.target.value;
    locationDisplay.textContent = `City: ${selectedCity}`;
    tempSettings.city = selectedCity;  // Update the temporary city
  });

  // Save changes when the save button is clicked
  saveBtn.addEventListener("click", () => {
    saveSettingsToLocalStorage();  // Save all the settings
    closeSettingsModal();  // Close the modal after saving
  });

  // Load settings from localStorage when the page loads
  loadSettings();
});
