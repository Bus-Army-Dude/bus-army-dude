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
                iOS: ['18', '17'],
                iPadOS: ['18', '17'],
                macOS: ['15', '14']
            },
            microsoft: {
                Windows: ['11', '10']
            },
            android: ['15', '14'],
            linux: [
                'Fedora', 'Arch Linux', 'Red Hat Enterprise Linux', 'Kali Linux', 'Manjaro', 'Ubuntu', 'Linux Mint'
            ]
        };

        const getLatestVersion = (platform) => {
            switch(platform) {
                case 'iOS': return operatingSystems.apple.iOS[0];
                case 'iPadOS': return operatingSystems.apple.iPadOS[0];
                case 'macOS': return operatingSystems.apple.macOS[0];
                case 'Windows': return operatingSystems.microsoft.Windows[0];
                case 'Android': return operatingSystems.android[0];
                default: return '';
            }
        };

        if (/iPhone/.test(ua)) {
            const version = ua.match(/iPhone\s*OS\s*(\d+)?/)?.[1] || getLatestVersion('iOS');
            deviceInfo = `iPhone (iOS ${version})`;
        } else if (/iPad/.test(ua)) {
            const version = ua.match(/iPad\s*OS\s*(\d+)?/)?.[1] || getLatestVersion('iPadOS');
            deviceInfo = `iPad (iPadOS ${version})`;
        } else if (/Android/.test(ua)) {
            const version = ua.match(/Android\s*([0-9.]+)?/)?.[1] || getLatestVersion('Android');
            deviceInfo = `Android ${version}`;
        } else if (/Windows/.test(ua)) {
            const version = ua.match(/Windows NT (\d+\.\d+)/)?.[1] === '10.0' ? '11/10' : getLatestVersion('Windows');
            deviceInfo = `Windows ${version}`;
        } else if (/Macintosh/.test(ua)) {
            const version = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1].replace('_', '.') || getLatestVersion('macOS');
            deviceInfo = `macOS ${version}`;
        } else if (/Linux/.test(ua)) {
            deviceInfo = 'Linux (Unknown Distribution)';
        } else {
            deviceInfo = 'Unknown Device';
        }

        const deviceElement = document.querySelector('.device-info');
        if (deviceElement) {
            deviceElement.textContent = `Device: ${deviceInfo}`;
        }
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

    // TikTok Shoutouts
    const tiktokShoutouts = {
        accounts: [
            { username: 'teamtrump', isVerified: true, followers: '8.3M', nickname: 'Team Trump', bio: 'The official TikTok page for the Trump Campaign', profilePic: 'images/teamtrump.jpeg' },
            { username: 'carterpcs', isVerified: true, followers: '5.6M', nickname: 'Carterpcs', bio: 'Making Tech Less Of A Snoozefest, LA', profilePic: 'images/carterpcs.jpeg' },
            { username: 'applesauceandadhd', isVerified: true, followers: '3.6M', nickname: 'Jess|Aggressive Tutorials', bio: 'Surviving Not Thriving, TeamJessSecrest@Gersh.com', profilePic: 'images/applesauceandadhd.jpeg' },
            { username: 'houseofhughes_', isVerified: false, followers: '303.5K', nickname: 'Rachel Hughes', bio: 'houseofhughes@thestation.io, Cerebral Palsy Mama, 20% OFF BUCKED UP: RACHELHUGHES', profilePic: 'images/houseofhughes.jpeg' },
            { username: 'lust_ryze', isVerified: false, followers: '11.4K', nickname: 'Ryze', bio: 'Google pixel,Samsung, Apple Owner, Other social links bellow', profilePic: 'images/lust_ryze.jpeg' },
            { username: 'lust__ryze', isVerified: false, followers: '1,038', nickname: 'Ryze', bio: 'Google pixel,Samsung, Apple Owner, Spam likes=Blocked', profilePic: 'images/lust_ryze.jpeg' },
            { username: 'busarmydude', isVerified: false, followers: '1,235', nickname: 'Bus Army Dude', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology', profilePic: 'images/busarmydude.jpg' },
            { username: 'raisingramsey2023', isVerified: false, followers: '1,153', nickname: 'RaisingRamsey2023', bio: 'The Adventures of Raising Ramsey. Come along as we watch Ramsey Play and Learn', profilePic: 'images/raisingramsey2023.jpeg' },
            { username: 'jerridc4', isVerified: false, followers: '417', nickname: 'Jerrid Cook', bio: '@raisingramsey2023, @benz.the beard', profilePic: 'images/jerridc4.jpeg' },
            { username: 'jerridonthelot', isVerified: false, followers: '119', nickname: 'Jerrid on the Lot', bio: 'Your friendly neighborhood Car Salesman and Boy Dad', profilePic: 'images/jerridonthelot.jpeg' },
            { username: 'imparkerburton', isVerified: false, followers: '2.8M', nickname: 'Parker Burton', bio: 'That Android Guy, Business: parker@imparkerburton.com', profilePic: 'images/imparkerburton.jpeg' },
            { username: 'kaylee_mertens_', isVerified: false, followers: '672.4K', nickname: 'Kaylee Mertens|Dancing Baby', bio: 'Just a mom who loves her baby boy 💙,📍Wisconsin, KayleeMertens.collabs@gmail.com', profilePic: 'images/kayleemertens.jpeg' },
            { username: 'kennedylawfirm', isVerified: false, followers: '1.9M', nickname: 'Lawyer Kevin Kennedy', bio: "The Kennedy Law Firm, PLLC, Clarksville, TN, Kev's got you covered™️", profilePic: 'images/kennedylawfirm.jpeg' },
            { username: 'meetmeinthemediacenter', isVerified: true, followers: '683.8K', nickname: 'Meet Me In The Media Center', bio: '✌🏻❤️&ToastyBooks, 📚Middle School Librarian, 💌 meetmeinthemediacenter@gmail.com', profilePic: 'images/meetmeinthemediacenter.jpeg' },
            { username: 'missfoxy0142', isVerified: false, followers: '24', nickname: 'miss_foxy142', bio: 'No bio yet.', profilePic: 'images/missfoxy0142.jpeg' },
            { username: 'mrfatcheeto', isVerified: false, followers: '462.9K', nickname: 'Mr Fat Cheeto', bio: 'OH YEAH!', profilePic: 'images/mrfatcheeto.jpeg' },
            { username: 'playing.with.litt', isVerified: false, followers: '82', nickname: 'dylanmancini1', bio: 'Hey everyone I wish I could have my main account and thanks for the views', profilePic: 'images/playing.with.litt.jpeg' },
            { username: '_jano_142_', isVerified: false, followers: '100', nickname: 'Jano_142', bio: "I'm a guy who loves cars... Want to support my passion? My Cashapp is @Jano142", profilePic: 'images/jano142.jpeg' },
            { username: 'elvirablack8', isVerified: false, followers: '973', nickname: 'elvirablack8', bio: 'I love my friends and my family all so much even my followers', profilePic: 'images/elvirablack8.jpeg' },
            { username: 'badge502', isVerified: false, followers: '798.8K', nickname: 'Badge502', bio: 'NREMT - 911/EMD PO Box 775 Belleville, NJ 07109 *I DONT HAVE A BACKUP ACCOUNT*', profilePic: 'images/badge502.jpeg' },
            { username: 'badge5022', isVerified: false, followers: '15.6K', nickname: 'Badge502', bio: 'Backup Account', profilePic: 'images/badge5022.jpeg' },
            { username: 'aggressiveafterdark', isVerified: false, followers: '304.4K', nickname: 'ApplesauceandADHD_AfterDark', bio: "Shhhhhhh. It's a secret@Jess|Aggressive Tutorials Official Back-Up", profilePic: 'images/aggressiveafterdark.jpeg' },
            { username: 'souldragon912', isVerified: false, followers: '84', nickname: 'Soul Dragon', bio: "I'm in Network Security. i play Höfner club bass and love 80s rock. 18", profilePic: 'images/souldragon912.jpeg' },
            { username: 'prettymomma37', isVerified: false, followers: '68', nickname: 'Andrea', bio: 'No bio yet', profilePic: 'images/prettymomma37.jpeg' },
            { username: 'tatechtips', isVerified: true, followers: '3M', nickname: 'TA TECH TIPS', bio: '🔥 Tech Tips from Nick B 🔥, Enquiries: 📧 hello@TheGoldStudios.com', profilePic: 'images/tatechtips.jpeg' },
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

// Manually set the last updated date and time (example in EST timezone)
const lastUpdatedDate = "01/06/2025";  // Set the date here (mm/dd/yyyy)
const lastUpdatedTime = "9:49:00";    // Set the time here (12-hour format)

// Combine the date and time into a single string for parsing
const lastUpdatedString = `${lastUpdatedDate} ${lastUpdatedTime}`;

const instagramShoutouts = {
    accounts: [
        { username: 'riverkritzar', isVerified: false, followers: '82', nickname: 'River Jordan Kritzar', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/riverkritzar.jpg' },
        { username: 'busarmydude', isVerified: false, followers: '3', nickname: 'Bus Army Dude', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/busarmydude.jpg' },
        { username: 'rose_the_fox24', isVerified: false, followers: '81', nickname: 'Rose Haydu', bio: 'I’m 19, Drp/rp open, I’m taken by the love of my life @_jano_142_ 💜3/1/24💜', profilePic: 'instagram_photos/rosethefox24.jpg' },
        { username: '_jano_142_', isVerified: false, followers: '47', nickname: 'Nathan Haydu', bio: 'Cars are love, cars are life. Taken by @rose_the_fox24 ❤️(3/1/24)❤️#bncr33gtr:Best Skyline/🔰Dream car🚗#c7zr1:Last TRUE Vette/🇺🇸Dream car🏎', profilePic: 'instagram_photos/jano142.jpg' },    
        { username: 'mrbeast', isVerified: true, followers: '64.4M', nickname: 'MrBeast', bio: 'My New Show Beast Games is out now on Prime Video!', profilePic: 'instagram_photos/mrbeast.jpg' },    
        // Add more Instagram creators as needed
    ],
    lastUpdatedTime: '2025-01-06T14:55:02', // Manually set the last updated date and time
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
                        ${account.isVerified ? '<img src="check.png" alt="Verified" class="instagram-verified-badge">' : ''}
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
        { username: '@MrBeast', isVerified: true, subscribers: '341M', nickname: 'MrBeast', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames SUBSCRIBE FOR A COOKIE!', profilePic: 'youtube_photoes/mrbeast.jpg' },
        { username: '@BeastReacts', isVerified: true, subscribers: '35.2M', nickname: 'Beast Reacts', bio: 'SUBSCRIBE FOR A COOKIE', profilePic: 'youtube_photoes/beastreacts.jpg' },
        { username: '@MrBeastGaming', isVerified: true, subscribers: '46.2M', nickname: 'MrBeast Gaming', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames MrBeast Gaming - SUBSCRIBE OR ELSE', profilePic: 'youtube_photoes/mrbeastgaming.jpg' },
        { username: '@MrBeast2', isVerified: true, subscribers: '48.2M', nickname: 'MrBeast 2', bio: 'my second channel for other videos and shorts :) subscribe ', profilePic: 'youtube_photoes/mrbeast2.jpg' },
        { username: '@BeastPhilanthropy', isVerified: true, subscribers: '27.1M', nickname: 'Beast Philanthropy', bio: '100% of the profits from my ad revenue, merch sales, and sponsorships will go towards making the world a better place!', profilePic: 'youtube_photoes/beastphilanthropy.jpg' },
        // Add more YouTube creators as needed
    ],
    lastUpdatedTime: '2025-01-06T09:51:00', // Manually set the last updated date and time
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
                        ${account.isVerified ? '<img src="check.png" alt="Verified" class="youtube-verified-badge">' : ''}
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
const lastUpdatedDate = "01/06/2025";  // Set the date here (mm/dd/yyyy)
const lastUpdatedTime = "9:49 AM";    // Set the time here (12-hour format)

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
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    };

    // Format and display the converted time
    const localLastUpdated = lastUpdatedDateObj.toLocaleString('en-US', options);

    // Set the content of the "Last Updated" text
    lastUpdatedElement.textContent = `Last Updated: ${localLastUpdated}`;
  }
});
