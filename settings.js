// Check if the user has a saved theme preference in localStorage
const savedTheme = localStorage.getItem('theme');

// Apply the saved theme or default to light mode
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode'); // Add the dark mode class to the body
    document.getElementById('theme-toggle').checked = true; // Set the toggle switch to 'on'
}

// Dark mode toggle handler
document.getElementById('theme-toggle').addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark-mode'); // Enable dark mode
        localStorage.setItem('theme', 'dark'); // Save preference in localStorage
    } else {
        document.body.classList.remove('dark-mode'); // Disable dark mode
        localStorage.setItem('theme', 'light'); // Save preference in localStorage
    }
});
