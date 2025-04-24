// settings.js - With added logging for focusOutline debugging

class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.initializeControls();
        this.applySettings();
        console.log("SettingsManager Initialized. Final initial settings:", JSON.stringify(this.settings));
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            textSize: 16,
            focusOutline: 'disabled', // Default is disabled
        };
        let loadedSettings = { ...defaultSettings };

        try {
            const storedSettingsJSON = localStorage.getItem('websiteSettings');
            console.log("LOAD: Found in localStorage:", storedSettingsJSON); // Log what was found
            if (storedSettingsJSON) {
                const parsedSettings = JSON.parse(storedSettingsJSON);
                // Merge carefully, only taking known keys
                for (const key in defaultSettings) {
                    if (parsedSettings.hasOwnProperty(key)) {
                        loadedSettings[key] = parsedSettings[key];
                    }
                }
                console.log("LOAD: Parsed and merged settings:", JSON.stringify(loadedSettings));
            } else {
                console.log("LOAD: No settings found, using defaults.");
            }
        } catch (error) {
            console.error("LOAD: Error parsing settings:", error);
            loadedSettings = { ...defaultSettings }; // Fallback to defaults on error
        }

        // --- Validate textSize (keep validation) ---
        const minSize = 10; const maxSize = 30;
        if (typeof loadedSettings.textSize !== 'number' || isNaN(loadedSettings.textSize) || loadedSettings.textSize < minSize || loadedSettings.textSize > maxSize) {
             console.warn(`LOAD: Invalid textSize (${loadedSettings.textSize}). Resetting to ${defaultSettings.textSize}.`);
             loadedSettings.textSize = defaultSettings.textSize;
        }

        // --- Validate focusOutline ---
        const validFocusStates = ['enabled', 'disabled'];
        if (!validFocusStates.includes(loadedSettings.focusOutline)) {
             console.warn(`LOAD: Invalid focusOutline (${loadedSettings.focusOutline}). Resetting to '${defaultSettings.focusOutline}'.`);
             loadedSettings.focusOutline = defaultSettings.focusOutline;
        }

        // --- Validate darkMode ---
        if (typeof loadedSettings.darkMode !== 'boolean') {
             console.warn(`LOAD: Invalid darkMode (${loadedSettings.darkMode}). Resetting to ${defaultSettings.darkMode}.`);
             loadedSettings.darkMode = defaultSettings.darkMode;
        }

        console.log("LOAD: Settings returned:", JSON.stringify(loadedSettings));
        return loadedSettings;
    }

    initializeControls() {
        console.log("Initializing controls...");
        // ... (Dark Mode, Text Size controls initialization - keep logging if needed) ...

        // --- Focus Outline Toggle ---
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');
        if (focusOutlineToggle) {
            const shouldBeChecked = this.settings.focusOutline === 'enabled';
            console.log(`INIT: Setting focusOutline toggle 'checked' state to: ${shouldBeChecked} (based on setting: '${this.settings.focusOutline}')`);
            focusOutlineToggle.checked = shouldBeChecked;

            focusOutlineToggle.addEventListener('change', (e) => {
                 console.log("EVENT: Focus outline toggle changed. Checked:", e.target.checked);
                 this.toggleFocusOutline(e.target.checked); // Pass boolean state
            });
            console.log("Focus Outline toggle initialized.");
        } else {
             console.warn("Focus Outline Toggle element (#focusOutlineToggle) not found!");
        }

         // ... (Reset Button, Footer Year initialization) ...
         console.log("Controls initialized.");
    }

    // updateSliderGradient remains the same
    updateSliderGradient(slider) {
        if (!slider) return;
        const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.setProperty('--slider-value', `${value}%`);
    }


    applySettings() {
        console.log("Applying initial settings from loaded state...");
        this.applyTheme(this.settings.darkMode);
        this.setTextSize(this.settings.textSize);
        // Apply focus outline based on the loaded setting
        console.log(`APPLY: Applying focus outline based on setting: '${this.settings.focusOutline}'`);
        this.toggleFocusOutline(this.settings.focusOutline === 'enabled');
    }

    // applyTheme remains the same
    applyTheme(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        // Only save if changed within this specific action
        if (this.settings.darkMode !== isDark) {
             this.settings.darkMode = isDark;
             this.saveSettings();
             console.log(`Theme applied and saved: ${isDark ? 'Dark' : 'Light'}`);
        }
    }

    // setTextSize remains the same (with validation)
    setTextSize(size) {
        const minSize = 10; const maxSize = 30;
        const validSize = (typeof size === 'number' && !isNaN(size) && size >= minSize && size <= maxSize) ? size : 16;
        document.documentElement.style.setProperty('--font-size-base', `${validSize}px`);
        if (this.settings.textSize !== validSize) {
            this.settings.textSize = validSize;
            this.saveSettings();
            console.log(`Text size set and saved: ${validSize}px`);
        }
        // Update UI elements
         const textSizeSlider = document.getElementById('text-size-slider');
         const textSizeValue = document.getElementById('textSizeValue');
         if(textSizeSlider && textSizeSlider.value != validSize) {
             textSizeSlider.value = validSize;
             this.updateSliderGradient(textSizeSlider);
         }
         if(textSizeValue) { textSizeValue.textContent = `${validSize}px`; }
    }

    // Toggle and save focus outline setting
    toggleFocusOutline(enable) { // enable is boolean
        const className = 'focus-outline-disabled';
        const newState = enable ? 'enabled' : 'disabled'; // Convert boolean to 'enabled'/'disabled' string

        console.log(`TOGGLE: Received request to set focus outline enable=${enable} (newState='${newState}')`);
        console.log(`TOGGLE: Current setting is '${this.settings.focusOutline}'`);

        // Apply class to body
        if (enable) {
            document.body.classList.remove(className);
            console.log(`TOGGLE: Body class '${className}' removed.`);
        } else {
            document.body.classList.add(className);
            console.log(`TOGGLE: Body class '${className}' added.`);
        }

        // Update setting state and save ONLY if it changed
        if (this.settings.focusOutline !== newState) {
            this.settings.focusOutline = newState;
            this.saveSettings(); // Save the updated state to localStorage
            console.log(`TOGGLE: Focus outline state updated and saved to '${newState}'`);
        } else {
             console.log(`TOGGLE: Focus outline state already '${newState}', no save needed.`);
        }
    }

    // Save settings to localStorage
    saveSettings() {
        const settingsToSave = {
            darkMode: this.settings.darkMode,
            textSize: this.settings.textSize,
            focusOutline: this.settings.focusOutline
        };
        try {
            localStorage.setItem('websiteSettings', JSON.stringify(settingsToSave));
            console.log("SAVE: Settings saved to localStorage:", JSON.stringify(settingsToSave));
        } catch (error) {
             console.error("SAVE: Error saving settings to localStorage:", error);
        }
    }

    // resetToFactorySettings remains the same
    resetToFactorySettings() {
        console.log("Resetting settings to factory defaults...");
        const defaultSettings = { darkMode: true, textSize: 16, focusOutline: 'disabled' };
        this.settings.darkMode = defaultSettings.darkMode;
        this.settings.textSize = defaultSettings.textSize;
        this.settings.focusOutline = defaultSettings.focusOutline;
        this.applySettings(); // Re-apply (will also trigger saves)
        // Update UI controls
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
        alert("Display settings reset to defaults.");
    }

    // updateFooterYear remains the same
    updateFooterYear() {
        const footerYear = document.getElementById('year');
        if (footerYear) { footerYear.textContent = new Date().getFullYear(); }
    }
}

