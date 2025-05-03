class SettingsManager {
    constructor() {
        this.defaultSettings = {
            darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
            fontSize: 16,
            focusOutline: 'disabled',
            lastUpdated: Date.now()
        };
        
        this.currentUser = 'BusArmyDude';
        this.settings = this.loadSettings();
        this.updateInterval = null;
        
        // Initialize everything
        this.initializeControls();
        this.applySettings();
        this.setupEventListeners();
        this.startTimeUpdate();
        this.displayUserInfo();
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

        // Cleanup on page unload
        window.addEventListener('unload', () => this.cleanup());
    }

    startTimeUpdate() {
        const updateTimeDisplay = () => {
            const now = new Date();
            const timeString = now.toISOString()
                .replace('T', ' ')
                .substring(0, 19);
            
            const timeElements = document.querySelectorAll('.current-datetime');
            timeElements.forEach(element => {
                element.textContent = `Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): ${timeString}`;
            });
        };

        // Update immediately and then every second
        updateTimeDisplay();
        this.updateInterval = setInterval(updateTimeDisplay, 1000);
    }

    displayUserInfo() {
        const userElements = document.querySelectorAll('.current-user');
        userElements.forEach(element => {
            element.textContent = `Current User's Login: ${this.currentUser}`;
        });
    }

    applySettings() {
        // Apply Light/Dark Mode
        document.body.classList.toggle('light-e', !this.settings.darkMode);
        
        // Apply Font Size
        document.documentElement.style.setProperty('--base-font-size', `${this.settings.fontSize}px`);
        this.updateTextSize();
        
        // Apply Focus Outline
        document.body.classList.toggle('focus-outline-disabled', 
            this.settings.focusOutline === 'disabled');
    }

    updateTextSize() {
        const elements = document.querySelectorAll('body, h1, h2, h3, h4, h5, h6, p, span, a, button, input, textarea, label');
        const baseSize = this.settings.fontSize;
        
        elements.forEach(element => {
            let scale = 1;
            switch (element.tagName.toLowerCase()) {
                case 'h1': scale = 2; break;
                case 'h2': scale = 1.75; break;
                case 'h3': scale = 1.5; break;
                case 'h4': scale = 1.25; break;
                case 'h5': scale = 1.15; break;
                case 'h6': scale = 1.1; break;
                default: scale = 1;
            }
            element.style.fontSize = `${baseSize * scale}px`;
        });
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

    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize settings when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});
