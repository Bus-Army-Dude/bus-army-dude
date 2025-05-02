class SettingsManager {
    constructor() {
        this.defaultSettings = {
            darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
            fontSize: 16,
            focusOutline: 'enabled',
            lastUpdated: Date.now()
        };
        
        this.settings = this.loadSettings();
        this.initializeControls();
        this.applySettings();
        this.setupEventListeners();
        this.initializeCookieConsent();
    }

    loadSettings() {
        try {
            const stored = localStorage.getItem('websiteSettings');
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    darkMode: typeof parsed.darkMode === 'boolean' ? parsed.darkMode : this.defaultSettings.darkMode,
                    fontSize: this.validateFontSize(parsed.fontSize),
                    focusOutline: ['enabled', 'disabled'].includes(parsed.focusOutline) ? 
                        parsed.focusOutline : this.defaultSettings.focusOutline,
                    lastUpdated: Date.now()
                };
            }
        } catch (error) {
            console.error("Error loading settings:", error);
        }
        return { ...this.defaultSettings };
    }

    validateFontSize(size) {
        const parsed = parseInt(size);
        if (isNaN(parsed) || parsed < 12 || parsed > 24) {
            return this.defaultSettings.fontSize;
        }
        return parsed;
    }

    initializeControls() {
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
        }

        // Text Size Slider
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('textSizeValue');
        if (textSizeSlider && textSizeValue) {
            textSizeSlider.value = this.settings.fontSize;
            textSizeValue.textContent = `${this.settings.fontSize}px`;
        }

        // Focus Outline Toggle
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');
        if (focusOutlineToggle) {
            focusOutlineToggle.checked = this.settings.focusOutline === 'enabled';
        }

        // Year in footer
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    setupEventListeners() {
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                this.settings.darkMode = e.target.checked;
                this.applySettings();
                this.saveSettings();
            });
        }

        // Text Size Slider
        const textSizeSlider = document.getElementById('text-size-slider');
        if (textSizeSlider) {
            textSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                this.settings.fontSize = size;
                document.getElementById('textSizeValue').textContent = `${size}px`;
                this.applySettings();
                this.saveSettings();
            });
        }

        // Focus Outline Toggle
        const focusOutlineToggle = document.getElementById('focusOutlineToggle');
        if (focusOutlineToggle) {
            focusOutlineToggle.addEventListener('change', (e) => {
                this.settings.focusOutline = e.target.checked ? 'enabled' : 'disabled';
                this.applySettings();
                this.saveSettings();
            });
        }

        // Reset Button
        const resetButton = document.getElementById('resetSettings');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetSettings());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', e => {
                if (!localStorage.getItem('websiteSettings')) {
                    this.settings.darkMode = e.matches;
                    this.applySettings();
                    this.saveSettings();
                }
            });

        // Listen for settings changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'websiteSettings') {
                this.settings = JSON.parse(e.newValue);
                this.initializeControls();
                this.applySettings();
            }
        });
    }

    applySettings() {
        // Apply Dark Mode
        document.documentElement.setAttribute('data-theme', this.settings.darkMode ? 'dark' : 'light');
        
        // Apply Font Size
        document.documentElement.style.setProperty('--font-size-base', `${this.settings.fontSize}px`);
        
        // Apply Focus Outline
        document.body.classList.toggle('focus-outline-disabled', 
            this.settings.focusOutline === 'disabled');
    }

    saveSettings() {
        try {
            this.settings.lastUpdated = Date.now();
            localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
            
            // Dispatch event for other pages
            window.dispatchEvent(new CustomEvent('settingsChanged', {
                detail: this.settings
            }));
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to their defaults?')) {
            this.settings = { ...this.defaultSettings };
            this.initializeControls();
            this.applySettings();
            this.saveSettings();
            alert('Settings have been reset to defaults.');
        }
    }

    initializeCookieConsent() {
        const banner = document.getElementById('cookie-consent-banner');
        if (!banner) return;

        const hasConsent = document.cookie.split(';').some(item => item.trim().startsWith('cookieConsent='));
        if (!hasConsent) {
            banner.classList.add('visible');
        }
    }
}

// Cookie consent function
function acceptCookies() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
        document.cookie = "cookieConsent=true; path=/; max-age=31536000"; // 1 year
        banner.classList.remove('visible');
    }
}

// Initialize settings when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('settings-page-identifier')) {
        window.settingsManager = new SettingsManager();
    }
});
