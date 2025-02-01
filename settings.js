class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.initializeControls();
        this.applySettings();
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            fontSize: 15,
            maintenanceMode: false,  // Default setting for maintenance mode
            profileStatus: "Active", // Default profile status
            darkModeSchedule: { start: "22:00", end: "06:00" } // Default dark mode schedule
        };
        return JSON.parse(localStorage.getItem('websiteSettings')) || defaultSettings;
    }

    initializeControls() {
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                if (!this.settings.darkModeSchedule) {
                    this.applyTheme(e.target.checked);
                }
            });
        }

        // Font Size Control
        const fontSizeRange = document.getElementById('fontSizeRange');
        const currentFontSize = document.getElementById('currentFontSize');
        if (fontSizeRange) {
            fontSizeRange.value = this.settings.fontSize;
            fontSizeRange.addEventListener('input', (e) => {
                this.setFontSize(e.target.value);
                this.updateSliderBackground(e.target);
            });
            this.updateSliderBackground(fontSizeRange);
        }
        if (currentFontSize) {
            currentFontSize.textContent = `${this.settings.fontSize}px`;
        }

        // Maintenance Mode (Now available to everyone)
        const maintenanceModeToggle = document.getElementById('maintenanceModeToggle');
        if (maintenanceModeToggle) {
            maintenanceModeToggle.checked = this.settings.maintenanceMode;
            maintenanceModeToggle.addEventListener('change', (e) => {
                this.setMaintenanceMode(e.target.checked);
            });
        }

        // Profile Status (Now available to everyone)
        const profileStatusSelect = document.getElementById('profileStatusSelect');
        if (profileStatusSelect) {
            profileStatusSelect.value = this.settings.profileStatus;
            profileStatusSelect.addEventListener('change', (e) => {
                this.setProfileStatus(e.target.value);
            });
        }

        // Dark Mode Schedule - Vertically displayed inputs
        const darkModeStartInput = document.getElementById('darkModeStart');
        const darkModeEndInput = document.getElementById('darkModeEnd');
        if (darkModeStartInput && darkModeEndInput) {
            darkModeStartInput.value = this.settings.darkModeSchedule.start;
            darkModeEndInput.value = this.settings.darkModeSchedule.end;
            darkModeStartInput.addEventListener('change', (e) => {
                this.setDarkModeSchedule(e.target.value, this.settings.darkModeSchedule.end);
            });
            darkModeEndInput.addEventListener('change', (e) => {
                this.setDarkModeSchedule(this.settings.darkModeSchedule.start, e.target.value);
            });
        }

        // Reset Settings Button
        const resetButton = document.getElementById('resetSettings');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all settings to factory defaults?')) {
                    this.resetToFactorySettings();
                }
            });
        }

        // Disable dark mode toggle when schedule is active
        if (this.settings.darkModeSchedule) {
            this.toggleDarkModeScheduleControls(true);
        }
    }

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.setFontSize(this.settings.fontSize);
        this.applyMaintenanceMode(this.settings.maintenanceMode);
        this.applyProfileStatus(this.settings.profileStatus);
        this.applyDarkModeSchedule(this.settings.darkModeSchedule);
    }

    applyTheme(isDark = this.settings.darkMode) {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.settings.darkMode = isDark;
        this.saveSettings();
    }

    setFontSize(size) {
        size = Math.min(Math.max(size, 10), 30); // Limit size between 10px and 30px
        document.documentElement.style.setProperty('--font-size-base', `${size}px`);
        this.settings.fontSize = size;
        this.saveSettings();

        // Update UI display
        const currentFontSize = document.getElementById('currentFontSize');
        if (currentFontSize) {
            currentFontSize.textContent = `${size}px`;
        }
    }

    updateSliderBackground(slider) {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.setProperty('--value', `${value}%`);
    }

    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }

    resetToFactorySettings() {
        const defaultSettings = {
            darkMode: true,
            fontSize: 15,
            maintenanceMode: false,
            profileStatus: "Active",
            darkModeSchedule: { start: "22:00", end: "06:00" }
        };
        this.settings = defaultSettings;
        this.applySettings();
        this.saveSettings();

        // Update UI controls
        const darkModeToggle = document.getElementById('darkModeToggle');
        const fontSizeRange = document.getElementById('fontSizeRange');
        const currentFontSize = document.getElementById('currentFontSize');
        const maintenanceModeToggle = document.getElementById('maintenanceModeToggle');
        const profileStatusSelect = document.getElementById('profileStatusSelect');
        const darkModeStartInput = document.getElementById('darkModeStart');
        const darkModeEndInput = document.getElementById('darkModeEnd');

        if (darkModeToggle) darkModeToggle.checked = defaultSettings.darkMode;
        if (fontSizeRange) {
            fontSizeRange.value = defaultSettings.fontSize;
            this.updateSliderBackground(fontSizeRange);
        }
        if (currentFontSize) currentFontSize.textContent = `${defaultSettings.fontSize}px`;
        if (maintenanceModeToggle) maintenanceModeToggle.checked = defaultSettings.maintenanceMode;
        if (profileStatusSelect) profileStatusSelect.value = defaultSettings.profileStatus;
        if (darkModeStartInput) darkModeStartInput.value = defaultSettings.darkModeSchedule.start;
        if (darkModeEndInput) darkModeEndInput.value = defaultSettings.darkModeSchedule.end;
    }

    // Maintenance Mode (Public can change now)
    setMaintenanceMode(isActive) {
        this.settings.maintenanceMode = isActive;
        this.saveSettings();
        this.applyMaintenanceMode(isActive);
    }

    applyMaintenanceMode(isActive) {
        // Apply maintenance mode effect here (e.g., display a maintenance page or message)
        if (isActive) {
            document.body.classList.add('maintenance-mode');
        } else {
            document.body.classList.remove('maintenance-mode');
        }
    }

    // Profile Status (Public can change now)
    setProfileStatus(status) {
        this.settings.profileStatus = status;
        this.saveSettings();
    }

    // Dark Mode Schedule
    setDarkModeSchedule(start, end) {
        this.settings.darkModeSchedule = { start, end };
        this.saveSettings();
        this.toggleDarkModeScheduleControls(true); // Disable the dark mode toggle
    }

    applyDarkModeSchedule(schedule) {
        const currentTime = new Date();
        const startTime = this.parseTime(schedule.start);
        const endTime = this.parseTime(schedule.end);

        if (currentTime >= startTime && currentTime <= endTime) {
            this.applyTheme(true); // Enable dark mode
        } else {
            this.applyTheme(false); // Disable dark mode
        }
    }

    parseTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const time = new Date();
        time.setHours(hours);
        time.setMinutes(minutes);
        time.setSeconds(0);
        return time;
    }

    toggleDarkModeScheduleControls(disable) {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.disabled = disable;
        }
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});

// Get the current year
const currentYear = new Date().getFullYear();
// Set the current year in the footer
document.getElementById('current-year').textContent = currentYear;
