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

// Set the refresh time (5 minutes from now)
let refreshTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now

// Function to update the countdown every second
function updateCountdown() {
    // Get the current time
    let now = new Date().getTime();

    // Calculate the remaining time until the page refreshes
    let timeLeft = refreshTime - now;

    if (timeLeft <= 0) {
        // If the time is up, refresh the page
        document.getElementById("countdown-display").innerHTML = "Refreshing now!";
        setTimeout(() => {
            location.reload();
        }, 1000); // Refresh after 1 second
    } else {
        // Calculate the remaining minutes and seconds
        let minutes = Math.floor(timeLeft / (1000 * 60));
        let seconds = Math.floor((timeLeft / 1000) % 60);

        // Update the countdown display in minutes and seconds
        document.getElementById("countdown-display").innerHTML = `Page will refresh in ${minutes}m ${seconds}s`;
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
    updateCountdown(); // Make sure the countdown starts
};

// Update the countdown every second
setInterval(updateCountdown, 1000); // Update countdown every second

// RedNote Shoutouts
const redNoteShoutouts = {
    accounts: [
        { username: '63893018335', isVerified: false, fans: '21,000', nickname: 'Basge502', bio: 'No introduction yet', profilePic: 'rednote/basge502.webp', userId: '67853e92000000000801ee5d', token: 'ABy8b3MUGXD9mTh_DRUWGuurbnUrwIMswnddTO9cI1Gjg%3D' },
        { username: 'busarmydude', isVerified: false, fans: '15', nickname: 'River Kritzar', bio: 'https://bus-army-dude.github.io/bus-army-dude/', profilePic: 'rednote/busarmydude.webp', userId: '6784c343000000000803cd8c', token: 'ABArWuAlrqd-0XrSwW8448qhsXeAp_QX9ZiVo8H17' },
        // Add more RedNote creators as needed
    ],
    lastUpdatedTime: '2025-01-19T11:19:05', // Manually set the last updated date and time
    profileLinkBase: "https://www.xiaohongshu.com/user/profile",
    init() {
        this.createShoutoutCards();
        this.setLastUpdatedTime();
    },
    createShoutoutCards() {
        const container = document.querySelector('.rednote-creator-grid');
        if (!container) return;

        container.innerHTML = '';
        this.accounts.forEach(account => {
            const card = document.createElement('div');
            card.className = 'rednote-creator-card';

            // Create the profile link using the Xiaohongshu format
            const profileLink = `${this.profileLinkBase}/${account.userId}?xsec_token=${account.token}&xsec_source=pc_search`;

            card.innerHTML = `
                <img src="${account.profilePic}" alt="${account.nickname}" class="rednote-creator-pic" onerror="this.src='images/default-profile.jpg'">
                <div class="rednote-creator-info">
                    <div class="rednote-creator-header">
                        <h3>${account.nickname}</h3>
                        ${account.isVerified ? '<img src="rednotecheck.png" alt="Verified" class="rednote-verified-badge">' : ''}
                    </div>
                    <p class="rednote-creator-username">${account.username}</p>
                    <p class="rednote-creator-bio">${account.bio || ''}</p>
                    <p class="rednote-fan-count">${account.fans} Fans</p>
                    <a href="${profileLink}" target="_blank" class="rednote-visit-profile">
                        Visit Profile
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    },
    setLastUpdatedTime() {
        const lastUpdatedElement = document.getElementById('rednote-last-updated-timestamp');
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

// Initialize the RedNote shoutouts
redNoteShoutouts.init();

    
// Instagram Shoutouts
const instagramShoutouts = {
    accounts: [
        { username: 'riverkritzar', isVerified: false, followers: '84', nickname: 'River Jordan Kritzar', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/riverkritzar.jpg' },
        { username: 'busarmydude', isVerified: false, followers: '13', nickname: 'Bus Army Dude', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/busarmydude.jpg' },
        { username: 'rose_the_fox24', isVerified: false, followers: '81', nickname: 'Rose Haydu', bio: 'I’m 19, Drp/rp open, I’m taken by the love of my life @_jano_142_ 💜3/1/24💜', profilePic: 'instagram_photos/rosethefox24.jpg' },
        { username: '_jano_142_', isVerified: false, followers: '47', nickname: 'Nathan Haydu', bio: 'Cars are love, cars are life. Taken by @rose_the_fox24 ❤️(3/1/24)❤️#bncr33gtr:Best Skyline/🔰Dream car🚗#c7zr1:Last TRUE Vette/🇺🇸Dream car🏎', profilePic: 'instagram_photos/jano142.jpg' },    
        { username: 'mrbeast', isVerified: true, followers: '65.2M', nickname: 'MrBeast', bio: 'My New Show Beast Games is out now on Prime Video!', profilePic: 'instagram_photos/mrbeast.jpg' },    
        { username: 'applesauceandadhd', isVerified: true, followers: '699K', nickname: 'Jessica', bio: 'TeamJessSecrest@Gersh.com', profilePic: 'instagram_photos/applesauceandadhd.jpeg' },    
        { username: 'emtbadge502', isVerified: true, followers: '482K', nickname: 'Anthony Christian', bio: 'P.O. Box 775, Belleville, NJ 07109, EMT - 911/ EMD - CPR Instructor - Content Creator, Work Hard. Be Kind Always.', profilePic: 'instagram_photos/emtbadge502.jpg' },    
        { username: 'kaylee_mertens_', isVerified: false, followers: '3,084', nickname: 'Kaylee Mertens', bio: 'Tik Tok: Kaylee_Mertens_', profilePic: 'instagram_photos/kayleemertens.jpeg' },    
        { username: 'meetmeinthemediacenter', isVerified: true, followers: '50.1K', nickname: 'Jen Miller', bio: '✌🏻❤️&Toasty📚 680K on TikTok ✨Book Return Game 🫶🏻Middle School Librarian', profilePic: 'instagram_photos/meetmeinthemediacenter.jpeg' },    
        { username: 'mrfattcheeto', isVerified: true, followers: '259K', nickname: 'Trent Parker', bio: "I'm like some HVAC Genius", profilePic: 'instagram_photos/mrfatcheeto.jpeg' },    
        { username: 'trafficlightdoctor', isVerified: true, followers: '307K', nickname: 'TrafficLightDoctor', bio: 'Follow My YouTube And TikTok!!', profilePic: 'instagram_photos/trafficlightdoctor.jpeg' },            
        { username: 'lisa.remillard', isVerified: true, followers: '89.4K', nickname: 'Lisa Remillard', bio: 'Public figure 📹 🎙Journalist, ▶️ Subcribe to my YouTube channel (@LisaRemillardOfficial)', profilePic: 'instagram_photos/lisaremillard.jpg' },                    
        { username: 'teamtrump', isVerified: true, followers: '5M', nickname: 'Team Trump', bio: 'Political Organization MAKE AMERICA GREAT AGAIN! 🇺🇸 Text TRUMP to 88022', profilePic: 'instagram_photos/teamtrump.jpeg' },                    
        { username: 'carterpcs_', isVerified: true, followers: '500K', nickname: 'Carter Smith', bio: 'Tech Creator & Reviewer Business: carterpcs@rakugomedia.com✉️', profilePic: 'instagram_photos/carterpc.jpg' },                    
        { username: 'houseofhughes_', isVerified: false, followers: '99.2K', nickname: 'Rachel Hughes', bio: 'Personal blog YouTube + TikTok: House of Hughes, All Inquiries: houseofhughes@thestation.io, 20% off Bucked Up: RACHELHUGHES', profilePic: 'instagram_photos/houseofhughes.jpeg' },                    
        { username: 'imparkerburton', isVerified: true, followers: '280K', nickname: 'Parker Burton', bio: 'That Android Guy Business: parker@imparkerburton.com', profilePic: 'instagram_photos/imparkerburton.jpeg' },                    
        { username: 'kennedylawfirm', isVerified: false, followers: '24K', nickname: 'Lawyer Kevin Kennedy', bio: 'Clarksville, TN Kevs got you covered', profilePic: 'instagram_photos/kennedylawfirm.jpeg' },                    
        { username: 'ta.techtips', isVerified: false, followers: '269K', nickname: 'TA Tech Tips', bio: '🔥 Tech Tips 🔥 📱TikTok | TATechTips📧 hello@thegoldstudios.com', profilePic: 'instagram_photos/tatechtips.jpeg' },                    
        // Add more Instagram creators as needed
    ],
    lastUpdatedTime: '2025-01-19T09:26:25', // Manually set the last updated date and time
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
        { username: '@MrBeast', isVerified: true, subscribers: '346M', nickname: 'MrBeast', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames SUBSCRIBE FOR A COOKIE!', profilePic: 'youtube_photoes/mrbeast.jpg' },
        { username: '@BeastReacts', isVerified: true, subscribers: '35.2M', nickname: 'Beast Reacts', bio: 'SUBSCRIBE FOR A COOKIE', profilePic: 'youtube_photoes/beastreacts.jpg' },
        { username: '@MrBeastGaming', isVerified: true, subscribers: '46.4M', nickname: 'MrBeast Gaming', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames MrBeast Gaming - SUBSCRIBE OR ELSE', profilePic: 'youtube_photoes/mrbeastgaming.jpg' },
        { username: '@MrBeast2', isVerified: true, subscribers: '48.4M', nickname: 'MrBeast 2', bio: 'my second channel for other videos and shorts :) subscribe ', profilePic: 'youtube_photoes/mrbeast2.jpg' },
        { username: '@BeastPhilanthropy', isVerified: true, subscribers: '27.2M', nickname: 'Beast Philanthropy', bio: '100% of the profits from my ad revenue, merch sales, and sponsorships will go towards making the world a better place!', profilePic: 'youtube_photoes/beastphilanthropy.jpg' },
        { username: '@mrfatcheeto', isVerified: false, subscribers: '95K', nickname: 'Mr Fat Cheeto', bio: 'I’m like a HVAC Genius. Come join me on my crazy HVAC Comedy adventures ', profilePic: 'youtube_photoes/mrfatcheeto.jpg' },
        { username: '@Badge502', isVerified: false, subscribers: '60.1K', nickname: 'Badge502', bio: 'Your local EMT!', profilePic: 'youtube_photoes/badge502.jpg' },     
        { username: '@Trafficlightdoctor', isVerified: false, subscribers: '151K', nickname: 'Traffic Light Doctor', bio: 'TrafficlightDoctor Live! explores traffic signals and road safety, while TrafficlightDoctor Live Gaming offers an immersive gaming experience.', profilePic: 'youtube_photoes/trafficlightdoctor.jpeg' },     
        // Add more YouTube creators as needed
    ],
    lastUpdatedTime: '2025-01-19T09:28:02', // Manually set the last updated date and time
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
    setInterval(updateNewYearCountdown, 1000);
});


// Set these flags to `false` when TikTok is unbanned in the respective regions
const isTikTokBannedInUS = true;  // Change this to `false` when TikTok is unbanned in the U.S.
const isTikTokBannedInCA = false;  // Change this to `false` when TikTok is unbanned in Canada
const isTikTokBannedInGB = false;  // Change this to `false` when TikTok is unbanned in the UK
const isTikTokBannedInEU = false;  // Change this to `false` when TikTok is unbanned in the European Union
const isTikTokBannedInIN = false;  // Change this to `false` when TikTok is unbanned in India
const isTikTokBannedInAU = false;  // Change this to `false` when TikTok is unbanned in Australia
const isTikTokBannedInSG = false;  // Change this to `false` when TikTok is unbanned in Singapore
const isTikTokBannedInBR = false;  // Change this to `false` when TikTok is unbanned in Brazil
const isTikTokBannedInZA = false;  // Change this to `false` when TikTok is unbanned in South Africa
const isTikTokBannedInJP = false;  // Change this to `false` when TikTok is unbanned in Japan
const isTikTokBannedInKR = false;  // Change this to `false` when TikTok is unbanned in South Korea
const isTikTokBannedInCN = true;  // Change this to `false` when TikTok is unbanned in China (no TikTok in mainland China)
const isTikTokBannedInRU = false;  // Change this to `false` when TikTok is unbanned in Russia
const isTikTokBannedInMY = false;  // Change this to `false` when TikTok is unbanned in Malaysia
const isTikTokBannedInPH = false;  // Change this to `false` when TikTok is unbanned in the Philippines

// Manually set the "Last Updated" timestamp here (adjust as needed)
let manualLastUpdated = 'January 19, 2025, 4:41 PM';  // Replace with your desired timestamp

// Function to detect the user's country and display the correct sections using GeoJS API
function checkLocation() {
    fetch('https://get.geojs.io/v1/ip/country.json')  // GeoJS API for detecting country
        .then(response => response.json())
        .then(data => {
            const country = data.country;

            // If you want to use the manually set timestamp, use `manualLastUpdated`
            let lastUpdated = manualLastUpdated;

            // Optionally store the value in localStorage for later use
            localStorage.setItem('lastUpdated', lastUpdated);

            if (country === 'US' && isTikTokBannedInUS) {
                document.getElementById('us-shoutouts').style.display = 'block'; // Show TikTok banned message for U.S. users
                document.getElementById('other-regions-shoutouts').style.display = 'none'; // Hide TikTok creator shoutouts for other regions
                document.getElementById('us-last-updated').innerText = lastUpdated;
            } else if (country === 'CA' && isTikTokBannedInCA) {
                document.getElementById('ca-shoutouts').style.display = 'block'; 
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('ca-last-updated').innerText = lastUpdated;
            } else if (country === 'GB' && isTikTokBannedInGB) {
                document.getElementById('gb-shoutouts').style.display = 'block';
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('gb-last-updated').innerText = lastUpdated;
            } else if (country === 'EU' && isTikTokBannedInEU) {
                document.getElementById('eu-shoutouts').style.display = 'block'; 
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('eu-last-updated').innerText = lastUpdated;
            } else if (country === 'IN' && isTikTokBannedInIN) {
                document.getElementById('in-shoutouts').style.display = 'block';
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('in-last-updated').innerText = lastUpdated;
            } else if (country === 'AU' && isTikTokBannedInAU) {
                document.getElementById('au-shoutouts').style.display = 'block';
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('au-last-updated').innerText = lastUpdated;
            } else if (country === 'SG' && isTikTokBannedInSG) {
                document.getElementById('sg-shoutouts').style.display = 'block';
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('sg-last-updated').innerText = lastUpdated;
            } else if (country === 'BR' && isTikTokBannedInBR) {
                document.getElementById('br-shoutouts').style.display = 'block';
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('br-last-updated').innerText = lastUpdated;
            } else if (country === 'ZA' && isTikTokBannedInZA) {
                document.getElementById('za-shoutouts').style.display = 'block';
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('za-last-updated').innerText = lastUpdated;
            } else if (country === 'JP' && isTikTokBannedInJP) {
                document.getElementById('jp-shoutouts').style.display = 'block';
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('jp-last-updated').innerText = lastUpdated;
            } else if (country === 'KR' && isTikTokBannedInKR) {
                document.getElementById('kr-shoutouts').style.display = 'block';
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('kr-last-updated').innerText = lastUpdated;
            } else if (country === 'CN' && isTikTokBannedInCN) {
                document.getElementById('cn-shoutouts').style.display = 'block';
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('cn-last-updated').innerText = lastUpdated;
            } else if (country === 'RU' && isTikTokBannedInRU) {
                document.getElementById('ru-shoutouts').style.display = 'block';
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('ru-last-updated').innerText = lastUpdated;
            } else if (country === 'MY' && isTikTokBannedInMY) {
                document.getElementById('my-shoutouts').style.display = 'block';
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('my-last-updated').innerText = lastUpdated;
            } else if (country === 'PH' && isTikTokBannedInPH) {
                document.getElementById('ph-shoutouts').style.display = 'block';
                document.getElementById('other-regions-shoutouts').style.display = 'none';
                document.getElementById('ph-last-updated').innerText = lastUpdated;
            } else {
                // Show creator shoutouts for other regions
                document.getElementById('other-regions-shoutouts').style.display = 'block'; 
                document.getElementById('us-shoutouts').style.display = 'none'; // Hide U.S. banned message
                document.getElementById('ca-shoutouts').style.display = 'none'; // Hide Canada banned message
                document.getElementById('gb-shoutouts').style.display = 'none'; // Hide UK banned message
                document.getElementById('eu-shoutouts').style.display = 'none'; // Hide EU banned message
                document.getElementById('in-shoutouts').style.display = 'none'; // Hide India banned message
                document.getElementById('au-shoutouts').style.display = 'none'; // Hide Australia banned message
                document.getElementById('sg-shoutouts').style.display = 'none'; // Hide Singapore banned message
                document.getElementById('br-shoutouts').style.display = 'none'; // Hide Brazil banned message
                document.getElementById('za-shoutouts').style.display = 'none'; // Hide South Africa banned message
                document.getElementById('jp-shoutouts').style.display = 'none'; // Hide Japan banned message
                document.getElementById('kr-shoutouts').style.display = 'none'; // Hide South Korea banned message
                document.getElementById('cn-shoutouts').style.display = 'none'; // Hide China banned message
                document.getElementById('ru-shoutouts').style.display = 'none'; // Hide Russia banned message
                document.getElementById('my-shoutouts').style.display = 'none'; // Hide Malaysia banned message
                document.getElementById('ph-shoutouts').style.display = 'none'; // Hide Philippines banned message
                document.getElementById('other-regions-last-updated').innerText = lastUpdated;
                addCreators(); // Call function to add creators dynamically
            }
        })
        .catch(error => {
            console.error('Error fetching location data:', error);
            // Fallback if the API fails
            document.getElementById('location-error').style.display = 'block';
        });
}

// Function to dynamically add creators for other regions
function addCreators() {
    const container = document.querySelector('.creator-grid');
    if (!container) return;

    const creators = [
        { username: 'meetmeinthemediacenter', isVerified: true, followers: '692.6K', nickname: 'Meet Me In The Media Center', bio: '✌🏻❤️&ToastyBooks 📚Middle School Librarian,💌 meetmeinthemediacenter@gmail.com', profilePic: 'images/meetmeinthemediacenter.jpeg' },
        // Add more creators as necessary
    ];

    creators.forEach(creator => {
        const card = document.createElement('div');
        card.className = 'creator-card';
        card.innerHTML = `
            <img src="${creator.profilePic}" alt="@${creator.username}" class="creator-pic" onerror="this.src='default-profile.jpg'">
            <div class="creator-info">
                <div class="creator-header">
                    <h3>${creator.nickname}</h3>
                    ${creator.isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''}
                </div>
                <p class="creator-username">@${creator.username}</p>
                <p class="creator-bio">${creator.bio}</p>
                <p class="follower-count">${creator.followers} Followers</p>
                <a href="https://tiktok.com/@${creator.username}" target="_blank" class="visit-profile">Visit Profile</a>
            </div>
        `;
        container.appendChild(card);
    });
}

// Call checkLocation function on page load
checkLocation();
