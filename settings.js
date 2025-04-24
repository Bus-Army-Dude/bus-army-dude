// settings.js - Manages client-side display settings using localStorage

class SettingsManager {
    /**
     * Initializes the SettingsManager, loads settings, sets up controls, and applies them.
     */
    constructor() {
        this.settings = this.loadSettings();
        this.initializeControls();
        this.applySettings();
        console.log("SettingsManager Initialized with settings:", this.settings); // Log initial settings
    }

    /**
     * Loads settings from localStorage, merging with defaults and validating values.
     * @returns {object} The loaded and validated settings object.
     */
    loadSettings() {
        // Define defaults ONLY for settings managed by this class
        const defaultSettings = {
            darkMode: true,
            textSize: 16, // Default numeric value
            focusOutline: 'disabled',
        };

        let loadedSettings = { ...defaultSettings }; // Start with a copy of defaults

        try {
            const storedSettings = localStorage.getItem('websiteSettings');
            if (storedSettings) {
                // Merge stored settings over defaults, ensuring no unexpected keys are added
                const parsedSettings = JSON.parse(storedSettings);
                for (const key in defaultSettings) {
                    if (parsedSettings.hasOwnProperty(key)) {
                        loadedSettings[key] = parsedSettings[key];
                    }
                }
                console.log("Loaded settings from localStorage:", loadedSettings);
            } else {
                console.log("No settings found in localStorage, using defaults.");
            }
        } catch (error) {
            console.error("Error parsing settings from localStorage:", error);
            // Keep default settings if parsing fails
            loadedSettings = { ...defaultSettings };
        }

        // --- Validate textSize ---
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

        // --- Validate focusOutline ---
        if (!['enabled', 'disabled'].includes(loadedSettings.focusOutline)) {
             console.warn(`Invalid focusOutline loaded (${loadedSettings.focusOutline}). Resetting to default '${defaultSettings.focusOutline}'.`);
             loadedSettings.focusOutline = defaultSettings.focusOutline;
        }

        // --- Validate darkMode ---
        if (typeof loadedSettings.darkMode !== 'boolean') {
             console.warn(`Invalid darkMode loaded (${loadedSettings.darkMode}). Resetting to default ${defaultSettings.darkMode}.`);
             loadedSettings.darkMode = defaultSettings.darkMode;
        }

        return loadedSettings;
    }

