class ThemeManager {
    constructor() {
        this.settings = this.loadSettings();
        this.applySettings();
        this.initializeThemeColors();
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            language: 'en',
            fontSize: 16
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

    applyTheme(isDark = this.settings.darkMode) {
        const theme = isDark ? this.darkTheme : this.lightTheme;
        Object.entries(theme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.settings.darkMode = isDark;
        this.saveSettings();
    }

    setFontSize(size) {
        size = Math.min(Math.max(size, 12), 20); // Limit size between 12px and 20px
        document.documentElement.style.setProperty('--font-size-base', `${size}px`);
        this.settings.fontSize = size;
        this.saveSettings();
    }

    setLanguage(lang) {
        this.settings.language = lang;
        this.saveSettings();
        this.translatePage();
    }

    translatePage() {
        // Implement translation logic here
        const translations = this.getTranslations();
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[this.settings.language]?.[key]) {
                element.textContent = translations[this.settings.language][key];
            }
        });
    }

    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }

    getTranslations() {
        return {
            en: {
                settings: "Settings",
                appearance: "Appearance",
                language: "Language",
                textSize: "Text Size",
                darkMode: "Dark Mode",
                // Add more translations
            },
            es: {
                settings: "Ajustes",
                appearance: "Apariencia",
                language: "Idioma",
                textSize: "Tamaño del texto",
                darkMode: "Modo oscuro",
                // Add more translations
            },
            // Add more languages
        };
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();
