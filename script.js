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

    // TikTok Shoutouts
    const tiktokShoutouts = {
        accounts: [
            { username: 'mrbeast', isVerified: true, followers: '107.7M', nickname: 'MrBeast', bio: 'GO WATCH MY NEW SHOW', profilePic: 'images/mrbeast.jpeg' },     
            { username: 'teamtrump', isVerified: true, followers: '8.4M', nickname: 'Team Trump', bio: 'The official TikTok page for the Trump Campaign', profilePic: 'images/teamtrump.jpeg' },
            { username: 'carterpcs', isVerified: true, followers: '5.6M', nickname: 'Carterpcs', bio: 'Making Tech Less Of A Snoozefest, LA', profilePic: 'images/carterpcs.jpeg' },
            { username: 'applesauceandadhd', isVerified: true, followers: '3.6M', nickname: 'Jess|Aggressive Tutorials', bio: 'Surviving Not Thriving, TeamJessSecrest@Gersh.com', profilePic: 'images/applesauceandadhd.jpeg' },
            { username: 'houseofhughes_', isVerified: false, followers: '305.5K', nickname: 'Rachel Hughes', bio: 'houseofhughes@thestation.io, Cerebral Palsy Mama, 20% OFF BUCKED UP: RACHELHUGHES', profilePic: 'images/houseofhughes.jpeg' },
            { username: 'lust_ryze', isVerified: false, followers: '11.4K', nickname: 'Ryze', bio: 'Google pixel,Samsung, Apple Owner, Other social links bellow', profilePic: 'images/lust_ryze.jpeg' },
            { username: 'lust__ryze', isVerified: false, followers: '1,038', nickname: 'Ryze', bio: 'Google pixel,Samsung, Apple Owner, Spam likes=Blocked', profilePic: 'images/lust_ryze.jpeg' },
            { username: 'busarmydude', isVerified: false, followers: '1,238', nickname: 'Bus Army Dude', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology', profilePic: 'images/busarmydude.jpg' },
            { username: 'raisingramsey2023', isVerified: false, followers: '1,155', nickname: 'RaisingRamsey2023', bio: 'The Adventures of Raising Ramsey. Come along as we watch Ramsey Play and Learn', profilePic: 'images/raisingramsey2023.jpeg' },
            { username: 'jerridc4', isVerified: false, followers: '417', nickname: 'Jerrid Cook', bio: '@raisingramsey2023, @benz.the beard', profilePic: 'images/jerridc4.jpeg' },
            { username: 'jerridonthelot', isVerified: false, followers: '120', nickname: 'Jerrid on the Lot', bio: 'Your friendly neighborhood Car Salesman and Boy Dad', profilePic: 'images/jerridonthelot.jpeg' },
            { username: 'imparkerburton', isVerified: false, followers: '2.8M', nickname: 'Parker Burton', bio: 'That Android Guy, Business: parker@imparkerburton.com', profilePic: 'images/imparkerburton.jpeg' },
            { username: 'kaylee_mertens_', isVerified: false, followers: '673.5K', nickname: 'Kaylee Mertens|Dancing Baby', bio: 'Just a mom who loves her baby boy 💙,📍Wisconsin, KayleeMertens.collabs@gmail.com', profilePic: 'images/kayleemertens.jpeg' },
            { username: 'kennedylawfirm', isVerified: false, followers: '1.9M', nickname: 'Lawyer Kevin Kennedy', bio: "The Kennedy Law Firm, PLLC, Clarksville, TN, Kev's got you covered™️", profilePic: 'images/kennedylawfirm.jpeg' },
            { username: 'meetmeinthemediacenter', isVerified: true, followers: '685.2K', nickname: 'Meet Me In The Media Center', bio: '✌🏻❤️&ToastyBooks, 📚Middle School Librarian, 💌 meetmeinthemediacenter@gmail.com', profilePic: 'images/meetmeinthemediacenter.jpeg' },
            { username: 'missfoxy0142', isVerified: false, followers: '24', nickname: 'miss_foxy142', bio: 'No bio yet.', profilePic: 'images/missfoxy0142.jpeg' },
            { username: 'mrfatcheeto', isVerified: false, followers: '465.5K', nickname: 'Mr Fat Cheeto', bio: 'OH YEAH!', profilePic: 'images/mrfatcheeto.jpeg' },
            { username: 'playing.with.litt', isVerified: false, followers: '83', nickname: 'dylanmancini1', bio: 'Hey everyone class of 27 16 years old', profilePic: 'images/playing.with.litt.jpeg' },
            { username: '_jano_142_', isVerified: false, followers: '100', nickname: 'Jano_142', bio: "I'm a guy who loves cars... Want to support my passion? My Cashapp is @Jano142", profilePic: 'images/jano142.jpeg' },
            { username: 'elvirablack8', isVerified: false, followers: '972', nickname: 'elvirablack8', bio: 'I love my friends and my family all so much even my followers', profilePic: 'images/elvirablack8.jpeg' },
            { username: 'badge502', isVerified: false, followers: '800K', nickname: 'Badge502', bio: 'NREMT - 911/EMD PO Box 775 Belleville, NJ 07109 *I DONT HAVE A BACKUP ACCOUNT*', profilePic: 'images/badge502.jpeg' },
            { username: 'badge5022', isVerified: false, followers: '15.8K', nickname: 'Badge502', bio: 'Backup Account', profilePic: 'images/badge5022.jpeg' },
            { username: 'aggressiveafterdark', isVerified: false, followers: '308.4K', nickname: 'ApplesauceandADHD_AfterDark', bio: "Shhhhhhh. It's a secret@Jess|Aggressive Tutorials Official Back-Up", profilePic: 'images/aggressiveafterdark.jpeg' },
            { username: 'souldragon912', isVerified: false, followers: '81', nickname: 'Soul Dragon', bio: "I'm in Network Security. i play Höfner club bass and love 80s rock. 18", profilePic: 'images/souldragon912.jpeg' },
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
        { username: 'riverkritzar', isVerified: false, followers: '82', nickname: 'River Jordan Kritzar', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/riverkritzar.jpg' },
        { username: 'busarmydude', isVerified: false, followers: '3', nickname: 'Bus Army Dude', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/busarmydude.jpg' },
        { username: 'rose_the_fox24', isVerified: false, followers: '81', nickname: 'Rose Haydu', bio: 'I’m 19, Drp/rp open, I’m taken by the love of my life @_jano_142_ 💜3/1/24💜', profilePic: 'instagram_photos/rosethefox24.jpg' },
        { username: '_jano_142_', isVerified: false, followers: '47', nickname: 'Nathan Haydu', bio: 'Cars are love, cars are life. Taken by @rose_the_fox24 ❤️(3/1/24)❤️#bncr33gtr:Best Skyline/🔰Dream car🚗#c7zr1:Last TRUE Vette/🇺🇸Dream car🏎', profilePic: 'instagram_photos/jano142.jpg' },    
        { username: 'mrbeast', isVerified: true, followers: '64.5M', nickname: 'MrBeast', bio: 'My New Show Beast Games is out now on Prime Video!', profilePic: 'instagram_photos/mrbeast.jpg' },    
        { username: 'applesauceandadhd', isVerified: true, followers: '545K', nickname: 'Jessica', bio: 'TeamJessSecrest@Gersh.com', profilePic: 'instagram_photos/applesauceandadhd.jpeg' },    
        { username: 'emtbadge502', isVerified: true, followers: '464K', nickname: 'Anthony Christian', bio: 'P.O. Box 775, Belleville, NJ 07109, EMT - 911/ EMD - CPR Instructor - Content Creator, Work Hard. Be Kind Always.', profilePic: 'instagram_photos/emtbadge502.jpg' },    
        { username: 'kaylee_mertens_', isVerified: false, followers: '783', nickname: 'Kaylee Mertens', bio: 'Tik Tok: Kaylee_Mertens_', profilePic: 'instagram_photos/kayleemertens.jpeg' },    
        { username: 'meetmeinthemediacenter', isVerified: true, followers: '16.9K', nickname: 'Jen Miller', bio: '✌🏻❤️&Toasty📚 680K on TikTok ✨Book Return Game 🫶🏻Middle School Librarian', profilePic: 'instagram_photos/meetmeinthemediacenter.jpeg' },    
        { username: 'mrfattcheeto', isVerified: true, followers: '236K', nickname: 'Trent Parker', bio: "I'm like some HVAC Genius", profilePic: 'instagram_photos/mrfatcheeto.jpeg' },    
        // Add more Instagram creators as needed
    ],
    lastUpdatedTime: '2025-01-08T18:49:36', // Manually set the last updated date and time
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
        { username: '@MrBeast', isVerified: true, subscribers: '342M', nickname: 'MrBeast', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames SUBSCRIBE FOR A COOKIE!', profilePic: 'youtube_photoes/mrbeast.jpg' },
        { username: '@BeastReacts', isVerified: true, subscribers: '35.2M', nickname: 'Beast Reacts', bio: 'SUBSCRIBE FOR A COOKIE', profilePic: 'youtube_photoes/beastreacts.jpg' },
        { username: '@MrBeastGaming', isVerified: true, subscribers: '46.3M', nickname: 'MrBeast Gaming', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames MrBeast Gaming - SUBSCRIBE OR ELSE', profilePic: 'youtube_photoes/mrbeastgaming.jpg' },
        { username: '@MrBeast2', isVerified: true, subscribers: '48.2M', nickname: 'MrBeast 2', bio: 'my second channel for other videos and shorts :) subscribe ', profilePic: 'youtube_photoes/mrbeast2.jpg' },
        { username: '@BeastPhilanthropy', isVerified: true, subscribers: '27.1M', nickname: 'Beast Philanthropy', bio: '100% of the profits from my ad revenue, merch sales, and sponsorships will go towards making the world a better place!', profilePic: 'youtube_photoes/beastphilanthropy.jpg' },
        { username: '@mrfatcheeto', isVerified: false, subscribers: '88.7K', nickname: 'Mr Fat Cheeto', bio: 'I’m like a HVAC Genius. Come join me on my crazy HVAC Comedy adventures ', profilePic: 'youtube_photoes/mrfatcheeto.jpg' },
        { username: '@Badge502', isVerified: false, subscribers: '55.8K', nickname: 'Badge502', bio: 'Your local EMT!', profilePic: 'youtube_photoes/badge502.jpg' },     
        // Add more YouTube creators as needed
    ],
    lastUpdatedTime: '2025-01-08T18:51:46', // Manually set the last updated date and time
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
const lastUpdatedDate = "Wed, Jan 8, 2025";  // Set the date here (Day of the Week, Month, Day, Year)
const lastUpdatedTime = "6:42 PM";    // Set the time here (12-hour format)

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

// Array of facts (populated with 365 facts)
const facts = [
  "January 1, 1801 - The United Kingdom of Great Britain and Ireland is established.",
  "January 2, 1492 - The Moors are driven out of Spain with the fall of Granada.",
  "January 3, 1959 - Alaska is admitted as the 49th state of the United States.",
  "January 4, 1999 - The euro becomes the official currency of 11 European Union countries.",
  "January 5, 1993 - The Intel Corporation produces its first microprocessor, the 4004.",
  "January 6, 1941 - Franklin D. Roosevelt delivers the Four Freedoms speech.",
  "January 7, 1927 - The first transatlantic telephone call is placed from London to New York.",
  "January 8, 1815 - The Battle of New Orleans takes place, the final battle of the War of 1812.",
  "January 9, 2007 - Apple Inc. announces the first iPhone.",
  "January 10, 1863 - The first underground railway opens in London.",
  "January 11, 1908 - The first movie to be shown in the White House is shown by President Theodore Roosevelt.",
  "January 12, 1966 - The Soviet Union launches Luna 9, the first spacecraft to land on the Moon.",
  "January 13, 1942 - The first US Army Ranger Battalion is activated.",
  "January 14, 1952 - The first color television broadcasts are transmitted by CBS.",
  "January 15, 1967 - The first Super Bowl is played.",
  "January 16, 1991 - The Gulf War begins with the start of Operation Desert Storm.",
  "January 17, 1995 - The Great Hanshin Earthquake occurs in Japan, killing over 6,000 people.",
  "January 18, 1936 - King George V dies, and King Edward VIII ascends the British throne.",
  "January 19, 1966 - Indira Gandhi is elected as the first female Prime Minister of India.",
  "January 20, 1981 - The United States and Iran sign an agreement to release 52 American hostages.",
  "January 21, 1990 - The first McDonald’s restaurant opens in Moscow, Russia.",
  "January 22, 1973 - The US Supreme Court issues its landmark decision in Roe v. Wade, legalizing abortion.",
  "January 23, 1977 - The first Star Wars movie is released worldwide.",
  "January 24, 1965 - Winston Churchill dies at the age of 90.",
  "January 25, 1971 - The US announces the end of military involvement in Vietnam.",
  "January 26, 1950 - India becomes a republic, with Dr. Rajendra Prasad as its first president.",
  "January 27, 1945 - The Auschwitz concentration camp is liberated by Soviet forces.",
  "January 28, 1986 - The Space Shuttle Challenger disaster occurs, killing seven astronauts.",
  "January 29, 1979 - The Iranian Revolution reaches its peak with the overthrow of the Shah.",
  "January 30, 1948 - Mahatma Gandhi is assassinated in New Delhi, India.",
  "January 31, 1961 - Ham the Chimp becomes the first hominid to be launched into space."
  "February 1, 1960 - The first lunch counter sit-in occurs in Greensboro, North Carolina.",
  "February 2, 1848 - The Treaty of Guadalupe Hidalgo is signed, ending the Mexican-American War.",
  "February 3, 1959 - Buddy Holly, Ritchie Valens, and The Big Bopper are killed in a plane crash.",
  "February 4, 1945 - The Yalta Conference begins between Winston Churchill, Franklin D. Roosevelt, and Joseph Stalin.",
  "February 5, 1994 - The first-ever baseball strike in Major League Baseball history is initiated.",
  "February 6, 1952 - Princess Elizabeth becomes Queen Elizabeth II following the death of her father, King George VI.",
  "February 7, 1964 - The Beatles arrive in the United States for the first time.",
  "February 8, 1960 - The first US satellite is launched into orbit.",
  "February 9, 1964 - The Beatles make their first appearance on The Ed Sullivan Show.",
  "February 10, 1996 - The first version of the game Pokémon is released in Japan.",
  "February 11, 1990 - Nelson Mandela is released from prison after 27 years.",
  "February 12, 1993 - The Intel Corporation releases the Pentium microprocessor.",
  "February 13, 2013 - The resignation of Pope Benedict XVI is announced.",
  "February 14, 1929 - The St. Valentine’s Day Massacre takes place in Chicago.",
  "February 15, 1961 - A plane carrying the entire US figure skating team crashes in Belgium.",
  "February 16, 1987 - The 12th Annual Grammy Awards take place in Los Angeles.",
  "February 17, 1972 - The Watergate scandal begins with a break-in at the Democratic National Committee headquarters.",
  "February 18, 1930 - The planet Pluto is discovered by Clyde Tombaugh.",
  "February 19, 1942 - The United States begins internment of Japanese Americans during World War II.",
  "February 20, 1967 - The first human heart transplant is performed by Dr. Christiaan Barnard in South Africa.",
  "February 21, 1947 - The first television demonstration of color broadcasts is made in the United States.",
  "February 22, 1959 - The first Barbie doll is introduced by Mattel.",
  "February 23, 1965 - Malcolm X is assassinated in New York City.",
  "February 24, 1980 - The US boycotts the Moscow Summer Olympics in protest of the Soviet invasion of Afghanistan.",
  "February 25, 1991 - The Gulf War ends with a ceasefire after 42 days of conflict.",
  "February 26, 1971 - The first United States space station, Skylab, is launched into orbit.",
  "February 27, 1936 - The first Lego sets are introduced in Denmark.",
  "February 28, 1994 - The film 'Forrest Gump' wins six Academy Awards, including Best Picture.",
  "March 1, 1971 - A bomb is detonated at the United States Capitol Building in Washington D.C.",
  "March 2, 1967 - The first Super Bowl halftime show is held.",
  "March 3, 1995 - The first fully electronic trading day is held on the New York Stock Exchange.",
  "March 4, 1913 - The Women's Suffrage March takes place in Washington D.C.",
  "March 5, 1963 - The Hula Hoop becomes the craze in America.",
  "March 6, 1967 - The Soviet Union launches the Venera 4 spacecraft, which enters the atmosphere of Venus.",
  "March 7, 1965 - The first March on Selma takes place, demanding voting rights for African Americans.",
  "March 8, 1983 - US President Ronald Reagan calls the Soviet Union an 'evil empire.'",
  "March 9, 1977 - The United States and China begin formal diplomatic relations.",
  "March 10, 1964 - The United States begins bombing North Vietnam in Operation Rolling Thunder.",
  "March 11, 1985 - Mikhail Gorbachev is named General Secretary of the Communist Party of the Soviet Union.",
  "March 12, 1990 - Lithuania declares independence from the Soviet Union.",
  "March 13, 1964 - Kitty Genovese is murdered in New York City, prompting the bystander effect to be studied.",
  "March 14, 1997 - The first DVD is released in the United States.",
  "March 15, 1965 - President Lyndon B. Johnson addresses Congress to call for the passage of the Voting Rights Act.",
  "March 16, 1968 - The My Lai Massacre occurs during the Vietnam War.",
  "March 17, 1973 - The Watergate scandal takes a new turn with the discovery of the existence of the secret White House tapes.",
  "March 18, 1965 - Cosmonaut Alexei Leonov performs the first spacewalk outside a spacecraft.",
  "March 19, 1989 - The Exxon Valdez oil spill occurs in Alaska, becoming one of the worst environmental disasters in US history.",
  "March 20, 1990 - The World Wide Web is introduced to the public for the first time.",
  "March 21, 1963 - Alcatraz Federal Penitentiary is officially closed after 29 years of operation.",
  "March 22, 1997 - Tara Lipinski becomes the youngest woman to win a World Figure Skating Championship.",
  "March 23, 1965 - The first US combat troops are sent to Vietnam.",
  "March 24, 1989 - The largest oil spill in US history, the Exxon Valdez disaster, occurs.",
  "March 25, 1911 - The Triangle Shirtwaist Factory fire occurs in New York City, killing 146 workers.",
  "March 26, 1979 - The Camp David Accords are signed between Egypt and Israel.",
  "March 27, 1964 - The Great Alaska Earthquake strikes, causing widespread damage and killing over 100 people.",
  "March 28, 1963 - Alfred Hitchcock’s iconic thriller *The Birds* premieres in London.",
  "March 29, 1974 - The United States begins to withdraw troops from Vietnam.",
  "March 30, 1981 - US President Ronald Reagan is shot by John Hinckley Jr. outside a Washington hotel.",
  "March 31, 1968 - President Lyndon B. Johnson announces he will not seek re-election.",
  "April 1, 1987 - The World Health Organization reports the first case of AIDS in China.",
  "April 2, 1917 - The United States enters World War I as President Woodrow Wilson asks Congress to declare war on Germany.",
  "April 3, 1973 - The first portable cell phone call is made by Martin Cooper of Motorola.",
  "April 4, 1968 - Civil rights leader Dr. Martin Luther King Jr. is assassinated in Memphis, Tennessee.",
  "April 5, 1994 - Kurt Cobain, lead singer of Nirvana, is found dead of suicide in his Seattle home.",
  "April 6, 1917 - The United States declares war on Germany, entering World War I.",
  "April 7, 1948 - The World Health Organization (WHO) is established.",
  "April 8, 1974 - Hank Aaron hits his 715th home run, breaking Babe Ruth's record.",
  "April 9, 1940 - Germany invades Denmark and Norway during World War II.",
  "April 10, 1912 - The RMS Titanic sets sail on its maiden voyage.",
  "April 11, 1968 - President Lyndon B. Johnson signs the Civil Rights Act of 1968 into law.",
  "April 12, 1961 - Yuri Gagarin, a Soviet cosmonaut, becomes the first human to journey into outer space.",
  "April 13, 1970 - Apollo 13 astronauts are forced to abort their mission due to a malfunction.",
  "April 14, 1912 - The RMS Titanic strikes an iceberg and begins sinking.",
  "April 15, 1912 - The RMS Titanic sinks, resulting in the deaths of over 1,500 people.",
  "April 16, 1963 - Dr. Martin Luther King Jr. writes his famous 'Letter from Birmingham Jail.'",
  "April 17, 1975 - The Khmer Rouge take control of Cambodia, beginning the Cambodian genocide.",
  "April 18, 1906 - The San Francisco earthquake strikes, devastating the city and killing thousands.",
  "April 19, 1995 - The Oklahoma City bombing occurs, resulting in the deaths of 168 people.",
  "April 20, 1999 - The Columbine High School shooting occurs, killing 13 people.",
  "April 21, 1926 - Queen Elizabeth II is born in London.",
  "April 22, 1970 - The first Earth Day is celebrated in the United States.",
  "April 23, 1616 - William Shakespeare dies on the same day as Miguel de Cervantes.",
  "April 24, 1980 - The US military attempts a rescue mission for American hostages in Iran, which fails.",
  "April 25, 1953 - James Watson and Francis Crick publish their model of the DNA double helix.",
  "April 26, 1986 - The Chernobyl nuclear disaster occurs in the Soviet Union.",
  "April 27, 1994 - South Africa holds its first multiracial elections, electing Nelson Mandela as president.",
  "April 28, 1967 - Boxer Muhammad Ali refuses to be drafted into the military, citing his religious beliefs.",
  "April 29, 1975 - The Vietnam War ends as Saigon falls to North Vietnamese forces.",
  "April 30, 1945 - Adolf Hitler commits suicide in his Berlin bunker as Soviet forces close in on the city.",
  "May 1, 1886 - The first May Day labor strike is held in Chicago, advocating for an eight-hour workday.",
  "May 2, 1998 - The Asian financial crisis begins in Indonesia, leading to widespread unrest.",
  "May 3, 1979 - Margaret Thatcher becomes the first female Prime Minister of the United Kingdom.",
  "May 4, 1970 - The Kent State shooting occurs during a student protest against the Vietnam War.",
  "May 5, 1961 - Alan Shepard becomes the first American in space, completing a suborbital flight.",
  "May 6, 1954 - Roger Bannister becomes the first person to run a mile in under 4 minutes.",
  "May 7, 1915 - The Lusitania, a British ocean liner, is sunk by a German U-boat, killing 1,198 people.",
  "May 8, 1945 - VE Day (Victory in Europe Day) is celebrated, marking the end of World War II in Europe.",
  "May 9, 1960 - The United States Food and Drug Administration approves the first birth control pill.",
  "May 10, 1994 - Nelson Mandela is inaugurated as the first black president of South Africa.",
  "May 11, 1947 - The first Volkswagen Beetle is sold in the United States.",
  "May 12, 1963 - Alfred Hitchcock's movie *The Birds* premieres.",
  "May 13, 1981 - Pope John Paul II is shot and wounded by a gunman in St. Peter’s Square in Vatican City.",
  "May 14, 1948 - The state of Israel is declared, leading to the first Arab-Israeli war.",
  "May 15, 1951 - The first modern Olympics are held in Switzerland.",
  "May 16, 1966 - The Cultural Revolution begins in China, launched by Chairman Mao Zedong.",
  "May 17, 1954 - The US Supreme Court delivers its ruling in Brown v. Board of Education, declaring racial segregation in public schools unconstitutional.",
  "May 18, 1980 - Mount St. Helens erupts in Washington state, causing massive destruction.",
  "May 19, 1962 - Marilyn Monroe sings 'Happy Birthday' to President John F. Kennedy at his birthday party.",
  "May 20, 1927 - Charles Lindbergh completes the first solo nonstop transatlantic flight.",
  "May 21, 1998 - Indonesian President Suharto resigns after 31 years in power.",
  "May 22, 1960 - The strongest earthquake in recorded history, a magnitude 9.5 quake, strikes Chile.",
  "May 23, 1984 - The Apple Macintosh computer is introduced.",
  "May 24, 1991 - The European Union is formally established.",
  "May 25, 1963 - The Organization of African Unity is established.",
  "May 26, 1986 - The Chernobyl nuclear disaster becomes the largest environmental disaster in history.",
  "May 27, 1992 - The United States begins its military involvement in the Bosnian War.",
  "May 28, 1996 - The first official web browser, Netscape Navigator, is launched.",
  "May 29, 1953 - Sir Edmund Hillary and Tenzing Norgay become the first climbers to reach the summit of Mount Everest.",
  "May 30, 1967 - The Nigerian Civil War begins.",
  "May 31, 1998 - The first iMac computer is released by Apple.",
  "June 1, 1967 - The Beatles release *Sgt. Pepper’s Lonely Hearts Club Band.*",
  "June 2, 1953 - Queen Elizabeth II is crowned in Westminster Abbey.",
  "June 3, 1965 - Astronaut Edward White becomes the first American to conduct a spacewalk.",
  "June 4, 1989 - The Tiananmen Square massacre occurs in Beijing, China.",
  "June 5, 1947 - The Marshall Plan is announced to aid the reconstruction of Europe after World War II.",
  "June 6, 1944 - D-Day, the Allied invasion of Normandy, takes place during World War II.",
  "June 7, 1940 - The first Battle of Britain begins, marking a significant aerial conflict during World War II.",
  "June 8, 1972 - The famous 'Napalm Girl' photograph is taken during the Vietnam War.",
  "June 9, 1991 - Boris Yeltsin becomes the first freely elected president of Russia.",
  "June 10, 1967 - The Six-Day War between Israel and several Arab states ends.",
  "June 11, 1963 - Alabama Governor George Wallace attempts to block the integration of the University of Alabama.",
  "June 12, 1987 - President Ronald Reagan delivers his famous 'Mr. Gorbachev, tear down this wall!' speech.",
  "June 13, 1983 - The first American woman, Sally Ride, goes into space.",
  "June 14, 1777 - The Continental Congress adopts the Stars and Stripes as the flag of the United States.",
  "June 15, 1215 - King John of England signs the Magna Carta.",
  "June 16, 1963 - Valentina Tereshkova becomes the first woman in space.",
  "June 17, 1994 - O.J. Simpson is involved in a famous low-speed car chase in Los Angeles.",
  "June 18, 1812 - The United States declares war on Great Britain, starting the War of 1812.",
  "June 19, 1865 - The Emancipation Proclamation is officially enforced in Texas, freeing the last slaves in the United States.",
  "June 20, 1989 - The Tiananmen Square protests end with the Chinese government declaring martial law.",
  "June 21, 1964 - Three civil rights workers are murdered in Mississippi.",
  "June 22, 1941 - Germany invades the Soviet Union during World War II.",
  "June 23, 1991 - The Soviet Union launches a coup attempt against Mikhail Gorbachev.",
  "June 24, 2002 - The United States begins bombing Afghanistan in retaliation for the 9/11 attacks.",
  "June 25, 1950 - The Korean War begins as North Korean troops invade South Korea.",
  "June 26, 1976 - The U.S. celebrates its bicentennial with a nationwide series of events.",
  "June 27, 1995 - The United States begins using military drones for surveillance.",
  "June 28, 1919 - The Treaty of Versailles is signed, officially ending World War I.",
  "June 29, 1986 - The Chernobyl disaster officially ends with the containment of the reactor.",
  "June 30, 1991 - The Soviet Union officially ceases to exist as a superpower.",
  "July 1, 1967 - The first automatic teller machine (ATM) is installed in the United Kingdom.",
  "July 2, 1937 - Amelia Earhart disappears over the Pacific Ocean while attempting to circumnavigate the globe.",
  "July 3, 1985 - The Live Aid concert is held to raise funds for famine relief in Ethiopia.",
  "July 4, 1776 - The Declaration of Independence is signed by the Continental Congress.",
  "July 5, 1946 - The bikini swimsuit is introduced by designer Louis Réard.",
  "July 6, 1944 - The Ringling Brothers Circus fire in Hartford, Connecticut, kills 168 people.",
  "July 7, 2005 - London is attacked in a series of bombings on the subway and buses.",
  "July 8, 1947 - A UFO crash is reported near Roswell, New Mexico.",
  "July 9, 1979 - The first successful space station, Salyut 7, is launched by the Soviet Union.",
  "July 10, 1913 - The first woman, Alice Ramsey, drives across the United States.",
  "July 11, 1995 - The Bosnian War culminates in the Srebrenica massacre, where over 8,000 people are killed.",
  "July 12, 1962 - The Rolling Stones play their first gig at the Marquee Club in London.",
  "July 13, 1985 - Live Aid, the largest music concert for charity, takes place simultaneously in London and Philadelphia.",
  "July 14, 1789 - The French Revolution begins with the storming of the Bastille.",
  "July 15, 1948 - The National Health Service (NHS) is established in the United Kingdom.",
  "July 16, 1999 - John F. Kennedy Jr. dies in a plane crash off the coast of Martha's Vineyard.",
  "July 17, 1955 - Disneyland opens in Anaheim, California.",
  "July 18, 1947 - The Indian Independence Act grants independence to India and Pakistan.",
  "July 19, 1848 - The Seneca Falls Convention, the first women’s rights convention, is held in New York.",
  "July 20, 1969 - Apollo 11 astronauts Neil Armstrong and Buzz Aldrin land on the moon.",
  "July 21, 1969 - Neil Armstrong becomes the first person to walk on the Moon.",
  "July 22, 1933 - Wiley Post becomes the first person to fly solo around the world.",
  "July 23, 1952 - The Egyptian Revolution takes place, ending the monarchy and establishing a republic.",
  "July 24, 1915 - The Lusitania sinking trial begins, with the German U-boat's involvement questioned.",
  "July 25, 1965 - The Beatles’ *Help!* film is released in the United States.",
  "July 26, 1956 - Egyptian president Gamal Abdel Nasser nationalizes the Suez Canal.",
  "July 27, 1972 - The Munich Olympics massacre occurs, with Palestinian terrorists taking 11 Israeli athletes hostage.",
  "July 28, 1914 - Austria-Hungary declares war on Serbia, starting World War I.",
  "July 29, 1976 - The Tangshan earthquake occurs in China, killing over 242,000 people.",
  "July 30, 1945 - The USS Indianapolis is sunk by a Japanese submarine, leading to the loss of 880 sailors.",
  "July 31, 1991 - The Soviet Union and the United States sign the Strategic Arms Reduction Treaty (START I).",
  "August 1, 1981 - MTV (Music Television) is launched in the United States.",
  "August 2, 1989 - The Tiananmen Square protests end with a violent military crackdown.",
  "August 3, 1960 - The United States launches its first weather satellite.",
  "August 4, 1961 - Barack Obama, 44th president of the United States, is born.",
  "August 5, 1962 - Marilyn Monroe dies of an apparent overdose.",
  "August 6, 1945 - The United States drops the atomic bomb on Hiroshima, Japan.",
  "August 7, 1974 - Philippe Petit walks a tightrope between the World Trade Center towers.",
  "August 8, 1969 - The Beatles’ *Abbey Road* album is released.",
  "August 9, 1974 - Richard Nixon resigns from the presidency following the Watergate scandal.",
  "August 10, 1999 - John F. Kennedy Jr. dies in a plane crash in the Atlantic Ocean.",
  "August 11, 1965 - The Watts Riots erupt in Los Angeles.",
  "August 12, 1961 - The Berlin Wall is constructed to separate East and West Berlin.",
  "August 13, 1961 - The Berlin Wall is erected by East Germany.",
  "August 14, 1945 - Japan surrenders, marking the end of World War II.",
  "August 15, 1969 - The Woodstock Music & Art Fair begins in Bethel, New York.",
  "August 16, 1977 - Elvis Presley dies at his Graceland home in Memphis.",
  "August 17, 1969 - The Woodstock Music Festival ends after 3 days of peace and music.",
  "August 18, 1920 - The 19th Amendment is ratified, granting women the right to vote in the United States.",
  "August 19, 1964 - The Beatles release *A Hard Day's Night*.",
  "August 20, 1998 - The United States launches airstrikes on Afghanistan and Sudan in response to terrorist attacks.",
  "August 21, 1991 - The Soviet Union attempts a coup against Mikhail Gorbachev.",
  "August 22, 1989 - The Exxon Valdez oil spill occurs, releasing millions of gallons of crude oil into Alaska's Prince William Sound.",
  "August 23, 1968 - The Democratic National Convention takes place in Chicago, leading to protests.",
  "August 24, 1814 - British forces burn Washington, D.C. during the War of 1812.",
  "August 25, 1957 - The Soviet Union tests its first intercontinental ballistic missile (ICBM).",
  "August 26, 1978 - Cardinal Albino Luciani is elected pope, taking the name Pope John Paul I.",
  "August 27, 1979 - The IRA kills Lord Mountbatten, a prominent member of the British royal family.",
  "August 28, 1963 - Dr. Martin Luther King Jr. delivers his famous 'I Have a Dream' speech.",
  "August 29, 1958 - The first successful rock and roll concert is held at the Newport Jazz Festival.",
  "August 30, 1967 - Thurgood Marshall is confirmed as the first African American Supreme Court Justice.",
  "September 1, 1939 - Germany invades Poland, starting World War II.",
  "September 2, 1969 - The first episode of *Sesame Street* airs on PBS.",
  "September 3, 1967 - Sweden switches from driving on the left to driving on the right.",
  "September 4, 1957 - The Little Rock Nine, a group of African-American students, integrate Central High School in Arkansas.",
  "September 5, 1972 - The Munich Olympics massacre occurs, with the deaths of 11 Israeli athletes.",
  "September 6, 1901 - US President William McKinley is shot by anarchist Leon Czolgosz.",
  "September 7, 2001 - The United States records its highest-ever stock market losses as a result of 9/11 terrorist attacks.",
  "September 8, 1974 - President Gerald Ford pardons Richard Nixon for his involvement in the Watergate scandal.",
  "September 9, 1982 - The first compact disc (CD) is produced in Germany.",
  "September 10, 1947 - The United Nations formally adopts the Universal Declaration of Human Rights.",
  "September 11, 2001 - The United States suffers terrorist attacks, marking the beginning of the War on Terror.",
  "September 12, 1962 - President John F. Kennedy delivers his famous 'We choose to go to the moon' speech.",
  "September 13, 1996 - Rapper Tupac Shakur is fatally shot in Las Vegas.",
  "September 14, 1982 - The Lebanon War begins.",
  "September 15, 1963 - The 16th Street Baptist Church bombing in Birmingham, Alabama, kills four African-American girls.",
  "September 16, 1968 - The first public demonstration of the computer mouse occurs at Stanford Research Institute.",
  "September 17, 1787 - The United States Constitution is signed.",
  "September 18, 1927 - The first jazz band recording is made in New York.",
  "September 19, 1970 - The Soviet Union launches the Venera 7 space probe to Venus.",
  "September 20, 1994 - The United States launches Operation Uphold Democracy in Haiti.",
  "September 21, 1972 - The Munich Olympics massacre begins, where 11 Israeli athletes are killed.",
  "September 22, 1962 - President John F. Kennedy delivers his speech on the Cuban Missile Crisis.",
  "September 23, 1962 - The first episode of *The Jetsons* airs on television.",
  "September 24, 1964 - The Ford Mustang is introduced at the New York World's Fair.",
  "September 25, 1991 - The Soviet Union dissolves, ending the Cold War.",
  "September 26, 1960 - The first televised presidential debate between John F. Kennedy and Richard Nixon is held.",
  "October 1, 1962 - The first James Bond movie, *Dr. No*, premieres.",
  "October 2, 1967 - Thurgood Marshall becomes the first African American to be appointed to the U.S. Supreme Court.",
  "October 3, 1995 - O.J. Simpson is acquitted of the murders of his ex-wife Nicole Brown Simpson and her friend Ron Goldman.",
  "October 4, 1957 - The Soviet Union launches Sputnik 1, the first artificial satellite.",
  "October 5, 1969 - The first episode of *Scooby-Doo, Where Are You!* airs.",
  "October 6, 1927 - *The Jazz Singer*, the first full-length talking motion picture, is released.",
  "October 7, 2001 - The United States launches Operation Enduring Freedom in Afghanistan.",
  "October 8, 1871 - The Great Chicago Fire begins, destroying much of the city.",
  "October 9, 1967 - Che Guevara, the famous Marxist revolutionary, is executed in Bolivia.",
  "October 10, 1973 - The Yom Kippur War begins between Israel and a coalition of Arab states.",
  "October 11, 1968 - The first episode of *The Brady Bunch* airs on television.",
  "October 12, 1999 - The Dow Jones Industrial Average hits a new record high.",
  "October 13, 1792 - The cornerstone of the White House is laid in Washington, D.C.",
  "October 14, 1964 - Dr. Martin Luther King Jr. is awarded the Nobel Peace Prize.",
  "October 15, 1951 - *I Love Lucy* airs its first episode on television.",
  "October 16, 1917 - Mata Hari, the famous exotic dancer and spy, is executed by the French for espionage.",
  "October 17, 1989 - The Loma Prieta earthquake strikes the San Francisco Bay Area.",
  "October 18, 1929 - The term "The Great Depression" is coined in the United States.",
  "October 19, 1987 - The U.S. stock market crashes in what is known as 'Black Monday.'",
  "October 20, 1973 - The United States faces the Oil Crisis, leading to gas shortages.",
  "October 21, 1944 - General Dwight D. Eisenhower takes command of the Allied forces in Europe during World War II.",
  "October 22, 1962 - The Cuban Missile Crisis begins, with the U.S. discovering Soviet missiles in Cuba.",
  "October 23, 1995 - The Million Man March takes place in Washington, D.C.",
  "October 24, 1945 - The United Nations is founded, following the end of World War II.",
  "October 25, 1962 - The U.S. begins a naval blockade around Cuba during the Cuban Missile Crisis.",
  "October 26, 1979 - U.S. Embassy in Iran is seized during the Iranian Revolution.",
  "October 27, 1962 - The Cuban Missile Crisis comes to a close after tense negotiations between the U.S. and the Soviet Union.",
  "October 28, 1965 - The Gateway Arch in St. Louis is completed.",
  "October 29, 1929 - The Great Depression begins with the Wall Street Crash.",
  "October 30, 1938 - Orson Welles' radio broadcast of *The War of the Worlds* causes mass panic.",
  "October 31, 1517 - Martin Luther nails his 95 Theses to the church door, marking the beginning of the Protestant Reformation.",  
  "November 1, 1952 - The United States successfully tests the first hydrogen bomb.",
  "November 2, 1983 - President Ronald Reagan signs a bill establishing Martin Luther King Jr. Day as a U.S. holiday.",
  "November 3, 1970 - The first jumbo jet, the Boeing 747, makes its first test flight.",
  "November 4, 1979 - The U.S. Embassy in Tehran is seized by Iranian militants.",
  "November 5, 1955 - Marty McFly, the protagonist of *Back to the Future*, travels back in time from this date.",
  "November 6, 1991 - The Soviet Union launches the world's first space station, Mir.",
  "November 7, 1916 - Jeannette Rankin becomes the first woman elected to the U.S. Congress.",
  "November 8, 1960 - John F. Kennedy is elected as the 35th president of the United States.",
  "November 9, 1989 - The Berlin Wall falls, marking the end of the Cold War.",
  "November 10, 1938 - Kristallnacht occurs in Nazi Germany, a series of anti-Jewish pogroms.",
  "November 11, 1918 - World War I ends with the signing of the Armistice.",
  "November 12, 1990 - The first World Wide Web browser, called *WorldWideWeb*, is created by Tim Berners-Lee.",
  "November 13, 1974 - The U.S. House Judiciary Committee begins impeachment hearings against President Richard Nixon.",
  "November 14, 1922 - The British Broadcasting Corporation (BBC) begins its first radio broadcasts.",
  "November 15, 2001 - The U.S. launches Operation Anaconda in Afghanistan.",
  "November 16, 1933 - The United States and the Soviet Union establish diplomatic relations.",
  "November 17, 1973 - President Nixon declares 'I am not a crook' in response to the Watergate scandal.",
  "November 18, 1978 - The Jonestown Massacre takes place in Guyana.",
  "November 19, 1863 - President Abraham Lincoln delivers the Gettysburg Address during the Civil War.",
  "November 20, 1945 - The Nuremberg Trials begin, prosecuting Nazi war criminals.",
  "November 21, 1963 - President John F. Kennedy is assassinated in Dallas, Texas.",
  "November 22, 1965 - *The Sound of Music* premieres in theaters.",
  "November 23, 1936 - The first modern color film, *The Adventures of Robin Hood*, is released.",
  "November 24, 1859 - Charles Darwin publishes *On the Origin of Species*.",
  "November 25, 1952 - Agatha Christie’s play *The Mousetrap* opens in London.",
  "November 26, 1965 - The first episode of *The Munsters* airs on TV.",
  "November 27, 1984 - The first test flight of the Space Shuttle Atlantis takes place.",
  "November 28, 1963 - President Lyndon B. Johnson is sworn in following Kennedy's assassination.",
  "November 29, 1947 - The United Nations votes to partition Palestine, leading to the creation of Israel.",
  "November 30, 1954 - A meteorite strikes a woman in Alabama, making it the only confirmed meteorite impact injury on record.",
  "December 1, 1955 - Rosa Parks refuses to give up her seat on a bus in Montgomery, Alabama.",
  "December 2, 1804 - Napoleon Bonaparte is crowned Emperor of France.",
  "December 3, 1967 - The first heart transplant is performed by Dr. Christiaan Barnard in South Africa.",
  "December 4, 1980 - John Lennon, former member of The Beatles, is assassinated in New York City.",
  "December 5, 1933 - The 21st Amendment to the U.S. Constitution is ratified, ending Prohibition.",
  "December 6, 1917 - The Halifax Explosion occurs, killing 2,000 people in Canada.",
  "December 7, 1941 - Japan attacks Pearl Harbor, prompting the United States' entry into World War II.",
  "December 8, 1980 - John Lennon is murdered outside his apartment in New York City.",
  "December 9, 1979 - The Soviet Union invades Afghanistan, starting a decade-long conflict.",
  "December 10, 1896 - Alfred Nobel, inventor of dynamite, dies and leaves his fortune to establish the Nobel Prizes.",
  "December 11, 1941 - Germany and Italy declare war on the United States, bringing the U.S. fully into World War II.",
  "December 12, 1913 - The first airplane flight across the United States takes place.",
  "December 13, 1989 - The Velvet Revolution in Czechoslovakia ends with the resignation of the communist leadership.",
  "December 14, 1799 - George Washington, the first President of the United States, dies.",
  "December 15, 1791 - The Bill of Rights is ratified in the United States.",
  "December 16, 1773 - The Boston Tea Party takes place in protest of British taxes.",
  "December 17, 1903 - The Wright brothers make the first powered flight in Kitty Hawk, North Carolina.",
  "December 18, 1865 - The 13th Amendment to the U.S. Constitution is ratified, abolishing slavery.",
  "December 19, 1961 - The first American astronaut, Alan Shepard, successfully travels in space.",
  "December 20, 1972 - The last Apollo mission, Apollo 17, lands on the moon.",
  "December 21, 1988 - Pan Am Flight 103 is bombed over Lockerbie, Scotland.",
  "December 22, 1989 - Romanian dictator Nicolae Ceaușescu is overthrown and executed.",
  "December 23, 1993 - The Oslo Accords, aimed at achieving peace between Israel and Palestine, are signed.",
  "December 24, 1914 - The Christmas Truce occurs on the Western Front during World War I.",
  "December 25, 1776 - George Washington crosses the Delaware River, leading to a victory at the Battle of Trenton.",
  "December 26, 2004 - A massive earthquake off the coast of Sumatra triggers a devastating tsunami in Southeast Asia.",
  "December 27, 1927 - The first movie with sound, *The Jazz Singer*, premieres in New York City.",
  "December 28, 1895 - The Lumière brothers present the first public film screening in Paris.",
  "December 29, 1845 - The United States annexes Texas, leading to the Mexican-American War.",
  "December 30, 2006 - Saddam Hussein, the former president of Iraq, is executed.",
  "December 31, 1999 - The world celebrates the turn of the millennium, welcoming the year 2000."
// Continue this list for all 365 days...
];


// Array of quotes (populated with 365 quotes)
const quotes = [
    "“The only way to do great work is to love what you do.” - Steve Jobs",
  "“It always seems impossible until it’s done.” - Nelson Mandela",
  "“You miss 100% of the shots you don’t take.” - Wayne Gretzky",
  "“In the end, we will remember not the words of our enemies, but the silence of our friends.” - Martin Luther King Jr.",
  "“The best way to predict the future is to create it.” - Abraham Lincoln",
  "“Life is what happens when you're busy making other plans.” - John Lennon",
  "“Get busy living or get busy dying.” - Stephen King",
  "“Success is not final, failure is not fatal: It is the courage to continue that counts.” - Winston Churchill",
  "“Believe you can and you're halfway there.” - Theodore Roosevelt",
  "“The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.” - Ralph Waldo Emerson",
  "“Life isn't about finding yourself. It's about creating yourself.” - George Bernard Shaw",
  "“What lies behind us and what lies before us are tiny matters compared to what lies within us.” - Ralph Waldo Emerson",
  "“It does not matter how slowly you go as long as you do not stop.” - Confucius",
  "“You must be the change you wish to see in the world.” - Mahatma Gandhi",
  "“Happiness depends upon ourselves.” - Aristotle",
  "“You can never plan the future by the past.” - Edmund Burke",
  "“Everything you can imagine is real.” - Pablo Picasso",
  "“Do one thing every day that scares you.” - Eleanor Roosevelt",
  "“What you get by achieving your goals is not as important as what you become by achieving your goals.” - Zig Ziglar",
  "“The only way to achieve the impossible is to believe it is possible.” - Charles Kingsleigh",
  "“Start where you are. Use what you have. Do what you can.” - Arthur Ashe",
  "“I am not a product of my circumstances. I am a product of my decisions.” - Stephen R. Covey",
  "“The best revenge is massive success.” - Frank Sinatra",
  "“The most common way people give up their power is by thinking they don't have any.” - Alice Walker",
  "“Strive not to be a success, but rather to be of value.” - Albert Einstein",
  "“I have not failed. I've just found 10,000 ways that won't work.” - Thomas Edison",
  "“The journey of a thousand miles begins with one step.” - Lao Tzu",
  "“You only live once, but if you do it right, once is enough.” - Mae West",
  "“Good things come to those who wait, but better things come to those who go out and get them.” - Anonymous",
  "“Don't count the days, make the days count.” - Muhammad Ali",
  "“You don’t have to be great to start, but you have to start to be great.” - Zig Ziglar",
  "“The harder you work for something, the greater you'll feel when you achieve it.” - Anonymous",
  "“Everything you've ever wanted is on the other side of fear.” - George Addair",
  "“Dream it. Wish it. Do it.” - Anonymous",
  "“Doubt kills more dreams than failure ever will.” - Suzy Kassem",
  "“Success doesn't just find you. You have to go out and get it.” - Anonymous",
  "“The key to success is to focus on goals, not obstacles.” - Anonymous",
  "“Success is the sum of small efforts, repeated day in and day out.” - Robert Collier",
  "“Success usually comes to those who are too busy to be looking for it.” - Henry David Thoreau",
  "“Don’t watch the clock; do what it does. Keep going.” - Sam Levenson",
  "“The future depends on what we do in the present.” - Mahatma Gandhi",
  "“You don’t have to be great to start, but you have to start to be great.” - Anonymous",
  "“Be not afraid of life. Believe that life is worth living, and your belief will help create the fact.” - William James",
  "“Success is not how high you have climbed, but how you make a positive difference to the world.” - Roy T. Bennett",
  "“I find that the harder I work, the more luck I seem to have.” - Thomas Jefferson",
  "“If you want to achieve greatness stop asking for permission.” - Anonymous",
  "“It’s not whether you get knocked down, it’s whether you get up.” - Vince Lombardi",
  "“Hardships often prepare ordinary people for an extraordinary destiny.” - C.S. Lewis",
  "“Success is not in what you have, but who you are.” - Bo Bennett",
  "“Don’t wait for opportunity. Create it.” - Anonymous",
  "“Opportunities don't happen, you create them.” - Chris Grosser",
  "“Success is not the key to happiness. Happiness is the key to success.” - Albert Schweitzer",
  "“The only limit to our realization of tomorrow is our doubts of today.” - Franklin D. Roosevelt",
  "“Do what you can with all you have, wherever you are.” - Theodore Roosevelt",
  "“Life is either a daring adventure or nothing at all.” - Helen Keller",
  "“The future belongs to those who believe in the beauty of their dreams.” - Eleanor Roosevelt",
  "“I attribute my success to this: I never gave or took any excuse.” - Florence Nightingale",
  "“Success is not measured by what you accomplish, but by the opposition you have encountered, and the courage with which you have maintained the struggle against overwhelming odds.” - Orison Swett Marden",
  "“The only thing standing between you and your goal is the story you keep telling yourself as to why you can’t achieve it.” - Jordan Belfort",
  "“It’s hard to beat a person who never gives up.” - Babe Ruth",
  "“Don’t stop when you’re tired. Stop when you’re done.” - Anonymous",
  "“If you want to go fast, go alone. If you want to go far, go together.” - African Proverb",
  "“Success is the ability to go from one failure to another with no loss of enthusiasm.” - Winston Churchill",
  "“It’s not about perfect. It’s about effort.” - Jillian Michaels",
  "“Great things are not done by impulse, but by a series of small things brought together.” - Vincent Van Gogh",
  "“The difference between ordinary and extraordinary is that little extra.” - Jimmy Johnson",
  "“Success is a journey, not a destination.” - Ben Sweetland",
  "“Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.” - Christian D. Larson",
  "“The only way to do great work is to love what you do.” - Steve Jobs",
  "“Don’t be afraid to give up the good to go for the great.” - John D. Rockefeller"
];

// Function to check if a year is a leap year
function isLeapYear(year) {
    return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
}

// Function to get the daily index, considering leap years
function getDailyIndex() {
    const startDate = new Date('2025-01-01'); // Starting date (January 1, 2025)
    const currentDate = new Date();

    // Calculate the number of days between the two dates
    const timeDifference = currentDate - startDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // Adjust for leap years
    let leapYearAdjustment = 0;

    // Count leap years between start date and current date
    for (let year = 2025; year <= currentDate.getFullYear(); year++) {
        if (isLeapYear(year)) {
            leapYearAdjustment += 1;
        }
    }

    // Account for leap years and loop every 365 or 366 days
    const totalDays = daysDifference + leapYearAdjustment;
    return totalDays % 365; // Loop every 365 days (ignoring Feb 29 after this)
}

// Function to get today's fact
function getTodaysFact() {
    const index = getDailyIndex();
    return facts[index];
}

// Function to get today's quote
function getTodaysQuote() {
    const index = getDailyIndex();
    return quotes[index];
}

// Function to get today's date
function getTodaysDate() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
}

// Display the date, fact, and quote
document.getElementById('currentDate').innerText = getTodaysDate();
document.getElementById('dailyFact').innerText = getTodaysFact();
document.getElementById('dailyQuote').innerText = getTodaysQuote();
