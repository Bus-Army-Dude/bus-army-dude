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

// Page refresh countdown set to 5 minutes (300 seconds)
const refreshInterval = 5 * 60 * 1000;  // 5 minutes in milliseconds
let startTime = Date.now();

function updateCountdown() {
    const countdownElement = document.querySelector('.countdown');
    const timeElapsed = Date.now() - startTime;
    const timeLeft = Math.ceil((refreshInterval - timeElapsed) / 1000);  // Convert ms to seconds
    
    if (timeLeft >= 0) {
        const minutes = Math.floor(timeLeft / 60);  // Get full minutes
        const seconds = timeLeft % 60;              // Get remaining seconds
        
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
    updateCountdown();
    
    // Synchronize both time and countdown updates every second
    setInterval(() => {
        updateTime();
        updateCountdown();
    }, 1000);  // Update both every second
};
    
    // TikTok Shoutouts
    const tiktokShoutouts = {
        accounts: [
            { username: 'mrbeast', isVerified: true, followers: '112.7M', nickname: 'MrBeast', bio: 'New CEO of Tiktok?', profilePic: 'images/mrbeast.jpeg' },     
            { username: 'teamtrump', isVerified: true, followers: '8.7M', nickname: 'Team Trump', bio: 'The official TikTok page for the Trump Campaign', profilePic: 'images/teamtrump.jpeg' },
            { username: 'carterpcs', isVerified: true, followers: '5.6M', nickname: 'Carterpcs', bio: 'Making Tech Less Of A Snoozefest, LA', profilePic: 'images/carterpcs.jpeg' },
            { username: 'applesauceandadhd', isVerified: true, followers: '3.8M', nickname: 'Jess|Aggressive Tutorials', bio: 'Surviving Not Thriving, TeamJessSecrest@Gersh.com', profilePic: 'images/applesauceandadhd.jpeg' },
            { username: 'houseofhughes_', isVerified: false, followers: '309.6K', nickname: 'Rachel Hughes', bio: 'houseofhughes@thestation.io, Cerebral Palsy Mama, 20% OFF BUCKED UP: RACHELHUGHES', profilePic: 'images/houseofhughes.jpeg' },
            { username: 'busarmydude', isVerified: false, followers: '1,250', nickname: 'Bus Army Dude', bio: 'CURRENT PRESIDENT: Trump (2025-2029) Political party: Republican', profilePic: 'images/busarmydude.jpg' },
            { username: 'raisingramsey2023', isVerified: false, followers: '1,198', nickname: 'RaisingRamsey2023', bio: 'The Adventures of Raising Ramsey. Come along as we watch Ramsey Play and Learn', profilePic: 'images/raisingramsey2023.jpeg' },
            { username: 'trafficlightdoctor', isVerified: false, followers: '383.9K', nickname: '🚦 Traffic Light Doctor 🚦', bio: '🚦Traffic Signal Tech🚦 Traffic Lights, Family, Food, and Comedy!, Mississippi', profilePic: 'images/trafficlightdoctor.jpeg' },
            { username: 'jerridc4', isVerified: false, followers: '478', nickname: 'Jerrid Cook', bio: '@raisingramsey2023, @benz.the beard', profilePic: 'images/jerridc4.jpeg' },
            { username: 'jerridonthelot', isVerified: false, followers: '121', nickname: 'Jerrid on the Lot', bio: 'Your friendly neighborhood Car Salesman and Boy Dad', profilePic: 'images/jerridonthelot.jpeg' },
            { username: 'imparkerburton', isVerified: false, followers: '2.9M', nickname: 'Parker Burton', bio: 'That Android Guy, Business: parker@imparkerburton.com', profilePic: 'images/imparkerburton.jpeg' },
            { username: 'kaylee_mertens_', isVerified: false, followers: '674.8K', nickname: 'Kaylee Mertens|Dancing Baby', bio: 'Just a mom who loves her baby boy 💙,📍Wisconsin, KayleeMertens.collabs@gmail.com', profilePic: 'images/kayleemertens.jpeg' },
            { username: 'kennedylawfirm', isVerified: false, followers: '1.9M', nickname: 'Lawyer Kevin Kennedy', bio: "The Kennedy Law Firm, PLLC, Clarksville, TN, Kev's got you covered™️", profilePic: 'images/kennedylawfirm.jpeg' },
            { username: 'meetmeinthemediacenter', isVerified: true, followers: '694.4K', nickname: 'Meet Me In The Media Center', bio: '✌🏻❤️&ToastyBooks, 📚Middle School Librarian, 💌 meetmeinthemediacenter@gmail.com', profilePic: 'images/meetmeinthemediacenter.jpeg' },
            { username: 'missfoxy0142', isVerified: false, followers: '23', nickname: 'miss_foxy142', bio: 'No bio yet.', profilePic: 'images/missfoxy0142.jpeg' },
            { username: 'mrfatcheeto', isVerified: false, followers: '498.4K', nickname: 'Mr Fat Cheeto', bio: 'OH YEAH!', profilePic: 'images/mrfatcheeto.jpeg' },
            { username: '_jano_142_', isVerified: false, followers: '101', nickname: 'Jano_142', bio: "I'm a guy who loves cars... Want to support my passion? My Cashapp is @Jano142", profilePic: 'images/jano142.jpeg' },
            { username: 'elvirablack8', isVerified: false, followers: '990', nickname: 'elvirablack8', bio: 'I love my friends and my family all so much even my followers', profilePic: 'images/elvirablack8.jpeg' },
            { username: 'badge502', isVerified: false, followers: '802.8K', nickname: 'Badge502', bio: 'NREMT - 911/EMD PO Box 775 Belleville, NJ 07109 *I DONT HAVE A BACKUP ACCOUNT*', profilePic: 'images/badge502.jpeg' },
            { username: 'badge5022', isVerified: false, followers: '19.2K', nickname: 'Badge502', bio: 'Backup Account', profilePic: 'images/badge5022.jpeg' },
            { username: 'aggressiveafterdark', isVerified: false, followers: '334.3K', nickname: 'ApplesauceandADHD_AfterDark', bio: "Shhhhhhh. It's a secret@Jess|Aggressive Tutorials Official Back-Up", profilePic: 'images/aggressiveafterdark.jpeg' },
            { username: 'souldragon912', isVerified: false, followers: '82', nickname: 'Soul Dragon', bio: "I'm in Network Security. i play Höfner club bass and love 80s rock. 18", profilePic: 'images/souldragon912.jpeg' },
            { username: 'prettymomma37', isVerified: false, followers: '68', nickname: 'Andrea', bio: 'No bio yet', profilePic: 'images/prettymomma37.jpeg' },
            { username: 'tatechtips', isVerified: true, followers: '3.1M', nickname: 'TA TECH TIPS', bio: '🔥 Tech Tips from Nick B 🔥, Enquiries: 📧 hello@TheGoldStudios.com', profilePic: 'images/tatechtips.jpeg' },
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
        { username: 'riverkritzar', isVerified: false, followers: '84', nickname: 'River Jordan Kritzar', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/riverkritzar.jpg' },
        { username: 'busarmydude', isVerified: false, followers: '16', nickname: 'Bus Army Dude', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/busarmydude.jpg' },
        { username: 'rose_the_fox24', isVerified: false, followers: '80', nickname: 'Rose Haydu', bio: 'I’m 19, Drp/rp open, I’m taken by the love of my life @_jano_142_ 💜3/1/24💜', profilePic: 'instagram_photos/rosethefox24.jpg' },
        { username: '_jano_142_', isVerified: false, followers: '47', nickname: 'Nathan Haydu', bio: 'Cars are love, cars are life. Taken by @rose_the_fox24 ❤️(3/1/24)❤️#bncr33gtr:Best Skyline/🔰Dream car🚗#c7zr1:Last TRUE Vette/🇺🇸Dream car🏎', profilePic: 'instagram_photos/jano142.jpg' },    
        { username: 'mrbeast', isVerified: true, followers: '65.4M', nickname: 'MrBeast', bio: 'My New Show Beast Games is out now on Prime Video!', profilePic: 'instagram_photos/mrbeast.jpg' },    
        { username: 'applesauceandadhd', isVerified: true, followers: '729K', nickname: 'Jessica', bio: 'TeamJessSecrest@Gersh.com', profilePic: 'instagram_photos/applesauceandadhd.jpeg' },    
        { username: 'emtbadge502', isVerified: true, followers: '488K', nickname: 'Anthony Christian', bio: 'P.O. Box 775, Belleville, NJ 07109, EMT - 911/ EMD - CPR Instructor - Content Creator, Work Hard. Be Kind Always.', profilePic: 'instagram_photos/emtbadge502.jpg' },    
        { username: 'kaylee_mertens_', isVerified: false, followers: '3,150', nickname: 'Kaylee Mertens', bio: 'Tik Tok: Kaylee_Mertens_', profilePic: 'instagram_photos/kayleemertens.jpeg' },    
        { username: 'meetmeinthemediacenter', isVerified: true, followers: '51.1K', nickname: 'Jen Miller', bio: '✌🏻❤️&Toasty📚 680K on TikTok ✨Book Return Game 🫶🏻Middle School Librarian', profilePic: 'instagram_photos/meetmeinthemediacenter.jpeg' },    
        { username: 'mrfattcheeto', isVerified: true, followers: '266K', nickname: 'Trent Parker', bio: "I'm like some HVAC Genius", profilePic: 'instagram_photos/mrfatcheeto.jpeg' },    
        { username: 'trafficlightdoctor', isVerified: true, followers: '308K', nickname: 'TrafficLightDoctor', bio: 'Follow My YouTube And TikTok!!', profilePic: 'instagram_photos/trafficlightdoctor.jpeg' },            
        { username: 'lisa.remillard', isVerified: true, followers: '91.4K', nickname: 'Lisa Remillard', bio: 'Public figure 📹 🎙Journalist, ▶️ Subcribe to my YouTube channel (@LisaRemillardOfficial)', profilePic: 'instagram_photos/lisaremillard.jpg' },                    
        // Add more Instagram creators as needed
    ],
    lastUpdatedTime: '2025-01-22T09:18:31', // Manually set the last updated date and time
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
        { username: '@MrBeast', isVerified: true, subscribers: '346M', nickname: 'MrBeast', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames SUBSCRIBE FOR A COOKIE!', profilePic: 'youtube_photoes/mrbeast.jpg' },
        { username: '@BeastReacts', isVerified: true, subscribers: '35.3M', nickname: 'Beast Reacts', bio: 'SUBSCRIBE FOR A COOKIE', profilePic: 'youtube_photoes/beastreacts.jpg' },
        { username: '@MrBeastGaming', isVerified: true, subscribers: '46.4M', nickname: 'MrBeast Gaming', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames MrBeast Gaming - SUBSCRIBE OR ELSE', profilePic: 'youtube_photoes/mrbeastgaming.jpg' },
        { username: '@MrBeast2', isVerified: true, subscribers: '48.5M', nickname: 'MrBeast 2', bio: 'my second channel for other videos and shorts :) subscribe ', profilePic: 'youtube_photoes/mrbeast2.jpg' },
        { username: '@BeastPhilanthropy', isVerified: true, subscribers: '27.2M', nickname: 'Beast Philanthropy', bio: '100% of the profits from my ad revenue, merch sales, and sponsorships will go towards making the world a better place!', profilePic: 'youtube_photoes/beastphilanthropy.jpg' },
        { username: '@mrfatcheeto', isVerified: false, subscribers: '96.2K', nickname: 'Mr Fat Cheeto', bio: 'I’m like a HVAC Genius. Come join me on my crazy HVAC Comedy adventures ', profilePic: 'youtube_photoes/mrfatcheeto.jpg' },
        { username: '@Badge502', isVerified: false, subscribers: '60.6K', nickname: 'Badge502', bio: 'Your local EMT!', profilePic: 'youtube_photoes/badge502.jpg' },     
        { username: '@Trafficlightdoctor', isVerified: false, subscribers: '151K', nickname: 'Traffic Light Doctor', bio: 'TrafficlightDoctor Live! explores traffic signals and road safety, while TrafficlightDoctor Live Gaming offers an immersive gaming experience.', profilePic: 'youtube_photoes/trafficlightdoctor.jpeg' },     
        // Add more YouTube creators as needed
    ],
    lastUpdatedTime: '2025-01-22T09:19:56', // Manually set the last updated date and time
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
    tiktokShoutouts.init();
    updateNewYearCountdown();

    setInterval(updateTime, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(updateNewYearCountdown, 1000);
});

// Manually set the last updated date and time (example in EST timezone)
const lastUpdatedDate = "Wed, Jan 22, 2025";  // Set the date here (Day of the Week, Month, Day, Year)
const lastUpdatedTime = "9:22:33 AM";    // Set the time here (12-hour format)

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

// Get the button
const backToTopButton = document.getElementById("back-to-top-btn");

// When the user scrolls down 100px from the top of the document, show the button
window.onscroll = function () {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    backToTopButton.style.display = "block"; // Show the button
  } else {
    backToTopButton.style.display = "none"; // Hide the button
  }
};

// When the user clicks on the button, scroll to the top of the document
backToTopButton.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Smooth scroll animation
  });
};

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

