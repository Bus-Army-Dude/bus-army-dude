// Check if dark mode is already set in localStorage
const darkModePreference = localStorage.getItem('dark-mode');

// Apply dark mode if it's enabled, otherwise use light mode by default
if (darkModePreference === 'true') {
    document.body.classList.add('dark-mode');
} else {
    document.body.classList.remove('dark-mode');
}

// Dark mode toggle functionality
document.getElementById('theme-toggle').addEventListener('change', function() {
    if (this.checked) {
        // Add dark mode class to body
        document.body.classList.add('dark-mode');
        // Save the user's preference in localStorage
        localStorage.setItem('dark-mode', 'true');
    } else {
        // Remove dark mode class from body
        document.body.classList.remove('dark-mode');
        // Save the user's preference in localStorage
        localStorage.setItem('dark-mode', 'false');
    }
});

// Ensure the initial state of the checkbox matches the stored preference
const themeToggle = document.getElementById('theme-toggle');
if (darkModePreference === 'true') {
    themeToggle.checked = true;
} else {
    themeToggle.checked = false;
}
