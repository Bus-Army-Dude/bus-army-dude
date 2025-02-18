class CommonManager {
    constructor() {
        this.settings = this.loadSettings();
        this.initializeThemeColors();
        this.applySettings();
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            fontSize: 16,
            focusOutlineDisabled: false // Default to outline enabled
        };
        return JSON.parse(localStorage.getItem('websiteSettings')) || defaultSettings;
    }

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

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.setFontSize(this.settings.fontSize);
        this.applyFocusOutlineSetting();
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

    toggleDarkMode() {
        this.settings.darkMode = !this.settings.darkMode;
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
        this.applyTheme(this.settings.darkMode);
    }

    updateFontSize(size) {
        this.settings.fontSize = size;
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
        this.setFontSize(size);
    }

    toggleFocusOutline() {
        this.settings.focusOutlineDisabled = !this.settings.focusOutlineDisabled;
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
        this.applyFocusOutlineSetting();
    }
}

// Initialize common manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.commonManager = new CommonManager();

    // Attach event listener for the focus outline toggle
    document.querySelector('#focus-outline-toggle').addEventListener('change', (e) => {
        window.commonManager.toggleFocusOutline();
    });
});
