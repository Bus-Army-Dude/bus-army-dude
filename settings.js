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
            focusOutline: 'enabled',   // Default focus outline setting (enabled means outlines show)
            visionImpaired: false,     // Vision Impaired Profile (disabled by default)
            adhdFriendly: false,       // ADHD Friendly Profile (disabled by default)
            autismFriendly: false      // Autism Friendly Profile (disabled by default)
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
            focusOutlineToggle.checked = this.settings.focusOutline === 'enabled';
            focusOutlineToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.enableFocusOutline();
                } else {
                    this.disableFocusOutline();
                }
            });
        }

        // Disability Profiles
        const visionImpairedToggle = document.getElementById('visionImpairedToggle');
        if (visionImpairedToggle) {
            visionImpairedToggle.checked = this.settings.visionImpaired;
            visionImpairedToggle.addEventListener('change', (e) => {
                this.toggleDisabilityProfile('vision-impaired', e.target.checked);
            });
        }

        const adhdFriendlyToggle = document.getElementById('adhdFriendlyToggle');
        if (adhdFriendlyToggle) {
            adhdFriendlyToggle.checked = this.settings.adhdFriendly;
            adhdFriendlyToggle.addEventListener('change', (e) => {
                this.toggleDisabilityProfile('adhd-friendly', e.target.checked);
            });
        }

        const autismFriendlyToggle = document.getElementById('autismFriendlyToggle');
        if (autismFriendlyToggle) {
            autismFriendlyToggle.checked = this.settings.autismFriendly;
            autismFriendlyToggle.addEventListener('change', (e) => {
                this.toggleDisabilityProfile('autism-friendly', e.target.checked);
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

        // Remove focus outline from buttons (if needed)
        this.disableFocusOutlineOnButtons();
    }

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.setTextSize(this.settings.textSize);
        this.applyMaintenanceMode(this.settings.maintenanceMode);
        this.applyProfileStatus(this.settings.profileStatus);  // Apply profile status
        if (this.settings.focusOutline === 'enabled') {
            this.enableFocusOutline();
        } else {
            this.disableFocusOutline();
        }

        // Apply disability profiles
        this.toggleDisabilityProfile('vision-impaired', this.settings.visionImpaired);
        this.toggleDisabilityProfile('adhd-friendly', this.settings.adhdFriendly);
        this.toggleDisabilityProfile('autism-friendly', this.settings.autismFriendly);
    }

    // Toggle disability profiles
    toggleDisabilityProfile(profile, isEnabled) {
        const body = document.body;
        if (isEnabled) {
            body.classList.add(profile);
        } else {
            body.classList.remove(profile);
        }
        this.settings[profile] = isEnabled;
        this.saveSettings();
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

    // Disable focus outline globally
    disableFocusOutline() {
        document.body.classList.add('focus-outline-disabled'); // This class removes outlines from all focused elements
        this.settings.focusOutline = 'disabled';
        this.saveSettings();
    }

    // Enable focus outline globally
    enableFocusOutline() {
        document.body.classList.remove('focus-outline-disabled');
        this.settings.focusOutline = 'enabled';
        this.saveSettings();
    }

    // Remove focus outline from all buttons (for extra measure)
    disableFocusOutlineOnButtons() {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('focus', (e) => {
                e.target.style.outline = 'none';
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
            focusOutline: 'enabled',
            visionImpaired: false,
            adhdFriendly: false,
            autismFriendly: false
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
        const visionImpairedToggle = document.getElementById('visionImpairedToggle');
        const adhdFriendlyToggle = document.getElementById('adhdFriendlyToggle');
        const autismFriendlyToggle = document.getElementById('autismFriendlyToggle');

        if (darkModeToggle) darkModeToggle.checked = defaultSettings.darkMode;
        if (textSizeSelect) textSizeSelect.value = defaultSettings.textSize;
        if (maintenanceModeToggle) maintenanceModeToggle.checked = defaultSettings.maintenanceMode;
        if (profileStatusSelect) profileStatusSelect.value = defaultSettings.profileStatus;
        if (focusOutlineToggle) focusOutlineToggle.checked = defaultSettings.focusOutline === 'enabled';
        if (visionImpairedToggle) visionImpairedToggle.checked = defaultSettings.visionImpaired;
        if (adhdFriendlyToggle) adhdFriendlyToggle.checked = defaultSettings.adhdFriendly;
        if (autismFriendlyToggle) autismFriendlyToggle.checked = defaultSettings.autismFriendly;
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

    // Update the footer year
    updateFooterYear() {
        const currentYear = new Date().getFullYear();
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = currentYear;
        }
    }

    // Set profile status manually (for owner)
    setProfileStatusManually(status) {
        if (['online', 'idle', 'offline'].includes(status)) {
            this.setProfileStatus(status);
        } else {
            console.error('Invalid profile status');
        }
    }

    // Set maintenance mode manually (for owner)
    setMaintenanceModeManually(isEnabled) {
        this.setMaintenanceMode(isEnabled);
    }
}

// Initialize SettingsManager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const settingsManager = new SettingsManager();

    // Example: Set maintenance mode manually
    settingsManager.setMaintenanceModeManually(false);

    // Example: Set profile status manually
    settingsManager.setProfileStatusManually('offline');
});

// Function to adjust text size (if called from inline onchange attribute)
function adjustTextSize(size) {
    document.body.classList.remove('text-default', 'text-large', 'text-larger');
    document.body.classList.add('text-' + size);
}

// Function to accept cookies and hide the banner
function acceptCookies() {
    // Set a cookie indicating the user has accepted cookies for 1 year
    document.cookie = "cookieConsent=true; path=/; max-age=" + (60 * 60 * 24 * 365);
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Check if the user has already accepted the cookies on page load
window.addEventListener('load', function() {
    const banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;

    const cookies = document.cookie.split('; ');
    const consentCookie = cookies.find(row => row.startsWith('cookieConsent='));
    if (consentCookie && consentCookie.split('=')[1] === 'true') {
        banner.style.display = 'none';
    } else {
        banner.style.display = 'flex';
    }
});