    /**
     * Initializes UI controls (toggles, slider) on the settings page.
     */
    initializeControls() {
        console.log("Initializing UI controls...");

        // --- Dark Mode Toggle ---
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.applyTheme(e.target.checked);
            });
            console.log("Dark Mode toggle initialized.");
        } else {
             console.warn("Dark Mode Toggle element (#darkModeToggle) not found!");
        }

        // --- Text Size Slider ---
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('textSizeValue');
        if (textSizeSlider && textSizeValue) {
            textSizeSlider.value = this.settings.textSize; // Use validated value
            textSizeValue.textContent = `${this.settings.textSize}px`;
            this.updateSliderGradient(textSizeSlider);

            textSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                if (!isNaN(size)) {
                     this.setTextSize(size); // setTextSize handles validation and saving
                     // textSizeValue and gradient are updated within setTextSize now
                } else {
                     console.warn("Invalid size from slider input:", e.target.value);
                }
            });
            console.log("Text Size slider initialized.");
        } else {
            if (!textSizeSlider) console.warn("Text Size Slider element (#text-size-slider) not found!");
            if (!textSizeValue) console.warn("Text Size Value element (#textSizeValue) not found!");
        }

        // --- Focus Outline Toggle ---
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');
        if (focusOutlineToggle) {
            focusOutlineToggle.checked = this.settings.focusOutline === 'enabled';
            focusOutlineToggle.addEventListener('change', (e) => {
                this.toggleFocusOutline(e.target.checked);
            });
            console.log("Focus Outline toggle initialized.");
        } else {
             console.warn("Focus Outline Toggle element (#focusOutlineToggle) not found!");
        }

        // --- Reset Settings Button ---
        const resetButton = document.getElementById('resetSettings');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset display settings (Theme, Text Size, Focus Outline) to defaults?')) {
                    this.resetToFactorySettings();
                }
            });
             console.log("Reset button listener added.");
        } else {
             console.warn("Reset Settings button (#resetSettings) not found!");
        }

        // --- Footer Year ---
        this.updateFooterYear(); // Moved here as it doesn't depend on other elements
    }

    /**
     * Updates the background gradient of the text size slider.
     * @param {HTMLInputElement} slider - The slider element.
     */
    updateSliderGradient(slider) {
        if (!slider) return;
        const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.setProperty('--slider-value', `${value}%`);
    }

    /**
     * Applies all managed settings to the page on initial load.
     */
    applySettings() {
        console.log("Applying initial settings...");
        this.applyTheme(this.settings.darkMode);
        this.setTextSize(this.settings.textSize);
        this.toggleFocusOutline(this.settings.focusOutline === 'enabled');
    }

    /**
     * Applies the theme (dark/light mode) to the body.
     * @param {boolean} isDark - Whether dark mode should be enabled.
     */
    applyTheme(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.settings.darkMode = isDark;
        this.saveSettings();
        console.log(`Theme applied: ${isDark ? 'Dark' : 'Light'}`);
    }

    /**
     * Sets the base font size and saves the setting.
     * @param {number} size - The desired font size in pixels.
     */
    setTextSize(size) {
        const minSize = 10;
        const maxSize = 30;
        // Validate size, default to 16 if invalid
        const validSize = (typeof size === 'number' && !isNaN(size) && size >= minSize && size <= maxSize) ? size : 16;

        document.documentElement.style.setProperty('--font-size-base', `${validSize}px`);

        // Only update and save if the size actually changed
        if (this.settings.textSize !== validSize) {
            this.settings.textSize = validSize;
            this.saveSettings();
            console.log(`Text size set to: ${validSize}px`);
        }

        // Update UI elements if they exist
         const textSizeSlider = document.getElementById('text-size-slider');
         const textSizeValue = document.getElementById('textSizeValue');
         if(textSizeSlider && textSizeSlider.value != validSize) { // Use != to handle string vs number comparison
             textSizeSlider.value = validSize;
             this.updateSliderGradient(textSizeSlider);
         }
         if(textSizeValue) {
             textSizeValue.textContent = `${validSize}px`;
         }
    }

    /**
     * Toggles the focus outline visibility by adding/removing a body class.
     * @param {boolean} enable - Whether focus outlines should be enabled.
     */
    toggleFocusOutline(enable) {
        const className = 'focus-outline-disabled';
        if (enable) {
            document.body.classList.remove(className);
            console.log("Focus outline enabled (class removed)");
        } else {
            document.body.classList.add(className);
            console.log("Focus outline disabled (class added)");
        }
        const newState = enable ? 'enabled' : 'disabled';
        // Only save if the state actually changed
        if (this.settings.focusOutline !== newState) {
             this.settings.focusOutline = newState;
             this.saveSettings();
             console.log(`Focus outline state saved: ${newState}`);
        }
    }

    /**
     * Saves the current state of managed settings to localStorage.
     */
    saveSettings() {
        // Only save settings managed by this class
        const settingsToSave = {
            darkMode: this.settings.darkMode,
            textSize: this.settings.textSize,
            focusOutline: this.settings.focusOutline
        };
        try {
            localStorage.setItem('websiteSettings', JSON.stringify(settingsToSave));
             // console.log("Settings saved to localStorage:", settingsToSave); // Optional: verbose logging
        } catch (error) {
             console.error("Error saving settings to localStorage:", error);
        }
    }

    /**
     * Resets managed settings to their default values and updates the UI.
     */
    resetToFactorySettings() {
        console.log("Resetting settings to factory defaults...");
        const defaultSettings = {
            darkMode: true,
            textSize: 16,
            focusOutline: 'disabled',
        };

        // Apply defaults directly
        this.settings.darkMode = defaultSettings.darkMode;
        this.settings.textSize = defaultSettings.textSize;
        this.settings.focusOutline = defaultSettings.focusOutline;

        this.applySettings(); // Re-apply all managed settings (this will also trigger saves)

        // Update UI controls specific to this manager
        const darkModeToggle = document.getElementById('darkModeToggle');
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('textSizeValue');
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');

        if (darkModeToggle) darkModeToggle.checked = this.settings.darkMode;
        if (textSizeSlider) {
            textSizeSlider.value = this.settings.textSize;
            // Ensure gradient updates after setting value
            this.updateSliderGradient(textSizeSlider);
        }
        if (textSizeValue) textSizeValue.textContent = `${this.settings.textSize}px`;
        if (focusOutlineToggle) focusOutlineToggle.checked = this.settings.focusOutline === 'enabled';

        alert("Display settings reset to defaults."); // User feedback
    }

    /**
     * Updates the text content of the element with ID 'year' to the current year.
     */
    updateFooterYear() {
        const footerYear = document.getElementById('year');
        if (footerYear) {
            footerYear.textContent = new Date().getFullYear();
        } else {
            // console.warn("Footer year element (#year) not found."); // Optional warning
        }
    }
}

