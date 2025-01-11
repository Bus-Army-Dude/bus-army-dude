// Function to enable dark mode
function enableDarkMode() {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled"); // Save dark mode preference
}

// Function to disable dark mode
function disableDarkMode() {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled"); // Save dark mode preference
}

// Function to enable large text mode
function enableLargeText() {
    document.body.classList.add("large-text");
    localStorage.setItem("largeText", "enabled"); // Save large text preference
}

// Function to disable large text mode
function disableLargeText() {
    document.body.classList.remove("large-text");
    localStorage.setItem("largeText", "disabled"); // Save large text preference
}

// Function to accept cookie consent
function acceptCookies() {
    document.querySelector('.cookie-consent').style.display = 'none'; // Hide consent banner
    localStorage.setItem("cookiesAccepted", "true"); // Save cookie consent preference
}

// Function to load saved preferences on page load
function loadPreferences() {
    const darkMode = localStorage.getItem("darkMode");
    const largeText = localStorage.getItem("largeText");
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");

    if (darkMode === "enabled") {
        enableDarkMode();
    }

    if (largeText === "enabled") {
        enableLargeText();
    }

    if (cookiesAccepted === "true") {
        document.querySelector('.cookie-consent').style.display = 'none'; // Hide consent banner if accepted
    }
}

// Event listeners for toggles and buttons
document.getElementById("darkModeToggle").addEventListener("click", function() {
    const isDarkMode = document.body.classList.contains("dark-mode");
    if (isDarkMode) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

document.getElementById("largeTextToggle").addEventListener("click", function() {
    const isLargeText = document.body.classList.contains("large-text");
    if (isLargeText) {
        disableLargeText();
    } else {
        enableLargeText();
    }
});

document.getElementById("acceptCookiesButton").addEventListener("click", acceptCookies);

// Load preferences when the page loads
loadPreferences();
