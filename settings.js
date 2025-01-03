document.addEventListener('DOMContentLoaded', function () {
    // Get saved theme and text size from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';  // Default to light mode
    const savedTextSize = localStorage.getItem('textSize') || '16px';  // Default text size

    // Apply saved theme and text size
    document.body.classList.add(savedTheme);
    document.body.style.fontSize = savedTextSize;

    // Theme change event listeners
    document.getElementById('light-mode').addEventListener('click', () => {
        document.body.classList.replace('dark', 'light');
        localStorage.setItem('theme', 'light');
    });

    document.getElementById('dark-mode').addEventListener('click', () => {
        document.body.classList.replace('light', 'dark');
        localStorage.setItem('theme', 'dark');
    });

    // Text size change listener
    const textSizeSlider = document.getElementById('text-size-slider');
    textSizeSlider.addEventListener('input', (event) => {
        const newSize = event.target.value + 'px';  // Get new size in pixels
        document.body.style.fontSize = newSize;  // Apply new text size
        localStorage.setItem('textSize', newSize);  // Save new size to localStorage
    });

    // Set the slider value to reflect the current text size
    textSizeSlider.value = parseInt(savedTextSize);
});
