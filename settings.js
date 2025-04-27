// settings.js - Manages client-side display settings using localStorage

class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.initializeControls();
        this.applySettings();
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            textSize: 16,
            focusOutline: 'disabled',
        };

        try {
            const stored = localStorage.getItem('websiteSettings');
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    darkMode: typeof parsed.darkMode === 'boolean' ? parsed.darkMode : defaultSettings.darkMode,
                    textSize: parsed.textSize >= 12 && parsed.textSize <= 24 ? parsed.textSize : defaultSettings.textSize,
                    focusOutline: ['enabled', 'disabled'].includes(parsed.focusOutline) ? parsed.focusOutline : defaultSettings.focusOutline
                };
            }
        } catch (error) {
            console.error("Error loading settings:", error);
        }
        return defaultSettings;
    }

    initializeControls() {
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => this.applyTheme(e.target.checked));
        }

        // Text Size Slider
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('textSizeValue');
        if (textSizeSlider && textSizeValue) {
            textSizeSlider.value = this.settings.textSize;
            textSizeValue.textContent = `${this.settings.textSize}px`;
            
            textSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                this.setTextSize(size);
                textSizeValue.textContent = `${size}px`;
                this.updateSliderGradient(textSizeSlider);
            });
            
            // Initial gradient update
            this.updateSliderGradient(textSizeSlider);
        }

        // Focus Outline Toggle
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');
        if (focusOutlineToggle) {
            focusOutlineToggle.checked = this.settings.focusOutline === 'enabled';
            focusOutlineToggle.addEventListener('change', (e) => this.toggleFocusOutline(e.target.checked));
        }

        // Reset Button
        const resetButton = document.getElementById('resetSettings');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetToFactorySettings());
        }

        // Update footer year
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    updateSliderGradient(slider) {
        if (!slider) return;
        const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.setProperty('--slider-value', `${value}%`);
    }

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.setTextSize(this.settings.textSize);
        this.toggleFocusOutline(this.settings.focusOutline === 'enabled');
    }

    applyTheme(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.settings.darkMode = isDark;
        this.saveSettings();
    }

    setTextSize(size) {
        if (size >= 12 && size <= 24) {
            document.documentElement.style.setProperty('--font-size-base', `${size}px`);
            this.settings.textSize = size;
            this.saveSettings();
        }
    }

    toggleFocusOutline(enable) {
        document.body.classList.toggle('focus-outline-disabled', !enable);
        this.settings.focusOutline = enable ? 'enabled' : 'disabled';
        this.saveSettings();
    }

    saveSettings() {
        try {
            localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    }

    resetToFactorySettings() {
        if (!confirm('Are you sure you want to reset all settings to their defaults?')) {
            return;
        }

        // Default values
        const defaults = {
            darkMode: true,
            textSize: 16,
            focusOutline: 'disabled'
        };

        // Reset internal settings
        this.settings = { ...defaults };

        // Update UI elements
        const darkModeToggle = document.getElementById('darkModeToggle');
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('textSizeValue');
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');

        if (darkModeToggle) darkModeToggle.checked = defaults.darkMode;
        if (textSizeSlider) {
            textSizeSlider.value = defaults.textSize;
            this.updateSliderGradient(textSizeSlider);
        }
        if (textSizeValue) textSizeValue.textContent = `${defaults.textSize}px`;
        if (focusOutlineToggle) focusOutlineToggle.checked = defaults.focusOutline === 'enabled';

        // Apply settings
        this.applySettings();

        // Clear and save
        localStorage.removeItem('websiteSettings');
        this.saveSettings();

        alert('Settings have been reset to defaults.');
    }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const settingsPageMarker = document.getElementById('settings-page-identifier');
    if (settingsPageMarker) {
        window.settingsManager = new SettingsManager();
    }
});

// Cookie consent logic
function acceptCookies() {
    document.cookie = "cookieConsent=true; path=/; max-age=31536000; SameSite=Lax; Secure";
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
        const hasConsent = document.cookie.split('; ').some(row => row.startsWith('cookieConsent=true'));
        banner.style.display = hasConsent ? 'none' : 'flex';
    }
});
