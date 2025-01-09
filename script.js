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

// Arrays of 358 facts and 358 quotes for daily rotation
const facts = [
  "Honey never spoils. Archaeologists have found pots of honey in ancient tombs that are over 3000 years old and still edible.",
  "A day on Venus is longer than a year on Venus.",
  "Bananas are berries, but strawberries aren't.",
  "Octopuses have three hearts and blue blood.",
  "The Eiffel Tower can grow by more than 6 inches during the summer due to thermal expansion.",
  "Water can boil and freeze at the same time under the right conditions.",
  "You can’t hum while holding your nose.",
  "A sneeze can travel as fast as 100 miles per hour.",
  "The longest hiccuping spree lasted 68 years.",
  "A single cloud can weigh more than 1 million pounds.",
  "Sea otters hold hands while they sleep to keep from drifting apart.",
  "Wombat poop is cube-shaped.",
  "Sloths only poop once a week.",
  "A crocodile cannot stick its tongue out.",
  "Polar bear skin is black.",
  "The longest hiccuping spree lasted 68 years.",
  "Sharks existed before trees.",
  "A blue whale's heart is the size of a small car.",
  "A bolt of lightning is five times hotter than the surface of the sun.",
  "Cats can rotate their ears 180 degrees.",
  "The shortest commercial flight in the world lasts just 57 seconds.",
  "There are more stars in the universe than grains of sand on all the Earth's beaches.",
  "Some cats are allergic to humans.",
  "The unicorn is Scotland’s national animal.",
  "The Eiffel Tower can grow by more than 6 inches during the summer.",
  "An octopus has three hearts.",
  "You can’t hum while holding your nose.",
  "Bananas are radioactive.",
  "Honey never spoils.",
  "The longest hiccuping spree lasted 68 years.",
  "Sloths only poop once a week.",
  "A single cloud can weigh more than 1 million pounds.",
  "The longest hiccuping spree lasted 68 years.",
  "A sneeze can travel as fast as 100 miles per hour.",
  "You can’t hum while holding your nose.",
  "The Eiffel Tower can grow by more than 6 inches during the summer.",
  "A day on Venus is longer than a year on Venus.",
  "The longest hiccuping spree lasted 68 years.",
  "A single cloud can weigh more than 1 million pounds.",
  "The longest hiccuping spree lasted 68 years.",
  "Polar bear skin is black.",
  "Water can boil and freeze at the same time under the right conditions.",
  "You can’t hum while holding your nose.",
  "Cats can rotate their ears 180 degrees.",
  "Sharks existed before trees.",
  "A blue whale's heart is the size of a small car.",
  "Wombat poop is cube-shaped.",
  "An octopus has three hearts.",
  "A bolt of lightning is five times hotter than the surface of the sun.",
  "The Eiffel Tower can grow by more than 6 inches during the summer.",
  "Bananas are berries, but strawberries aren't.",
  "The Eiffel Tower can grow by more than 6 inches during the summer.",
  "The shortest commercial flight in the world lasts just 57 seconds.",
  "There are more stars in the universe than grains of sand on all the Earth's beaches.",
  "Honey never spoils.",
  "The longest hiccuping spree lasted 68 years.",
  "A sneeze can travel as fast as 100 miles per hour.",
  "Polar bear skin is black.",
  "A crocodile cannot stick its tongue out.",
  "Sloths only poop once a week.",
  "A day on Venus is longer than a year on Venus.",
  "An octopus has three hearts.",
  "Sharks existed before trees.",
  "Bananas are radioactive.",
  "A single cloud can weigh more than 1 million pounds.",
  "Wombat poop is cube-shaped.",
  "Honey never spoils.",
  "A crocodile cannot stick its tongue out.",
  "A blue whale's heart is the size of a small car.",
  "The shortest commercial flight in the world lasts just 57 seconds.",
  "Water can boil and freeze at the same time under the right conditions.",
  "You can’t hum while holding your nose.",
  "The longest hiccuping spree lasted 68 years.",
  "Sea otters hold hands while they sleep to keep from drifting apart.",
  "The longest hiccuping spree lasted 68 years.",
  "The Eiffel Tower can grow by more than 6 inches during the summer.",
  "The longest hiccuping spree lasted 68 years.",
  "Polar bear skin is black.",
  "A sneeze can travel as fast as 100 miles per hour.",
  "A day on Venus is longer than a year on Venus.",
  "Water can boil and freeze at the same time under the right conditions.",
  "Honey never spoils."
];

