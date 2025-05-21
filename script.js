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
                if (e.target.closest('a, .social-button, .link-button, .settings-button, .merch-button, .weather-button, .disabilities-section a, .visit-profile')) {
                    e.preventDefault();
                }
            });

            // Attempt to suppress long-press actions on specific links/buttons (mainly for mobile)
            const interactiveElements = document.querySelectorAll(
                'a, .social-button, .link-button, .settings-button, .merch-button, .weather-button, .disabilities-section a, .visit-profile'
            );
            interactiveElements.forEach(element => {
                element.setAttribute('draggable', 'false');
            });
        }
    };

    enhancedInteractionControl.init();

    // Time update function with timezone abbreviation
    function updateTime() {
        const now = new Date();

        // Get each part manually
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // --- These lines extract the weekday and month ---
        const weekday = weekdays[now.getDay()];
        const month = months[now.getMonth()];
        const day = now.getDate();
        const year = now.getFullYear();

        // Format time parts (hh:mm:ss AM/PM)
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // 0 means 12 AM

        // Pad minutes and seconds with leading zeros
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        const hoursStr = hours.toString().padStart(2, '0');

        // --- This line gets the abbreviated timezone ---
        const timeZoneAbbr = now.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ').pop();

        // Construct final string, including weekday, month, day, year, hours, minutes, seconds, AM/PM, and timezone
        const formattedDateTime = `${weekday}, ${month} ${day}, ${year} at ${hoursStr}:${minutesStr}:${secondsStr} ${ampm} ${timeZoneAbbr}`;

        // Update datetime element
        const dateTimeSectionElement = document.querySelector('.datetime-section .current-datetime');
        if (dateTimeSectionElement) {
            dateTimeSectionElement.textContent = formattedDateTime;
        }

        // Update version info simpler time with full date and timezone
        const versionTimeElement = document.querySelector('.version-info-section .update-time');
        if (versionTimeElement) {
            // Use the already formatted string that includes everything
            versionTimeElement.textContent = ` ${formattedDateTime}`;
        }
    }


    updateTime();

    // --- Page Refresh Countdown ---
    const refreshInterval = 5 * 60 * 1000; // 5 minutes
    let refreshTime = Date.now() + refreshInterval;

    function updatePageRefreshCountdown() {
        const countdownElement = document.querySelector('.version-info-section .countdown');
        const currentTime = Date.now();
        const timeLeft = Math.ceil((refreshTime - currentTime) / 1000);

        if (countdownElement) {
            if (timeLeft >= 0) {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                countdownElement.innerHTML = `Page refreshing in: <span class="timer-digits">${minutes}m ${seconds.toString().padStart(2, '0')}s</span>`;
            } else {
                countdownElement.textContent = "Refreshing now...";
                smoothReload();
            }
        }
    }

    function smoothReload() {
        const body = document.body;
        body.style.transition = 'opacity 0.5s ease-in-out';
        body.style.opacity = '0';
        setTimeout(() => location.reload(), 500);
    }

    if (document.querySelector('.version-info-section .countdown')) {
        updatePageRefreshCountdown();
        setInterval(updatePageRefreshCountdown, 1000);
    }

    setInterval(updateTime, 1000);

    // --- Back to top button ---
    const scrollBtn = document.getElementById('scrollToTop');
    const indicator = document.querySelector('.scroll-to-top .progress-indicator');

    function updateScrollIndicator() {
        if (!indicator || !scrollBtn) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

        const radius = indicator.r ? indicator.r.baseVal.value : 0;
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
            indicator.style.strokeDashoffset = circumference;
        }
        updateScrollIndicator();
        window.addEventListener('scroll', updateScrollIndicator, { passive: true });

        scrollBtn.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Cookie Consent ---
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookiesBtn = document.getElementById('cookieAccept'); // Corrected ID assuming it should be 'cookieAccept'

    if (cookieConsent && acceptCookiesBtn) {
        if (!localStorage.getItem('cookieAccepted')) {
            cookieConsent.style.display = 'block';
        }
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieConsent.style.display = 'none';
        });
    }

    // Update footer year dynamically
    function updateFooterYear() {
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
    updateFooterYear();

}); // --- END OF DOMContentLoaded ---

// --- HTTPS Redirect ---
if (window.location.protocol !== "https:" && window.location.hostname !== "localhost" && !window.location.hostname.startsWith("127.")) {
    console.log("Redirecting to HTTPS...");
    window.location.href = "https://" + window.location.host + window.location.pathname + window.location.search;
}

// --- Page Load Animation ---
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