// --- Initialize SettingsManager or Apply Basic Settings ---
document.addEventListener('DOMContentLoaded', () => {
    // --- YOU NEED TO ADD id="settings-page-identifier" to a main element ---
    // ---       on your settings.html page for this check to work!       ---
    const settingsPageMarker = document.getElementById('settings-page-identifier');

    if (settingsPageMarker) {
         console.log("Settings page detected. Initializing full Settings Manager...");
         // We are on the settings page, initialize the full manager
         window.settingsManager = new SettingsManager(); // Make it global if needed for console access
    } else {
         console.log("Not on settings page. Applying basic theme/size/focus from localStorage.");
         // Apply basic settings from localStorage on other pages
         try {
             const storedSettingsJSON = localStorage.getItem('websiteSettings');
             let settingsApplied = { theme: false, size: false, focus: false };

             if (storedSettingsJSON) {
                 const storedSettings = JSON.parse(storedSettingsJSON);

                 // Apply Dark/Light Mode
                 if (typeof storedSettings.darkMode === 'boolean') {
                     document.body.classList.toggle('dark-mode', storedSettings.darkMode);
                     document.body.classList.toggle('light-mode', !storedSettings.darkMode);
                     settingsApplied.theme = true;
                 }

                 // Apply Text Size
                 if (typeof storedSettings.textSize === 'number' && !isNaN(storedSettings.textSize)) {
                     // Apply same validation as in loadSettings
                     const minSize = 10;
                     const maxSize = 30;
                     const validSize = (storedSettings.textSize >= minSize && storedSettings.textSize <= maxSize) ? storedSettings.textSize : 16;
                     document.documentElement.style.setProperty('--font-size-base', `${validSize}px`);
                     settingsApplied.size = true;
                 }

                 // Apply Focus Outline
                 if (storedSettings.focusOutline === 'disabled') {
                    document.body.classList.add('focus-outline-disabled');
                    settingsApplied.focus = true;
                 } else if (storedSettings.focusOutline === 'enabled') {
                     document.body.classList.remove('focus-outline-disabled');
                    settingsApplied.focus = true;
                 }
             }

             // Apply defaults if settings weren't found or applied
             if (!settingsApplied.theme) { document.body.classList.add('dark-mode'); }
             if (!settingsApplied.size) { document.documentElement.style.setProperty('--font-size-base', `16px`); }
             if (!settingsApplied.focus) { document.body.classList.add('focus-outline-disabled'); }

         } catch(e) {
             console.error("Error applying basic settings from localStorage:", e);
              // Apply safe defaults if storage fails completely
              document.body.classList.add('dark-mode');
              document.documentElement.style.setProperty('--font-size-base', `16px`);
              document.body.classList.add('focus-outline-disabled');
         }

         // Update footer year even if not on settings page
         const footerYear = document.getElementById('year');
         if (footerYear) { footerYear.textContent = new Date().getFullYear(); }
    }
});


// --- Cookie Consent Logic (Keep this separate) ---
function acceptCookies() {
    try {
        document.cookie = "cookieConsent=true; path=/; max-age=" + (60 * 60 * 24 * 365) + "; SameSite=Lax"; // 1 year expiry, added SameSite
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    } catch (e) {
         console.error("Error setting cookie:", e);
    }
}

window.addEventListener('load', function() {
    const banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;

    try {
        const cookies = document.cookie.split('; ');
        const consentCookie = cookies.find(row => row.trim().startsWith('cookieConsent=')); // Use trim()
        if (consentCookie && consentCookie.split('=')[1] === 'true') {
            banner.style.display = 'none';
        } else {
            banner.style.display = 'flex';
        }
    } catch (e) {
         console.error("Error reading cookies:", e);
         banner.style.display = 'flex'; // Show banner if error reading cookies
    }
});
