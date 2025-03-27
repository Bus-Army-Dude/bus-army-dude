class SettingsManager {
    constructor() {
        // Load settings and check if the user is the owner
        this.settings = this.loadSettings();
        this.isOwner = this.checkIfOwner();  // Check if current user is the owner
        this.initializeControls();
        this.applySettings();

        // Listen for changes across tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === 'websiteSettings') {
                this.settings = JSON.parse(e.newValue);
                this.applySettings();
                this.refreshUI();
            }
        });
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            textSize: 16, // Changed to numeric value for slider
            focusOutline: 'disabled',    // Default focus outline setting
            maintenanceMode: false, // Assuming this is a setting
            profileStatus: 'offline' // Assuming this is a setting
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
                this.settings.darkMode = e.target.checked;
                this.applyTheme(this.settings.darkMode);
                this.saveSettings();
            });
        }

        // Text Size Slider
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('textSizeValue');
        if (textSizeSlider && textSizeValue) {
            textSizeSlider.value = this.settings.textSize;
            textSizeValue.textContent = `${this.settings.textSize}px`;
            this.updateSliderGradient(textSizeSlider);

            textSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                this.settings.textSize = size;
                this.setTextSize(size);
                textSizeValue.textContent = `${size}px`;
                this.updateSliderGradient(textSizeSlider);
                this.saveSettings();
            });
        }

        // Profile Status (Visible and Editable only for owner)
        const profileStatusSelect = document.getElementById('profileStatusSelect');
        if (profileStatusSelect) {
            profileStatusSelect.value = this.settings.profileStatus;
            profileStatusSelect.disabled = !this.isOwner;  // Disable if not owner
            profileStatusSelect.addEventListener('change', (e) => {
                this.settings.profileStatus = e.target.value;
                this.setProfileStatus(this.settings.profileStatus);
                this.saveSettings();
            });
        }

        // Maintenance Mode (Visible and Editable only for owner)
        const maintenanceModeToggle = document.getElementById('maintenanceModeToggle');
        if (maintenanceModeToggle) {
            maintenanceModeToggle.checked = this.settings.maintenanceMode;
            maintenanceModeToggle.disabled = !this.isOwner;
            maintenanceModeToggle.addEventListener('change', (e) => {
                this.settings.maintenanceMode = e.target.checked;
                this.setMaintenanceMode(this.settings.maintenanceMode);
                this.saveSettings();
            });
        }

        // Reset Settings Button
        const resetButton = document.getElementById('resetSettings');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetToFactorySettings();
            });
        }

        // Footer Year Update
        this.updateFooterYear();

        // Focus Outline Toggle
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');
        if (focusOutlineToggle) {
            focusOutlineToggle.checked = this.settings.focusOutline === 'enabled';
            focusOutlineToggle.addEventListener('change', (e) => {
                this.settings.focusOutline = e.target.checked ? 'enabled' : 'disabled';
                this.toggleFocusOutline(this.settings.focusOutline === 'enabled');
                this.saveSettings();
            });
        }
    }

    updateSliderGradient(slider) {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.setProperty('--slider-value', `${value}%`);
    }

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.setTextSize(this.settings.textSize);
        this.applyMaintenanceMode(this.settings.maintenanceMode);
        this.applyProfileStatus(this.settings.profileStatus);  // Apply profile status
        this.toggleFocusOutline(this.settings.focusOutline === 'enabled');
    }

    // Set the profile status
    setProfileStatus(status) {
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
    }

    // Set text size
    setTextSize(size) {
        document.documentElement.style.setProperty('--font-size-base', `${size}px`);
    }

    // Focus outline enabling and disabling
    toggleFocusOutline(enable) {
        if (enable) {
            document.body.classList.remove('focus-outline-disabled');
        } else {
            document.body.classList.add('focus-outline-disabled');
        }
    }

    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }

    // Reset to default settings
    resetToFactorySettings() {
        const defaultSettings = {
            darkMode: true,
            textSize: 16,
            focusOutline: 'disabled',
            maintenanceMode: false, // Assuming this is a setting
            profileStatus: 'offline' // Assuming this is a setting
        };
        this.settings = defaultSettings;
        this.applySettings();
        this.saveSettings();

        // Update UI controls
        const darkModeToggle = document.getElementById('darkModeToggle');
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('textSizeValue');
        const maintenanceModeToggle = document.getElementById('maintenanceModeToggle');
        const profileStatusSelect = document.getElementById('profileStatusSelect');
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');

        if (darkModeToggle) darkModeToggle.checked = defaultSettings.darkMode;
        if (textSizeSlider) {
            textSizeSlider.value = defaultSettings.textSize;
            this.updateSliderGradient(textSizeSlider);
        }
        if (textSizeValue) textSizeValue.textContent = `${defaultSettings.textSize}px`;
        if (maintenanceModeToggle) maintenanceModeToggle.checked = defaultSettings.maintenanceMode;
        if (profileStatusSelect) profileStatusSelect.value = defaultSettings.profileStatus;
        if (focusOutlineToggle) focusOutlineToggle.checked = defaultSettings.focusOutline === 'enabled';
    }

    // Set Maintenance Mode
    setMaintenanceMode(isEnabled) {
        const maintenanceMessage = document.getElementById('maintenanceModeMessage');
        if (maintenanceMessage) {
            maintenanceMessage.style.display = isEnabled ? 'block' : 'none';
        }
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

    // Manually set maintenance mode
    settingsManager.setMaintenanceMode(false);

    // Manually set profile status
    settingsManager.setProfileStatus('online');
});

// Function to accept cookies and hide the banner
function acceptCookies() {
    document.cookie = "cookieConsent=true; path=/; max-age=" + (60 * 60 * 24 * 365);
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Check if cookies have been accepted on page load
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
