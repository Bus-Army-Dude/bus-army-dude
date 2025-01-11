// Handle dark mode toggle
document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

// Handle large text toggle
document.getElementById('largeTextToggle').addEventListener('click', function() {
    document.body.classList.toggle('large-text');
});

// Handle cookie consent
const cookieConsentBanner = document.getElementById('cookieConsentBanner');
const acceptCookiesButton = document.getElementById('acceptCookies');

// Check if cookie consent is already given
if (localStorage.getItem('cookiesAccepted') === 'true') {
    cookieConsentBanner.style.display = 'none';
}

// Accept cookies and hide the banner
acceptCookiesButton.addEventListener('click', function() {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieConsentBanner.style.display = 'none';
});
