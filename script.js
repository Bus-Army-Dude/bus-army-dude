// main-script.js

document.addEventListener('DOMContentLoaded', () => {
    // Enhanced Interaction Control (Copy Protection, Drag Prevention, Context Menu)
    const enhancedInteractionControl = {
        init() {
            // Prevent context menu (right-click/long-press menu)
            document.addEventListener('contextmenu', e => e.preventDefault());

            // Prevent text selection globally, but allow in inputs/textareas
            document.addEventListener('selectstart', e => {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && !e.target.isContentEditable) {
                    e.preventDefault();
                }
            });

            // Prevent copying globally, but allow from inputs/textareas
            document.addEventListener('copy', e => {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && !e.target.isContentEditable) {
                    e.preventDefault();
                }
            });

            // Prevent dragging of links and buttons
            document.addEventListener('dragstart', e => {
                // Check if the target or its parent is a link or an element styled as a button
                if (e.target.closest('a, .social-button, .link-button, .settings-button, .merch-button, .weather-button, .disabilities-section a, .visit-profile')) {
                    e.preventDefault();
                }
            });

            // Attempt to suppress long-press actions on specific links/buttons (mainly for mobile)
            // Note: CSS ` -webkit-touch-callout: none;` is generally more effective for iOS link previews.
            const interactiveElements = document.querySelectorAll(
                'a, .social-button, .link-button, .settings-button, .merch-button, .weather-button, .disabilities-section a, .visit-profile'
            );
            interactiveElements.forEach(element => {
                // Setting draggable to false can sometimes help
                element.setAttribute('draggable', 'false');

                // For touch devices, you might try to intercept touch events,
                // but -webkit-touch-callout: none; in CSS is key for iOS.
                // This JS part for touch is often redundant if CSS is well-applied.
            });
        }
    };

    // Initialize interaction controls
    enhancedInteractionControl.init();

            // Time update function
            function updateTime() {
            const now = new Date();
        
            // Format date and time (without timezone)
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
        
            let formattedDateTime = now.toLocaleString('en-US', options);
            formattedDateTime = formattedDateTime.replace(',', '').replace(',', ' at');
        
            // Get abbreviated timezone like 'PDT', 'EST'
            const timeZoneAbbr = now.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ').pop();
        
            // Combine full datetime with timezone abbrev
            formattedDateTime += ' ' + timeZoneAbbr;
        
            // Update datetime section
            const dateTimeSectionElement = document.querySelector('.datetime-section .current-datetime');
            if (dateTimeSectionElement) {
                dateTimeSectionElement.textContent = formattedDateTime;
            }
        
            // For version info, keep it simpler (without 'at' and timezone abbrev)
            const versionTimeElement = document.querySelector('.version-info-section .update-time');
            if (versionTimeElement) {
                const simpleOptions = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                };
                versionTimeElement.textContent = ` ${now.toLocaleString('en-US', simpleOptions)}`;
            }
        }

        // Update time in the ".current-datetime" element within the Datetime Section
        const dateTimeSectionElement = document.querySelector('.datetime-section .current-datetime');
        if (dateTimeSectionElement) {
            dateTimeSectionElement.textContent = timestamp;
        }
    }

    // Call updateTime initially
    updateTime();

    // --- Page Refresh Countdown ---
    const refreshInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
    let refreshTime = Date.now() + refreshInterval;

    function updatePageRefreshCountdown() {
        const countdownElement = document.querySelector('.version-info-section .countdown'); // Specific target
        const currentTime = Date.now();
        const timeLeft = Math.ceil((refreshTime - currentTime) / 1000);

        if (countdownElement) { // Check if element exists before updating
            if (timeLeft >= 0) {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                // Using innerHTML to allow for potential styling of the numbers later
                countdownElement.innerHTML = `Page refreshing in: <span class="timer-digits">${minutes}m ${seconds.toString().padStart(2, '0')}s</span>`;
            } else {
                countdownElement.textContent = "Refreshing now...";
                smoothReload();
            }
        }
    }

    // Smoothly reload the page
    function smoothReload() {
        const body = document.body;
        body.style.transition = 'opacity 0.5s ease-in-out';
        body.style.opacity = '0';
        setTimeout(() => {
            location.reload();
        }, 500); // Match transition duration
    }

    // Initialize page refresh countdown only if the element exists
    if (document.querySelector('.version-info-section .countdown')) {
        updatePageRefreshCountdown();
        // Update Page Refresh countdown every second
        setInterval(updatePageRefreshCountdown, 1000);
    }


    // Update Time display every second
    setInterval(updateTime, 1000);


    // --- Back to top button functionality ---
    const scrollBtn = document.getElementById('scrollToTop');
    const indicator = document.querySelector('.scroll-to-top .progress-indicator'); // More specific selector

    function updateScrollIndicator() {
        if (!indicator || !scrollBtn) {
            return;
        }
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0; // Cap progress at 1

        // Make sure the circle element and its radius 'r' attribute exist
        const radius = indicator.r ? indicator.r.baseVal.value : 0; // Get radius from SVG attribute
        if (radius > 0) {
            const circumference = 2 * Math.PI * radius;
            indicator.style.strokeDasharray = circumference;
            const offset = circumference * (1 - progress);
            indicator.style.strokeDashoffset = offset;
        }


        if (scrollTop > 100) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }

    if (scrollBtn && indicator) {
        const radius = indicator.r ? indicator.r.baseVal.value : 0;
        if (radius > 0) {
             const circumference = 2 * Math.PI * radius;
             indicator.style.strokeDasharray = circumference;
             indicator.style.strokeDashoffset = circumference; // Start with full offset
        }
        updateScrollIndicator(); // Initial call
        window.addEventListener('scroll', updateScrollIndicator, { passive: true });

        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Good practice for buttons that trigger JS actions
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Cookie Consent ---
    const cookieConsent = document.getElementById('cookieConsent'); // Assuming you have this element
    const acceptCookiesBtn = document.getElementById('acceptCookies'); // Assuming you have this button

    if (cookieConsent && acceptCookiesBtn) {
        if (!localStorage.getItem('cookieAccepted')) {
            cookieConsent.style.display = 'block'; // Or 'flex' or your preferred display type
        }
        acceptCookiesBtn.addEventListener('click', function() {
            localStorage.setItem('cookieAccepted', 'true');
            cookieConsent.style.display = 'none';
        });
    }

    // Update footer year dynamically
    function updateFooterYear() {
        const yearElement = document.getElementById('year'); // Assuming <span id="year"></span> in footer
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.textContent = currentYear;
        }
    }
    updateFooterYear();

}); // --- END OF PRIMARY DOMContentLoaded LISTENER ---


// --- HTTPS Redirect (Runs immediately) ---
// Consider server-side HTTPS enforcement for better security and reliability.
// This client-side redirect is a fallback.
if (window.location.protocol !== "https:" && window.location.hostname !== "localhost" && !window.location.hostname.startsWith("127.")) {
    console.log("Redirecting to HTTPS...");
    window.location.href = "https://" + window.location.host + window.location.pathname + window.location.search;
}

// --- Page Load Animation (Runs on window load) ---
window.addEventListener('load', function() {
    document.body.classList.add('loaded'); // Assuming 'loaded' class triggers animations or visibility
});

// --- NOTE on FAQs ---
// The FAQ accordion functionality (handling clicks to open/close answers)
// is now expected to be handled entirely by your 'displayShoutouts.js' script,
// specifically within the 'attachFaqAccordionListeners' function called after
// FAQs are dynamically loaded from Firestore by 'loadAndDisplayFaqs'.
// The static FAQ JavaScript has been removed from this file to avoid conflicts.
