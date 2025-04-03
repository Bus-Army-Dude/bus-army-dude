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

// Call updateTime to set the current time when the page loads
updateTime();

    // Set the refresh interval to 5 minutes (300 seconds)
const refreshInterval = 5 * 60 * 1000;  // 5 minutes in milliseconds
let refreshTime = Date.now() + refreshInterval;  // Get future time 5 minutes from now

function updateCountdown() {
    const countdownElement = document.querySelector('.countdown');
    const currentTime = Date.now();
    const timeLeft = Math.ceil((refreshTime - currentTime) / 1000);  // Convert ms to seconds

    if (timeLeft >= 0) {
        const minutes = Math.floor(timeLeft / 60);  // Get full minutes
        const seconds = timeLeft % 60;              // Get remaining seconds

        // Update countdown display
        if (countdownElement) {
            countdownElement.textContent = `Page refreshing in: ${minutes}m ${seconds}s`;
        }
    } else {
        smoothReload();  // Smooth reload when time is up
    }
}

// Smoothly reload the page with a fade-out effect
function smoothReload() {
    const body = document.body;
    body.style.transition = 'opacity 0.5s ease';
    body.style.opacity = '0';

    setTimeout(function() {
        location.reload();
    }, 500); // Delay the reload to allow fade-out
}

window.onload = function () {
    updateTime();
    updateNewYearCountdown();

    setInterval(() => {
        updateTime();
        updateNewYearCountdown();
    }, 1000);
};

function updateNewYearCountdown() {
    const now = new Date();
    
    // Summer Solstice 2025 (June 20, 22:42 UTC)
    const summerSolsticeUTC = new Date('2025-06-20T22:42:00Z');
    
    // Convert to user's local timezone
    const localOffset = now.getTimezoneOffset() * 60 * 1000;
    const summerSolstice = new Date(summerSolsticeUTC.getTime() + localOffset);
    
    if (now >= summerSolstice) {
        document.querySelector('.countdown-section').innerHTML = `
            <h2 style="color: var(--accent-color); font-size: 2.5em; margin-bottom: 20px;">
                Summer 2025 is here!!!
            </h2>
            <div style="font-size: 1.5em; color: var(--text-color);">🌞 🏖️ 🌺 ⛱️</div>
        `;
        return;
    }

    // Calculate time difference properly
    let years = summerSolstice.getFullYear() - now.getFullYear();
    let months = summerSolstice.getMonth() - now.getMonth();
    let days = summerSolstice.getDate() - now.getDate();
    let hours = summerSolstice.getHours() - now.getHours();
    let minutes = summerSolstice.getMinutes() - now.getMinutes();
    let seconds = summerSolstice.getSeconds() - now.getSeconds();

    // Adjust negative values
    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        const lastMonth = new Date(summerSolstice.getFullYear(), summerSolstice.getMonth(), 0).getDate();
        days += lastMonth;
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }

    // Update flip clocks
    updateFlipClock('countdown-years', years);
    updateFlipClock('countdown-months', months);
    updateFlipClock('countdown-days', days);
    updateFlipClock('countdown-hours', hours);
    updateFlipClock('countdown-minutes', minutes);
    updateFlipClock('countdown-seconds', seconds);
}

function updateFlipClock(id, value) {
    const clock = document.getElementById(id);
    if (!clock) return;

    const front = clock.querySelector('.flip-clock-front');
    const back = clock.querySelector('.flip-clock-back');
    const flipInner = clock.querySelector('.flip-clock-inner');

    const valueStr = value.toString().padStart(2, '0');

    if (front.textContent !== valueStr) {
        front.textContent = valueStr;
        back.textContent = valueStr;

        flipInner.classList.add('flip');
        setTimeout(() => {
            flipInner.classList.remove('flip');
        }, 600);
    }
}

// Initialize on page load
updateTime();
updateNewYearCountdown();
setInterval(updateTime, 1000);
setInterval(updateNewYearCountdown, 1000);

if (window.location.protocol !== 'https:') {
    window.location.href = "https://" + window.location.host + window.location.pathname;
}

// Back to top button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Modern FAQ functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Check if this item is already active
            const isActive = item.classList.contains('active');

            // Close all FAQ items first
            faqItems.forEach(faqItem => {
                // Add a closing animation class if it was active
                if (faqItem.classList.contains('active')) {
                    faqItem.classList.add('closing');
                    setTimeout(() => {
                        faqItem.classList.remove('closing');
                    }, 300); // Match this with your CSS transition time
                }
                faqItem.classList.remove('active');
            });

            // If the clicked item wasn't active before, open it
            if (!isActive) {
                item.classList.add('active');
                // Scroll the item into view if it's not fully visible
                const rect = item.getBoundingClientRect();
                const isInViewport = (
                    rect.top >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
                );

                if (!isInViewport) {
                    item.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }
        });
    });

    // Close FAQ when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.faq-item')) {
            faqItems.forEach(item => {
                if (item.classList.contains('active')) {
                    item.classList.add('closing');
                    setTimeout(() => {
                        item.classList.remove('active', 'closing');
                    }, 300);
                }
            });
        }
    });
});

// Check if the user has already accepted cookies
if (!localStorage.getItem('cookieAccepted')) {
    document.getElementById('cookieConsent').style.display = 'block';
}

// Accept cookies button functionality
document.getElementById('acceptCookies').onclick = function() {
    localStorage.setItem('cookieAccepted', 'true');
    document.getElementById('cookieConsent').style.display = 'none';
};

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Get all the FAQ question buttons
const faqQuestions = document.querySelectorAll('.faq-question');

// Add event listeners to each button
faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;

        // Toggle the active class to show or hide the answer
        faqItem.classList.toggle('active');
    });
});
