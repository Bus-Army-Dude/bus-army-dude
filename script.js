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

// Device detection function
function detectDetailedDevice() {
    const ua = navigator.userAgent;
    let deviceInfo = '';

    const operatingSystems = {
        apple: {
            iOS: ['18.3', '18.2.1', '18.2', '18.1', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
            iPadOS: ['18.3','18.2', '18.1', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
            macOS: ['15.3', '15.2', '15.1', '15', '14', '13', '12', '11', '10.15', '10.14', '10.13', '10.12', '10.11', '10.10', '10.9', '10.8', '10.7', '10.6', '10.5', '10.4', '10.3', '10.2', '10.1', '10.0']
        },
        microsoft: {
            Windows: ['11', '10', '8.1', '8', '7']
        },
        android: ['15', '14', '13', '12', '11', '10'],
        linux: [
            'Fedora', 'Arch Linux', 'Red Hat Enterprise Linux', 'Kali Linux', 'Manjaro', 'Ubuntu', 'Linux Mint'
        ],
        unix: ['FreeBSD', 'OpenBSD', 'NetBSD'],
        chrome: ['Chrome OS'],
        blackberry: ['BlackBerry OS'],
        webos: ['webOS'],
        other: ['Unknown Device']
    };

    const getLatestVersion = (platform) => {
        switch(platform) {
            case 'iOS': return operatingSystems.apple.iOS[0];
            case 'iPadOS': return operatingSystems.apple.iPadOS[0];
            case 'macOS': return operatingSystems.apple.macOS[0];
            case 'Windows': return operatingSystems.microsoft.Windows[0];
            case 'Android': return operatingSystems.android[0];
            case 'Linux': return operatingSystems.linux[0];
            case 'FreeBSD': return operatingSystems.unix[0];
            case 'OpenBSD': return operatingSystems.unix[1];
            case 'NetBSD': return operatingSystems.unix[2];
            case 'Chrome OS': return operatingSystems.chrome[0];
            case 'BlackBerry OS': return operatingSystems.blackberry[0];
            case 'webOS': return operatingSystems.webos[0];
            default: return operatingSystems.other[0];
        }
    };

    // Check iPhone
    if (/iPhone/.test(ua)) {
        const version = ua.match(/iPhone\s*OS\s*(\d+)?/)?.[1] || getLatestVersion('iOS');
        deviceInfo = `iPhone (iOS ${version})`;
    }
    // Check iPad
    else if (/iPad/.test(ua)) {
        const version = ua.match(/iPad\s*OS\s*(\d+)?/)?.[1] || getLatestVersion('iPadOS');
        deviceInfo = `iPad (iPadOS ${version})`;
    }
    // Check Android
    else if (/Android/.test(ua)) {
        const version = ua.match(/Android\s*([0-9.]+)?/)?.[1] || getLatestVersion('Android');
        deviceInfo = `Android ${version}`;
    }
    // Check Windows
    else if (/Windows/.test(ua)) {
        const version = ua.match(/Windows NT (\d+\.\d+)/)?.[1] || getLatestVersion('Windows');
        deviceInfo = `Windows ${version}`;
    }
    // Check macOS
    else if (/Macintosh/.test(ua)) {
        const version = ua.match(/Mac OS X (\d+[\.\d+]+)?/)?.[1] || getLatestVersion('macOS');
        deviceInfo = `macOS ${version}`;
    }
    // Check other platforms
    else {
        deviceInfo = 'Unknown Device';
    }

    return deviceInfo;
}

// Time update function
function updateTime() {
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', { timeZoneName: 'short' });
    const timeElement = document.querySelector('.update-time');
    if (timeElement) {
        timeElement.textContent = `Current Date and Time: ${timestamp}`;
    }
}

// Page refresh countdown
let timeLeft = 60;
function updateCountdown() {
    const countdownElement = document.querySelector('.countdown');
    if (countdownElement && timeLeft >= 0) {
        countdownElement.textContent = `Page refreshing in: ${timeLeft} seconds`;
        timeLeft--;
        if (timeLeft < 0) {
            location.reload();
        }
    }
}

// Update version panel with device info
function updateVersionPanel() {
    const deviceElement = document.querySelector('.device-info');
    if (deviceElement) {
        deviceElement.textContent = `Device: ${detectDetailedDevice()}`;
    }
}

// Call the functions on page load
window.onload = function() {
    updateVersionPanel();
    updateTime();
    setInterval(updateCountdown, 1000); // Update countdown every second
};
    
// Instagram Shoutouts
const instagramShoutouts = {
    accounts: [
        { username: 'riverkritzar', isVerified: false, followers: '84', nickname: 'River Jordan Kritzar', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/riverkritzar.jpg' },
        { username: 'busarmydude', isVerified: false, followers: '11', nickname: 'Bus Army Dude', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/busarmydude.jpg' },
        { username: 'rose_the_fox24', isVerified: false, followers: '81', nickname: 'Rose Haydu', bio: 'I’m 19, Drp/rp open, I’m taken by the love of my life @_jano_142_ 💜3/1/24💜', profilePic: 'instagram_photos/rosethefox24.jpg' },
        { username: '_jano_142_', isVerified: false, followers: '48', nickname: 'Nathan Haydu', bio: 'Cars are love, cars are life. Taken by @rose_the_fox24 ❤️(3/1/24)❤️#bncr33gtr:Best Skyline/🔰Dream car🚗#c7zr1:Last TRUE Vette/🇺🇸Dream car🏎', profilePic: 'instagram_photos/jano142.jpg' },    
        { username: 'mrbeast', isVerified: true, followers: '64.8M', nickname: 'MrBeast', bio: 'My New Show Beast Games is out now on Prime Video!', profilePic: 'instagram_photos/mrbeast.jpg' },    
        { username: 'applesauceandadhd', isVerified: true, followers: '589K', nickname: 'Jessica', bio: 'TeamJessSecrest@Gersh.com', profilePic: 'instagram_photos/applesauceandadhd.jpeg' },    
        { username: 'emtbadge502', isVerified: true, followers: '472K', nickname: 'Anthony Christian', bio: 'P.O. Box 775, Belleville, NJ 07109, EMT - 911/ EMD - CPR Instructor - Content Creator, Work Hard. Be Kind Always.', profilePic: 'instagram_photos/emtbadge502.jpg' },    
        { username: 'kaylee_mertens_', isVerified: false, followers: '914', nickname: 'Kaylee Mertens', bio: 'Tik Tok: Kaylee_Mertens_', profilePic: 'instagram_photos/kayleemertens.jpeg' },    
        { username: 'meetmeinthemediacenter', isVerified: true, followers: '25.6K', nickname: 'Jen Miller', bio: '✌🏻❤️&Toasty📚 680K on TikTok ✨Book Return Game 🫶🏻Middle School Librarian', profilePic: 'instagram_photos/meetmeinthemediacenter.jpeg' },    
        { username: 'mrfattcheeto', isVerified: true, followers: '247K', nickname: 'Trent Parker', bio: "I'm like some HVAC Genius", profilePic: 'instagram_photos/mrfatcheeto.jpeg' },    
        { username: 'trafficlightdoctor', isVerified: true, followers: '304K', nickname: 'TrafficLightDoctor', bio: 'Follow My YouTube And TikTok!!', profilePic: 'instagram_photos/trafficlightdoctor.jpeg' },            
        { username: 'lisa.remillard', isVerified: true, followers: '76.8K', nickname: 'Lisa Remillard', bio: 'Public figure 📹 🎙Journalist, ▶️ Subcribe to my YouTube channel (@LisaRemillardOfficial)', profilePic: 'instagram_photos/lisaremillard.jpg' },                    
        { username: 'teamtrump', isVerified: true, followers: '4.9M', nickname: 'Team Trump', bio: 'Political Organization MAKE AMERICA GREAT AGAIN! 🇺🇸 Text TRUMP to 88022', profilePic: 'instagram_photos/teamtrump.jpeg' },                    
        { username: 'carterpc_', isVerified: true, followers: '472K', nickname: 'Carter Smith', bio: 'Tech Creator & Reviewer Business: carterpcs@rakugomedia.com✉️', profilePic: 'instagram_photos/carterpc.jpg' },                    
        { username: 'houseofhughes_', isVerified: false, followers: '97.2K', nickname: 'Rachel Hughes', bio: 'Personal blog YouTube + TikTok: House of Hughes, All Inquiries: houseofhughes@thestation.io, 20% off Bucked Up: RACHELHUGHES', profilePic: 'instagram_photos/houseofhughes.jpeg' },                    
        { username: 'imparkerburton', isVerified: true, followers: '277K', nickname: 'Parker Burton', bio: 'That Android Guy Business: parker@imparkerburton.com', profilePic: 'instagram_photos/imparkerburton.jpeg' },                    
        { username: 'kennedylawfirm', isVerified: false, followers: '23.4K', nickname: 'Lawyer Kevin Kennedy', bio: 'Clarksville, TN Kevs got you covered', profilePic: 'instagram_photos/kennedylawfirm.jpeg' },                    
        { username: 'ta.techtips', isVerified: false, followers: '267K', nickname: 'TA Tech Tips', bio: '🔥 Tech Tips 🔥 📱TikTok | TATechTips📧 hello@thegoldstudios.com', profilePic: 'instagram_photos/tatechtips.jpeg' },                    
        { username: 'lust_ryze', isVerified: false, followers: '24', nickname: 'hi everyone this will be my official Instagram account for my tiktok account you can find my other social bellow', profilePic: 'instagram_photos/lustryze.jpeg' },                    
        // Add more Instagram creators as needed
    ],
    lastUpdatedTime: '2025-01-14T13:07:38', // Manually set the last updated date and time
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

// Initialize the Instagram shoutouts
instagramShoutouts.init();

const youtubeShoutouts = {
    accounts: [
        { username: '@MrBeast', isVerified: true, subscribers: '343M', nickname: 'MrBeast', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames SUBSCRIBE FOR A COOKIE!', profilePic: 'youtube_photoes/mrbeast.jpg' },
        { username: '@BeastReacts', isVerified: true, subscribers: '35.2M', nickname: 'Beast Reacts', bio: 'SUBSCRIBE FOR A COOKIE', profilePic: 'youtube_photoes/beastreacts.jpg' },
        { username: '@MrBeastGaming', isVerified: true, subscribers: '46.3M', nickname: 'MrBeast Gaming', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames MrBeast Gaming - SUBSCRIBE OR ELSE', profilePic: 'youtube_photoes/mrbeastgaming.jpg' },
        { username: '@MrBeast2', isVerified: true, subscribers: '48.3M', nickname: 'MrBeast 2', bio: 'my second channel for other videos and shorts :) subscribe ', profilePic: 'youtube_photoes/mrbeast2.jpg' },
        { username: '@BeastPhilanthropy', isVerified: true, subscribers: '27.1M', nickname: 'Beast Philanthropy', bio: '100% of the profits from my ad revenue, merch sales, and sponsorships will go towards making the world a better place!', profilePic: 'youtube_photoes/beastphilanthropy.jpg' },
        { username: '@mrfatcheeto', isVerified: false, subscribers: '91.3K', nickname: 'Mr Fat Cheeto', bio: 'I’m like a HVAC Genius. Come join me on my crazy HVAC Comedy adventures ', profilePic: 'youtube_photoes/mrfatcheeto.jpg' },
        { username: '@Badge502', isVerified: false, subscribers: '58.4K', nickname: 'Badge502', bio: 'Your local EMT!', profilePic: 'youtube_photoes/badge502.jpg' },     
        { username: '@Trafficlightdoctor', isVerified: false, subscribers: '150K', nickname: 'Traffic Light Doctor', bio: 'TrafficlightDoctor Live! explores traffic signals and road safety, while TrafficlightDoctor Live Gaming offers an immersive gaming experience.', profilePic: 'youtube_photoes/trafficlightdoctor.jpeg' },     
        // Add more YouTube creators as needed
    ],
    lastUpdatedTime: '2025-01-14T12:41:02', // Manually set the last updated date and time
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
        const newYear = new Date('2025-02-27T03:00:00');
        const diff = newYear - now;

        const countdownSection = document.querySelector('.countdown-section');
        if (!countdownSection) return;

        if (diff <= 0) {
            countdownSection.innerHTML = `
                <h2 style="color: var(--accent-color); font-size: 2.5em; margin-bottom: 20px;">
                    HAPPY BIRTHDAY! IT'S OFFICIALLY YOUR 20TH BIRTHDAY, ENJOY IT!
                </h2>
                <div style="font-size: 1.5em; color: var(--text-color);">🎉 🎊 🎆 🎈</div>
            `;
        } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('countdown-days').textContent = days;
            document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
        }
    }

    // Initialize everything
    detectDetailedDevice();
    updateTime();
    updateNewYearCountdown();

    setInterval(updateTime, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(updateNewYearCountdown, 1000);
});
