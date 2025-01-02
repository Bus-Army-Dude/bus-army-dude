// Event listeners for buttons or input elements to trigger light/dark mode and text size changes
document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

// Example of text size buttons
document.getElementById('increase-text-btn').addEventListener('click', function() {
    changeTextSize(18); // Example: set text size to 18px
});
document.getElementById('decrease-text-btn').addEventListener('click', function() {
    changeTextSize(14); // Example: set text size to 14px
});

// Function to toggle between light and dark mode
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    const modeLabel = document.getElementById('mode-label'); // Get the label element

    // Toggle between light and dark modes
    if (currentTheme === 'light') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark'); // Save dark theme preference in localStorage
        modeLabel.textContent = 'Dark Mode'; // Update label text to Dark Mode
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light'); // Save light theme preference in localStorage
        modeLabel.textContent = 'Light Mode'; // Update label text to Light Mode
    }
}

// Function to apply saved theme preference on page load
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const modeLabel = document.getElementById('mode-label'); // Get the label element
    const toggleButton = document.getElementById('theme-toggle-btn'); // Get the toggle button

    // Apply saved theme to body
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        toggleButton.checked = true; // Sync checkbox with saved theme
        modeLabel.textContent = 'Dark Mode'; // Update label text to Dark Mode
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        toggleButton.checked = false; // Sync checkbox with saved theme
        modeLabel.textContent = 'Light Mode'; // Update label text to Light Mode
    }
}

// Event listener for theme toggle button (only on settings page)
if (document.getElementById('theme-toggle-btn')) {
    document.getElementById('theme-toggle-btn').addEventListener('change', toggleTheme);
}

// Apply saved theme on page load (across all pages)
window.onload = applySavedTheme;

// Function to change the text size
function changeTextSize(size) {
    const body = document.body;
    body.style.fontSize = size + 'px'; // Change font size
    localStorage.setItem('text-size', size); // Save text size in localStorage
}

// Apply saved theme and text size on page load
function applySavedSettings() {
    const savedTheme = localStorage.getItem('theme');
    const savedTextSize = localStorage.getItem('text-size');

    // Apply saved theme
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        document.getElementById('theme-toggle-btn').checked = true; // Sync checkbox with the theme
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        document.getElementById('theme-toggle-btn').checked = false; // Sync checkbox with the theme
    }

    // Apply saved text size
    if (savedTextSize) {
        document.body.style.fontSize = savedTextSize + 'px';
    }
}

// Event listeners for the settings page buttons
document.getElementById('theme-toggle-btn').addEventListener('change', toggleTheme);
document.getElementById('increase-text-btn').addEventListener('click', function() {
    changeTextSize(18); // Example: Increase text size to 18px
});
document.getElementById('decrease-text-btn').addEventListener('click', function() {
    changeTextSize(14); // Example: Decrease text size to 14px
});

// Run the applySavedSettings function when the page loads
window.onload = applySavedSettings;
