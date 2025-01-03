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
