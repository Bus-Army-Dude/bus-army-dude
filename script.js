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

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted):", 
        new Date().toISOString().replace('T', ' ').slice(0, 19));
    console.log("Current User's Login: BusArmyDude");

    // Initialize all components
    initializeVersionInfo();
    startTimeUpdates();
});

// Initialize version information
function initializeVersionInfo() {
    // Set device info
    const deviceInfoDiv = document.querySelector('.device-info');
    if (deviceInfoDiv) {
        deviceInfoDiv.textContent = detectDetailedDevice();
    }

    // Set user login
    const userLoginDiv = document.querySelector('.user-login');
    if (userLoginDiv) {
        userLoginDiv.textContent = 'BusArmyDude';
    }
}

// Device detection function
function detectDetailedDevice() {
    const ua = navigator.userAgent;
    
    let detectedOS = 'Unknown Operating System';
    
    if (ua.includes('Windows')) {
        if (ua.includes('Windows NT 10.0')) {
            detectedOS = 'Windows 11';
        } else {
            detectedOS = 'Windows 10';
        }
    } else if (ua.includes('Mac OS X')) {
        detectedOS = 'macOS';
    } else if (ua.includes('Linux')) {
        detectedOS = 'Linux';
    } else if (ua.includes('Android')) {
        detectedOS = 'Android';
    } else if (ua.includes('iPhone')) {
        detectedOS = 'iOS';
    }

    return detectedOS;
}

// Start time updates
function startTimeUpdates() {
    // Initialize the refresh countdown
    startTime = Date.now();
    
    // Initial updates
    updateTimes();
    updateCountdown();

    // Set interval for updates
    setInterval(() => {
        updateTimes();
        updateCountdown();
    }, 1000);
}

// Update all time displays
function updateTimes() {
    const now = new Date();
    
    // Update UTC time
    const utcTimeElement = document.querySelector('.utc-time');
    if (utcTimeElement) {
        const utcTime = now.toISOString().replace('T', ' ').slice(0, 19);
        utcTimeElement.textContent = utcTime;
    }

    // Update local time
    const timeElement = document.querySelector('.update-time');
    if (timeElement) {
        const timestamp = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
            hour12: true
        });
        timeElement.textContent = timestamp;
    }
}

// Page refresh countdown variables
const refreshInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
let startTime;

// Update countdown function
function updateCountdown() {
    const countdownElement = document.querySelector('.countdown');
    const timeElapsed = Date.now() - startTime;
    const timeLeft = Math.ceil((refreshInterval - timeElapsed) / 1000);

    if (timeLeft >= 0) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        if (countdownElement) {
            countdownElement.textContent = `Page refreshing in: ${minutes}m ${seconds}s`;
        }
    } else {
        smoothReload();
    }
}

// Smooth reload function
function smoothReload() {
    const body = document.body;
    body.style.transition = 'opacity 0.5s ease';
    body.style.opacity = '0';

    setTimeout(function() {
        location.reload();
    }, 500);
}

// Version number and build info
const versionInfo = {
    version: 'v1.11.0',
    build: '2025.1.27'
};

