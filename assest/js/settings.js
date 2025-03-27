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
    // Additional code to apply other settings can be added here
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
