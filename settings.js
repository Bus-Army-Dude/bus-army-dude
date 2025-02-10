class SettingsManager {
    constructor() {
        // Load settings and check if the user is the owner
        this.settings = this.loadSettings();
        this.isOwner = this.checkIfOwner();  // Check if current user is the owner
        this.initializeControls();
        this.applySettings();
        this.checkCookieConsent();  // Check if user has accepted cookies
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            textSize: 'default',
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

        // Text Size Adjustment
        const textSizeSelect = document.getElementById('text-size');
        if (textSizeSelect) {
            textSizeSelect.value = this.settings.textSize;
            textSizeSelect.addEventListener('change', (e) => {
                this.setTextSize(e.target.value);
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

        // Cookie Consent
        const acceptCookiesButton = document.getElementById('accept-cookies');
        if (acceptCookiesButton) {
            acceptCookiesButton.addEventListener('click', () => {
                this.setCookieConsent('accepted');
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
        this.setTextSize(this.settings.textSize);
        this.applyMaintenanceMode(this.settings.maintenanceMode);
        this.applyProfileStatus(this.settings.profileStatus);  // Apply profile status
    }

    // Set the profile status
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

    // Apply dark or light theme
    applyTheme(isDark = this.settings.darkMode) {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.settings.darkMode = isDark;
        this.saveSettings();
    }

    // Set text size
    setTextSize(size) {
        document.body.classList.remove('text-default', 'text-large', 'text-larger');
        document.body.classList.add('text-' + size);
        this.settings.textSize = size;
        this.saveSettings();
    }

    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }

    // Reset to default settings
    resetToFactorySettings() {
        const defaultSettings = {
            darkMode: true,
            textSize: 'default',
        };
        this.settings = defaultSettings;
        this.applySettings();
        this.saveSettings();

        // Update UI controls
        const darkModeToggle = document.getElementById('darkModeToggle');
        const textSizeSelect = document.getElementById('text-size');
        const maintenanceModeToggle = document.getElementById('maintenanceModeToggle');
        const profileStatusSelect = document.getElementById('profileStatusSelect');

        if (darkModeToggle) darkModeToggle.checked = defaultSettings.darkMode;
        if (textSizeSelect) textSizeSelect.value = defaultSettings.textSize;
        if (maintenanceModeToggle) maintenanceModeToggle.checked = defaultSettings.maintenanceMode;
        if (profileStatusSelect) profileStatusSelect.value = defaultSettings.profileStatus;
    }

    // Set Maintenance Mode
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

    // Check if user has accepted cookies
    checkCookieConsent() {
        const cookieConsent = localStorage.getItem('cookieConsent');
        const cookieBanner = document.getElementById('cookie-consent-banner');

        if (cookieConsent === 'accepted') {
            cookieBanner.style.display = 'none';  // Hide the banner if cookies are accepted
        } else {
            cookieBanner.style.display = 'block';  // Show the banner if cookies are not accepted
        }
    }

    // Set cookie consent in localStorage
    setCookieConsent(consent) {
        if (consent === 'accepted') {
            localStorage.setItem('cookieConsent', 'accepted');  // Save cookie consent to localStorage
        }
        this.checkCookieConsent();  // Recheck after setting consent
    }

    // Update the footer year
    updateFooterYear() {
        const currentYear = new Date().getFullYear();
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = currentYear;
        }
    }

    // Set profile status manually
    setProfileStatusManually(status) {
        if (['online', 'idle', 'offline'].includes(status)) {
            this.setProfileStatus(status); // Reuse the existing setProfileStatus method
        } else {
            console.error('Invalid profile status');
        }
    }

    // Set maintenance mode manually
    setMaintenanceModeManually(isEnabled) {
        this.setMaintenanceMode(isEnabled); // Reuse the existing setMaintenanceMode method
    }
}

// Initialize SettingsManager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const settingsManager = new SettingsManager();

    // Example of setting maintenance mode manually
    settingsManager.setMaintenanceModeManually(true);  // Set maintenance mode to "true"

    // Example of setting profile status manually
    settingsManager.setProfileStatusManually('online');  // Set profile status to "online"
});

function adjustTextSize(size) {
    document.body.classList.remove('text-default', 'text-large', 'text-larger');
    document.body.classList.add('text-' + size);
}

function acceptCookies() {
    document.getElementById('cookie-consent-banner').style.display = 'none';
    // Set cookie consent
}