// Initialize version and build numbers
document.addEventListener('DOMContentLoaded', () => {
    const versionElement = document.querySelector('.version-number');
    const buildElement = document.querySelector('.build-number');
    
    if (versionElement) {
        versionElement.textContent = versionInfo.version;
    }
    
    if (buildElement) {
        buildElement.textContent = versionInfo.build;
    }
});
    
   // TikTok Shoutouts
    const tiktokShoutouts = {
        accounts: [
            { username: 'mrbeast', isVerified: true, followers: '114.1M', nickname: 'MrBeast', bio: 'New CEO of Tiktok?', profilePic: 'images/mrbeast.jpeg' },     
            { username: 'teamtrump', isVerified: true, followers: '8.8M', nickname: 'Team Trump', bio: 'The official TikTok page for the Trump Campaign', profilePic: 'images/teamtrump.jpeg' },
            { username: 'carterpcs', isVerified: true, followers: '5.6M', nickname: 'Carterpcs', bio: 'Making Tech Less Of A Snoozefest, LA', profilePic: 'images/carterpcs.jpeg' },
            { username: 'applesauceandadhd', isVerified: true, followers: '3.9M', nickname: 'Jess|Aggressive Tutorials', bio: 'Surviving Not Thriving, TeamJessSecrest@Gersh.com', profilePic: 'images/applesauceandadhd.jpeg' },
            { username: 'tatechtips', isVerified: true, followers: '3.2M', nickname: 'TA TECH TIPS', bio: '🔥 Tech Tips from Nick B 🔥, Enquiries: 📧 hello@TheGoldStudios.com', profilePic: 'images/tatechtips.jpeg' },
            { username: 'imparkerburton', isVerified: false, followers: '2.9M', nickname: 'Parker Burton', bio: 'That Android Guy, Business: parker@imparkerburton.com', profilePic: 'images/imparkerburton.jpeg' },
            { username: 'kennedylawfirm', isVerified: false, followers: '1.9M', nickname: 'Lawyer Kevin Kennedy', bio: "The Kennedy Law Firm, PLLC, Clarksville, TN, Kev's got you covered™️", profilePic: 'images/kennedylawfirm.jpeg' },
            { username: 'badge502', isVerified: false, followers: '803.5K', nickname: 'Badge502', bio: 'NREMT - 911/EMD PO Box 775 Belleville, NJ 07109 *I DONT HAVE A BACKUP ACCOUNT*', profilePic: 'images/badge502.jpeg' },
            { username: 'meetmeinthemediacenter', isVerified: true, followers: '696.9K', nickname: 'Meet Me In The Media Center', bio: '✌🏻❤️&ToastyBooks, 📚Middle School Librarian, 💌 meetmeinthemediacenter@gmail.com', profilePic:  'images/meetmeinthemediacenter.jpeg' },
            { username: 'kaylee_mertens_', isVerified: false, followers: '674.7K', nickname: 'Kaylee Mertens|Dancing Baby', bio: 'Just a mom who loves her baby boy 💙,📍Wisconsin, KayleeMertens.collabs@gmail.com', profilePic: 'images/kayleemertens.jpeg' },
            { username: 'mrfatcheeto', isVerified: false, followers: '512.1K', nickname: 'Mr Fat Cheeto', bio: 'OH YEAH!', profilePic: 'images/mrfatcheeto.jpeg' },
            { username: 'trafficlightdoctor', isVerified: false, followers: '384.6K', nickname: '🚦 Traffic Light Doctor 🚦', bio: '🚦Traffic Signal Tech🚦 Traffic Lights, Family, Food, and Comedy!, Mississippi', profilePic: 'images/trafficlightdoctor.jpeg' },
            { username: 'aggressiveafterdark', isVerified: false, followers: '347.4K', nickname: 'ApplesauceandADHD_AfterDark', bio: "Shhhhhhh. It's a secret@Jess|Aggressive Tutorials Official Back-Up", profilePic: 'images/aggressiveafterdark.jpeg' },
            { username: 'rachel_hughes', isVerified: false, followers: '310.6K', nickname: 'Rachel Hughes', bio: 'houseofhughes@thestation.io, Cerebral Palsy Mama, 20% OFF BUCKED UP: RACHELHUGHES', profilePic: 'images/houseofhughes.jpeg' },
            { username: 'badge5022', isVerified: false, followers: '19.9K', nickname: 'Badge502', bio: 'Backup Account', profilePic: 'images/badge5022.jpeg' },           
            { username: 'raisingramsey2023', isVerified: false, followers: '1,201', nickname: 'RaisingRamsey2023', bio: 'The Adventures of Raising Ramsey. Come along as we watch Ramsey Play and Learn', profilePic: 'images/raisingramsey2023.jpeg' },
            { username: 'jerridc4', isVerified: false, followers: '479', nickname: 'Jerrid Cook', bio: '@raisingramsey2023, @benz.the beard', profilePic: 'images/jerridc4.jpeg' },
            { username: 'officalbusarmydude', isVerified: false, followers: '6', nickname: 'Bus Army Dude', bio: 'https://bus-army-dude.github.io/bus-army-dude/index.html', profilePic: 'images/busarmydude.jpg' },
         
            // Add more shoutouts here...
        ],
        init() {
            this.createShoutoutCards();
        },
        createShoutoutCards() {
            const container = document.querySelector('.creator-grid');
            if (!container) return;

            container.innerHTML = '';
            this.accounts.forEach(account => {
                const card = document.createElement('div');
                card.className = 'creator-card';
                card.innerHTML = `
                    <img src="${account.profilePic}" alt="@${account.username}" class="creator-pic" onerror="this.src='images/default-profile.jpg'">
                    <div class="creator-info">
                        <div class="creator-header">
                            <h3>${account.nickname}</h3>
                            ${account.isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''}
                        </div>
                        <p class="creator-username">@${account.username}</p>
                        <p class="creator-bio">${account.bio || ''}</p>
                        <p class="follower-count">${account.followers} Followers</p>
                        <a href="https://tiktok.com/@${account.username}" target="_blank" class="visit-profile">
                            Visit Profile
                        </a>
                    </div>
                `;
                container.appendChild(card);
            });
        }
    };

