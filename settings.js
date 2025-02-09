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
            maintenanceMode: false,
            profileStatus: 'online'
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
        this.setFontSize(this.settings.fontSize);
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
            fontSize: 16,
            maintenanceMode: false,
            profileStatus: 'online'
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
});

// Function to control shoutout sections
document.addEventListener('DOMContentLoaded', function() {
    const currentRegion = "us"; // Example: user's current region (set dynamically)
    
    // TikTok section
    const tiktokToggle = document.getElementById('toggleTikTokShoutouts');
    const tiktokSection = document.getElementById('tiktokSection');
    const tiktokMessage = document.getElementById('tiktokUnavailableMessage');
    const tiktokRegions = document.getElementById('tiktokRegions');

    // Instagram section
    const instagramToggle = document.getElementById('toggleInstagramShoutouts');
    const instagramSection = document.getElementById('instagramSection');
    const instagramMessage = document.getElementById('instagramUnavailableMessage');
    const instagramRegions = document.getElementById('instagramRegions');

    // YouTube section
    const youtubeToggle = document.getElementById('toggleYouTubeShoutouts');
    const youtubeSection = document.getElementById('youtubeSection');
    const youtubeMessage = document.getElementById('youtubeUnavailableMessage');
    const youtubeRegions = document.getElementById('youtubeRegions');

    // Load saved settings from localStorage
    const savedSettings = JSON.parse(localStorage.getItem('shoutoutSettings')) || {
        tiktok: { enabled: true, regions: [] },
        instagram: { enabled: true, regions: [] },
        youtube: { enabled: true, regions: [] }
    };

    // Initialize toggles based on saved settings
    tiktokToggle.checked = savedSettings.tiktok.enabled;
    instagramToggle.checked = savedSettings.instagram.enabled;
    youtubeToggle.checked = savedSettings.youtube.enabled;

    // Helper function to check if region is available
    const isRegionAvailable = (regions) => {
        return [...regions.options].some(option => option.value === currentRegion && option.selected);
    };

    // Function to update shoutout sections based on settings
    function updateShoutoutSections() {
        // TikTok
        if (tiktokToggle.checked && isRegionAvailable(tiktokRegions)) {
            tiktokSection.style.display = 'block';
            tiktokMessage.style.display = 'none';
        } else {
            tiktokSection.style.display = 'none';
            tiktokMessage.style.display = 'block';
        }

        // Instagram
        if (instagramToggle.checked && isRegionAvailable(instagramRegions)) {
            instagramSection.style.display = 'block';
            instagramMessage.style.display = 'none';
        } else {
            instagramSection.style.display = 'none';
            instagramMessage.style.display = 'block';
        }

        // YouTube
        if (youtubeToggle.checked && isRegionAvailable(youtubeRegions)) {
            youtubeSection.style.display = 'block';
            youtubeMessage.style.display = 'none';
        } else {
            youtubeSection.style.display = 'none';
            youtubeMessage.style.display = 'block';
        }

        // Save settings to localStorage
        localStorage.setItem('shoutoutSettings', JSON.stringify({
            tiktok: { enabled: tiktokToggle.checked, regions: [...tiktokRegions.selectedOptions].map(opt => opt.value) },
            instagram: { enabled: instagramToggle.checked, regions: [...instagramRegions.selectedOptions].map(opt => opt.value) },
            youtube: { enabled: youtubeToggle.checked, regions: [...youtubeRegions.selectedOptions].map(opt => opt.value) }
        }));
    }

    // Event listeners for toggles and region selections
    tiktokToggle.addEventListener('change', updateShoutoutSections);
    instagramToggle.addEventListener('change', updateShoutoutSections);
    youtubeToggle.addEventListener('change', updateShoutoutSections);
    tiktokRegions.addEventListener('change', updateShoutoutSections);
    instagramRegions.addEventListener('change', updateShoutoutSections);
    youtubeRegions.addEventListener('change', updateShoutoutSections);

    // Apply settings on page load
    updateShoutoutSections();
});
