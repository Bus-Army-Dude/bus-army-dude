document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const textSizeInput = document.getElementById('text-size');
    const textSizeValue = document.getElementById('text-size-value');

    // Load and apply saved settings
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    } else {
        body.classList.remove('dark-mode');
        darkModeToggle.checked = false;
    }

    const savedTextSize = localStorage.getItem('textSize');
    if (savedTextSize) {
        body.style.fontSize = savedTextSize + 'px'; // Apply saved text size
        textSizeInput.value = savedTextSize; // Sync the slider with saved value
        textSizeValue.textContent = savedTextSize + 'px';
    }

    // Dark Mode functionality
    darkModeToggle.addEventListener('change', function() {
        if (darkModeToggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Text Size functionality
    textSizeInput.addEventListener('input', function() {
        const textSize = textSizeInput.value;
        textSizeValue.textContent = textSize + 'px';
        body.style.fontSize = textSize + 'px'; // Apply the text size to body
        localStorage.setItem('textSize', textSize); // Save text size to localStorage
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Apply saved theme and text size on page load
    function applySavedSettings() {
        const savedTheme = localStorage.getItem('darkMode');
        const savedTextSize = localStorage.getItem('textSize');

        // Apply saved dark mode
        if (savedTheme === 'enabled') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        // Apply saved text size
        if (savedTextSize) {
            document.body.style.fontSize = savedTextSize + 'px';
        }
    }

    // Call the function to apply saved settings
    applySavedSettings();
});
