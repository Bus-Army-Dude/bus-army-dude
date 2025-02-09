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
            fontSize: 16,
            profileStatus: 'offline',
            maintenanceMode: false,
            creatorShoutouts: {
                tiktok: {
                    US: true,
                    UK: true,
                    CA: false,
                    CN: false
                },
                instagram: {
                    US: true,
                    CA: true,
                    MX: false,
                    GB: false
                },
                youtube: {
                    US: true,
                    MX: true,
                    IN: false,
                    BR: false
                }
            }
        };
        return JSON.parse(localStorage.getItem('websiteSettings')) || defaultSettings;
    }

    // Check if the user is the owner
    checkIfOwner() {
        return localStorage.getItem('isOwner') === 'true';  // Checking 'isOwner' in localStorage
    }

    initializeControls() {
        // Dark Mode Toggle (Available for all users)
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.applyTheme(e.target.checked);
            });
        }

        // Font Size Control (Available for all users)
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

        // Profile Status (Visible only for owner)
        const profileStatusSelect = document.getElementById('profileStatusSelect');
        if (profileStatusSelect) {
            profileStatusSelect.value = this.settings.profileStatus;
            profileStatusSelect.disabled = !this.isOwner;  // Disable if not owner
            profileStatusSelect.addEventListener('change', (e) => {
                if (this.isOwner) this.setProfileStatus(e.target.value);
            });
        }

        // Maintenance Mode (Visible and Editable only for owner)
        const maintenanceModeToggle = document.getElementById('maintenanceModeToggle');
        if (maintenanceModeToggle) {
            maintenanceModeToggle.checked = this.settings.maintenanceMode;
            maintenanceModeToggle.disabled = !this.isOwner;
            maintenanceModeToggle.addEventListener('change', (e) => {
                if (this.isOwner) this.setMaintenanceMode(e.target.checked);
            });
        }

        // Creator Shoutouts Region Toggles (Manually set each region for each platform)
        this.initializeCreatorShoutoutRegionControl('tiktok');
        this.initializeCreatorShoutoutRegionControl('instagram');
        this.initializeCreatorShoutoutRegionControl('youtube');

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

    // Initialize creator shoutouts region toggles for each region
    initializeCreatorShoutoutRegionControl(platform) {
        const regionControls = document.querySelectorAll(`#${platform}RegionControl .regionToggle`);
        regionControls.forEach((toggle) => {
            toggle.addEventListener('change', (e) => {
                this.setCreatorShoutoutRegion(platform, e.target.dataset.region, e.target.checked);
            });
            toggle.checked = this.settings.creatorShoutouts[platform][toggle.dataset.region];
        });
    }

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.setFontSize(this.settings.fontSize);
        this.applyMaintenanceMode(this.settings.maintenanceMode);
        this.applyProfileStatus(this.settings.profileStatus);
        this.applyCreatorShoutouts();
    }

    setProfileStatus(status) {
        this.settings.profileStatus = status;
        this.saveSettings();
        this.applyProfileStatus(status);
    }

    applyProfileStatus(status) {
        const statusElement = document.querySelector('.profile-status');
        if (statusElement) {
            statusElement.classList.remove('online', 'idle', 'offline');
            statusElement.classList.add(status);
            const statusIcons = { online: "🟢", idle: "🟡", offline: "⚪" };
            statusElement.textContent = statusIcons[status] || "⚪";
        }
    }

    applyTheme(isDark = this.settings.darkMode) {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.settings.darkMode = isDark;
        this.saveSettings();
    }

    setFontSize(size) {
        size = Math.min(Math.max(size, 10), 30);
        document.documentElement.style.setProperty('--font-size-base', `${size}px`);
        this.settings.fontSize = size;
        this.saveSettings();

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
            fontSize: 16,
            profileStatus: 'offline',
            maintenanceMode: false,
            creatorShoutouts: {
                tiktok: {
                    US: true,
                    UK: true,
                    CA: false,
                    CN: false
                },
                instagram: {
                    US: true,
                    CA: true,
                    MX: false,
                    GB: false
                },
                youtube: {
                    US: true,
                    MX: true,
                    IN: false,
                    BR: false
                }
            }
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

    setCreatorShoutoutRegion(platform, region, isAvailable) {
        this.settings.creatorShoutouts[platform][region] = isAvailable;
        this.saveSettings();
        this.applyCreatorShoutouts();
    }

    applyCreatorShoutouts() {
        const shoutoutSections = ['tiktok', 'instagram', 'youtube'];
        shoutoutSections.forEach(platform => {
            const sectionElement = document.getElementById(`${platform}ShoutoutSection`);
            if (sectionElement) {
                const regions = Object.keys(this.settings.creatorShoutouts[platform]);
                const availableRegions = regions.filter(region => this.settings.creatorShoutouts[platform][region]);
                sectionElement.style.display = availableRegions.length > 0 ? 'block' : 'none';
            }
        });
    }

    // Manually set regions for creator shoutouts
    setCreatorShoutoutsTikTokManually(region, isAvailable) {
        this.setCreatorShoutoutRegion('tiktok', region, isAvailable);
    }

    setCreatorShoutoutsInstagramManually(region, isAvailable) {
        this.setCreatorShoutoutRegion('instagram', region, isAvailable);
    }

    setCreatorShoutoutsYouTubeManually(region, isAvailable) {
        this.setCreatorShoutoutRegion('youtube', region, isAvailable);
    }

    updateFooterYear() {
        const footerYear = document.getElementById('footerYear');
        if (footerYear) {
            footerYear.textContent = new Date().getFullYear();
        }
    }
}

// Initialize SettingsManager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const settingsManager = new SettingsManager();

    // Example of manually setting creator shoutouts regions (with true/false for each region)
    settingsManager.setCreatorShoutoutsTikTokManually('US', true);   // Enable US for TikTok
    settingsManager.setCreatorShoutoutsTikTokManually('CN', false);  // Disable CN for TikTok
    settingsManager.setCreatorShoutoutsInstagramManually('MX', true); // Enable MX for Instagram
    settingsManager.setCreatorShoutoutsYouTubeManually('BR', true);  // Enable BR for YouTube
});
