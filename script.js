// main-script.js (Earth Day Countdown & Duplicate FAQ Logic Removed)

document.addEventListener('DOMContentLoaded', () => {
    // Enhanced Copy Protection
    const enhancedCopyProtection = {
        init() {
            document.addEventListener('contextmenu', e => e.preventDefault());
            document.addEventListener('selectstart', e => e.preventDefault());
            document.addEventListener('copy', e => e.preventDefault());
        }
    };

    // Initialize copy protection
    enhancedCopyProtection.init();

   // Time update function
    function updateTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZoneName: 'long'
        };

        const timestamp = now.toLocaleString('en-US', options);
        const timeElement = document.querySelector('.update-time');

        if (timeElement) {
            timeElement.textContent = `${timestamp}`;
        }
    }

    // Call updateTime initially
    updateTime();

    // --- Page Refresh Countdown ---
    const refreshInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
    let refreshTime = Date.now() + refreshInterval;

    function updatePageRefreshCountdown() { // Renamed function for clarity
        const countdownElement = document.querySelector('.countdown'); // Target element for refresh timer
        const currentTime = Date.now();
        const timeLeft = Math.ceil((refreshTime - currentTime) / 1000);

        if (timeLeft >= 0) {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            if (countdownElement) {
                countdownElement.textContent = `Page refreshing in: ${minutes}m ${seconds}s`;
            }
        } else {
            smoothReload(); // Reload when time is up
        }
    }

    // Smoothly reload the page
    function smoothReload() {
        const body = document.body;
        body.style.transition = 'opacity 0.5s ease';
        body.style.opacity = '0';
        setTimeout(() => {
            location.reload();
        }, 500);
    }

    // Initialize page refresh countdown
    updatePageRefreshCountdown();

    // --- Set Intervals ---
    // Update Time display every second
    setInterval(updateTime, 1000);
    // Update Page Refresh countdown every second
    setInterval(updatePageRefreshCountdown, 1000);

    // --- End Intervals ---

    // --- Back to top button functionality (Moved inside DOMContentLoaded) ---
    const scrollBtn = document.getElementById('scrollToTop');
    const indicator = document.querySelector('.progress-indicator');

    function updateScrollIndicator() {
        // Check if elements exist before using them
        if (!indicator || !scrollBtn) {
             // console.warn("Scroll indicator or button not found."); // Optional warning
             return;
        }
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        // Prevent division by zero if docHeight is 0
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        const offset = 163.36 * (1 - progress); // Use the value from your original code
        indicator.style.strokeDashoffset = offset;

        // Show/hide button
        if (scrollTop > 100) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }

    // Initial call and listener for scroll indicator
    updateScrollIndicator(); // Run once on load
    window.addEventListener('scroll', updateScrollIndicator);

    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // --- End Back to top button ---

    // --- Cookie Consent (Moved inside DOMContentLoaded) ---
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookiesBtn = document.getElementById('acceptCookies');

    if (cookieConsent && acceptCookiesBtn) {
         // Check if the user has already accepted cookies
        if (!localStorage.getItem('cookieAccepted')) {
            cookieConsent.style.display = 'block';
        }
        // Accept cookies button functionality
        acceptCookiesBtn.onclick = function() {
            localStorage.setItem('cookieAccepted', 'true');
            cookieConsent.style.display = 'none';
        };
    }
    // --- End Cookie Consent ---

}); // --- END OF PRIMARY DOMContentLoaded LISTENER ---


// --- HTTPS Redirect (Runs immediately) ---
if (window.location.protocol !== 'https:') {
    console.log("Redirecting to HTTPS...");
    window.location.href = "https://" + window.location.host + window.location.pathname;
}

// --- Page Load Animation (Runs on window load) ---
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// --- NOTE on FAQs ---
// The FAQ accordion functionality (handling clicks to open/close answers)
// is now expected to be handled entirely by your 'displayShoutouts.js' script,
// specifically within the 'attachFaqAccordionListeners' function called after
// FAQs are dynamically loaded from Firestore by 'loadAndDisplayFaqs'.
// The static FAQ JavaScript has been removed from this file to avoid conflicts.
