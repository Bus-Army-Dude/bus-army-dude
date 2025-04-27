class CommonManager {
    constructor() {
        this.removeNoJsClass();
        this.settings = this.loadSettings();
        this.initializeThemeColors();
        this.applySettings();
        this.initializeControls();
    }

    removeNoJsClass() {
        document.documentElement.classList.remove('no-js');
        document.documentElement.classList.add('js');
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            fontSize: 14,
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
        this.setFontSize(this.settings.fontSize);
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

    initializeControls() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.settings.darkMode = e.target.checked;
                this.applyTheme(this.settings.darkMode);
                this.saveSettings();
            });
        }

        // Initialize font size slider
        const textSizeSlider = document.getElementById('text-size-slider');
        const textSizeValue = document.getElementById('textSizeValue');
        
        if (textSizeSlider && textSizeValue) {
            textSizeSlider.value = this.settings.fontSize;
            textSizeValue.textContent = `${this.settings.fontSize}px`;
            
            textSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                this.settings.fontSize = size;
                this.setFontSize(size);
                textSizeValue.textContent = `${size}px`;
                this.saveSettings();
            });
        }
    }

    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }

    // Method to reset settings to default
    resetToDefaults() {
        localStorage.removeItem('websiteSettings');
        this.settings = this.loadSettings();
        this.applySettings();
    }
}

// Accept cookies function
function acceptCookies() {
    document.cookie = "cookieConsent=true; path=/; max-age=" + (60 * 60 * 24 * 365);
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Check cookie consent on page load
window.addEventListener('load', function() {
    const banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;

    const cookies = document.cookie.split('; ');
    const consentCookie = cookies.find(row => row.startsWith('cookieConsent='));
    if (consentCookie && consentCookie.split('=')[1] === 'true') {
        banner.style.display = 'none';
    } else {
        banner.style.display = 'flex';
    }
});

// Initialize CommonManager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const commonManager = new CommonManager();
});
