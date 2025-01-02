document.addEventListener('DOMContentLoaded', () => {
    const fontSizeSlider = document.getElementById('fontSize');
    const colorSchemeSelector = document.getElementById('colorScheme');
    const highContrastCheckbox = document.getElementById('highContrast');
    const form = document.getElementById('appearanceForm');

    // Load settings from localStorage
    const savedFontSize = localStorage.getItem('fontSize');
    const savedColorScheme = localStorage.getItem('colorScheme');
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';

    // Set default values if no saved settings
    fontSizeSlider.value = savedFontSize || 16;
    colorSchemeSelector.value = savedColorScheme || 'light';
    highContrastCheckbox.checked = savedHighContrast;

    // Apply saved settings on page load
    applySettings();

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newFontSize = fontSizeSlider.value;
        const newColorScheme = colorSchemeSelector.value;
        const newHighContrast = highContrastCheckbox.checked;

        // Save settings to localStorage
        localStorage.setItem('fontSize', newFontSize);
        localStorage.setItem('colorScheme', newColorScheme);
        localStorage.setItem('highContrast', newHighContrast);

        // Apply settings to the page
        applySettings();
    });

    // Function to apply settings
    function applySettings() {
        document.body.style.fontSize = `${fontSizeSlider.value}px`;

        if (colorSchemeSelector.value === 'dark') {
            document.body.style.backgroundColor = '#121212';
            document.body.style.color = 'white';
        } else {
            document.body.style.backgroundColor = 'white';
            document.body.style.color = 'black';
        }

        if (highContrastCheckbox.checked) {
            document.body.style.backgroundColor = '#000';
            document.body.style.color = '#FFF';
        }
    }
});
