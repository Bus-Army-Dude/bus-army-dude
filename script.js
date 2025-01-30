// Core Protection and Utilities
const enhancedCopyProtection = {
    init() {
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('selectstart', e => e.preventDefault());
        document.addEventListener('copy', e => e.preventDefault());
    }
};

// Time utilities
function updateTime() {
    const now = new Date();
    const timeElement = document.querySelector('.current-time');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString();
    }
}

// Force HTTPS
if (window.location.protocol !== 'https:') {
    window.location.href = "https://" + window.location.host + window.location.pathname;
}

// Back to top functionality
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
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
}

// Cookie consent functionality
function initializeCookieConsent() {
    if (!localStorage.getItem('cookieAccepted')) {
        const cookieConsent = document.getElementById('cookieConsent');
        if (cookieConsent) {
            cookieConsent.style.display = 'block';
        }
    }

    const acceptButton = document.getElementById('acceptCookies');
    if (acceptButton) {
        acceptButton.onclick = () => {
            localStorage.setItem('cookieAccepted', 'true');
            document.getElementById('cookieConsent').style.display = 'none';
        };
    }
}

// Last updated timestamp functionality
const lastUpdated = {
    timestamp: '2025-01-30T19:54:00',
    init() {
        const elements = document.querySelectorAll('[id^="lastUpdated"]');
        elements.forEach(element => this.updateElement(element));
    },
    updateElement(element) {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const date = new Date(this.timestamp);
        const formattedDate = date.toLocaleString('en-US', {
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
        element.textContent = `Last Updated: ${formattedDate}`;
    }
};

// Social Media Shoutouts Configuration
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
        { username: 'meetmeinthemediacenter', isVerified: true, followers: '696.9K', nickname: 'Meet Me In The Media Center', bio: '✌🏻❤️&ToastyBooks, 📚Middle School Librarian, 💌 meetmeinthemediacenter@gmail.com', profilePic: 'images/meetmeinthemediacenter.jpeg' },
        { username: 'kaylee_mertens_', isVerified: false, followers: '674.7K', nickname: 'Kaylee Mertens|Dancing Baby', bio: 'Just a mom who loves her baby boy 💙,📍Wisconsin, KayleeMertens.collabs@gmail.com', profilePic: 'images/kayleemertens.jpeg' },
        { username: 'mrfatcheeto', isVerified: false, followers: '512.1K', nickname: 'Mr Fat Cheeto', bio: 'OH YEAH!', profilePic: 'images/mrfatcheeto.jpeg' },
        { username: 'trafficlightdoctor', isVerified: false, followers: '384.6K', nickname: '🚦 Traffic Light Doctor 🚦', bio: '🚦Traffic Signal Tech🚦 Traffic Lights, Family, Food, and Comedy!, Mississippi', profilePic: 'images/trafficlightdoctor.jpeg' },
        { username: 'aggressiveafterdark', isVerified: false, followers: '347.4K', nickname: 'ApplesauceandADHD_AfterDark', bio: "Shhhhhhh. It's a secret@Jess|Aggressive Tutorials Official Back-Up", profilePic: 'images/aggressiveafterdark.jpeg' },
        { username: 'rachel_hughes', isVerified: false, followers: '310.6K', nickname: 'Rachel Hughes', bio: 'houseofhughes@thestation.io, Cerebral Palsy Mama, 20% OFF BUCKED UP: RACHELHUGHES', profilePic: 'images/houseofhughes.jpeg' },
        { username: 'badge5022', isVerified: false, followers: '19.9K', nickname: 'Badge502', bio: 'Backup Account', profilePic: 'images/badge5022.jpeg' },           
        { username: 'raisingramsey2023', isVerified: false, followers: '1,201', nickname: 'RaisingRamsey2023', bio: 'The Adventures of Raising Ramsey. Come along as we watch Ramsey Play and Learn', profilePic: 'images/raisingramsey2023.jpeg' },
        { username: 'jerridc4', isVerified: false, followers: '479', nickname: 'Jerrid Cook', bio: '@raisingramsey2023, @benz.the beard', profilePic: 'images/jerridc4.jpeg' },
        { username: 'officalbusarmydude', isVerified: false, followers: '6', nickname: 'Bus Army Dude', bio: 'https://bus-army-dude.github.io/bus-army-dude/index.html', profilePic: 'images/busarmydude.jpg' }
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
        { username: 'heyrachelhughes', isVerified: false, followers: '101K', nickname: 'Rachel Hughes', bio: 'Personal blog, YouTube + TikTok: Rachel_Hughes, ALL INQUIRIES: houseofhughes@thestation.io, 20% off Bucked Up: RACHELHUGHES', profilePic: 'instagram_photos/houseofhughes.jpeg' },                            
        { username: 'lisa.remillard', isVerified: true, followers: '96.3K', nickname: 'Lisa Remillard', bio: 'Public figure 📹 🎙Journalist, ▶️ Subcribe to my YouTube channel (@LisaRemillardOfficial)', profilePic: 'instagram_photos/lisaremillard.jpg' },                    
        { username: 'meetmeinthemediacenter', isVerified: true, followers: '51.3K', nickname: 'Jen Miller', bio: '✌🏻❤️&Toasty📚 680K on TikTok ✨Book Return Game 🫶🏻Middle School Librarian', profilePic: 'instagram_photos/meetmeinthemediacenter.jpeg' },    
        { username: 'kaylee_mertens_', isVerified: false, followers: '3,152', nickname: 'Kaylee Mertens', bio: 'Tik Tok: Kaylee_Mertens_', profilePic: 'instagram_photos/kayleemertens.jpeg' },    
        { username: 'riverkritzar', isVerified: false, followers: '86', nickname: 'River Jordan Kritzar', bio: "Hello, my name is River, I am 19. I am autistic. I love technology.", profilePic: 'instagram_photos/riverkritzar.jpg' },
        { username: 'rose_the_fox24', isVerified: false, followers: '80', nickname: 'Rose Haydu', bio: 'I'm 19, Drp/rp open, I'm taken by the love of my life @_jano_142_ 💜3/1/24💜', profilePic: 'instagram_photos/rosethefox24.jpg' },
        { username: '_jano_142_', isVerified: false, followers: '48', nickname: 'Nathan Haydu', bio: 'Cars are love, cars are life. Taken by @rose_the_fox24 ❤️(3/1/24)❤️#bncr33gtr:Best Skyline/🔰Dream car🚗#c7zr1:Last TRUE Vette/🇺🇸Dream car🏎', profilePic: 'instagram_photos/jano142.jpg' },    
        { username: 'busarmydude', isVerified: false, followers: '18', nickname: 'Bus Army Dude', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/busarmydude.jpg' }
    ],
    lastUpdatedTime: '2025-01-30T19:55:51',
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
    }
};
const youtubeShoutouts = {
    accounts: [
        { username: '@MrBeast', isVerified: true, subscribers: '352M', nickname: 'MrBeast', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames SUBSCRIBE FOR A COOKIE!', profilePic: 'youtube_photoes/mrbeast.jpg' },
        { username: '@MrBeast2', isVerified: true, subscribers: '48.6M', nickname: 'MrBeast 2', bio: 'my second channel for other videos and shorts :) subscribe ', profilePic: 'youtube_photoes/mrbeast2.jpg' },
        { username: '@MrBeastGaming', isVerified: true, subscribers: '46.5M', nickname: 'MrBeast Gaming', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames MrBeast Gaming - SUBSCRIBE OR ELSE', profilePic: 'youtube_photoes/mrbeastgaming.jpg' },
        { username: '@BeastReacts', isVerified: true, subscribers: '35.3M', nickname: 'Beast Reacts', bio: 'SUBSCRIBE FOR A COOKIE', profilePic: 'youtube_photoes/beastreacts.jpg' },
        { username: '@BeastPhilanthropy', isVerified: true, subscribers: '27.3M', nickname: 'Beast Philanthropy', bio: '100% of the profits from my ad revenue, merch sales, and sponsorships will go towards making the world a better place!', profilePic: 'youtube_photoes/beastphilanthropy.jpg' },
        { username: '@rachel_hughes', isVerified: false, subscribers: '230K', nickname: 'Rachel Hughes', bio: 'My name is Rachel Hughes :) I am a 30 year old, mom of two, living in Utah! I love sharing my experiences and life regarding mental health, leaving religion, overcoming an eating disorder, having a disabled child, fitness, beauty and more! Thank you so much for being here. xo', profilePic: 'youtube_photoes/rachel_hughes.jpg' },        
        { username: '@Trafficlightdoctor', isVerified: false, subscribers: '152K', nickname: 'Traffic Light Doctor', bio: 'TrafficlightDoctor Live! explores traffic signals and road safety, while TrafficlightDoctor Live Gaming offers an immersive gaming experience.', profilePic: 'youtube_photoes/trafficlightdoctor.jpeg' },     
        { username: '@mrfatcheeto', isVerified: false, subscribers: '99.5K', nickname: 'Mr Fat Cheeto', bio: 'I'm like a HVAC Genius. Come join me on my crazy HVAC Comedy adventures ', profilePic: 'youtube_photoes/mrfatcheeto.jpg' },
        { username: '@Badge502', isVerified: false, subscribers: '61K', nickname: 'Badge502', bio: 'Your local EMT!', profilePic: 'youtube_photoes/badge502.jpg' }
    ],
    lastUpdatedTime: '2025-01-30T19:56:46',
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

// Countdown System
const countdownSystem = {
    targetDate: '2025-01-31T14:30:00', // AFO Braces appointment time
    
    init() {
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    },

    updateCountdown() {
        const now = new Date();
        const target = new Date(this.targetDate);
        const diff = target - now;

        const countdownSection = document.querySelector('.countdown-section');
        if (!countdownSection) return;

        if (diff <= 0) {
            this.showCompletionMessage(countdownSection);
            return;
        }

        const timeUnits = this.calculateTimeUnits(diff);
        this.updateFlipClocks(timeUnits);
    },

    calculateTimeUnits(diff) {
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
        };
    },

    updateFlipClocks(timeUnits) {
        Object.entries(timeUnits).forEach(([unit, value]) => {
            this.updateFlipClock(`countdown-${unit}`, value);
        });
    },

    updateFlipClock(id, value) {
        const clock = document.getElementById(id);
        if (!clock) return;

        const front = clock.querySelector('.flip-clock-front');
        const back = clock.querySelector('.flip-clock-back');
        if (!front || !back) return;

        const valueStr = value.toString().padStart(2, '0');

        if (front.textContent !== valueStr) {
            front.textContent = valueStr;
            back.textContent = valueStr;

            const flipInner = clock.querySelector('.flip-clock-inner');
            if (flipInner) {
                flipInner.classList.add('flip');
                setTimeout(() => {
                    flipInner.classList.remove('flip');
                }, 600); // Match this with your CSS animation duration
            }
        }
    },

    showCompletionMessage(container) {
        container.innerHTML = `
            <h2 style="color: var(--accent-color); font-size: 2.5em; margin-bottom: 20px;">
                YOU DID IT TODAY IS THE DAY YOU GET YOUR AFO BRACES!!!!!
            </h2>
            <div style="font-size: 1.5em; color: var(--text-color);">🎉 🎊 🎆 🎈</div>
        `;
    }
};

// Helper function to create flip clock HTML structure
function createFlipClock(containerId, label) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="flip-clock">
            <div class="flip-clock-inner">
                <div class="flip-clock-front">00</div>
                <div class="flip-clock-back">00</div>
            </div>
            <div class="flip-clock-label">${label}</div>
        </div>
    `;
}

// Initialize flip clocks on page load
function initializeFlipClocks() {
    const units = [
        { id: 'countdown-days', label: 'Days' },
        { id: 'countdown-hours', label: 'Hours' },
        { id: 'countdown-minutes', label: 'Minutes' },
        { id: 'countdown-seconds', label: 'Seconds' }
    ];

    units.forEach(unit => createFlipClock(unit.id, unit.label));
}

// FAQ System
const faqSystem = {
    init() {
        this.initializeFAQItems();
        this.setupKeyboardNavigation();
        this.setupOutsideClickHandler();
    },

    initializeFAQItems() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (!question) return;
            
            question.addEventListener('click', () => {
                this.toggleFAQItem(item);
            });
        });
    },

    toggleFAQItem(item) {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items first
        document.querySelectorAll('.faq-item').forEach(faqItem => {
            if (faqItem.classList.contains('active')) {
                faqItem.classList.add('closing');
                setTimeout(() => {
                    faqItem.classList.remove('closing', 'active');
                }, 300);
            }
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
            this.scrollIntoViewIfNeeded(item);
        }
    },

    scrollIntoViewIfNeeded(item) {
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
    },

    setupKeyboardNavigation() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            if (!question) return;
            
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
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        this.toggleFAQItem(item);
                        break;
                }
            });
        });
    },

    setupOutsideClickHandler() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.faq-item')) {
                document.querySelectorAll('.faq-item.active').forEach(item => {
                    item.classList.add('closing');
                    setTimeout(() => {
                        item.classList.remove('active', 'closing');
                    }, 300);
                });
            }
        });
    }
};

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core protection and utilities
    enhancedCopyProtection.init();
    initializeBackToTop();
    initializeCookieConsent();
    lastUpdated.init();

    // Initialize social media shoutouts
    tiktokShoutouts.init();
    instagramShoutouts.init();
    youtubeShoutouts.init();

    // Initialize countdown system
    countdownSystem.init();
    initializeFlipClocks();

    // Initialize FAQ system
    faqSystem.init();

    // Initialize time updates
    updateTime();
    setInterval(updateTime, 1000);

    // Set current year in footer
    document.getElementById('current-year')?.textContent = new Date().getFullYear();

    // Add page load animation
    document.body.classList.add('loaded');
});

// Global timestamp configuration
const globalConfig = {
    lastUpdated: '2025-01-30T19:59:47',
    countdownTarget: '2025-01-31T14:30:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    user: {
        login: 'BusArmyDude',
        repo: 'Bus-Army-Dude/bus-army-dude',
        repoId: '912084953'
    }
};

// Force HTTPS on non-local environments
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    if (window.location.protocol !== 'https:') {
        window.location.href = 'https://' + window.location.host + window.location.pathname;
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error handler:', e.message);
    // You could add error reporting here if needed
});

// Performance monitoring
window.addEventListener('load', () => {
    if (window.performance) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.info(`Page fully loaded in ${loadTime}ms`);
    }
});

// Export for debugging if needed
const debug = {
    config: globalConfig,
    components: {
        tiktok: tiktokShoutouts,
        instagram: instagramShoutouts,
        youtube: youtubeShoutouts,
        countdown: countdownSystem,
        faq: faqSystem
    }
};

// Prevent console in production
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.log = () => {};
    console.debug = () => {};
}
