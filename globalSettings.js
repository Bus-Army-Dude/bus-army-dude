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
        const savedSettings = localStorage.getItem('websiteSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
        
        // Always apply font size on page load
        this.applyFontSize(settings.fontSize);
        
        return settings;
    }

    init() {
        this.applyDarkMode(this.settings.darkMode);
        this.applyFontSize(this.settings.fontSize);

        // Listen for changes across tabs/pages
        window.addEventListener('storage', (e) => {
            if (e.key === 'websiteSettings') {
                this.settings = JSON.parse(e.newValue);
                this.applyAllSettings();
            }
        });

        // Apply settings immediately when page loads
        window.addEventListener('load', () => {
            this.applyAllSettings();
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
        
        // Apply font size to all text elements
        const textElements = {
            'body': 1,
            'h1': 2,
            'h2': 1.75,
            'h3': 1.5,
            'h4': 1.25,
            'h5': 1.15,
            'h6': 1.1,
            'p': 1,
            'span': 1,
            'a': 1,
            'li': 1,
            'button': 1,
            'input': 1,
            'textarea': 1,
            'label': 1
        };

        Object.entries(textElements).forEach(([element, scale]) => {
            const elements = document.getElementsByTagName(element);
            for (let el of elements) {
                el.style.fontSize = `${size * scale}px`;
            }
        });

        // Update settings
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

// Initialize global settings immediately
const globalSettings = new GlobalSettings();

// Reapply settings when dynamic content is loaded
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            globalSettings.applyFontSize(globalSettings.settings.fontSize);
        }
    });
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });
