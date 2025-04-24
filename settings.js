// settings.js (or relevant file)

class SettingsManager {
    constructor() {
        // Load settings from localStorage or use defaults
        this.settings = this.loadSettings();
        // Note: Owner check is removed as maintenance/profile status moved to admin/Firestore
        // this.isOwner = this.checkIfOwner(); // REMOVED
        this.initializeControls();
        this.applySettings();
    }

    loadSettings() {
        // Define defaults ONLY for settings managed by this class
        const defaultSettings = {
            darkMode: true,
            textSize: 16, // Default numeric value
            focusOutline: 'disabled',
        };

        let loadedSettings = defaultSettings; // Start with defaults

        try {
            const storedSettings = localStorage.getItem('websiteSettings');
            if (storedSettings) {
                // Merge stored settings over defaults
                loadedSettings = { ...defaultSettings, ...JSON.parse(storedSettings) };
            }
        } catch (error) {
            console.error("Error parsing settings from localStorage:", error);
            // Keep default settings if parsing fails
            loadedSettings = defaultSettings;
        }

        // --- Validate textSize ---
        // Ensure textSize is a number within a reasonable range (e.g., 10-30)
        const minSize = 10; // Define minimum acceptable text size
        const maxSize = 30; // Define maximum acceptable text size
        if (typeof loadedSettings.textSize !== 'number' ||
            isNaN(loadedSettings.textSize) ||
            loadedSettings.textSize < minSize ||
            loadedSettings.textSize > maxSize)
        {
             console.warn(`Invalid textSize loaded (${loadedSettings.textSize}). Resetting to default ${defaultSettings.textSize}.`);
             loadedSettings.textSize = defaultSettings.textSize; // Reset to default if invalid
        }
        // --- End validation ---

        // Validate other relevant client-side settings
        loadedSettings.darkMode = typeof loadedSettings.darkMode === 'boolean' ? loadedSettings.darkMode : defaultSettings.darkMode;
        loadedSettings.focusOutline = ['enabled', 'disabled'].includes(loadedSettings.focusOutline) ? loadedSettings.focusOutline : defaultSettings.focusOutline;

        // Ensure Firestore-managed settings are NOT loaded or defaulted here
        delete loadedSettings.maintenanceMode;
        delete loadedSettings.profileStatus;
        delete loadedSettings.isMaintenanceModeEnabled; // Remove any potentially leftover keys

        return loadedSettings;
    }

    // // Owner check removed - not relevant for these client-side settings
    // checkIfOwner() {
    //     return localStorage.getItem('isOwner') === 'true';
    // }

