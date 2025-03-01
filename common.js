class CommonManager {
    constructor() {
        this.removeNoJsClass();
        this.settings = this.loadSettings(); // Always load the settings from localStorage
        this.initializeThemeColors();
        this.applySettings(); // Apply theme based on stored settings
        this.addThemeToggleHandling(); // Handle theme switching
        this.addFontSizeHandling(); // Handle font size changing
        this.addFocusOutlineHandling(); // Handle focus outline toggling
        this.addDisableAnimationsHandling(); // Handle animation toggling
    }

    // Immediately removes the 'no-js' class from the <html> element
    removeNoJsClass() {
        document.documentElement.classList.remove('no-js');
        document.documentElement.classList.add('js');
    }

    // Loads settings from localStorage or defaults if not present
    loadSettings() {
        const defaultSettings = {
            darkMode: true, // Default to dark mode
            fontSize: 16, // Default font size (in px)
            focusOutlineDisabled: false,
            disableAnimations: false // Default to animations enabled
        };
        return JSON.parse(localStorage.getItem('websiteSettings')) || defaultSettings;
    }

    // Initializes the theme color schemes for dark and light modes
    initializeThemeColors() {
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

    // Applies settings (theme, font size, focus outline, animations)
    applySettings() {
        this.applyTheme(this.settings.darkMode); // Apply the saved theme
        this.setFontSize(this.settings.fontSize); // Apply the saved font size
        this.applyFocusOutlineSetting(); // Apply focus outline setting
        this.applyDisableAnimationsSetting(); // Apply animation setting
    }

    // Applies the current theme (dark or light)
    applyTheme(isDark = this.settings.darkMode) {
        const theme = isDark ? this.darkTheme : this.lightTheme;
        Object.entries(theme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.saveSettings(); // Save the theme preference
    }

    // Sets the font size dynamically
    setFontSize(size) {
        document.documentElement.style.setProperty('--font-size-base', `${size}px`);
        document.body.style.fontSize = `${size}px`;
        this.saveSettings(); // Save the font size preference
    }

    // Applies the focus outline setting (disabled or enabled)
    applyFocusOutlineSetting() {
        if (this.settings.focusOutlineDisabled) {
            document.body.classList.add('focus-outline-disabled');
        } else {
            document.body.classList.remove('focus-outline-disabled');
        }
    }

    // Applies the disable animations setting
    applyDisableAnimationsSetting() {
        if (this.settings.disableAnimations) {
            document.body.classList.add('disable-animations');
        } else {
            document.body.classList.remove('disable-animations');
        }
    }

    // Toggles the theme when the user interacts with the toggle switch
    addThemeToggleHandling() {
        const themeToggle = document.querySelector('#theme-toggle');
        if (themeToggle) {
            themeToggle.checked = !this.settings.darkMode; // Invert initial toggle based on saved setting
            themeToggle.addEventListener('change', () => {
                this.settings.darkMode = !this.settings.darkMode;
                this.applyTheme(this.settings.darkMode);
                this.saveSettings(); // Save the theme preference
            });
        }
    }

    // Handles font size changes via a slider or control
    addFontSizeHandling() {
        const fontSizeControl = document.querySelector('#font-size-control');
        if (fontSizeControl) {
            fontSizeControl.value = this.settings.fontSize;
            fontSizeControl.addEventListener('input', () => {
                this.settings.fontSize = fontSizeControl.value;
                this.setFontSize(this.settings.fontSize);
                this.saveSettings(); // Save the font size preference
            });
        }
    }

    // Handles the toggle for focus outline setting
    addFocusOutlineHandling() {
        const focusOutlineToggle = document.querySelector('#focus-outline-toggle');
        if (focusOutlineToggle) {
            focusOutlineToggle.checked = !this.settings.focusOutlineDisabled;
            focusOutlineToggle.addEventListener('change', () => {
                this.settings.focusOutlineDisabled = !focusOutlineToggle.checked;
                this.applyFocusOutlineSetting();
                this.saveSettings(); // Save the focus outline preference
            });
        }
    }

    // Handles the toggle for disabling animations
    addDisableAnimationsHandling() {
        const animationsToggle = document.querySelector('#animations-toggle');
        if (animationsToggle) {
            animationsToggle.checked = this.settings.disableAnimations;
            animationsToggle.addEventListener('change', () => {
                this.settings.disableAnimations = animationsToggle.checked;
                this.applyDisableAnimationsSetting();
                this.saveSettings(); // Save the animation preference
            });
        }
    }

    // Saves the settings to localStorage
    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }
}

const commonManager = new CommonManager();
