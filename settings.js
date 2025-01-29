class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
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

    initializeControls() {
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.applyTheme(e.target.checked, this.settings.highContrast);
            });
        }

        // High Contrast Toggle
        const highContrastToggle = document.getElementById('highContrastToggle');
        if (highContrastToggle) {
            highContrastToggle.checked = this.settings.highContrast;
            highContrastToggle.addEventListener('change', (e) => {
                this.applyTheme(this.settings.darkMode, e.target.checked);
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
        this.applyTheme(this.settings.darkMode, this.settings.highContrast);
        this.setFontSize(this.settings.fontSize);
    }

    applyTheme(isDark = this.settings.darkMode, isHighContrast = this.settings.highContrast) {
        if (isHighContrast) {
            document.body.classList.add('high-contrast');
            document.body.classList.remove('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.toggle('dark-mode', isDark);
            document.body.classList.toggle('light-mode', !isDark);
            document.body.classList.remove('high-contrast');
        }
        this.settings.darkMode = isDark;
        this.settings.highContrast = isHighContrast;
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
