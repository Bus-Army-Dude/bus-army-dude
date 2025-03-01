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
            maintenanceMode: false,    // Default maintenance mode
            focusOutline: 'enabled',   // Default focus outline setting
            animationsEnabled: true    // New setting to enable animations
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

        // Reset Settings Button
        const resetButton = document.getElementById('resetSettings');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all settings to factory defaults?')) {
                    this.resetToFactorySettings();
                }
            });
        }

        // Focus Outline Toggle
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');
        if (focusOutlineToggle) {
            focusOutlineToggle.checked = this.settings.focusOutline === 'enabled';
            focusOutlineToggle.addEventListener('change', (e) => {
                this.toggleFocusOutline(e.target.checked);
            });
        }

        // Animations Toggle
        const animationsToggle = document.getElementById('animationsToggle');
        if (animationsToggle) {
            animationsToggle.checked = this.settings.animationsEnabled;
            animationsToggle.addEventListener('change', (e) => {
                this.toggleAnimations(e.target.checked);
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
        this.toggleFocusOutline(this.settings.focusOutline === 'enabled');
        this.toggleAnimations(this.settings.animationsEnabled);  // Apply animations setting
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

            // Map status to icons
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

    // Focus outline enabling and disabling
    toggleFocusOutline(enable) {
        if (enable) {
            document.body.classList.remove('focus-outline-disabled');
        } else {
            document.body.classList.add('focus-outline-disabled');
        }
        this.settings.focusOutline = enable ? 'enabled' : 'disabled';
        this.saveSettings();
    }

    // Disable/Enable animations
    toggleAnimations(enable) {
        if (enable) {
            // Remove the class that disables animations
            document.body.classList.remove('no-animations');
        } else {
            // Add the class that disables animations
            document.body.classList.add('no-animations');
        }
        this.settings.animationsEnabled = enable;
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
            profileStatus: 'offline',
            maintenanceMode: false,
            focusOutline: 'enabled',    // Default focus outline setting
            animationsEnabled: true     // Default to animations enabled
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
        const animationsToggle = document.getElementById('animationsToggle');

        if (darkModeToggle) darkModeToggle.checked = defaultSettings.darkMode;
        if (textSizeSelect) textSizeSelect.value = defaultSettings.textSize;
        if (maintenanceModeToggle) maintenanceModeToggle.checked = defaultSettings.maintenanceMode;
        if (profileStatusSelect) profileStatusSelect.value = defaultSettings.profileStatus;
        if (focusOutlineToggle) focusOutlineToggle.checked = defaultSettings.focusOutline === 'enabled';
        if (animationsToggle) animationsToggle.checked = defaultSettings.animationsEnabled;
    }

    // Set Maintenance Mode
    setMaintenanceMode(isEnabled) {
        this.settings.maintenanceMode = isEnabled;
        this.saveSettings();
        this.applyMaintenanceMode(isEnabled);
    }

    applyMaintenanceMode(isEnabled) {
        const maintenanceMessage = document.getElementById('maintenanceModeMessage');
        if (maintenanceMessage) {
            maintenanceMessage.style.display = isEnabled ? 'block' : 'none';
        }
    }

    // Set profile status manually (for owner)
    settingsManager.setProfileStatusManually('online') {
        if (['online', 'idle', 'offline'].includes(status)) {
            this.setProfileStatus(status);
        } else {
            console.error('Invalid profile status');
        }
    }

    // Set maintenance mode manually (for owner)
    setMaintenanceModeManually(isDisabled) {
        this.setMaintenanceMode(isDisabled);
    }

    // Dynamically update footer year
    updateFooterYear() {
        const footerYear = document.getElementById('year');
        if (footerYear) {
            footerYear.textContent = new Date().getFullYear();
        }
    }
}

// Initialize SettingsManager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const settingsManager = new SettingsManager();
});


// Check if the user has already accepted cookies
if (!localStorage.getItem("cookiesAccepted")) {
    // Show the banner if cookies haven't been accepted yet
    document.getElementById("cookie-consent-banner").style.display = "block";
}

// Function to accept cookies
function acceptCookies() {
    // Set a flag in local storage so the banner won't show again
    localStorage.setItem("cookiesAccepted", "true");

    // Hide the banner after acceptance
    document.getElementById("cookie-consent-banner").style.display = "none";
}
