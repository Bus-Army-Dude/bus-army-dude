document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const languageSelect = document.getElementById('languageSelect');
    const decreaseFont = document.getElementById('decreaseFont');
    const increaseFont = document.getElementById('increaseFont');
    const currentFontSize = document.getElementById('currentFontSize');

    // Initialize controls with current settings
    themeToggle.checked = themeManager.settings.darkMode;
    languageSelect.value = themeManager.settings.language;
    currentFontSize.textContent = themeManager.settings.fontSize;

    // Theme toggle event listener
    themeToggle.addEventListener('change', (e) => {
        themeManager.applyTheme(e.target.checked);
    });

    // Language selector event listener
    languageSelect.addEventListener('change', (e) => {
        themeManager.setLanguage(e.target.value);
    });

    // Font size controls
    decreaseFont.addEventListener('click', () => {
        const newSize = parseInt(currentFontSize.textContent) - 1;
        themeManager.setFontSize(newSize);
        currentFontSize.textContent = newSize;
    });

    increaseFont.addEventListener('click', () => {
        const newSize = parseInt(currentFontSize.textContent) + 1;
        themeManager.setFontSize(newSize);
        currentFontSize.textContent = newSize;
    });
});
