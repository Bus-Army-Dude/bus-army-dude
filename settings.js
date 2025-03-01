class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.isOwner = this.checkIfOwner();
        this.initializeControls();
        this.applySettings();
        this.checkCookieConsent();
    }

    // Load settings from localStorage (includes cookie consent status)
    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            textSize: 'default',
            profileStatus: 'offline',
            maintenanceMode: false,
            focusOutline: 'enabled',
            animationsEnabled: true
        };
        return JSON.parse(localStorage.getItem('websiteSettings')) || defaultSettings;
    }

    // Check if the user is the owner
    checkIfOwner() {
        return localStorage.getItem('isOwner') === 'true';
    }

    initializeControls() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.applyTheme(e.target.checked);
            });
        }

        const textSizeSelect = document.getElementById('text-size');
        if (textSizeSelect) {
            textSizeSelect.value = this.settings.textSize;
            textSizeSelect.addEventListener('change', (e) => {
                this.setTextSize(e.target.value);
            });
        }

        const profileStatusSelect = document.getElementById('profileStatusSelect');
        if (profileStatusSelect) {
            profileStatusSelect.value = this.settings.profileStatus;
            profileStatusSelect.disabled = !this.isOwner;
            profileStatusSelect.addEventListener('change', (e) => {
                this.setProfileStatus(e.target.value);
            });
        }

        const maintenanceModeToggle = document.getElementById('maintenanceModeToggle');
        if (maintenanceModeToggle) {
            maintenanceModeToggle.checked = this.settings.maintenanceMode;
            maintenanceModeToggle.disabled = !this.isOwner;
            maintenanceModeToggle.addEventListener('change', (e) => {
                this.setMaintenanceMode(e.target.checked);
            });
        }

        const resetButton = document.getElementById('resetSettings');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all settings to factory defaults?')) {
                    this.resetToFactorySettings();
                }
            });
        }

        const focusOutlineToggle = document.getElementById('focusOutlineToggle');
        if (focusOutlineToggle) {
            focusOutlineToggle.checked = this.settings.focusOutline === 'enabled';
            focusOutlineToggle.addEventListener('change', (e) => {
                this.toggleFocusOutline(e.target.checked);
            });
        }

        const animationsToggle = document.getElementById('animationsToggle');
        if (animationsToggle) {
            animationsToggle.checked = this.settings.animationsEnabled;
            animationsToggle.addEventListener('change', (e) => {
                this.toggleAnimations(e.target.checked);
            });
        }

        this.updateFooterYear();
    }

    // Check if cookies have been accepted
    checkCookieConsent() {
        if (!localStorage.getItem('cookiesAccepted')) {
            const cookieConsent = document.getElementById('cookieConsent');
            cookieConsent.style.display = 'block'; // Show the consent banner
            document.getElementById('acceptCookies').addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true'); // Save consent
                cookieConsent.style.display = 'none'; // Hide the consent banner
            });
        }
    }

    // Apply settings like dark mode, text size, etc.
    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.setTextSize(this.settings.textSize);
        this.applyMaintenanceMode(this.settings.maintenanceMode);
        this.applyProfileStatus(this.settings.profileStatus);
        this.toggleFocusOutline(this.settings.focusOutline === 'enabled');
        this.toggleAnimations(this.settings.animationsEnabled);
    }

    applyTheme(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.settings.darkMode = isDark;
        this.saveSettings();
    }

    setTextSize(size) {
        document.body.classList.remove('text-default', 'text-large', 'text-larger');
        document.body.classList.add('text-' + size);
        this.settings.textSize = size;
        this.saveSettings();
    }

    toggleFocusOutline(enable) {
        if (enable) {
            document.body.classList.remove('focus-outline-disabled');
        } else {
            document.body.classList.add('focus-outline-disabled');
        }
        this.settings.focusOutline = enable ? 'enabled' : 'disabled';
        this.saveSettings();
    }

    toggleAnimations(enable) {
        if (enable) {
            document.body.classList.remove('no-animations');
        } else {
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
            focusOutline: 'enabled',
            animationsEnabled: true
        };
        this.settings = defaultSettings;
        this.applySettings();
        this.saveSettings();
    }

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
