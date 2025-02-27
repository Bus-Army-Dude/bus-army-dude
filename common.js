class CommonManager {
    constructor() {
        this.removeNoJsClass();
        this.settings = this.loadSettings(); // Always load the settings from localStorage
        this.initializeThemeColors();
        this.applySettings(); // Apply theme based on stored settings
        this.addThemeToggleHandling(); // Handle theme switching
    }

    // Immediately removes the 'no-js' class from the <html> element
    removeNoJsClass() {
        document.documentElement.classList.remove('no-js');
        document.documentElement.classList.add('js');
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true, // Default to dark mode
            fontSize: 'default',
            focusOutlineDisabled: false
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
        this.applyTheme(this.settings.darkMode); // Apply the saved theme
        this.setFontSize(this.settings.fontSize); // Apply the saved font size
        this.applyFocusOutlineSetting(); // Apply focus outline setting
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

    addThemeToggleHandling() {
        const themeToggle = document.querySelector('#theme-toggle');
        if (themeToggle) {
            themeToggle.checked = !this.settings.darkMode; // Invert initial toggle based on saved setting
            themeToggle.addEventListener('change', () => {
                this.settings.darkMode = !this.settings.darkMode;
                this.applyTheme(this.settings.darkMode);