const instagramShoutouts = {
    accounts: [
        { username: 'mrbeast', isVerified: true, followers: '65.5M', nickname: 'MrBeast', bio: 'My New Show Beast Games is out now on Prime Video!', profilePic: 'instagram_photos/mrbeast.jpg' },    
        { username: 'applesauceandadhd', isVerified: true, followers: '739K', nickname: 'Jessica', bio: 'TeamJessSecrest@Gersh.com', profilePic: 'instagram_photos/applesauceandadhd.jpeg' },    
        { username: 'emtbadge502', isVerified: true, followers: '493K', nickname: 'Anthony Christian', bio: 'P.O. Box 775, Belleville, NJ 07109, EMT - 911/ EMD - CPR Instructor - Content Creator, Work Hard. Be Kind Always.', profilePic: 'instagram_photos/emtbadge502.jpg' },    
        { username: 'trafficlightdoctor', isVerified: true, followers: '311K', nickname: 'TrafficLightDoctor', bio: 'Follow My YouTube And TikTok!!', profilePic: 'instagram_photos/trafficlightdoctor.jpeg' },            
        { username: 'mrfattcheeto', isVerified: true, followers: '276K', nickname: 'Trent Parker', bio: "I'm like some HVAC Genius", profilePic: 'instagram_photos/mrfatcheeto.jpeg' },    
        { username: 'heyrachelhughes', isVerified: false, followers: '101K', nickname: 'Rachel Hughes', bio: 'PPersonal blog, YouTube + TikTok: Rachel_Hughes, ALL INQUIRIES: houseofhughes@thestation.io, 20% off Bucked Up: RACHELHUGHES', profilePic: 'instagram_photos/houseofhughes.jpeg' },                            
        { username: 'lisa.remillard', isVerified: true, followers: '96.3K', nickname: 'Lisa Remillard', bio: 'Public figure 📹 🎙Journalist, ▶️ Subcribe to my YouTube channel (@LisaRemillardOfficial)', profilePic: 'instagram_photos/lisaremillard.jpg' },                    
        { username: 'meetmeinthemediacenter', isVerified: true, followers: '51.3K', nickname: 'Jen Miller', bio: '✌🏻❤️&Toasty📚 680K on TikTok ✨Book Return Game 🫶🏻Middle School Librarian', profilePic: 'instagram_photos/meetmeinthemediacenter.jpeg' },    
        { username: 'kaylee_mertens_', isVerified: false, followers: '3,152', nickname: 'Kaylee Mertens', bio: 'Tik Tok: Kaylee_Mertens_', profilePic: 'instagram_photos/kayleemertens.jpeg' },    
        { username: 'riverkritzar', isVerified: false, followers: '86', nickname: 'River Jordan Kritzar', bio: "Hello, my name is River, I am 19. I am autistic. I love technology.", profilePic: 'instagram_photos/riverkritzar.jpg' },
        { username: 'rose_the_fox24', isVerified: false, followers: '80', nickname: 'Rose Haydu', bio: 'I’m 19, Drp/rp open, I’m taken by the love of my life @_jano_142_ 💜3/1/24💜', profilePic: 'instagram_photos/rosethefox24.jpg' },
        { username: '_jano_142_', isVerified: false, followers: '48', nickname: 'Nathan Haydu', bio: 'Cars are love, cars are life. Taken by @rose_the_fox24 ❤️(3/1/24)❤️#bncr33gtr:Best Skyline/🔰Dream car🚗#c7zr1:Last TRUE Vette/🇺🇸Dream car🏎', profilePic: 'instagram_photos/jano142.jpg' },    
        { username: 'busarmydude', isVerified: false, followers: '18', nickname: 'Bus Army Dude', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/busarmydude.jpg' },
        // Add more Instagram creators as needed
    ],
    lastUpdatedTime: '2025-01-30T10:52:31', // Manually set the last updated date and time
    init() {
        this.createShoutoutCards();
        this.setLastUpdatedTime();
    },
    createShoutoutCards() {
        const container = document.querySelector('.instagram-creator-grid');
        if (!container) return;

        container.innerHTML = '';
        this.accounts.forEach(account => {
            const card = document.createElement('div');
            card.className = 'instagram-creator-card';
            card.innerHTML = `
                <img src="${account.profilePic}" alt="${account.nickname}" class="instagram-creator-pic" onerror="this.src='images/default-profile.jpg'">
                <div class="instagram-creator-info">
                    <div class="instagram-creator-header">
                        <h3>${account.nickname}</h3>
                        ${account.isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''}
                    </div>
                    <p class="instagram-creator-username">${account.username}</p>
                    <p class="instagram-creator-bio">${account.bio || ''}</p>
                    <p class="instagram-follower-count">${account.followers} Followers</p>
                    <a href="https://instagram.com/${account.username}" target="_blank" class="instagram-visit-profile">
                        Visit Profile
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    },
    setLastUpdatedTime() {
        const lastUpdatedElement = document.getElementById('instagram-last-updated-timestamp');
        if (!lastUpdatedElement) return;

        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const lastUpdatedDate = new Date(this.lastUpdatedTime).toLocaleString('en-US', {
            timeZone: userTimeZone,
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });

        lastUpdatedElement.textContent = `Last Updated: ${lastUpdatedDate}`;
    }
};

// Initialize the YouTube shoutouts
instagramShoutouts.init();

const youtubeShoutouts = {
    accounts: [
        { username: '@MrBeast', isVerified: true, subscribers: '352M', nickname: 'MrBeast', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames SUBSCRIBE FOR A COOKIE!', profilePic: 'youtube_photoes/mrbeast.jpg' },
        { username: '@MrBeast2', isVerified: true, subscribers: '48.6M', nickname: 'MrBeast 2', bio: 'my second channel for other videos and shorts :) subscribe ', profilePic: 'youtube_photoes/mrbeast2.jpg' },
        { username: '@MrBeastGaming', isVerified: true, subscribers: '46.5M', nickname: 'MrBeast Gaming', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames MrBeast Gaming - SUBSCRIBE OR ELSE', profilePic: 'youtube_photoes/mrbeastgaming.jpg' },
        { username: '@BeastReacts', isVerified: true, subscribers: '35.3M', nickname: 'Beast Reacts', bio: 'SUBSCRIBE FOR A COOKIE', profilePic: 'youtube_photoes/beastreacts.jpg' },
        { username: '@BeastPhilanthropy', isVerified: true, subscribers: '27.3M', nickname: 'Beast Philanthropy', bio: '100% of the profits from my ad revenue, merch sales, and sponsorships will go towards making the world a better place!', profilePic: 'youtube_photoes/beastphilanthropy.jpg' },
        { username: '@rachel_hughes', isVerified: false, subscribers: '230K', nickname: 'Rachel Hughes', bio: 'My name is Rachel Hughes :) I am a 30 year old, mom of two, living in Utah! I love sharing my experiences and life regarding mental health, leaving religion, overcoming an eating disorder, having a disabled child, fitness, beauty and more! Thank you so much for being here. xo', profilePic: 'youtube_photoes/rachel_hughes.jpg' },        
        { username: '@Trafficlightdoctor', isVerified: false, subscribers: '152K', nickname: 'Traffic Light Doctor', bio: 'TrafficlightDoctor Live! explores traffic signals and road safety, while TrafficlightDoctor Live Gaming offers an immersive gaming experience.', profilePic: 'youtube_photoes/trafficlightdoctor.jpeg' },     
        { username: '@mrfatcheeto', isVerified: false, subscribers: '99.5K', nickname: 'Mr Fat Cheeto', bio: 'I’m like a HVAC Genius. Come join me on my crazy HVAC Comedy adventures ', profilePic: 'youtube_photoes/mrfatcheeto.jpg' },
        { username: '@Badge502', isVerified: false, subscribers: '61K', nickname: 'Badge502', bio: 'Your local EMT!', profilePic: 'youtube_photoes/badge502.jpg' },     
        // Add more YouTube creators as needed
    ],
    lastUpdatedTime: '2025-01-30T10:52:31', // Manually set the last updated date and time
    init() {
        this.createShoutoutCards();
        this.setLastUpdatedTime();
    },
    createShoutoutCards() {
        const container = document.querySelector('.youtube-creator-grid');
        if (!container) return;

        container.innerHTML = '';
        this.accounts.forEach(account => {
            const card = document.createElement('div');
            card.className = 'youtube-creator-card';
            card.innerHTML = `
                <img src="${account.profilePic}" alt="@${account.username}" class="youtube-creator-pic" onerror="this.src='images/default-profile.jpg'">
                <div class="youtube-creator-info">
                    <div class="youtube-creator-header">
                        <h3>${account.nickname}</h3>
                        ${account.isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : ''}
                    </div>
                    <p class="youtube-creator-username">${account.username}</p>
                    <p class="youtube-creator-bio">${account.bio || ''}</p>
                    <p class="youtube-subscriber-count">${account.subscribers} Subscribers</p>
                    <a href="https://youtube.com/${account.username}" target="_blank" class="youtube-visit-profile">
                        Visit Channel
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    },
    setLastUpdatedTime() {
        const lastUpdatedElement = document.getElementById('lastUpdatedYouTube');
        if (!lastUpdatedElement) return;

        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const lastUpdatedDate = new Date(this.lastUpdatedTime).toLocaleString('en-US', {
            timeZone: userTimeZone,
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });

        lastUpdatedElement.textContent = `Last Updated: ${lastUpdatedDate}`;
    }
};

youtubeShoutouts.init();
    
// New Year countdown
function updateNewYearCountdown() {
    const now = new Date();
    const newYear = new Date('2025-01-31T14:30:00');
    const diff = newYear - now;

    const countdownSection = document.querySelector('.countdown-section');
    if (!countdownSection) return;

    if (diff <= 0) {
        countdownSection.innerHTML = `
            <h2 style="color: var(--accent-color); font-size: 2.5em; margin-bottom: 20px;">
                YOU DID IT TODAY IS THE DAY YOU GET YOUR AFO BRACES!!!!!
            </h2>
            <div style="font-size: 1.5em; color: var(--text-color);">🎉 🎊 🎆 🎈</div>
        `;
    } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

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
    detectDetailedDevice();
    updateTime();
    tiktokShoutouts.init();
    updateNewYearCountdown();

    setInterval(updateTime, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(updateNewYearCountdown, 1000);
});

// Manually set the last updated date and time (example in EST timezone)
const lastUpdatedDate = "Thu, Jan 30, 2025";  // Set the date here (Day of the Week, Month, Day, Year)
const lastUpdatedTime = "10:52:31 AM";    // Set the time here (12-hour format)

// Combine the date and time into a single string for parsing
const lastUpdatedString = `${lastUpdatedDate} ${lastUpdatedTime}`;

document.addEventListener("DOMContentLoaded", () => {
  const lastUpdatedElement = document.querySelector("#lastUpdated");

  if (lastUpdatedElement) {
    // Create a Date object with the manually set date and time, example for EST (GMT-0500)
    const lastUpdatedDateObj = new Date(`${lastUpdatedString} GMT-0500`);

    // Convert the manually set date and time to the user's local time zone
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    };

    // Format and display the converted time as "Wed, Jan 8, 2025, 9:51:01 AM"
    const localLastUpdated = lastUpdatedDateObj.toLocaleString('en-US', options);

    // Set the content of the "Last Updated" text
    lastUpdatedElement.textContent = `Last Updated: ${localLastUpdated}`;
  }
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

    // Add keyboard navigation
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (index < faqItems.length - 1) {
                        faqItems[index + 1].querySelector('.faq-question').focus();
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (index > 0) {
                        faqItems[index - 1].querySelector('.faq-question').focus();
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    faqItems[0].querySelector('.faq-question').focus();
                    break;
                case 'End':
                    e.preventDefault();
                    faqItems[faqItems.length - 1].querySelector('.faq-question').focus();
                    break;
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

document.addEventListener('DOMContentLoaded', (event) => {
            // Get the current year
            const currentYear = new Date().getFullYear();
            // Set the current year in the footer
            document.getElementById('current-year').textContent = currentYear;
        });
