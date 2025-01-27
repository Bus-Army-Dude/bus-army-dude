document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const darkModeToggle = document.getElementById('darkModeToggle');
    const languageSelect = document.getElementById('languageSelect');
    const decreaseFont = document.getElementById('decreaseFont');
    const increaseFont = document.getElementById('increaseFont');
    const currentFontSize = document.getElementById('currentFontSize');

    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem('websiteSettings')) || {
        darkMode: true,
        language: 'en',
        fontSize: 16
    };

    // Initialize settings
    darkModeToggle.checked = savedSettings.darkMode;
    languageSelect.value = savedSettings.language;
    currentFontSize.textContent = `${savedSettings.fontSize}px`;

    // Dark Mode Toggle
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
        document.body.classList.toggle('light-mode', !this.checked);
        savedSettings.darkMode = this.checked;
        localStorage.setItem('websiteSettings', JSON.stringify(savedSettings));
    });

    // Language Selector
    languageSelect.addEventListener('change', function() {
        savedSettings.language = this.value;
        localStorage.setItem('websiteSettings', JSON.stringify(savedSettings));
    });

    // Font Size Controls
    function updateFontSize(change) {
        let size = parseInt(currentFontSize.textContent);
        size = Math.min(Math.max(size + change, 12), 20); // Min: 12px, Max: 20px
        currentFontSize.textContent = `${size}px`;
        document.documentElement.style.fontSize = `${size}px`;
        savedSettings.fontSize = size;
        localStorage.setItem('websiteSettings', JSON.stringify(savedSettings));
    }

    decreaseFont.addEventListener('click', () => updateFontSize(-1));
    increaseFont.addEventListener('click', () => updateFontSize(1));

    // Apply saved settings on load
    if (savedSettings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.add('light-mode');
    }
    document.documentElement.style.fontSize = `${savedSettings.fontSize}px`;
});
