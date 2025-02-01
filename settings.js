class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.isOwner = this.checkIfOwner();  // Check if the current user is the owner
        this.initializeControls();
        this.applySettings();
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            fontSize: 15,
            maintenanceMode: false,  // Default setting for maintenance mode
            profileStatus: "Active" // Default profile status
        };
        return JSON.parse(localStorage.getItem('websiteSettings')) || defaultSettings;
    }

    checkIfOwner() {
        // For now, we assume the owner is identified by some fixed condition, like a hardcoded username or password.
        // Example: Let's say the owner is "admin" (this can be replaced with more secure checks in a real system)
        const ownerPassword = "Penta!933754"; // Set your own password
        const userPassword = prompt("Please enter password to access owner settings:"); // Basic prompt for example purposes

        return userPassword === ownerPassword;
    }

    initializeControls() {
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.applyTheme(e.target.checked);
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

        // Maintenance Mode (Visible but Disabled for non-owners)
        const maintenanceModeToggle = document.getElementById('maintenanceModeToggle');
        if (maintenanceModeToggle) {
            maintenanceModeToggle.checked = this.settings.maintenanceMode;
            maintenanceModeToggle.disabled = !this.isOwner; // Disable if not owner
            maintenanceModeToggle.addEventListener('change', (e) => {
                this.setMaintenanceMode(e.target.checked);
            });
        }

        // Profile Status (Visible but Disabled for non-owners)
        const profileStatusSelect = document.getElementById('profileStatusSelect');
        if (profileStatusSelect) {
            profileStatusSelect.value = this.settings.profileStatus;
            profileStatusSelect.disabled = !this.isOwner; // Disable if not owner
            profileStatusSelect.addEventListener('change', (e) => {
                this.setProfileStatus(e.target.value);
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
    }

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.setFontSize(this.settings.fontSize);
        this.applyMaintenanceMode(this.settings.maintenanceMode);
        this.applyProfileStatus(this.settings.profileStatus);
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
            profileStatus: "Active"
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

        if (darkModeToggle) darkModeToggle.checked = defaultSettings.darkMode;
        if (fontSizeRange) {
            fontSizeRange.value = defaultSettings.fontSize;
            this.updateSliderBackground(fontSizeRange);
        }
        if (currentFontSize) currentFontSize.textContent = `${defaultSettings.fontSize}px`;
        if (maintenanceModeToggle) maintenanceModeToggle.checked = defaultSettings.maintenanceMode;
        if (profileStatusSelect) profileStatusSelect.value = defaultSettings.profileStatus;
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
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});

// Get the current year
const currentYear = new Date().getFullYear();
// Set the current year in the footer
document.getElementById('current-year').textContent = currentYear;
