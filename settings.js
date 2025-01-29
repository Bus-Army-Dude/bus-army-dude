class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.initializeThemeColors();
        this.initializeControls();
        this.applySettings();
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            fontSize: 16,
            highContrast: false
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

        this.highContrastTheme = {
            '--bg-color': '#000000',
            '--text-color': '#ffffff',
            '--secondary-text': '#ffcc00',
            '--border-color': '#ffcc00',
            '--accent-color': '#ffcc00',
            '--content-bg': '#333333'
        };
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

        // High Contrast Toggle
        const highContrastToggle = document.getElementById('highContrastToggle');
        if (highContrastToggle) {
            highContrastToggle.checked = this.settings.highContrast;
            highContrastToggle.addEventListener('change', (e) => {
                this.applyHighContrast(e.target.checked);
            });
        }

        // Font Size Control
        const fontSizeRange = document.getElementById('fontSizeRange');
        const currentFontSize = document.getElementById('currentFontSize');

        if (fontSizeRange) {
            fontSizeRange.value = this.settings.fontSize;
            fontSizeRange.addEventListener('input', (e) => {
                this.setFontSize(e.target.value);
            });
        }

        if (currentFontSize) {
            currentFontSize.textContent = `${this.settings.fontSize}px`;
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
    }

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.applyHighContrast(this.settings.highContrast);
        this.setFontSize(this.settings.fontSize);
    }

    applyTheme(isDark = this.settings.darkMode) {
        const theme = isDark ? this.darkTheme : this.lightTheme;
        this.applyThemeColors(theme);
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.settings.darkMode = isDark;
        this.saveSettings();
    }

    applyHighContrast(isHighContrast = this.settings.highContrast) {
        if (isHighContrast) {
            this.applyThemeColors(this.highContrastTheme);
        } else {
            this.applyTheme(this.settings.darkMode);
        }
        this.settings.highContrast = isHighContrast;
        this.saveSettings();
    }

    applyThemeColors(theme) {
        Object.entries(theme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
    }

    setFontSize(size) {
        size = Math.min(Math.max(size, 12), 30); // Limit size between 12px and 30px
        document.documentElement.style.setProperty('--font-size-base', `${size}px`);
        document.body.style.fontSize = `${size}px`;
        this.settings.fontSize = size;
        this.saveSettings();

        // Update UI display
        const currentFontSize = document.getElementById('currentFontSize');
        if (currentFontSize) {
            currentFontSize.textContent = `${size}px`;
        }
    }

    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }

    resetToFactorySettings() {
        const defaultSettings = {
            darkMode: true,
            fontSize: 16,
            highContrast: false
        };
        this.settings = defaultSettings;
        this.applySettings();
        this.saveSettings();

        // Update UI controls
        const darkModeToggle = document.getElementById('darkModeToggle');
        const highContrastToggle = document.getElementById('highContrastToggle');
        const fontSizeRange = document.getElementById('fontSizeRange');
        const currentFontSize = document.getElementById('currentFontSize');

        if (darkModeToggle) darkModeToggle.checked = defaultSettings.darkMode;
        if (highContrastToggle) highContrastToggle.checked = defaultSettings.highContrast;
        if (fontSizeRange) fontSizeRange.value = defaultSettings.fontSize;
        if (currentFontSize) currentFontSize.textContent = `${defaultSettings.fontSize}px`;
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});
