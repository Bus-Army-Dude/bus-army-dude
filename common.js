class CommonManager {
    constructor() {
        this.removeNoJsClass();
        this.settings = this.loadSettings();
        this.initializeThemeColors();
        this.applySettings();
        this.addThemeToggleHandling();
        this.addFontSizeHandling();
        this.addFocusOutlineHandling();
    }

    removeNoJsClass() {
        document.documentElement.classList.remove('no-js');
        document.documentElement.classList.add('js');
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            textSize: 16,
            focusOutlineDisabled: false,
        };
        return JSON.parse(localStorage.getItem('websiteSettings')) || defaultSettings;
    }

    initializeThemeColors() {
        this.darkTheme = {
            '--bg-color': '#1a1a1a',
            '--text-color': '#ffffff',
            '--secondary-text': '#a0a0a0',
            '--border-color': '#333333',
            '--accent-color': '#007aff',
            '--content-bg': '#2d2d2d'
        };

        this.lightTheme = {
            '--bg-color': '#ffffff',
            '--text-color': '#000000',
            '--secondary-text': '#666666',
            '--border-color': '#dddddd',
            '--accent-color': '#007aff',
            '--content-bg': '#f5f5f5'
        };
    }

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.setFontSize(this.settings.textSize);
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
    }

    applyFocusOutlineSetting() {
        document.body.classList.toggle('focus-outline-disabled', this.settings.focusOutlineDisabled);
    }

    addThemeToggleHandling() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.settings.darkMode = e.target.checked;
                this.applyTheme(this.settings.darkMode);
                this.saveSettings();
            });
        }
    }

    addFontSizeHandling() {
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('textSizeValue');
        
        if (textSizeSlider && textSizeValue) {
            textSizeSlider.value = this.settings.textSize;
            textSizeValue.textContent = `${this.settings.textSize}px`;
            this.updateSliderGradient(textSizeSlider);

            textSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                this.settings.textSize = size;
                this.setFontSize(size);
                textSizeValue.textContent = `${size}px`;
                this.updateSliderGradient(textSizeSlider);
                this.saveSettings();
            });
        }
    }

    updateSliderGradient(slider) {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.setProperty('--slider-value', `${value}%`);
    }

    addFocusOutlineHandling() {
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');
        if (focusOutlineToggle) {
            focusOutlineToggle.checked = !this.settings.focusOutlineDisabled;
            focusOutlineToggle.addEventListener('change', (e) => {
                this.settings.focusOutlineDisabled = !e.target.checked;
                this.applyFocusOutlineSetting();
                this.saveSettings();
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
});
