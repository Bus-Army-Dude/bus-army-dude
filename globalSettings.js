// globalSettings.js (Corrected Version with DOMContentLoaded)

class GlobalSettings {
    constructor() {
        // Load settings immediately from localStorage
        this.settings = this.loadSettingsInternalOnly();

        // Defer DOM-related initialization until the DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
             console.log("DOM loaded, initializing GlobalSettings DOM interactions...");
             this.initDOMRelated(); // Initialize DOM elements and apply initial styles
             this.initFontSizeControls(); // Initialize slider if present
             this.startObserver(); // Start observing for DOM changes after initial setup
        });

         // Set up storage listener immediately (doesn't require DOM)
         this.initStorageListener();
    }

    /**
     * Loads settings from localStorage ONLY. Does not interact with DOM.
     * @returns {object} The loaded settings or default settings.
     */
    loadSettingsInternalOnly() {
         const defaultSettings = {
             darkMode: true, // Default to dark mode as per original body class
             fontSize: 14,   // Default font size
             lastUpdate: Date.now()
         };
         const savedSettings = localStorage.getItem('websiteSettings');
         try {
             const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
             // Basic validation
             settings.darkMode = typeof settings.darkMode === 'boolean' ? settings.darkMode : defaultSettings.darkMode;
             settings.fontSize = typeof settings.fontSize === 'number' && settings.fontSize >= 12 && settings.fontSize <= 24 ? settings.fontSize : defaultSettings.fontSize;
             return settings;
         } catch (e) {
              console.error("Error parsing settings from localStorage, using defaults.", e);
              return defaultSettings;
         }
    }

     /**
      * Initializes DOM-related settings application *after* DOM is loaded.
      */
     initDOMRelated() {
         // Apply dark mode class to body first
         this.applyDarkMode(this.settings.darkMode);
         // Apply initial font size now that elements exist
         this.applyFontSize(this.settings.fontSize);
     }

     /**
      * Sets up the listener for changes in localStorage across tabs.
      */
     initStorageListener() {
         window.addEventListener('storage', (e) => {
            if (e.key === 'websiteSettings') {
                console.log("Storage event detected for websiteSettings.");
                try {
                    const newSettings = JSON.parse(e.newValue);
                    if (newSettings) {
                        this.settings = newSettings; // Update internal settings
                        this.applyAllSettings();     // Apply changes visually
                        this.updateFontSizeSliderDisplay(); // Update slider if controls exist
                    }
                } catch (err) {
                    console.error("Error parsing settings from storage event:", err);
                }
            }
         });
     }

    /**
     * Initializes the font size slider controls if they exist on the page.
     */
    initFontSizeControls() {
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('textSizeValue');

        if (textSizeSlider && textSizeValue) {
            console.log("Font size controls found, initializing.");
            this.updateFontSizeSliderDisplay(); // Set initial slider/label value

            textSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value, 10);
                if (!isNaN(size)) {
                    this.applyFontSize(size); // Apply change visually and save
                    if(textSizeValue) textSizeValue.textContent = `${size}px`; // Update label immediately
                    this.updateSliderGradient(textSizeSlider);
                }
            });
        } else {
             console.log("Font size slider controls not found on this page.");
        }
    }

     /**
      * Updates the font size slider's visual state (value, label, gradient).
      */
     updateFontSizeSliderDisplay() {
         const textSizeSlider = document.getElementById('text-size-slider');
         const textSizeValue = document.getElementById('textSizeValue');
          if (textSizeSlider && textSizeValue) {
               try{
                   textSizeSlider.value = this.settings.fontSize;
                   textSizeValue.textContent = `${this.settings.fontSize}px`;
                   this.updateSliderGradient(textSizeSlider);
               } catch(e){
                   console.error("Error updating font size slider display:", e);
               }
          }
     }

    /**
     * Updates the background gradient for the slider track.
     * @param {HTMLInputElement} slider - The slider element.
     */
    updateSliderGradient(slider) {
        if (!slider || typeof slider.min === 'undefined' || typeof slider.max === 'undefined') return;
        try{
            const min = parseFloat(slider.min);
            const max = parseFloat(slider.max);
            const val = parseFloat(slider.value);
            if(isNaN(min) || isNaN(max) || isNaN(val) || max <= min) return; // Basic validation
            const percentage = ((val - min) * 100) / (max - min);
            slider.style.setProperty('--slider-value', `${percentage}%`);
        } catch(e) {
            console.error("Error updating slider gradient:", e);
        }
    }

    /**
     * Applies the specified font size to relevant elements on the page.
     * @param {number} size - The base font size in pixels.
     */
    applyFontSize(size) {
        const cleanSize = Math.min(Math.max(parseInt(size, 10) || 16, 12), 24); // Ensure valid integer 12-24
        // console.log(`Applying font size: ${cleanSize}px`); // Optional log

        // Map of tag names to scaling factors
        const textElements = {
            'body': 1, 'h1': 2, 'h2': 1.75, 'h3': 1.5, 'h4': 1.25, 'h5': 1.15,
            'h6': 1.1, 'p': 1, 'span': 1, 'a': 1, 'li': 1, 'button': 1,
            'input': 1, 'textarea': 1, 'label': 1
            // Add other tags if needed
        };

        Object.entries(textElements).forEach(([elementTag, scale]) => {
            try {
                 const elements = document.getElementsByTagName(elementTag);
                 for (let i = 0; i < elements.length; i++) {
                     const el = elements[i];
                     // *** Safety Check ***
                     if (el && typeof el.style !== 'undefined') { // Check if element and style property exist
                         el.style.fontSize = `${cleanSize * scale}px`;
                     }
                 }
            } catch (e) {
                 // Avoid crashing if error occurs on one tag type
                 console.error(`Error applying font size to <${elementTag}> elements:`, e);
            }
        });

        // Update and save settings ONLY if the font size actually changed
        if (this.settings.fontSize !== cleanSize) {
            this.settings.fontSize = cleanSize;
            this.settings.lastUpdate = Date.now();
            this.saveSettings();
        }
    }

    /**
     * Toggles dark mode on/off.
     * @param {boolean} isDark - True to enable dark mode, false for light mode.
     */
    applyDarkMode(isDark) {
        if (typeof isDark !== 'boolean') return; // Type safety
         document.body.classList.toggle('dark-mode', isDark);
         document.body.classList.toggle('light-mode', !isDark); // Ensure opposite class is removed/added

        // Update and save settings ONLY if the mode actually changed
        if (this.settings.darkMode !== isDark) {
            this.settings.darkMode = isDark;
            this.settings.lastUpdate = Date.now();
            this.saveSettings();
        }
    }

    /**
     * Applies all current settings (dark mode, font size).
     */
    applyAllSettings() {
        console.log("Applying all settings from GlobalSettings...");
        this.applyDarkMode(this.settings.darkMode);
        this.applyFontSize(this.settings.fontSize);
    }

    /**
     * Saves the current settings object to localStorage.
     */
    saveSettings() {
         // console.log("Saving settings to localStorage:", this.settings); // Optional log
        try {
            localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
        } catch (e) {
            console.error("Error saving settings to localStorage:", e);
        }
    }

     /**
      * Initializes and starts the MutationObserver to reapply font size on DOM changes.
      */
     startObserver() {
          console.log("Starting MutationObserver for font size adjustments.");
          try {
              const observer = new MutationObserver((mutations) => {
                  // Basic check: If any nodes were added, re-apply font size.
                  // More complex logic could be added here to check *which* nodes were added
                  // or to debounce the applyFontSize call if changes happen rapidly.
                  let nodesAdded = false;
                   mutations.forEach((mutation) => {
                       if (mutation.addedNodes.length) {
                            nodesAdded = true;
                       }
                   });

                   if(nodesAdded) {
                        // console.log("DOM changed, potentially reapplying font size.");
                        // Re-check font size application - this prevents unnecessary saves if size didn't change
                        this.applyFontSize(this.settings.fontSize);
                   }
              });
              // Start observing the document body for additions/removals in the subtree
              observer.observe(document.body, { childList: true, subtree: true });
              console.log("MutationObserver started.");
          } catch (e) {
               console.error("Failed to start MutationObserver:", e);
          }
     }

} // End of GlobalSettings class


// --- Initialize the Global Settings ---
// The constructor now handles waiting for DOMContentLoaded for DOM manipulations
try {
    const globalSettings = new GlobalSettings();
    console.log("GlobalSettings instance created.");
} catch(e) {
    console.error("Failed to initialize GlobalSettings:", e);
    // Fallback or alert user?
}

// --- Optional: Export if needed by other modules ---
// export default globalSettings; // If you use ES modules elsewhere and need access
