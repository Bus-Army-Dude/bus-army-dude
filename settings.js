document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings from localStorage
    loadSettings();

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode');
        saveSettings();
    });

    // Language Selector
    const languageSelect = document.getElementById('languageSelect');
    languageSelect.addEventListener('change', function() {
        saveSettings();
    });

    // Font Size Controls
    const decreaseFont = document.getElementById('decreaseFont');
    const increaseFont = document.getElementById('increaseFont');
    const currentFontSize = document.getElementById('currentFontSize');

    decreaseFont.addEventListener('click', () => {
        changeFontSize(-1);
    });

    increaseFont.addEventListener('click', () => {
        changeFontSize(1);
    });
});

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('websiteSettings')) || {
        darkMode: true,
        language: 'en',
        fontSize: 16
    };

    // Apply Dark Mode
    document.getElementById('darkModeToggle').checked = settings.darkMode;
    document.body.classList.toggle('light-mode', !settings.darkMode);
    document.body.classList.toggle('dark-mode', settings.darkMode);

    // Apply Language
    document.getElementById('languageSelect').value = settings.language;

    // Apply Font Size
    document.getElementById('currentFontSize').textContent = `${settings.fontSize}px`;
    document.documentElement.style.setProperty('--font-size-base', `${settings.fontSize}px`);
}

function saveSettings() {
    const settings = {
        darkMode: document.getElementById('darkModeToggle').checked,
        language: document.getElementById('languageSelect').value,
        fontSize: parseInt(document.getElementById('currentFontSize').textContent)
    };

    localStorage.setItem('websiteSettings', JSON.stringify(settings));
}

function changeFontSize(change) {
    const currentSize = parseInt(document.getElementById('currentFontSize').textContent);
    const newSize = Math.min(Math.max(currentSize + change, 12), 24); // Min: 12px, Max: 24px
    
    document.getElementById('currentFontSize').textContent = `${newSize}px`;
    document.documentElement.style.setProperty('--font-size-base', `${newSize}px`);
    saveSettings();
}
