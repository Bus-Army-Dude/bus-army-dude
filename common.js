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
            focusOutlineDisabled: false // Default is false, meaning focus outline is enabled initially
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
        // Now the logic is reversed: if focusOutlineDisabled is true, the outline is removed
        if (this.settings.focusOutlineDisabled) {
            document.body.classList.add('focus-outline-disabled');
        } else {
            document.body.classList.remove('focus-outline-disabled');
        }
    }

    toggleFocusOutline() {
        // Toggle the focus outline setting and update localStorage
        this.settings.focusOutlineDisabled = !this.settings.focusOutlineDisabled;
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
        this.applyFocusOutlineSetting(); // Apply the updated setting
    }
}

// Initialize common manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.commonManager = new CommonManager();

    // Attach event listener for the focus outline toggle
    const focusOutlineToggle = document.querySelector('#focus-outline-toggle');
    if (focusOutlineToggle) {
        focusOutlineToggle.checked = !window.commonManager.settings.focusOutlineDisabled; // Invert initial state
        focusOutlineToggle.addEventListener('change', () => {
            window.commonManager.toggleFocusOutline();
        });
    }
});
