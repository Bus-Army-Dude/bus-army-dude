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
  const locationBtn = document.querySelector("[data-current-location-btn]");
  const locationDisplay = document.querySelector("[data-location-display]");
  const citySelect = document.querySelector("[data-city-select]");

  let locationAllowed = true; // Default value to allow location access
  let selectedCity = ""; // Default for the city selection

  // Function to check if Geolocation API is available
  const isGeolocationAvailable = () => {
    return "geolocation" in navigator; // Checks if the browser's Geolocation API is available
  };

  // Function to update the Current Location button state
  const updateLocationButtonState = () => {
    if (!locationAllowed || !isGeolocationAvailable()) {
      // Grey out the button if location is disabled in settings OR by system-level privacy
      locationBtn.classList.add("disabled");
      locationBtn.setAttribute("disabled", true);
      locationBtn.style.pointerEvents = "none"; // Prevent interaction
    } else {
      // Enable the button if geolocation is available and allowed in settings
      locationBtn.classList.remove("disabled");
      locationBtn.removeAttribute("disabled");
      locationBtn.style.pointerEvents = "auto"; // Allow interaction
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

  // Function to save settings to local storage
  const saveSettings = () => {
    const settings = {
      temperature: tempSelect.value,
      windSpeed: speedSelect.value,
      pressure: pressureSelect.value,
      darkMode: themeToggle.checked,
      timeFormat: timeToggle.checked,
      locationServices: locationToggle.checked,
      city: selectedCity, // Save selected city
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
      selectedCity = storedSettings.city || ""; // Load saved city or default
      applySettings(storedSettings);
    }
  };

  // Function to apply settings
  const applySettings = (settings) => {
    document.documentElement.setAttribute("data-theme", settings.darkMode ? "dark" : "light");

    // Update locationAllowed based on settings
    locationAllowed = settings.locationServices;

    // Update location button state
    updateLocationButtonState();

    // Apply city selection
    if (selectedCity) {
      locationDisplay.textContent = `City: ${selectedCity}`; // Display the saved city
    } else {
      locationDisplay.textContent = "Location not set"; // Default text if no city is selected
    }

    // Apply temperature, speed, pressure, etc.
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

    // Apply wind speed and pressure if necessary
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

  // Function to fetch current location
  const fetchLocation = () => {
    if (!locationAllowed) {
      alert("Location services are disabled. Enable them in settings to fetch your location.");
      console.error("Location fetching is disabled by user settings!");
      return; // Prevent the browser from accessing the Geolocation API
    }

    if (navigator.geolocation) {
      locationBtn.setAttribute("disabled", true); // Temporarily grey out the button
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationBtn.removeAttribute("disabled"); // Re-enable the button after successful fetch
          const latitude = position.coords.latitude.toFixed(4);
          const longitude = position.coords.longitude.toFixed(4);
          locationDisplay.textContent = `Lat: ${latitude}, Lon: ${longitude}`; // Display fetched location
          console.log(`Fetched location: Latitude - ${latitude}, Longitude - ${longitude}`);
        },
        (error) => {
          locationBtn.removeAttribute("disabled"); // Re-enable the button if fetching fails
          alert("Failed to fetch location. Please try again.");
          console.error("Error fetching location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      console.error("Geolocation is not supported by this browser.");
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

  // Event listener to toggle location services in settings
  locationToggle.addEventListener("change", (event) => {
    locationAllowed = event.target.checked; // Update locationAllowed based on the toggle
    updateLocationButtonState(); // Update location button state
  });

  // Event listener for selecting a city manually
  citySelect.addEventListener("change", (event) => {
    selectedCity = event.target.value;
    locationDisplay.textContent = `City: ${selectedCity}`; // Display the selected city
    saveSettings(); // Save the selected city in settings
  });

  // Event listener to fetch current location when button is clicked
  locationBtn.addEventListener("click", fetchLocation);

  // Load settings when the page loads
  loadSettings();
});