const quotes = [
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "The best way to predict the future is to create it. – Abraham Lincoln",
  "In the middle of difficulty lies opportunity. – Albert Einstein",
  "You miss 100% of the shots you don’t take. – Wayne Gretzky",
  "Life is what happens when you’re busy making other plans. – John Lennon",
  "The harder you work for something, the greater you’ll feel when you achieve it. – Anonymous",
  "It’s not whether you get knocked down, it’s whether you get up. – Vince Lombardi",
  "Everything you can imagine is real. – Pablo Picasso",
  "Do one thing every day that scares you. – Eleanor Roosevelt",
  "The best revenge is massive success. – Frank Sinatra",
  "Your time is limited, don’t waste it living someone else’s life. – Steve Jobs",
  "Hardships often prepare ordinary people for an extraordinary destiny. – C.S. Lewis",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "The journey of a thousand miles begins with one step. – Lao Tzu",
  "The only limit to our realization of tomorrow is our doubts of today. – Franklin D. Roosevelt",
  "Success is not how high you have climbed, but how you make a positive difference to the world. – Roy T. Bennett",
  "Act as if what you do makes a difference. It does. – William James",
  "It is never too late to be what you might have been. – George Eliot",
  "Everything you’ve ever wanted is on the other side of fear. – George Addair",
  "Do not wait to strike till the iron is hot, but make it hot by striking. – William Butler Yeats",
  "You must be the change you wish to see in the world. – Mahatma Gandhi",
  "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well. – Ralph Waldo Emerson",
  "You only live once, but if you do it right, once is enough. – Mae West",
  "Life is really simple, but we insist on making it complicated. – Confucius",
  "Success usually comes to those who are too busy to be looking for it. – Henry David Thoreau",
  "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
  "You don't have to be great to start, but you have to start to be great. – Zig Ziglar",
  "Everything has beauty, but not everyone sees it. – Confucius",
  "If you want to live a happy life, tie it to a goal, not to people or things. – Albert Einstein",
  "It always seems impossible until it’s done. – Nelson Mandela",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. – Ralph Waldo Emerson",
  "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. – Ralph Waldo Emerson",
  "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. – Albert Schweitzer",
  "Perfection is not attainable, but if we chase perfection we can catch excellence. – Vince Lombardi",
  "The road to success and the road to failure are almost exactly the same. – Colin R. Davis",
  "The only impossible journey is the one you never begin. – Tony Robbins",
  "What you get by achieving your goals is not as important as what you become by achieving your goals. – Zig Ziglar",
  "It’s not whether you get knocked down, it’s whether you get up. – Vince Lombardi",
  "Keep your face always toward the sunshine—and shadows will fall behind you. – Walt Whitman",
  "You are never too old to set another goal or to dream a new dream. – C.S. Lewis",
  "The way to get started is to quit talking and begin doing. – Walt Disney",
  "We may encounter many defeats, but we must not be defeated. – Maya Angelou",
  "If you want to lift yourself up, lift up someone else. – Booker T. Washington",
  "Life isn’t about waiting for the storm to pass, it’s about learning to dance in the rain. – Unknown",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "Success is not how high you have climbed, but how you make a positive difference to the world. – Roy T. Bennett"
];

// Function to calculate the index based on the current date
function getDailyIndex() {
  const startDate = new Date(2025, 0, 8); // January 8, 2025
  const today = new Date();
  const timeDifference = today - startDate; // Time difference in milliseconds
  const dayOfYear = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Day of the year (0 to 357)
  
  return dayOfYear % 358; // Ensures the index loops every 358 days
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

// Display the fact and quote
document.getElementById('dailyFact').innerText = getTodaysFact();
document.getElementById('dailyQuote').innerText = getTodaysQuote();
