// settings.js
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
            backgroundColor: '#ffffff',
            customBackground: ''
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

    initializeControls() {
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.applyTheme(e.target.checked);
            });
        }

        // Font Size Controls
        const decreaseFont = document.getElementById('decreaseFont');
        const increaseFont = document.getElementById('increaseFont');
        const currentFontSize = document.getElementById('currentFontSize');

        if (currentFontSize) {
            currentFontSize.textContent = `${this.settings.fontSize}px`;
        }

        if (decreaseFont) {
            decreaseFont.addEventListener('click', () => {
                this.adjustFontSize(-1);
            });
        }

        if (increaseFont) {
            increaseFont.addEventListener('click', () => {
                this.adjustFontSize(1);
            });
        }

        // Background Color Select
        const backgroundColorSelect = document.getElementById('backgroundColorSelect');
        const customColorPicker = document.getElementById('customColorPicker');
        if (backgroundColorSelect) {
            backgroundColorSelect.value = this.settings.backgroundColor;
            backgroundColorSelect.addEventListener('change', (e) => {
                this.setBackgroundColor(e.target.value);
                customColorPicker.value = e.target.value; // Sync color picker with select value
            });
        }

        if (customColorPicker) {
            customColorPicker.addEventListener('input', (e) => {
                this.setBackgroundColor(e.target.value);
                backgroundColorSelect.value = e.target.value; // Sync select with color picker value
            });
        }

        // Custom Background Upload
        const backgroundUploadInput = document.getElementById('backgroundUploadInput');
        const backgroundPreview = document.getElementById('backgroundPreview');
        const saveBackground = document.getElementById('saveBackground');

        if (backgroundUploadInput && backgroundPreview && saveBackground) {
            backgroundUploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        backgroundPreview.src = event.target.result;
                        backgroundPreview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });

            saveBackground.addEventListener('click', () => {
                this.saveCustomBackground(backgroundPreview.src);
            });

            // Set initial background preview
            if (this.settings.customBackground) {
                backgroundPreview.src = this.settings.customBackground;
                document.body.style.backgroundImage = `url(${this.settings.customBackground})`;
            }
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

    adjustFontSize(change) {
        const newSize = Math.min(Math.max(this.settings.fontSize + change, 12), 20);
        this.setFontSize(newSize);
        const currentFontSize = document.getElementById('currentFontSize');
        if (currentFontSize) {
            currentFontSize.textContent = `${newSize}px`;
        }
    }

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.setFontSize(this.settings.fontSize);
        this.setBackgroundColor(this.settings.backgroundColor);

        // Apply custom background if set
        if (this.settings.customBackground) {
            document.body.style.backgroundImage = `url(${this.settings.customBackground})`;
        } else {
            document.body.style.backgroundImage = '';
        }
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
        document.body.style.fontSize = `${size}px`;
        this.settings.fontSize = size;
        this.saveSettings();
    }

    setBackgroundColor(color) {
        document.documentElement.style.setProperty('--bg-color-custom', color);
        document.body.style.backgroundColor = color;
        this.settings.backgroundColor = color;
        this.saveSettings();
    }

    saveCustomBackground(imageSrc) {
        this.settings.customBackground = imageSrc;
        this.saveSettings();
        document.body.style.backgroundImage = `url(${imageSrc})`;
    }

    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }

    resetToFactorySettings() {
        const defaultSettings = {
            darkMode: true,
            fontSize: 16,
            backgroundColor: '// settings.js
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
            backgroundColor: '#ffffff',
            customBackground: ''
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

    initializeControls() {
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.applyTheme(e.target.checked);
            });
        }

        // Font Size Controls
        const decreaseFont = document.getElementById('decreaseFont');
        const increaseFont = document.getElementById('increaseFont');
        const currentFontSize = document.getElementById('currentFontSize');

        if (currentFontSize) {
            currentFontSize.textContent = `${this.settings.fontSize}px`;
        }

        if (decreaseFont) {
            decreaseFont.addEventListener('click', () => {
                this.adjustFontSize(-1);
            });
        }

        if (increaseFont) {
            increaseFont.addEventListener('click', () => {
                this.adjustFontSize(1);
            });
        }

        // Background Color Select
        const backgroundColorSelect = document.getElementById('backgroundColorSelect');
        const customColorPicker = document.getElementById('customColorPicker');
        if (backgroundColorSelect) {
            backgroundColorSelect.value = this.settings.backgroundColor;
            backgroundColorSelect.addEventListener('change', (e) => {
                this.setBackgroundColor(e.target.value);
                customColorPicker.value = e.target.value; // Sync color picker with select value
            });
        }

        if (customColorPicker) {
            customColorPicker.addEventListener('input', (e) => {
                this.setBackgroundColor(e.target.value);
                backgroundColorSelect.value = e.target.value; // Sync select with color picker value
            });
        }

        // Custom Background Upload
        const backgroundUploadInput = document.getElementById('backgroundUploadInput');
        const backgroundPreview = document.getElementById('backgroundPreview');
        const saveBackground = document.getElementById('saveBackground');

        if (backgroundUploadInput && backgroundPreview && saveBackground) {
            backgroundUploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        backgroundPreview.src = event.target.result;
                        backgroundPreview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });

            saveBackground.addEventListener('click', () => {
                this.saveCustomBackground(backgroundPreview.src);
            });

            // Set initial background preview
            if (this.settings.customBackground) {
                backgroundPreview.src = this.settings.customBackground;
                document.body.style.backgroundImage = `url(${this.settings.customBackground})`;
            }
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

    adjustFontSize(change) {
        const newSize = Math.min(Math.max(this.settings.fontSize + change, 12), 20);
        this.setFontSize(newSize);
        const currentFontSize = document.getElementById('currentFontSize');
        if (currentFontSize) {
            currentFontSize.textContent = `${newSize}px`;
        }
    }

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.setFontSize(this.settings.fontSize);
        this.setBackgroundColor(this.settings.backgroundColor);

        // Apply custom background if set
        if (this.settings.customBackground) {
            document.body.style.backgroundImage = `url(${this.settings.customBackground})`;
        } else {
            document.body.style.backgroundImage = '';
        }
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
        document.body.style.fontSize = `${size}px`;
        this.settings.fontSize = size;
        this.saveSettings();
    }

    setBackgroundColor(color) {
        document.documentElement.style.setProperty('--bg-color-custom', color);
        document.body.style.backgroundColor = color;
        this.settings.backgroundColor = color;
        this.saveSettings();
    }

    saveCustomBackground(imageSrc) {
        this.settings.customBackground = imageSrc;
        this.saveSettings();
        document.body.style.backgroundImage = `url(${imageSrc})`;
    }

    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }

    resetToFactorySettings() {
        const defaultSettings = {
            darkMode: true,
            fontSize: 16,
            backgroundColor: '#1a1a1a',
            customBackground: ''
        };
        this.settings = defaultSettings;
        this.applySettings();
        this.saveSettings();

        // Update UI controls
        const darkModeToggle = document.getElementById('darkModeToggle');
        const currentFontSize = document.getElementById('currentFontSize');
        const backgroundColorSelect = document.getElementById('backgroundColorSelect');
        const backgroundPreview = document.getElementById('backgroundPreview');
        const customColorPicker = document.getElementById('customColorPicker');
        if (darkModeToggle) darkModeToggle.checked = defaultSettings.darkMode;
        if (currentFontSize) currentFontSize.textContent = `${defaultSettings.fontSize}px`;
        if (backgroundColorSelect) backgroundColorSelect.value = defaultSettings.backgroundColor;
        if (customColorPicker) customColorPicker.value = defaultSettings.backgroundColor;
        if (backgroundPreview) backgroundPreview.src = '';
        document.body.style.backgroundImage = '';
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});',
            customBackground: ''
        };
        this.settings = defaultSettings;
        this.applySettings();
        this.saveSettings();

        // Update UI controls
        const darkModeToggle = document.getElementById('darkModeToggle');
        const currentFontSize = document.getElementById('currentFontSize');
        const backgroundColorSelect = document.getElementById('backgroundColorSelect');
        const backgroundPreview = document.getElementById('backgroundPreview');
        const customColorPicker = document.getElementById('customColorPicker');
        if (darkModeToggle) darkModeToggle.checked = defaultSettings.darkMode;
        if (currentFontSize) currentFontSize.textContent = `${defaultSettings.fontSize}px`;
        if (backgroundColorSelect) backgroundColorSelect.value = defaultSettings.backgroundColor;
        if (customColorPicker) customColorPicker.value = defaultSettings.backgroundColor;
        if (backgroundPreview) backgroundPreview.src = '';
        document.body.style.backgroundImage = '';
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});
