class GlobalSettings {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
        this.initFontSizeControls();
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            fontSize: 16,
            lastUpdate: Date.now()
        };
        return JSON.parse(localStorage.getItem('websiteSettings')) || defaultSettings;
    }

    init() {
        this.applyDarkMode(this.settings.darkMode);
        this.applyFontSize(this.settings.fontSize);

        window.addEventListener('storage', (e) => {
            if (e.key === 'websiteSettings') {
                this.settings = JSON.parse(e.newValue);
                this.applyAllSettings();
            }
        });
    }

    initFontSizeControls() {
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('textSizeValue');

        if (textSizeSlider && textSizeValue) {
            textSizeSlider.value = this.settings.fontSize;
            textSizeValue.textContent = `${this.settings.fontSize}px`;
            this.updateSliderGradient(textSizeSlider);

            textSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                this.applyFontSize(size);
                textSizeValue.textContent = `${size}px`;
                this.updateSliderGradient(textSizeSlider);
                this.settings.lastUpdate = Date.now();
                this.saveSettings();
            });
        }
    }

    updateSliderGradient(slider) {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.setProperty('--slider-value', `${value}%`);
    }

    applyFontSize(size) {
        size = Math.min(Math.max(size, 12), 24);
        document.documentElement.style.setProperty('--font-size-base', `${size}px`);
        this.settings.fontSize = size;
        this.saveSettings();
    }

    applyDarkMode(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.settings.darkMode = isDark;
        this.saveSettings();
    }

    applyAllSettings() {
        this.applyDarkMode(this.settings.darkMode);
        this.applyFontSize(this.settings.fontSize);
    }

    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }
}

// Initialize global settings
const globalSettings = new GlobalSettings();
