document.addEventListener('DOMContentLoaded', () => {
    // Enhanced Copy Protection
    const enhancedCopyProtection = {
        init() {
            document.addEventListener('contextmenu', e => e.preventDefault());
            document.addEventListener('selectstart', e => e.preventDefault());
            document.addEventListener('copy', e => e.preventDefault());
        }
    };

    // Initialize protection
    enhancedCopyProtection.init();

// Enhanced device detection
function detectDetailedDevice() {
    const ua = navigator.userAgent;
    let deviceInfo = '';

    // Define all OS versions
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
            'Fedora',
            'Arch Linux',
            'Red Hat Enterprise Linux',
            'Kali Linux',
            'Manjaro',
            'CloudLinux',
            'Scientific Linux',
            'antiX',
            'openSUSE',
            'Debian',
            'CentOS Stream',
            'Oracle Linux',
            'AlmaLinux',
            'MX Linux',
            'Zorin OS',
            'Clear Linux OS',
            'Ubuntu',
            'Linux Mint',
            'Gentoo',
            'elementary OS',
            'ClearOS',
            'Pop!_OS',
            'EndeavourOS'
        ]
    };

    // Function to get the latest version for a platform
    const getLatestVersion = (platform) => {
        switch(platform) {
            case 'iOS':
            case 'iPadOS':
                return operatingSystems.apple[platform][0];
            case 'macOS':
                return operatingSystems.apple.macOS[0];
            case 'Windows':
                return operatingSystems.microsoft.Windows[0];
            case 'Android':
                return operatingSystems.android[0];
            default:
                return '';
        }
    };

    // Detect OS and version
    if (/iPhone/.test(ua)) {
        const match = ua.match(/iPhone\s*(?:OS\s*)?(\d+)?/);
        const version = match?.[1] || getLatestVersion('iOS');
        deviceInfo = `iPhone (iOS ${version})`;
    } else if (/iPad/.test(ua)) {
        const match = ua.match(/iPad\s*(?:OS\s*)?(\d+)?/);
        const version = match?.[1] || getLatestVersion('iPadOS');
        deviceInfo = `iPad (iPadOS ${version})`;
    } else if (/Android/.test(ua)) {
        const match = ua.match(/Android\s*([0-9.]+)?/);
        const version = match?.[1] || getLatestVersion('Android');
        deviceInfo = `Android ${version}`;
    } else if (/Windows/.test(ua)) {
        const match = ua.match(/Windows NT (\d+\.\d+)/);
        let version = getLatestVersion('Windows');
        if (match) {
            // Map NT version to Windows version
            const ntToWindows = {
                '10.0': '11/10', // Both Windows 10 and 11 use NT 10.0
                '6.3': '8.1',
                '6.2': '8',
                '6.1': '7'
            };
            version = ntToWindows[match[1]] || version;
        }
        deviceInfo = `Windows ${version}`;
    } else if (/Macintosh/.test(ua)) {
        const match = ua.match(/Mac OS X (\d+[._]\d+)/);
        const version = match ? 
            match[1].replace('_', '.') : 
            getLatestVersion('macOS');
        deviceInfo = `macOS ${version}`;
    } else if (/Linux/.test(ua)) {
        // Try to detect specific Linux distribution
        let detectedDistro = 'Unknown Distribution';
        
        // Check for common Linux distribution identifiers in user agent
        for (const distro of operatingSystems.linux) {
            if (ua.toLowerCase().includes(distro.toLowerCase())) {
                detectedDistro = distro;
                break;
            }
        }
        
        // Additional checks for common Linux environment variables
        if (detectedDistro === 'Unknown Distribution' && typeof window !== 'undefined' && window.navigator) {
            const platform = window.navigator.platform;
            if (platform.includes('Linux')) {
                // Try to get more specific Linux info if available
                detectedDistro = operatingSystems.linux[0]; // Default to first Linux distro if specific one can't be determined
            }
        }
        
        deviceInfo = `Linux (${detectedDistro})`;
    } else {
        deviceInfo = 'Unknown Device';
    }

    // Update the device info display
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
            {
                username: 'teamtrump',
                isVerified: true,
                followers: '8.3M',
                nickname: 'Team Trump',
                bio: 'The offical TikTok page for the Trump Campaign',
                profilePic: 'images/teamtrump.jpeg'
            },
            {
                username: 'carterpcs',
                isVerified: true,
                followers: '5.5M',
                nickname: 'Carterpcs',
                bio: 'Making Tech Less Of A Snoozefest, LA, carterpcs@rakugomedia.com',
                profilePic: 'images/carterpcs.jpeg'
            },
            {
                username: 'applesauceandadhd',
                isVerified: true,
                followers: '3.5M',
                nickname: 'Jess|Aggressive Tutorials',
                bio: 'Surviving Not Thriving',
                profilePic: 'images/applesauceandadhd.jpeg'
            },
            {
                username: 'tatechtips',
                isVerified: true,
                followers: '3M',
                nickname: 'TA TECH TIPS',
                bio: '🔥 Tech Tips from Nick B 🔥Enquiries: 📧 hello@TheGoldStudios.com',
                profilePic: 'images/tatechtips.jpeg'
            },
            {
                username: 'imparkerburton',
                isVerified: false,
                followers: '2.8M',
                nickname: 'Parker Burton',
                bio: 'That Android Guy, Business: parker@imparkerburton.com',
                profilePic: 'images/imparkerburton.jpeg'
            },
            {
                username: 'kennedylawfirm',
                isVerified: false,
                followers: '1.9M',
                nickname: 'Lawyer Kevin Kennedy',
                bio: "The Kennedy Law Firm, PLLC Clarksvill, TN Kev's got you covered™️",
                profilePic: 'images/kennedylawfirm.jpeg'
            },
             {
                username: 'badge502',
                isVerified: false,
                followers: '798.1K',
                nickname: 'Badge502',
                bio: 'NREMT - 911/EMD, PO Box 775, Belleville, NJ 07109',
                profilePic: 'images/badge502.jpeg'
            },
            {
                username: 'mrfatcheeto',
                isVerified: false,
                followers: '458.4K',
                nickname: 'Mr Fat Cheeto',
                bio: 'OH YEAH!',
                profilePic: 'images/mrfatcheeto.jpeg'
            },
            {
                username: 'trafficlightdoctor',
                isVerified: false,
                followers: '383K',
                nickname: '🚦 Traffic Light Doctor 🚦',
                bio: '🚦Traffic Signal Tech🚦, Traffic Lights, Family, Food, and Comedy!, Mississippi',
                profilePic: 'images/trafficlightdoctor.jpeg'
            },
            {
                username: 'houseofhughes_',
                isVerified: false,
                followers: '303.4K',
                nickname: 'Rachel Hughes',
                bio: 'houseofhughes@thestation.io, Cerebral Palsy Mama, 20% OFF BUCKED UP: RACHELHUGHES',
                profilePic: 'images/houseofhughes.jpeg'
            },
            {
                username: 'aggressiveafterdark',
                isVerified: false,
                followers: '296.8K',
                nickname: 'ApplesauceandADHD_AfterDark',
                bio: 'Shhhhhhh. Its a secret, @Jess|Aggressive Tutorials Official Back-Up',
                profilePic: 'images/aggressiveafterdark.jpeg'
            },
            {
                username: 'badge5022',
                isVerified: false,
                followers: '15.5K',
                nickname: 'Badge502',
                bio: 'Backup Account',
                profilePic: 'images/badge5022.jpeg'
            },
            {
                username: 'lust_ryze',
                isVerified: false,
                followers: '11.4K',
                nickname: 'Ryze',
                bio: 'Google pixel,Samsung, Apple Owner',
                profilePic: 'images/lust_ryze.jpeg'
            },
            {
                username: 'busarmydude',
                isVerified: false,
                followers: '1,236',
                nickname: 'Bus Army Dude',
                bio: 'Hello, my name is River, I am 19. I am autistic. I love technology',
                profilePic: 'images/busarmydude.jpg'
            },
            {
                username: 'raisingramsey2023',
                isVerified: false,
                followers: '1,150',
                nickname: 'RaisingRamsey2023',
                bio: 'The Adventures of Raising Ramsey. Come along as we watch Ramsey Play and Learn',
                profilePic: 'images/raisingramsey2023.jpeg'
            },
            {
                username: 'lust__ryze',
                isVerified: false,
                followers: '1,039',
                nickname: 'Ryze',
                bio: 'Google Pixel,Samsung,Apple Owner, Spam likes =Blocked',
                profilePic: 'images/lust_ryze.jpeg'
            },
            {
                username: 'elvirablack8',
                isVerified: false,
                followers: '967',
                nickname: 'elvirablack8',
                bio: 'I love my friends and my family all so much even my followers',
                profilePic: 'images/elvirablack8.jpeg'
            },
            {
                username: 'jerridc4',
                isVerified: false,
                followers: '415',
                nickname: 'Jerrid Cook',
                bio: '@raisingramsey2023, @benz.the beard',
                profilePic: 'images/jerridc4.jpeg'
            },
            {
                username: 'jerridonthelot',
                isVerified: false,
                followers: '117',
                nickname: 'Jerrid on the Lot',
                bio: 'Your friendly neighborhood Car Salesman and Boy Dad',
                profilePic: 'images/jerridonthelot.jpeg'
            },
            {
                username: '_jano_142_',
                isVerified: false,
                followers: '100',
                nickname: 'Jano_142',
                bio: 'I am a guy who loves cars... Want to support my passion? My Cashapp is @Jano142',
                profilePic: 'images/jano142.jpeg'
            },
            {
                username: 'souldragon912',
                isVerified: false,
                followers: '84',
                nickname: 'Soul Dragon',
                bio: 'I am in Network Security. i play Höfner club bass and love 80s rock. 18',
                profilePic: 'images/souldragon912.jpeg'
            },
            {
                username: 'playing.with.litt',
                isVerified: false,
                followers: '76',
                nickname: 'dylanmancini1',
                bio: 'Hey everyone I wish I could have my main account and thanks for the views',
                profilePic: 'images/playing.with.litt.jpeg'
            },
            {
                username: 'prettymomma37',
                isVerified: false,
                followers: '68',
                nickname: 'Andrea',
                bio: 'No bio yet',
                profilePic: 'images/prettymomma37.jpeg'
            },
            {
                username: 'missfoxy0142',
                isVerified: false,
                followers: '24',
                nickname: 'miss_Foxy142',
                bio: 'No bio yet',
                profilePic: 'images/missfoxy0142.jpeg'
            },
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
                    HAPPY BIRTHDAY ITS OFFICALLY YOUR 20TH BIRTHDAY ENJOY IT
                </h2>
                <div style="font-size: 1.5em; color: var(--text-color);">
                    🎉 🎊 🎆 🎈
                </div>
            `;
        } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const elements = {
                days: document.getElementById('countdown-days'),
                hours: document.getElementById('countdown-hours'),
                minutes: document.getElementById('countdown-minutes'),
                seconds: document.getElementById('countdown-seconds')
            };

            if (elements.days && elements.hours && elements.minutes && elements.seconds) {
                elements.days.textContent = days;
                elements.hours.textContent = hours.toString().padStart(2, '0');
                elements.minutes.textContent = minutes.toString().padStart(2, '0');
                elements.seconds.textContent = seconds.toString().padStart(2, '0');
            }
        }
    }

    // Initialize everything
    detectDetailedDevice();
    updateTime();
    tiktokShoutouts.init();
    updateNewYearCountdown();

    // Set intervals
    setInterval(updateTime, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(updateNewYearCountdown, 1000);
});

// Function to toggle between light and dark mode
function toggleTheme() {
    const body = document.body;
    // Check current theme
    const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';

    // Toggle theme
    if (currentTheme === 'light') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark'); // Save theme in localStorage
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light'); // Save theme in localStorage
    }
}

// Function to change the text size
function changeTextSize(size) {
    const body = document.body;
    body.style.fontSize = size + 'px'; // Change font size
    localStorage.setItem('text-size', size); // Save text size in localStorage
}

// Apply saved theme and text size on page load
function applySavedSettings() {
    const savedTheme = localStorage.getItem('theme');
    const savedTextSize = localStorage.getItem('text-size');

    // Apply saved theme
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }

    // Apply saved text size
    if (savedTextSize) {
        document.body.style.fontSize = savedTextSize + 'px';
    }
}

// Run the applySavedSettings function when the page loads
window.onload = applySavedSettings;
