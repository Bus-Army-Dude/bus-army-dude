// Event listeners for buttons or input elements to trigger light/dark mode and text size changes
document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

// Example of text size buttons
document.getElementById('increase-text-btn').addEventListener('click', function() {
    changeTextSize(18); // Example: set text size to 18px
});
document.getElementById('decrease-text-btn').addEventListener('click', function() {
    changeTextSize(14); // Example: set text size to 14px
});