function getWeather(lat, lon) {
    const apiKey = '88a889bce78f9ea1dc4fc0ef692e8ca4';  // Replace with your OpenWeatherAPI key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weather = data.weather[0].description;
            const temp = data.main.temp;  // Temperature in Fahrenheit
            const location = data.name; // City name
            document.getElementById('weather-info').innerHTML = `
                <h2>Weather in ${location}</h2>
                <p>${temp}°F, ${weather}</p>
            `;
        })
        .catch(err => {
            document.getElementById('weather-info').innerHTML = 'Unable to retrieve weather data.';
            console.error(err);
        });
}

function handleLocationError() {
    document.getElementById('weather-info').innerHTML = 'Unable to get location for weather.';
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeather(lat, lon);
        },
        handleLocationError
    );
} else {
    document.getElementById('weather-info').innerHTML = 'Geolocation is not supported by this browser.';
}

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

const events = [
    { date: '2025-01-20', title: "Trump's Inauguration", time: '12:00 PM', description: 'Donald Trump takes office' },
    { date: '2025-02-27', title: "Bus Army Dude's Birthday", time: '3:00 AM', description: "Bus Army Dude's 20th Birthday" },
    { date: '2025-04-05', title: 'TikTok Ban Decision', time: 'TBD', description: 'Discussion wether TikTok gets banned or it stays in the US' }
];

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Function to load the calendar grid
function loadCalendar() {
    const monthYearDisplay = document.getElementById("month-year");
    monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    const calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = ''; // Clear previous grid content

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Get the first day of the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get the number of days in the month

    // Create empty grid cells before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement("div");
        calendarGrid.appendChild(emptyCell);
    }

    // Create day cells with numbers and event indicators
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("calendar-day");
        dayCell.textContent = day;

        // Check if there's an event on this day
        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const event = events.find(event => event.date === dateStr);
        
        if (event) {
            const eventIndicator = document.createElement("div");
            eventIndicator.classList.add("event-indicator");
            dayCell.appendChild(eventIndicator);
            dayCell.addEventListener("click", () => showEventDetails(event));
        }

        calendarGrid.appendChild(dayCell);
    }
}

// Function to show event details in a modal
function showEventDetails(event) {
    document.getElementById("event-title").textContent = event.title;
    document.getElementById("event-time").textContent = `Time: ${event.time}`;
    document.getElementById("event-description").textContent = event.description;
    document.getElementById("event-modal").style.display = "flex";
}

// Function to close the event modal
function closeModal() {
    document.getElementById("event-modal").style.display = "none";
}

// Navigation to previous month
document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    loadCalendar();
});

// Navigation to next month
document.getElementById("next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadCalendar();
});

// Initialize calendar on page load
window.onload = loadCalendar;

