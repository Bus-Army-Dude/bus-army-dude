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

// Call the functions on page load
window.onload = function() {
    updateTime();
    updateCountdown();

    // Synchronize both time and countdown updates every second
    setInterval(() => {
        updateTime();
        updateCountdown();
    }, 1000);  // Update both every second
};

// Earth Day countdown with timezone adjustment
function updateEarthDayCountdown() {
    const now = new Date();

    // Set the target date (Earth Day 2025) in UTC
    // April 22, 2025, at 00:00 UTC (midnight) is the target moment for Earth Day
    const earthDayUTC = new Date('2025-04-22T00:00:00Z'); // 'Z' denotes UTC time

    // Adjust to local time by getting the user's timezone offset in minutes
    const timezoneOffset = now.getTimezoneOffset(); // Offset in minutes from UTC
    earthDayUTC.setMinutes(earthDayUTC.getMinutes() - timezoneOffset);

    // Get time difference in milliseconds
    const diff = earthDayUTC - now;

    const countdownSection = document.querySelector('.countdown-section');
    if (!countdownSection) return;

    if (diff <= 0) {
        countdownSection.innerHTML = `
            <h2 style="color: var(--accent-color); font-size: 2.5em; margin-bottom: 20px;">
                Earth Day 2025 is here!!!
            </h2>
            <div style="font-size: 1.5em; color: var(--text-color);">🌍 🌱 🌿 🌎</div>
        `;
    } else {
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)); // More accurate year calculation
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44)); // More accurate month calculation
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Update flip clock for years
        updateFlipClock('countdown-years', years);

        // Update flip clock for months
        updateFlipClock('countdown-months', months);

        // Update flip clock for days
        updateFlipClock('countdown-days', days);

        // Update flip clock for hours
        updateFlipClock('countdown-hours', hours);

        // Update flip clock for minutes
        updateFlipClock('countdown-minutes', minutes);

        // Update flip clock for seconds
        updateFlipClock('countdown-seconds', seconds);
    }
}

// Function to update flip clock value
function updateFlipClock(id, value) {
    const clock = document.getElementById(id);
    if (!clock) return; // Prevent errors if element is missing

    const front = clock.querySelector('.flip-clock-front');
    const back = clock.querySelector('.flip-clock-back');
    const valueStr = value.toString().padStart(2, '0');

    if (front.textContent !== valueStr) {
        front.textContent = valueStr;
        back.textContent = valueStr;

        // Trigger the flip animation
        clock.querySelector('.flip-clock-inner').classList.add('flip');

        setTimeout(() => {
            clock.querySelector('.flip-clock-inner').classList.remove('flip');
        }, 600); // match the animation duration
    }
}

// Initialize everything
updateTime();
tiktokShoutouts.init();
updateEarthDayCountdown();

setInterval(updateTime, 1000);
setInterval(updateCountdown, 1000);
setInterval(updateEarthDayCountdown, 1000);
});

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

document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all FAQ items first (with closing animation)
            faqItems.forEach(faqItem => {
                if (faqItem !== item && faqItem.classList.contains('active')) {
                    faqItem.classList.add('closing');
                    setTimeout(() => {
                        faqItem.classList.remove('closing');
                        faqItem.classList.remove('active');
                        faqItem.querySelector('.faq-answer').style.maxHeight = null; // Ensure it closes
                    }, 300); // Match with CSS transition
                }
            });

            // Toggle the clicked item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null; // Collapse the answer
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px'; // Expand the answer
                // Scroll into view if the item is not fully visible
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

    // Close all FAQs if clicked outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.faq-item')) {
            faqItems.forEach(item => {
                if (item.classList.contains('active')) {
                    item.classList.add('closing');
                    setTimeout(() => {
                        item.classList.remove('active', 'closing');
                        item.querySelector('.faq-answer').style.maxHeight = null; // Ensure the content collapses
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