// --- Initialize SettingsManager or Apply Basic Settings ---
document.addEventListener('DOMContentLoaded', () => {
    const settingsPageMarker = document.getElementById('settings-page-identifier'); // Make sure this ID exists on your settings page!

    if (settingsPageMarker) {
         console.log("Settings page detected. Initializing full Settings Manager...");
         window.settingsManager = new SettingsManager();
    } else {
         console.log("Not on settings page. Applying basic settings from localStorage.");
         // Apply basic settings from localStorage on other pages
         try {
             const storedSettingsJSON = localStorage.getItem('websiteSettings');
             let settingsApplied = { theme: false, size: false, focus: false };
             if (storedSettingsJSON) {
                 const storedSettings = JSON.parse(storedSettingsJSON);
                 // Theme
                 if (typeof storedSettings.darkMode === 'boolean') {
                     document.body.classList.toggle('dark-mode', storedSettings.darkMode);
                     document.body.classList.toggle('light-mode', !storedSettings.darkMode);
                     settingsApplied.theme = true;
                 }
                 // Size
                 if (typeof storedSettings.textSize === 'number' && !isNaN(storedSettings.textSize)) {
                     const minSize = 10; const maxSize = 30;
                     const validSize = (storedSettings.textSize >= minSize && storedSettings.textSize <= maxSize) ? storedSettings.textSize : 16;
                     document.documentElement.style.setProperty('--font-size-base', `${validSize}px`);
                     settingsApplied.size = true;
                 }
                 // Focus
                 if (storedSettings.focusOutline === 'disabled') {
                    document.body.classList.add('focus-outline-disabled'); settingsApplied.focus = true;
                 } else if (storedSettings.focusOutline === 'enabled') {
                    document.body.classList.remove('focus-outline-disabled'); settingsApplied.focus = true;
                 }
             }
             // Apply defaults if settings weren't found/applied
             if (!settingsApplied.theme) { document.body.classList.add('dark-mode'); }
             if (!settingsApplied.size) { document.documentElement.style.setProperty('--font-size-base', `16px`); }
             if (!settingsApplied.focus) { document.body.classList.add('focus-outline-disabled'); } // Default to disabled if not set
             console.log("Basic settings applied on non-settings page.");

         } catch(e) {
             console.error("Error applying basic settings from localStorage:", e);
              // Apply safe defaults if storage fails
              document.body.classList.add('dark-mode');
              document.documentElement.style.setProperty('--font-size-base', `16px`);
              document.body.classList.add('focus-outline-disabled');
         }
         // Update footer year
         const footerYear = document.getElementById('year');
         if (footerYear) { footerYear.textContent = new Date().getFullYear(); }
    }
});


// --- Cookie Consent Logic ---
// (Keep the cookie functions acceptCookies and the window load listener as they were)
function acceptCookies() {
    try {
        document.cookie = "cookieConsent=true; path=/; max-age=" + (60 * 60 * 24 * 365) + "; SameSite=Lax";
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) { banner.style.display = 'none'; }
    } catch (e) { console.error("Error setting cookie:", e); }
}
window.addEventListener('load', function() {
    const banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;
    try {
        const cookies = document.cookie.split('; ');
        const consentCookie = cookies.find(row => row.trim().startsWith('cookieConsent='));
        if (consentCookie && consentCookie.split('=')[1] === 'true') {
            banner.style.display = 'none';
        } else {
            banner.style.display = 'flex';
        }
    } catch (e) { console.error("Error reading cookies:", e); banner.style.display = 'flex'; }
});
