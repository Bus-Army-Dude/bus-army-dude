class SettingsManager {
    constructor() {
        // Load settings and check if the user is the owner
        this.settings = this.loadSettings();
        this.isOwner = this.checkIfOwner();  // Check if current user is the owner
        this.initializeControls();
        this.applySettings();
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            textSize: 'default',
            profileStatus: 'offline',  // Default profile status
            maintenanceMode: false,  // Default maintenance mode
            focusOutline: 'enabled'   // Default focus outline setting
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

        // Focus Outline Toggle
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');
        if (focusOutlineToggle) {
            focusOutlineToggle.checked = this.settings.focusOutline === 'disabled';
            focusOutlineToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.disableFocusOutline();
                } else {
                    this.enableFocusOutline();
                }
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

        // Remove focus outline from buttons
        this.disableFocusOutlineOnButtons();
    }

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.setTextSize(this.settings.textSize);
        this.applyMaintenanceMode(this.settings.maintenanceMode);
        this.applyProfileStatus(this.settings.profileStatus);  // Apply profile status
        if (this.settings.focusOutline === 'disabled') {
            this.disableFocusOutline();
        } else {
            this.enableFocusOutline();
        }
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

    // Disable focus outline globally
    disableFocusOutline() {
        document.body.classList.add('focus-outline-disabled'); // Apply globally
        this.settings.focusOutline = 'disabled';
        this.saveSettings();
    }

    // Enable focus outline globally
    enableFocusOutline() {
        document.body.classList.remove('focus-outline-disabled'); // Apply globally
        this.settings.focusOutline = 'enabled';
        this.saveSettings();
    }

    // Disable focus outline on all buttons
    disableFocusOutlineOnButtons() {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('focus', (e) => {
                e.target.style.outline = 'none'; // Remove outline when focus is applied
            });
        });
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
            profileStatus: 'offline',
            maintenanceMode: false,
            focusOutline: 'enabled'
        };
        this.settings = defaultSettings;
        this.applySettings();
        this.saveSettings();

        // Update UI controls
        const darkModeToggle = document.getElementById('darkModeToggle');
        const textSizeSelect = document.getElementById('text-size');
        const maintenanceModeToggle = document.getElementById('maintenanceModeToggle');
        const profileStatusSelect = document.getElementById('profileStatusSelect');
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');

        if (darkModeToggle) darkModeToggle.checked = defaultSettings.darkMode;
        if (textSizeSelect) textSizeSelect.value = defaultSettings.textSize;
        if (maintenanceModeToggle) maintenanceModeToggle.checked = defaultSettings.maintenanceMode;
        if (profileStatusSelect) profileStatusSelect.value = defaultSettings.profileStatus;
        if (focusOutlineToggle) focusOutlineToggle.checked = defaultSettings.focusOutline === 'disabled';
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
    settingsManager.setMaintenanceModeManually(false);  // Set maintenance mode to "false"

    // Example of setting profile status manually
    settingsManager.setProfileStatusManually('offline');  // Set profile status to "offline"
});

// Function to accept cookies and hide the banner
function acceptCookies() {
    // Set a cookie indicating the user has accepted
    document.cookie = "cookieConsent=true; path=/; max-age=" + 60*60*24*365; // 1 year

    // Hide the cookie consent banner
    document.getElementById('cookie-consent-banner').style.display = 'none';
}

// Check if the user has already accepted the cookies
window.onload = function() {
    // Read the cookie to check if user already accepted
    var cookies = document.cookie.split('; ');
    var cookieConsent = cookies.find(row => row.startsWith('cookieConsent='));

    // If the cookieConsent exists, hide the banner
    if (cookieConsent) {
        document.getElementById('cookie-consent-banner').style.display = 'none';
    } else {
        // Otherwise, show the banner
        document.getElementById('cookie-consent-banner').style.display = 'flex';
    }
};
