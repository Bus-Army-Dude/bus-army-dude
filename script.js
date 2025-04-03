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
    updateNewYearCountdown();

    // Synchronize both time and countdown updates every second
    setInterval(() => {
        updateTime();
        updateNewYearCountdown();
    }, 1000);  // Update both every second
};

document.addEventListener('DOMContentLoaded', function() {
    function countdownToSummerSolstice() {
        const now = new Date();
        const currentYear = now.getFullYear();

        // Get the date of the Summer Solstice
        const summerSolstice = new Date(currentYear, 5, 21); // June 21st, tentatively

        // Adjust for the Southern Hemisphere
        const hemisphere = "north"; // Replace with user's hemisphere if known
        if (hemisphere.toLowerCase() === "south") {
            summerSolstice.setMonth(11); // December for Southern Hemisphere
            summerSolstice.setDate(21);
        }

        // If the solstice has already passed this year, target next year
        if (now > summerSolstice) {
            summerSolstice.setFullYear(currentYear + 1);
        }

        const timeRemaining = summerSolstice.getTime() - now.getTime();

        if (timeRemaining <= 0) {
            return "Summer Solstice is here!";
        }

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    }

    // Summer Solstice countdown with automatic timezone adjustment (now using the simple function)
    function updateNewYearCountdown() {
        const countdownResult = countdownToSummerSolstice();
        const countdownSection = document.querySelector('.countdown-section');
        if (!countdownSection) return;

        if (countdownResult === "Summer Solstice is here!") {
            countdownSection.innerHTML = `
                <h2 style="color: var(--accent-color); font-size: 2.5em; margin-bottom: 20px;">
                    Summer Solstice is here!
                </h2>
                <div style="font-size: 1.5em; color: var(--text-color);">🌞</div>
            `;
        } else {
            const parts = countdownResult.match(/(\d+) days, (\d+) hours, (\d+) minutes, (\d+) seconds/);
            if (parts) {
                const days = parseInt(parts[1]);
                const hours = parseInt(parts[2]);
                const minutes = parseInt(parts[3]);
                const seconds = parseInt(parts[4]);

                // Update flip clock
                updateFlipClock('countdown-years', 0); // Years will be 0 with this function
                updateFlipClock('countdown-months', 0); // Months will be 0 with this function
                updateFlipClock('countdown-days', days);
                updateFlipClock('countdown-hours', hours);
                updateFlipClock('countdown-minutes', minutes);
                updateFlipClock('countdown-seconds', seconds);
            } else {
                countdownSection.textContent = countdownResult; // Fallback if parsing fails
            }
        }
    }

    // Function to update flip clock value
    function updateFlipClock(id, value) {
        const clock = document.getElementById(id);
        if (!clock) return;

        const front = clock.querySelector('.flip-clock-front');
        const back = clock.querySelector('.flip-clock-back');
        const valueStr = value.toString().padStart(2, '0');

        if (front.textContent !== valueStr) {
            front.textContent = valueStr;
            back.textContent = valueStr;

            clock.querySelector('.flip-clock-inner').classList.add('flip');
            setTimeout(() => {
                clock.querySelector('.flip-clock-inner').classList.remove('flip');
            }, 600);
        }
    }

    // Assuming these functions are defined elsewhere in your script
    function updateTime() {}
    const tiktokShoutouts = { init: () => {} };
    function updateCountdown() {}

    // Initialize everything
    updateTime();
    tiktokShoutouts.init();
    updateNewYearCountdown();

    setInterval(updateTime, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(updateNewYearCountdown, 1000);
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
