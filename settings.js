class SettingsManager {
    constructor() {
        // Load settings and check if the user is the owner
        this.settings = this.loadSettings();
        this.isOwner = this.checkIfOwner();  // Check if current user is the owner
        this.initializeControls();
        this.applySettings();
    }

    // Method to set the profile status manually in JavaScript
    setProfileStatusManually(status) {
        if (['online', 'idle', 'offline'].includes(status)) {
            this.setProfileStatus(status); // Reuse the existing setProfileStatus method
        } else {
            console.error('Invalid profile status');
        }
    }

    // Method to set the maintenance mode manually in JavaScript
    setMaintenanceModeManually(isEnabled) {
        this.setMaintenanceMode(isEnabled); // Reuse the existing setMaintenanceMode method
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            
        };
        return JSON.parse(localStorage.getItem('websiteSettings')) || defaultSettings;
    }

    // Check if the user is the owner
    checkIfOwner() {
        return localStorage.getItem('isOwner') === 'true';  // Checking 'isOwner' in localStorage
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

        // Profile Status (Visible and Editable only for owner)
        const profileStatusSelect = document.getElementById('profileStatusSelect');
        if (profileStatusSelect) {
            profileStatusSelect.value = this.settings.profileStatus;
            profileStatusSelect.disabled = !this.isOwner;  // Disable if not owner
            profileStatusSelect.addEventListener('change', (e) => {
                this.setProfileStatus(e.target.value);
            });
        }

        // Maintenance Mode (Visible and Editable only for owner)
        const maintenanceModeToggle = document.getElementById('maintenanceModeToggle');
        if (maintenanceModeToggle) {
            maintenanceModeToggle.checked = this.settings.maintenanceMode;
            maintenanceModeToggle.disabled = !this.isOwner;
            maintenanceModeToggle.addEventListener('change', (e) => {
                this.setMaintenanceMode(e.target.checked);
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

        // Footer Year Update
        this.updateFooterYear();
    }

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.applyMaintenanceMode(this.settings.maintenanceMode);
        this.applyProfileStatus(this.settings.profileStatus);  // Apply profile status
    }

    setProfileStatus(status) {
        this.settings.profileStatus = status;
        this.saveSettings();
        this.applyProfileStatus(status); // Apply status change to the profile
    }

    applyProfileStatus(status) {
        const statusElement = document.querySelector('.profile-status');
        if (statusElement) {
            statusElement.classList.remove('online', 'idle', 'offline');  // Remove previous status classes
            statusElement.classList.add(status); // Add the new status class

            // Change the icon based on the status
            const statusIcons = {
                "online": "🟢",
                "idle": "🟡",
                "offline": "⚪"
            };

            statusElement.textContent = statusIcons[status] || "⚪"; // Default to offline icon if no match
        }
    }

    applyTheme(isDark = this.settings.darkMode) {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.settings.darkMode = isDark;
        this.saveSettings();
    }

    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }

    resetToFactorySettings() {
        const defaultSettings = {
            darkMode: true,
            
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
        if (maintenanceModeToggle) maintenanceModeToggle.checked = defaultSettings.maintenanceMode;
        if (profileStatusSelect) profileStatusSelect.value = defaultSettings.profileStatus;
    }

    setMaintenanceMode(isEnabled) {
        this.settings.maintenanceMode = isEnabled;
        this.saveSettings();
        this.applyMaintenanceMode(isEnabled); // Apply the maintenance mode on page
    }

    applyMaintenanceMode(isEnabled) {
        const maintenanceMessage = document.getElementById('maintenanceModeMessage');
        if (maintenanceMessage) {
            if (isEnabled) {
                maintenanceMessage.style.display = 'block';  // Show the maintenance message
            } else {
                maintenanceMessage.style.display = 'none';  // Hide the maintenance message
            }
        }
    }

    // Function to update the year in the footer
    updateFooterYear() {
        const currentYear = new Date().getFullYear();
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = currentYear;
        }
    }
}

// Initialize SettingsManager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const settingsManager = new SettingsManager();

    // Example of setting maintenance mode manually
    settingsManager.setMaintenanceModeManually(false);  // Set maintenance mode to "true"

    // Example of setting profile status manually
    settingsManager.setProfileStatusManually('offline');  // Set profile status to "idle"
});
