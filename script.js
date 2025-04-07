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
    console.log('Current time (local):', now);

    // Get the user's local time offset in milliseconds
    const localOffset = now.getTimezoneOffset() * 60000; // convert to milliseconds
    console.log('Local offset (milliseconds):', localOffset);

    // Set the target date for Earth Day 2025 (April 22, 2025, at midnight UTC)
    const earthDayUTC = new Date('2025-04-22T00:00:00Z'); // 'Z' denotes UTC time
    console.log('Earth Day 2025 (UTC):', earthDayUTC);

    // Adjust the Earth Day target to match the user's local timezone
    const earthDayLocal = new Date(earthDayUTC.getTime() - localOffset); // Convert UTC to local time
    console.log('Earth Day 2025 (local):', earthDayLocal);

    // Get time difference in milliseconds
    const diff = earthDayLocal - now;
    console.log('Time difference (milliseconds):', diff);

    const countdownSection = document.querySelector('.countdown-section');
    if (!countdownSection) {
        console.error('Countdown section element not found.');
        return;
    }

    if (diff <= 0) {
        countdownSection.innerHTML = `
            <h2 style="color: var(--accent-color); font-size: 2.5em; margin-bottom: 20px;">
                Earth Day 2025 is here!!! 🌍🌱
            </h2>
            <div style="font-size: 1.5em; color: var(--text-color);">Let's take action for our planet! 💚</div>
        `;
        console.log('Earth Day has arrived!');
    } else {
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)); // More accurate year calculation
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44)); // More accurate month calculation
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        console.log('Years:', years);
        console.log('Months:', months);
        console.log('Days:', days);
        console.log('Hours:', hours);
        console.log('Minutes:', minutes);
        console.log('Seconds:', seconds);

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

// Function to update flip clock value with actual flip animation
function updateFlipClock(id, newValue) {
    const clock = document.getElementById(id);
    if (!clock) return;

    const currentValue = clock.dataset.value;
    const newValueStr = newValue.toString().padStart(2, '0');

    if (newValueStr === currentValue) return;

    clock.dataset.value = newValueStr;

    const flipTop = document.createElement('div');
    flipTop.classList.add('flip-top');
    flipTop.innerHTML = `<div class="top">${currentValue || '00'}</div>`;

    const flipBottom = document.createElement('div');
    flipBottom.classList.add('flip-bottom');
    flipBottom.innerHTML = `<div class="bottom">${newValueStr}</div>`;

    const topHalf = clock.querySelector('.top-half');
    const bottomHalf = clock.querySelector('.bottom-half');

    if (topHalf && bottomHalf) {
        flipTop.querySelector('.top').textContent = topHalf.textContent;
        flipBottom.querySelector('.bottom').textContent = newValueStr;

        clock.appendChild(flipTop);
        clock.appendChild(flipBottom);

        setTimeout(() => {
            flipTop.classList.add('flip');
            topHalf.textContent = newValueStr;

            setTimeout(() => {
                flipBottom.classList.add('flip');
                bottomHalf.textContent = newValueStr;

                // Remove the temporary flip elements
                setTimeout(() => {
                    clock.removeChild(flipTop);
                    clock.removeChild(flipBottom);
                }, 600); // Match CSS animation duration
            }, 300); // Half of CSS animation duration
        }, 20);
    } else {
        // Initial setup if top and bottom halves don't exist yet
        clock.innerHTML = `
            <div class="top-half">${newValueStr}</div>
            <div class="bottom-half">${newValueStr}</div>
        `;
    }
}

// Initialize everything
updateTime(); // Assuming this function exists elsewhere in your code
tiktokShoutouts.init(); // Assuming this object and method exist elsewhere if needed
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