    initializeControls() {
        // --- Dark Mode Toggle ---
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.applyTheme(e.target.checked);
            });
        }

        // --- Text Size Slider ---
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('textSizeValue');
        if (textSizeSlider && textSizeValue) {
            // Use the validated value from loadSettings
            const currentSize = this.settings.textSize;

            textSizeSlider.value = currentSize;
            textSizeValue.textContent = `${currentSize}px`;

            this.updateSliderGradient(textSizeSlider);

            textSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                // Check if parsing was successful before setting
                if (!isNaN(size)) {
                     this.setTextSize(size);
                     textSizeValue.textContent = `${size}px`;
                     this.updateSliderGradient(textSizeSlider);
                } else {
                     console.warn("Invalid size from slider input:", e.target.value);
                }
            });
        }

        // --- Focus Outline Toggle ---
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');
        if (focusOutlineToggle) {
            focusOutlineToggle.checked = this.settings.focusOutline === 'enabled';
            focusOutlineToggle.addEventListener('change', (e) => {
                this.toggleFocusOutline(e.target.checked);
            });
        }

        // --- Reset Settings Button ---
        const resetButton = document.getElementById('resetSettings');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                // Use a more specific confirmation message
                if (confirm('Are you sure you want to reset display settings (Theme, Text Size, Focus Outline) to defaults?')) {
                    this.resetToFactorySettings();
                }
            });
        }

        // --- Footer Year ---
        this.updateFooterYear();

        // --- REMOVED Maintenance and Profile Status Controls ---
    }

    updateSliderGradient(slider) {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.setProperty('--slider-value', `${value}%`);
    }

    applySettings() {
        // Apply only the settings managed by this class
        this.applyTheme(this.settings.darkMode);
        this.setTextSize(this.settings.textSize);
        this.toggleFocusOutline(this.settings.focusOutline === 'enabled');
        // DO NOT apply maintenance mode or profile status here
    }

    // // setProfileStatus and applyProfileStatus REMOVED - Handled by Firestore/displayShoutouts.js
    // setProfileStatus(status) { ... }
    // applyProfileStatus(status) { ... }

    // Apply dark or light theme
    applyTheme(isDark) { // Removed default parameter, always apply based on arg or initial load
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.settings.darkMode = isDark;
        this.saveSettings();
    }

    // Set text size
    setTextSize(size) {
        // Add validation within the setter too
        const minSize = 10;
        const maxSize = 30;
        const validSize = (typeof size === 'number' && !isNaN(size) && size >= minSize && size <= maxSize) ? size : 16;

        document.documentElement.style.setProperty('--font-size-base', `${validSize}px`);
        this.settings.textSize = validSize;
        this.saveSettings();

        // Update UI elements if they exist (in case called outside initialization)
         const textSizeSlider = document.getElementById('text-size-slider');
         const textSizeValue = document.getElementById('textSizeValue');
         if(textSizeSlider && textSizeSlider.value != validSize) { // Use != to handle string vs number
             textSizeSlider.value = validSize;
             this.updateSliderGradient(textSizeSlider);
         }
         if(textSizeValue) {
             textSizeValue.textContent = `${validSize}px`;
         }
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

    // Save settings to localStorage
    saveSettings() {
        // Only save settings managed by this class
        const settingsToSave = {
            darkMode: this.settings.darkMode,
            textSize: this.settings.textSize,
            focusOutline: this.settings.focusOutline
        };
        localStorage.setItem('websiteSettings', JSON.stringify(settingsToSave));
    }

    // Reset to default settings managed by this class
    resetToFactorySettings() {
        const defaultSettings = {
            darkMode: true,
            textSize: 16,
            focusOutline: 'disabled',
        };
        // Overwrite only the relevant keys in current settings
        this.settings.darkMode = defaultSettings.darkMode;
        this.settings.textSize = defaultSettings.textSize;
        this.settings.focusOutline = defaultSettings.focusOutline;

        this.applySettings(); // Re-apply all managed settings
        // saveSettings() is called within applyTheme, setTextSize, toggleFocusOutline

        // Update UI controls specific to this manager
        const darkModeToggle = document.getElementById('darkModeToggle');
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('textSizeValue');
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');

        if (darkModeToggle) darkModeToggle.checked = this.settings.darkMode;
        if (textSizeSlider) {
            textSizeSlider.value = this.settings.textSize;
            this.updateSliderGradient(textSizeSlider);
        }
        if (textSizeValue) textSizeValue.textContent = `${this.settings.textSize}px`;
        if (focusOutlineToggle) focusOutlineToggle.checked = this.settings.focusOutline === 'enabled';

        alert("Display settings reset to defaults."); // User feedback
    }

    // // setMaintenanceMode and applyMaintenanceMode REMOVED - Handled by Firestore/displayShoutouts.js
    // setMaintenanceMode(isEnabled) { ... }
    // applyMaintenanceMode(isEnabled) { ... }

    // // setProfileStatusManually REMOVED - Belongs in admin logic if needed
    // setProfileStatusManually(status) { ... }

    // // setMaintenanceModeManually REMOVED - Belongs in admin logic if needed
    // setMaintenanceModeManually(isEnabled) { ... }

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
    // Check if we are on the settings page before initializing fully
    // This prevents errors if the script runs on pages without the settings controls
    if (document.getElementById('settings-page-identifier')) { // Add an ID to a main element on settings.html
         console.log("Initializing Settings Manager...");
         const settingsManager = new SettingsManager();
    } else {
         console.log("Not on settings page, skipping full Settings Manager initialization.");
         // Optionally apply basic theme from localStorage even if not on settings page
         try {
             const storedSettings = JSON.parse(localStorage.getItem('websiteSettings'));
             if (storedSettings && typeof storedSettings.darkMode === 'boolean') {
                 document.body.classList.toggle('dark-mode', storedSettings.darkMode);
                 document.body.classList.toggle('light-mode', !storedSettings.darkMode);
             }
              if (storedSettings && typeof storedSettings.textSize === 'number') {
                  document.documentElement.style.setProperty('--font-size-base', `${storedSettings.textSize}px`);
              }
              if (storedSettings && storedSettings.focusOutline === 'disabled') {
                 document.body.classList.add('focus-outline-disabled');
             }
         } catch(e) {
             console.error("Error applying basic settings from localStorage:", e);
              // Apply default theme if storage fails
              document.body.classList.add('dark-mode');
              document.documentElement.style.setProperty('--font-size-base', `16px`);
         }
         // Update footer year even if not on settings page
         const footerYear = document.getElementById('year');
         if (footerYear) { footerYear.textContent = new Date().getFullYear(); }
    }


    // --- REMOVE Manual setting calls ---
    // settingsManager.setMaintenanceModeManually(false); // REMOVE
    // settingsManager.setProfileStatusManually('offline'); // REMOVE
});

// --- Keep Cookie Consent Logic ---
// Function to accept cookies and hide the banner
function acceptCookies() {
    document.cookie = "cookieConsent=true; path=/; max-age=" + (60 * 60 * 24 * 365); // 1 year expiry
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Check if cookies have been accepted on page load
window.addEventListener('load', function() {
    const banner = document.getElementById('cookie-consent-banner');
    if (!banner) return; // Exit if no banner element

    try { // Add try-catch for potential cookie access issues
        const cookies = document.cookie.split('; ');
        const consentCookie = cookies.find(row => row.startsWith('cookieConsent='));
        if (consentCookie && consentCookie.split('=')[1] === 'true') {
            banner.style.display = 'none';
        } else {
            banner.style.display = 'flex'; // Show banner if no consent cookie
        }
    } catch (e) {
         console.error("Error accessing cookies:", e);
         // Decide how to handle cookie access error (e.g., show banner as default)
         banner.style.display = 'flex';
    }
});
