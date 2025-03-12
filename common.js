class CommonManager {
    constructor() {
        this.removeNoJsClass();
        this.settings = this.loadSettings(); // Always load the settings from localStorage
        console.log("Loaded settings:", this.settings);
        this.initializeThemeColors();
        this.applySettings(); // Apply theme based on stored settings
        this.addThemeToggleHandling(); // Handle theme switching
        this.addFontSizeHandling(); // Handle font size adjustments
        this.addFocusOutlineHandling(); // Handle focus outline settings
    }

    // Immediately removes the 'no-js' class from the <html> element
    removeNoJsClass() {
        document.documentElement.classList.remove('no-js');
        document.documentElement.classList.add('js');
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true, // Default to dark mode
            fontSize: 'default', // Default font size in pixels
            focusOutlineDisabled: false,
        };
        return JSON.parse(localStorage.getItem('websiteSettings')) || defaultSettings;
    }

    initializeThemeColors() {
        // Default theme colors
        this.darkTheme = {
            '--bg-color': '#1a1a1a',
            '--text-color': '#ffffff',
            '--secondary-text': '#a0a0a0',
            '--border-color': '#333333',
            '--accent-color': '#4CAF50',
            '--content-bg': '#2d2d2d'
        };

        this.lightTheme = {
            '--bg-color': '#ffffff',
            '--text-color': '#000000',
            '--secondary-text': '#666666',
            '--border-color': '#dddddd',
            '--accent-color': '#4CAF50',
            '--content-bg': '#f5f5f5'
        };
    }

    applySettings() {
        this.applyTheme(this.settings.darkMode); // Apply the saved theme
        this.setFontSize(this.settings.fontSize); // Apply the saved font size
        this.applyFocusOutlineSetting(); // Apply focus outline setting
        this.applyColorblindMode(this.settings.colorblindMode); // Apply colorblind mode
    }

    applyTheme(isDark = this.settings.darkMode) {
        const theme = isDark ? this.darkTheme : this.lightTheme;
        Object.entries(theme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
    }

    setFontSize(size) {
        document.documentElement.style.setProperty('--font-size-base', `${size}px`);
        document.body.style.fontSize = `${size}px`;
    }

    applyFocusOutlineSetting() {
        if (this.settings.focusOutlineDisabled) {
            document.body.classList.add('focus-outline-disabled');
        } else {
            document.body.classList.remove('focus-outline-disabled');
        }
    }

    applyColorblindMode(mode) {
        console.log("Applying colorblind mode:", mode);
        document.documentElement.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia', 'colorblind-achromatopsia');
        if (mode !== 'none') {
            document.documentElement.classList.add(`colorblind-${mode}`);
        }
    }

    addThemeToggleHandling() {
        const themeToggle = document.querySelector('#theme-toggle');
        if (themeToggle) {
            themeToggle.checked = !this.settings.darkMode; // Invert initial toggle based on saved setting
            themeToggle.addEventListener('change', () => {
                this.settings.darkMode = !this.settings.darkMode;
                this.applyTheme(this.settings.darkMode);
                this.saveSettings(); // Save the updated theme setting
            });
        }
    }

    addFontSizeHandling() {
        const fontSizeSelect = document.querySelector('#font-size-select');
        if (fontSizeSelect) {
            fontSizeSelect.value = this.settings.fontSize;
            fontSizeSelect.addEventListener('change', (e) => {
                this.settings.fontSize = parseInt(e.target.value);
                this.setFontSize(this.settings.fontSize);
                this.saveSettings(); // Save the updated font size setting
            });
        }
    }

    addFocusOutlineHandling() {
        const focusOutlineToggle = document.querySelector('#focus-outline-toggle');
        if (focusOutlineToggle) {
            focusOutlineToggle.checked = !this.settings.focusOutlineDisabled;
            focusOutlineToggle.addEventListener('change', () => {
                this.settings.focusOutlineDisabled = !focusOutlineToggle.checked;
                this.applyFocusOutlineSetting();
                this.saveSettings(); // Save the updated focus outline setting
            });
        }
    }

    addColorblindHandling() {
        const colorblindSelect = document.querySelector('#colorblind-select');
        if (colorblindSelect) {
            colorblindSelect.value = this.settings.colorblindMode;
            colorblindSelect.addEventListener('change', (e) => {
                this.settings.colorblindMode = e.target.value;
                this.applyColorblindMode(this.settings.colorblindMode);
                this.saveSettings(); // Save the updated colorblind mode setting
            });
        }
    }

    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }
}

// Initialize CommonManager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const commonManager = new CommonManager();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'colorblind-modes.css';
    document.head.appendChild(link);
});
