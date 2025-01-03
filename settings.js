// Function to switch to Light Mode
function setLightMode() {
    const body = document.body;
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light'); // Save light theme preference in localStorage
    updateModeButtonLabel('Light Mode');
}

// Function to switch to Dark Mode
function setDarkMode() {
    const body = document.body;
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark'); // Save dark theme preference in localStorage
    updateModeButtonLabel('Dark Mode');
}

// Function to update the label text of the buttons
function updateModeButtonLabel(mode) {
    const lightModeButton = document.getElementById('light-mode-btn');
    const darkModeButton = document.getElementById('dark-mode-btn');
    
    if (mode === 'Light Mode') {
        lightModeButton.style.display = 'none';
        darkModeButton.style.display = 'inline-block';
    } else {
        darkModeButton.style.display = 'none';
        lightModeButton.style.display = 'inline-block';
    }
}

// Function to apply saved settings
function applySavedSettings() {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        updateModeButtonLabel('Dark Mode');
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        updateModeButtonLabel('Light Mode');
    }

    // Apply saved text size
    const savedTextSize = localStorage.getItem('text-size');
    if (savedTextSize) {
        document.body.style.fontSize = `${savedTextSize}px`;
        document.getElementById('text-size').value = savedTextSize;
        document.getElementById('text-size-label').textContent = `${savedTextSize}px`;
    }


// Event listeners for the buttons and other settings
document.getElementById('light-mode-btn').addEventListener('click', setLightMode);
document.getElementById('dark-mode-btn').addEventListener('click', setDarkMode);
document.getElementById('text-size').addEventListener('input', updateTextSize);

// Function to update text size based on user preference
function updateTextSize() {
    const textSize = document.getElementById('text-size').value;
    const textSizeLabel = document.getElementById('text-size-label');
    document.body.style.fontSize = `${textSize}px`;
    textSizeLabel.textContent = `${textSize}px`; // Update text size label
    localStorage.setItem('text-size', textSize); // Save text size preference in localStorage
}

// Apply saved settings on page load (across all pages)
window.onload = applySavedSettings;
