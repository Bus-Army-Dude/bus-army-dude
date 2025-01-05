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
            { username: 'carterpcs', isVerified: true, followers: '5.5M', nickname: 'Carterpcs', bio: 'Making Tech Less Of A Snoozefest, LA', profilePic: 'images/carterpcs.jpeg' },
            { username: 'applesauceandadhd', isVerified: true, followers: '3.5M', nickname: 'Jess|Aggressive Tutorials', bio: 'Surviving Not Thriving, TeamJessSecrest@Gersh.com', profilePic: 'images/applesauceandadhd.jpeg' },
            { username: 'houseofhughes_', isVerified: false, followers: '303.5K', nickname: 'Rachel Hughes', bio: 'houseofhughes@thestation.io, Cerebral Palsy Mama, 20% OFF BUCKED UP: RACHELHUGHES', profilePic: 'images/houseofhughes.jpeg' },
            { username: 'lust_ryze', isVerified: false, followers: '11.4K', nickname: 'Ryze', bio: 'Google pixel,Samsung, Apple Owner, Other social links bellow', profilePic: 'images/lust_ryze.jpeg' },
            { username: 'lust__ryze', isVerified: false, followers: '1,039', nickname: 'Ryze', bio: 'Google pixel,Samsung, Apple Owner, Spam likes=Blocked', profilePic: 'images/lust_ryze.jpeg' },
            { username: 'busarmydude', isVerified: false, followers: '1,236', nickname: 'Bus Army Dude', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology', profilePic: 'images/busarmydude.jpg' },
            { username: 'raisingramsey2023', isVerified: false, followers: '1,151', nickname: 'RaisingRamsey2023', bio: 'The Adventures of Raising Ramsey. Come along as we watch Ramsey Play and Learn', profilePic: 'images/raisingramsey2023.jpeg' },
            { username: 'jerridc4', isVerified: false, followers: '416', nickname: 'Jerrid Cook', bio: '@raisingramsey2023, @benz.the beard', profilePic: 'images/jerridc4.jpeg' },
            { username: 'jerridonthelot', isVerified: false, followers: '117', nickname: 'Jerrid on the Lot', bio: 'Your friendly neighborhood Car Salesman and Boy Dad', profilePic: 'images/jerridonthelot.jpeg' },
            { username: 'imparkerburton', isVerified: false, followers: '2.8M', nickname: 'Parker Burton', bio: 'That Android Guy, Business: parker@imparkerburton.com', profilePic: 'images/imparkerburton.jpeg' },
            { username: 'kaylee_mertens_', isVerified: false, followers: '671.2K', nickname: 'Kaylee Mertens|Dancing Baby', bio: 'Just a mom who loves her baby boy 💙,📍Wisconsin, KayleeMertens.collabs@gmail.com', profilePic: 'images/kayleemertens.jpeg' },
            { username: 'kennedylawfirm', isVerified: false, followers: '1.9M', nickname: 'Lawyer Kevin Kennedy', bio: "The Kennedy Law Firm, PLLC, Clarksville, TN, Kev's got you covered™️", profilePic: 'images/kennedylawfirm.jpeg' },
            { username: 'meetmeinthemediacenter', isVerified: true, followers: '682.7K', nickname: 'Meet Me In The Media Center', bio: '✌🏻❤️&ToastyBooks, 📚Middle School Librarian, 💌 meetmeinthemediacenter@gmail.com', profilePic: 'images/meetmeinthemediacenter.jpeg' },
            { username: 'missfoxy0142', isVerified: false, followers: '24', nickname: 'miss_foxy142', bio: 'No bio yet.', profilePic: 'images/missfoxy0142.jpeg' },
            { username: 'mrfatcheeto', isVerified: false, followers: '460.9K', nickname: 'Mr Fat Cheeto', bio: 'OH YEAH!', profilePic: 'images/mrfatcheeto.jpeg' },
            { username: 'playing.with.litt', isVerified: false, followers: '78', nickname: 'dylanmancini1', bio: 'Hey everyone I wish I could have my main account and thanks for the views', profilePic: 'images/playing.with.litt.jpeg' },
            { username: '_jano_142_', isVerified: false, followers: '100', nickname: 'Jano_142', bio: "I'm a guy who loves cars... Want to support my passion? My Cashapp is @Jano142", profilePic: 'images/jano142.jpeg' },
            { username: 'elvirablack8', isVerified: false, followers: '970', nickname: 'elvirablack8', bio: 'I love my friends and my family all so much even my followers', profilePic: 'images/elvirablack8.jpeg' },
            { username: 'badge502', isVerified: false, followers: '798.4K', nickname: 'Badge502', bio: 'NREMT - 911/EMD PO Box 775 Belleville, NJ 07109 *I DONT HAVE A BACKUP ACCOUNT*', profilePic: 'images/badge502.jpeg' },
            { username: 'badge5022', isVerified: false, followers: '15.6K', nickname: 'Badge502', bio: 'Backup Account', profilePic: 'images/badge5022.jpeg' },
            { username: 'aggressiveafterdark', isVerified: false, followers: '301.2K', nickname: 'ApplesauceandADHD_AfterDark', bio: "Shhhhhhh. It's a secret@Jess|Aggressive Tutorials Official Back-Up", profilePic: 'images/aggressiveafterdark.jpeg' },
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

// Manually set the date and time you want for "Last Updated" in your time zone (e.g., EST)
const lastUpdatedDate = "01/05/2025";  // Set the date here (mm/dd/yyyy)
const lastUpdatedTime = "3:00 PM";    // Set the time here (12-hour format)

// Combine the date and time into a single string
const lastUpdatedString = `${lastUpdatedDate} ${lastUpdatedTime}`;

document.addEventListener("DOMContentLoaded", () => {
  const lastUpdatedElement = document.querySelector("#lastUpdated");

  if (lastUpdatedElement) {
    // Create a Date object with the manually set date and time
    const lastUpdatedDateObj = new Date(`${lastUpdatedString} GMT-0500`); // Example for EST, adjust for your time zone if needed

    // Convert the time to the user's local time zone
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

    const localLastUpdated = lastUpdatedDateObj.toLocaleString('en-US', options);

    // Display the converted "Last Updated" timestamp in the user's local time zone
    lastUpdatedElement.textContent = `Last Updated: ${localLastUpdated}`;
  }
});
    
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

// Function to toggle between light and dark mode
function toggleTheme() {
    const body = document.body;
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Toggle theme
    if (currentTheme === 'light') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
}

// Function to change text size
function changeTextSize(size) {
    document.body.style.fontSize = size + 'px';
    localStorage.setItem('text-size', size);
}

// Apply saved theme and text size on page load
function applySavedSettings() {
    const savedTheme = localStorage.getItem('theme');
    const savedTextSize = localStorage.getItem('text-size');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }

    if (savedTextSize) {
        document.body.style.fontSize = savedTextSize + 'px';
    }
}

// Apply settings when the page loads
window.addEventListener('load', applySavedSettings);
