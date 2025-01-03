document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const textSizeInput = document.getElementById('text-size');
    const textSizeValue = document.getElementById('text-size-value');
    
    // Load and apply saved settings from localStorage
    const savedTheme = localStorage.getItem('darkMode');
    const savedTextSize = localStorage.getItem('textSize');

    // Apply saved dark mode
    if (savedTheme === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    // Apply saved text size
    if (savedTextSize) {
        document.body.style.fontSize = savedTextSize + 'px';
        textSizeInput.value = savedTextSize;
        textSizeValue.textContent = savedTextSize + 'px';
    }

    // Dark Mode toggle functionality
    darkModeToggle.addEventListener('change', function () {
        if (darkModeToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Text Size change functionality
    textSizeInput.addEventListener('input', function () {
        const newSize = textSizeInput.value;
        textSizeValue.textContent = newSize + 'px';
        document.body.style.fontSize = newSize + 'px';
        localStorage.setItem('textSize', newSize);
    });
});
