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

function detectDetailedDevice() {
    const ua = navigator.userAgent;
    let deviceInfo = '';

    const operatingSystems = {
        apple: {
            iOS: ['18.3', '18.2.1', '18.2', '18.1', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
            iPadOS: ['18.3', '18.2', '18.1', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
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

    const deviceModels = {
        const deviceModels = {
        'iPhone': {
            '14,4': 'iPhone 13 mini',
            '14,5': 'iPhone 13',
            '14,6': 'iPhone 13 Pro',
            '14,7': 'iPhone 13 Pro Max',
            '13,1': 'iPhone 12 mini',
            '13,2': 'iPhone 12',
            '13,3': 'iPhone 12 Pro',
            '13,4': 'iPhone 12 Pro Max',
            '12,1': 'iPhone 11',
            '12,2': 'iPhone 11 Pro',
            '12,3': 'iPhone 11 Pro Max',
            '11,1': 'iPhone XS',
            '11,2': 'iPhone XS Max',
            '11,3': 'iPhone XR',
            '10,1': 'iPhone X',
            '10,2': 'iPhone 8',
            '10,3': 'iPhone 8 Plus',
            '10,4': 'iPhone 7',
            '10,5': 'iPhone 7 Plus',
            '10,6': 'iPhone 6S',
            '10,7': 'iPhone 6S Plus',
            '10,8': 'iPhone 6',
            '10,9': 'iPhone 6 Plus',
            '10,10': 'iPhone SE (1st generation)',
            '10,11': 'iPhone 5S',
            '10,12': 'iPhone 5C',
            '10,13': 'iPhone 5',
            '10,14': 'iPhone 4S',
            '10,15': 'iPhone 4',
            '10,16': 'iPhone 3GS',
            '10,17': 'iPhone 3G',
            '10,18': 'iPhone',
            '15,2': 'iPhone 14',
            '15,3': 'iPhone 14 Plus',
            '15,4': 'iPhone 14 Pro',
            '15,5': 'iPhone 14 Pro Max',
            '16,1': 'iPhone 15',
            '16,2': 'iPhone 15 Plus',
            '16,3': 'iPhone 15 Pro',
            '16,4': 'iPhone 15 Pro Max',
            '17,1': 'iPhone 16',
            '17,2': 'iPhone 16 Plus',
            '17,3': 'iPhone 16 Pro',
            '17,4': 'iPhone 16 Pro Max'
        },
        'iPad': {
            '8,1': 'iPad Pro 11-inch (3rd generation)',
            '8,2': 'iPad Pro 11-inch (3rd generation)',
            '8,3': 'iPad Pro 11-inch (3rd generation)',
            '8,4': 'iPad Pro 11-inch (3rd generation)',
            '8,5': 'iPad Pro 12.9-inch (5th generation)',
            '8,6': 'iPad Pro 12.9-inch (5th generation)',
            '8,7': 'iPad Pro 12.9-inch (5th generation)',
            '8,8': 'iPad Pro 12.9-inch (5th generation)',
            '7,1': 'iPad Pro 12.9-inch (2nd generation)',
            '7,2': 'iPad Pro 12.9-inch (2nd generation)',
            '7,3': 'iPad Pro 10.5-inch',
            '7,4': 'iPad Pro 10.5-inch',
            '6,1': 'iPad Pro 9.7-inch',
            '6,2': 'iPad Pro 9.7-inch',
            '5,1': 'iPad mini 4',
            '5,2': 'iPad mini 4',
            '4,1': 'iPad Air',
            '4,2': 'iPad Air 2',
            '4,3': 'iPad Air 3',
            '3,1': 'iPad 4th generation',
            '3,2': 'iPad 4th generation',
            '3,3': 'iPad 4th generation',
            '2,1': 'iPad 3rd generation',
            '2,2': 'iPad 3rd generation',
            '2,3': 'iPad 3rd generation',
            '1,1': 'iPad 2',
            '1,2': 'iPad 2',
            '1,3': 'iPad',
            '1,4': 'iPad',
            '2,4': 'iPad (4th generation)',
            '2,5': 'iPad mini',
            '2,6': 'iPad mini',
            '2,7': 'iPad mini',
            '3,4': 'iPad Air',
            '3,5': 'iPad Air',
            '3,6': 'iPad Air',
            '4,4': 'iPad Air 2',
            '4,5': 'iPad Air 2',
            '4,6': 'iPad Air 2'
        }
                'Galaxy': {
            // Galaxy S series
            'SM-G998B': 'Samsung Galaxy S21 Ultra',
            'SM-G996B': 'Samsung Galaxy S21+',
            'SM-G991B': 'Samsung Galaxy S21',
            'SM-G988B': 'Samsung Galaxy S20 Ultra',
            'SM-G986B': 'Samsung Galaxy S20+',
            'SM-G981B': 'Samsung Galaxy S20',
            'SM-G977B': 'Samsung Galaxy S10 5G',
            'SM-G975F': 'Samsung Galaxy S10+',
            'SM-G973F': 'Samsung Galaxy S10',
            'SM-G970F': 'Samsung Galaxy S10e',
            'SM-G965F': 'Samsung Galaxy S9+',
            'SM-G960F': 'Samsung Galaxy S9',
            'SM-G955F': 'Samsung Galaxy S8+',
            'SM-G950F': 'Samsung Galaxy S8',
            'SM-G935F': 'Samsung Galaxy S7 Edge',
            'SM-G930F': 'Samsung Galaxy S7',
            // Galaxy Z series (foldables)
            'SM-F926B': 'Samsung Galaxy Z Fold3',
            'SM-F916B': 'Samsung Galaxy Z Fold2',
            'SM-F711B': 'Samsung Galaxy Z Flip3',
            'SM-F700F': 'Samsung Galaxy Z Flip',
            // Galaxy A series
            'SM-A528B': 'Samsung Galaxy A52s',
            'SM-A515F': 'Samsung Galaxy A51',
            'SM-A505F': 'Samsung Galaxy A50',
            'SM-A715F': 'Samsung Galaxy A71',
            'SM-A705F': 'Samsung Galaxy A70',
            'SM-A515F': 'Samsung Galaxy A50',
            'SM-A405F': 'Samsung Galaxy A40',
            'SM-A305F': 'Samsung Galaxy A30',
            'SM-A205F': 'Samsung Galaxy A20',
            'SM-A105F': 'Samsung Galaxy A10',
            // Galaxy F series
            'SM-F415F': 'Samsung Galaxy F41',
            'SM-F915F': 'Samsung Galaxy F91',
            'SM-F127G': 'Samsung Galaxy F12',
            'SM-F226G': 'Samsung Galaxy F22',
            // Galaxy M series
            'SM-M515F': 'Samsung Galaxy M51',
            'SM-M315F': 'Samsung Galaxy M31',
            'SM-M217F': 'Samsung Galaxy M21',
            'SM-M115F': 'Samsung Galaxy M11',
            'SM-M105F': 'Samsung Galaxy M10',
            // Galaxy XCover series
            'SM-G715FN': 'Samsung Galaxy XCover Pro',
            'SM-G398FN': 'Samsung Galaxy XCover 4s',
            'SM-G390F': 'Samsung Galaxy XCover 4',
            'SM-G388F': 'Samsung Galaxy XCover 3',
            'SM-G389F': 'Samsung Galaxy XCover FieldPro',
            // Galaxy J series (discontinued)
            'SM-J730F': 'Samsung Galaxy J7',
            'SM-J610F': 'Samsung Galaxy J6',
            'SM-J530F': 'Samsung Galaxy J5',
            'SM-J410F': 'Samsung Galaxy J4',
            'SM-J320F': 'Samsung Galaxy J3',
            'SM-J200F': 'Samsung Galaxy J2',
            'SM-J100F': 'Samsung Galaxy J1'
        }
        'Pixel': {
            // Include all Pixel phone models
            'Pixel 6': 'Google Pixel 6',
            'Pixel 6 Pro': 'Google Pixel 6 Pro',
            'Pixel 5': 'Google Pixel 5',
            'Pixel 5a': 'Google Pixel 5a',
            'Pixel 4': 'Google Pixel 4',
            'Pixel 4 XL': 'Google Pixel 4 XL',
            'Pixel 4a': 'Google Pixel 4a',
            'Pixel 4a 5G': 'Google Pixel 4a 5G',
            'Pixel 3': 'Google Pixel 3',
            'Pixel 3 XL': 'Google Pixel 3 XL',
            'Pixel 3a': 'Google Pixel 3a',
            'Pixel 3a XL': 'Google Pixel 3a XL',
            'Pixel 2': 'Google Pixel 2',
            'Pixel 2 XL': 'Google Pixel 2 XL',
            'Pixel 1': 'Google Pixel 1',
            'Pixel XL': 'Google Pixel XL',
            'Pixel 4a 5G UW': 'Google Pixel 4a 5G UW',
            'Pixel 5G': 'Google Pixel 5G',
            'Pixel 5G UW': 'Google Pixel 5G UW',
            'Pixel 3 XL 128GB': 'Google Pixel 3 XL 128GB',
            'Pixel 3 XL 64GB': 'Google Pixel 3 XL 64GB',
            'Pixel 2 XL 64GB': 'Google Pixel 2 XL 64GB',
            'Pixel 2 XL 128GB': 'Google Pixel 2 XL 128GB',
            'Pixel 2 64GB': 'Google Pixel 2 64GB',
            'Pixel 2 128GB': 'Google Pixel 2 128GB',
            'Pixel 1 32GB': 'Google Pixel 1 32GB',
            'Pixel 1 128GB': 'Google Pixel 1 128GB',
        
            // Include Pixel tablet models
            'Pixel C': 'Google Pixel C',
            'Pixel Slate': 'Google Pixel Slate'
        }
    };

    const getDeviceModelName = (deviceType, model) => {
        return deviceModels[deviceType] && deviceModels[deviceType][model] ? deviceModels[deviceType][model] : `${deviceType} ${model}`;
    };

    // Check iPhone
    if (/iPhone/.test(ua)) {
        const model = ua.match(/iPhone\s*([0-9,]*)/)[1];
        const version = ua.match(/OS\s*([0-9_]+)/)?.[1].replace(/_/g, '.') || getLatestVersion('iOS');
        const deviceModel = getDeviceModelName('iPhone', model);
        deviceInfo = `${deviceModel} (iOS ${version})`;
    }
    // Check iPad
    else if (/iPad/.test(ua)) {
        const model = ua.match(/iPad\s*([0-9,]*)/)[1];
        const version = ua.match(/OS\s*([0-9_]+)/)?.[1].replace(/_/g, '.') || getLatestVersion('iPadOS');
        const deviceModel = getDeviceModelName('iPad', model);
        deviceInfo = `${deviceModel} (iPadOS ${version})`;
    }
    // Check Android
    else if (/Android/.test(ua)) {
        const model = ua.match(/Android\s*([0-9.]+)/)?.[1].split('.')[0];
        const version = ua.match(/Android\s*([0-9.]+)/)?.[1] || getLatestVersion('Android');
        const deviceModel = getDeviceModelName('Galaxy', model) || getDeviceModelName('Pixel', model);
        deviceInfo = `${deviceModel} (Android ${version})`;
    }
    // Check Windows
    else if (/Windows/.test(ua)) {
        const version = ua.match(/Windows NT (\d+\.\d+)/)?.[1] || getLatestVersion('Windows');
        deviceInfo = `Windows ${version}`;
    }
    // Check macOS
    else if (/Macintosh/.test(ua)) {
        const version = ua.match(/Mac OS X (\d+[\.\d+]+)?/)?.[1].replace(/_/g, '.') || getLatestVersion('macOS');
        deviceInfo = `macOS ${version}`;
    }
    // Check Linux
    else if (/Linux/.test(ua)) {
        const distro = operatingSystems.linux.find(distro => ua.includes(distro)) || 'Linux';
        deviceInfo = `${distro}`;
    }
    // Check Chrome OS
    else if (/CrOS/.test(ua)) {
        deviceInfo = `Chrome OS`;
    }
    // Check BlackBerry
    else if (/BB10/.test(ua)) {
        deviceInfo = `BlackBerry OS`;
    }
    // Check webOS
    else if (/webOS/.test(ua)) {
        deviceInfo = `webOS`;
    }
    // Check other platforms
    else {
        deviceInfo = 'Unknown Device';
    }

    // Update the HTML content with device information
    document.querySelector('.device-info').textContent = deviceInfo;
}

// Call the function to update the device information on page load
window.onload = detectDetailedDevice;

// Time update function
function updateTime() {
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', { timeZoneName: 'short' });
    const timeElement = document.querySelector('.update-time');
    if (timeElement) {
        timeElement.textContent = `${timestamp}`;
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
        deviceElement.textContent = `${detectDetailedDevice()}`;
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
            { username: 'mrbeast', isVerified: true, followers: '114M', nickname: 'MrBeast', bio: 'New CEO of Tiktok?', profilePic: 'images/mrbeast.jpeg' },     
            { username: 'teamtrump', isVerified: true, followers: '8.8M', nickname: 'Team Trump', bio: 'The official TikTok page for the Trump Campaign', profilePic: 'images/teamtrump.jpeg' },
            { username: 'carterpcs', isVerified: true, followers: '5.6M', nickname: 'Carterpcs', bio: 'Making Tech Less Of A Snoozefest, LA', profilePic: 'images/carterpcs.jpeg' },
            { username: 'applesauceandadhd', isVerified: true, followers: '3.9M', nickname: 'Jess|Aggressive Tutorials', bio: 'Surviving Not Thriving, TeamJessSecrest@Gersh.com', profilePic: 'images/applesauceandadhd.jpeg' },
            { username: 'tatechtips', isVerified: true, followers: '3.2M', nickname: 'TA TECH TIPS', bio: '🔥 Tech Tips from Nick B 🔥, Enquiries: 📧 hello@TheGoldStudios.com', profilePic: 'images/tatechtips.jpeg' },
            { username: 'imparkerburton', isVerified: false, followers: '2.9M', nickname: 'Parker Burton', bio: 'That Android Guy, Business: parker@imparkerburton.com', profilePic: 'images/imparkerburton.jpeg' },
            { username: 'kennedylawfirm', isVerified: false, followers: '1.9M', nickname: 'Lawyer Kevin Kennedy', bio: "The Kennedy Law Firm, PLLC, Clarksville, TN, Kev's got you covered™️", profilePic: 'images/kennedylawfirm.jpeg' },
            { username: 'badge502', isVerified: false, followers: '803.3K', nickname: 'Badge502', bio: 'NREMT - 911/EMD PO Box 775 Belleville, NJ 07109 *I DONT HAVE A BACKUP ACCOUNT*', profilePic: 'images/badge502.jpeg' },
            { username: 'meetmeinthemediacenter', isVerified: true, followers: '696.5K', nickname: 'Meet Me In The Media Center', bio: '✌🏻❤️&ToastyBooks, 📚Middle School Librarian, 💌 meetmeinthemediacenter@gmail.com', profilePic:  'images/meetmeinthemediacenter.jpeg' },
            { username: 'kaylee_mertens_', isVerified: false, followers: '674.7K', nickname: 'Kaylee Mertens|Dancing Baby', bio: 'Just a mom who loves her baby boy 💙,📍Wisconsin, KayleeMertens.collabs@gmail.com', profilePic: 'images/kayleemertens.jpeg' },
            { username: 'mrfatcheeto', isVerified: false, followers: '505.2K', nickname: 'Mr Fat Cheeto', bio: 'OH YEAH!', profilePic: 'images/mrfatcheeto.jpeg' },
            { username: 'trafficlightdoctor', isVerified: false, followers: '384.5K', nickname: '🚦 Traffic Light Doctor 🚦', bio: '🚦Traffic Signal Tech🚦 Traffic Lights, Family, Food, and Comedy!, Mississippi', profilePic: 'images/trafficlightdoctor.jpeg' },
            { username: 'aggressiveafterdark', isVerified: false, followers: '344.9K', nickname: 'ApplesauceandADHD_AfterDark', bio: "Shhhhhhh. It's a secret@Jess|Aggressive Tutorials Official Back-Up", profilePic: 'images/aggressiveafterdark.jpeg' },
            { username: 'rachel_hughes', isVerified: false, followers: '310.4K', nickname: 'Rachel Hughes', bio: 'houseofhughes@thestation.io, Cerebral Palsy Mama, 20% OFF BUCKED UP: RACHELHUGHES', profilePic: 'images/houseofhughes.jpeg' },
            { username: 'badge5022', isVerified: false, followers: '19.8K', nickname: 'Badge502', bio: 'Backup Account', profilePic: 'images/badge5022.jpeg' },           
            { username: 'raisingramsey2023', isVerified: false, followers: '1,200', nickname: 'RaisingRamsey2023', bio: 'The Adventures of Raising Ramsey. Come along as we watch Ramsey Play and Learn', profilePic: 'images/raisingramsey2023.jpeg' },
            { username: 'jerridc4', isVerified: false, followers: '478', nickname: 'Jerrid Cook', bio: '@raisingramsey2023, @benz.the beard', profilePic: 'images/jerridc4.jpeg' },
            { username: 'officalbusarmydude', isVerified: false, followers: '3', nickname: 'Bus Army Dude', bio: 'https://bus-army-dude.github.io/bus-army-dude/index.html', profilePic: 'images/busarmydude.jpg' },
         
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
        { username: 'mrbeast', isVerified: true, followers: '65.5M', nickname: 'MrBeast', bio: 'My New Show Beast Games is out now on Prime Video!', profilePic: 'instagram_photos/mrbeast.jpg' },    
        { username: 'applesauceandadhd', isVerified: true, followers: '736K', nickname: 'Jessica', bio: 'TeamJessSecrest@Gersh.com', profilePic: 'instagram_photos/applesauceandadhd.jpeg' },    
        { username: 'emtbadge502', isVerified: true, followers: '492K', nickname: 'Anthony Christian', bio: 'P.O. Box 775, Belleville, NJ 07109, EMT - 911/ EMD - CPR Instructor - Content Creator, Work Hard. Be Kind Always.', profilePic: 'instagram_photos/emtbadge502.jpg' },    
        { username: 'trafficlightdoctor', isVerified: true, followers: '310K', nickname: 'TrafficLightDoctor', bio: 'Follow My YouTube And TikTok!!', profilePic: 'instagram_photos/trafficlightdoctor.jpeg' },            
        { username: 'mrfattcheeto', isVerified: true, followers: '275K', nickname: 'Trent Parker', bio: "I'm like some HVAC Genius", profilePic: 'instagram_photos/mrfatcheeto.jpeg' },    
        { username: 'heyrachelhughes', isVerified: false, followers: '101K', nickname: 'Rachel Hughes', bio: 'PPersonal blog, YouTube + TikTok: Rachel_Hughes, ALL INQUIRIES: houseofhughes@thestation.io, 20% off Bucked Up: RACHELHUGHES', profilePic: 'instagram_photos/houseofhughes.jpeg' },                            
        { username: 'lisa.remillard', isVerified: true, followers: '95.1K', nickname: 'Lisa Remillard', bio: 'Public figure 📹 🎙Journalist, ▶️ Subcribe to my YouTube channel (@LisaRemillardOfficial)', profilePic: 'instagram_photos/lisaremillard.jpg' },                    
        { username: 'meetmeinthemediacenter', isVerified: true, followers: '51.3K', nickname: 'Jen Miller', bio: '✌🏻❤️&Toasty📚 680K on TikTok ✨Book Return Game 🫶🏻Middle School Librarian', profilePic: 'instagram_photos/meetmeinthemediacenter.jpeg' },    
        { username: 'kaylee_mertens_', isVerified: false, followers: '3,153', nickname: 'Kaylee Mertens', bio: 'Tik Tok: Kaylee_Mertens_', profilePic: 'instagram_photos/kayleemertens.jpeg' },    
        { username: 'riverkritzar', isVerified: false, followers: '86', nickname: 'River Jordan Kritzar', bio: "Hello, my name is River, I am 19. I am autistic. I love technology.", profilePic: 'instagram_photos/riverkritzar.jpg' },
        { username: 'rose_the_fox24', isVerified: false, followers: '80', nickname: 'Rose Haydu', bio: 'I’m 19, Drp/rp open, I’m taken by the love of my life @_jano_142_ 💜3/1/24💜', profilePic: 'instagram_photos/rosethefox24.jpg' },
        { username: '_jano_142_', isVerified: false, followers: '48', nickname: 'Nathan Haydu', bio: 'Cars are love, cars are life. Taken by @rose_the_fox24 ❤️(3/1/24)❤️#bncr33gtr:Best Skyline/🔰Dream car🚗#c7zr1:Last TRUE Vette/🇺🇸Dream car🏎', profilePic: 'instagram_photos/jano142.jpg' },    
        { username: 'busarmydude', isVerified: false, followers: '18', nickname: 'Bus Army Dude', bio: 'Hello, my name is River, I am 19. I am autistic. I love technology.', profilePic: 'instagram_photos/busarmydude.jpg' },
        // Add more Instagram creators as needed
    ],
    lastUpdatedTime: '2025-01-28T15:34:00', // Manually set the last updated date and time
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
        { username: '@MrBeast', isVerified: true, subscribers: '351M', nickname: 'MrBeast', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames SUBSCRIBE FOR A COOKIE!', profilePic: 'youtube_photoes/mrbeast.jpg' },
        { username: '@MrBeast2', isVerified: true, subscribers: '48.6M', nickname: 'MrBeast 2', bio: 'my second channel for other videos and shorts :) subscribe ', profilePic: 'youtube_photoes/mrbeast2.jpg' },
        { username: '@MrBeastGaming', isVerified: true, subscribers: '46.5M', nickname: 'MrBeast Gaming', bio: 'Go Watch Beast Games! https://unfur.ly/BeastGames MrBeast Gaming - SUBSCRIBE OR ELSE', profilePic: 'youtube_photoes/mrbeastgaming.jpg' },
        { username: '@BeastReacts', isVerified: true, subscribers: '35.3M', nickname: 'Beast Reacts', bio: 'SUBSCRIBE FOR A COOKIE', profilePic: 'youtube_photoes/beastreacts.jpg' },
        { username: '@BeastPhilanthropy', isVerified: true, subscribers: '27.3M', nickname: 'Beast Philanthropy', bio: '100% of the profits from my ad revenue, merch sales, and sponsorships will go towards making the world a better place!', profilePic: 'youtube_photoes/beastphilanthropy.jpg' },
        { username: '@rachel_hughes', isVerified: false, subscribers: '230K', nickname: 'Rachel Hughes', bio: 'My name is Rachel Hughes :) I am a 30 year old, mom of two, living in Utah! I love sharing my experiences and life regarding mental health, leaving religion, overcoming an eating disorder, having a disabled child, fitness, beauty and more! Thank you so much for being here. xo', profilePic: 'youtube_photoes/rachel_hughes.jpg' },        
        { username: '@Trafficlightdoctor', isVerified: false, subscribers: '152K', nickname: 'Traffic Light Doctor', bio: 'TrafficlightDoctor Live! explores traffic signals and road safety, while TrafficlightDoctor Live Gaming offers an immersive gaming experience.', profilePic: 'youtube_photoes/trafficlightdoctor.jpeg' },     
        { username: '@mrfatcheeto', isVerified: false, subscribers: '98.7K', nickname: 'Mr Fat Cheeto', bio: 'I’m like a HVAC Genius. Come join me on my crazy HVAC Comedy adventures ', profilePic: 'youtube_photoes/mrfatcheeto.jpg' },
        { username: '@Badge502', isVerified: false, subscribers: '60.9K', nickname: 'Badge502', bio: 'Your local EMT!', profilePic: 'youtube_photoes/badge502.jpg' },     
        // Add more YouTube creators as needed
    ],
    lastUpdatedTime: '2025-01-28T15:34:00', // Manually set the last updated date and time
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
    const newYear = new Date('2025-01-31T14:30:00');
    const diff = newYear - now;

    const countdownSection = document.querySelector('.countdown-section');
    if (!countdownSection) return;

    if (diff <= 0) {
        countdownSection.innerHTML = `
            <h2 style="color: var(--accent-color); font-size: 2.5em; margin-bottom: 20px;">
                YOU DID IT TODAY IS THE DAY YOU GET YOUR AFO BRACES!!!!!
            </h2>
            <div style="font-size: 1.5em; color: var(--text-color);">🎉 🎊 🎆 🎈</div>
        `;
    } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Update flip clock for days
        updateFlipClock('countdown-days', days);

        // Update flip clock for hours
        updateFlipClock('countdown-hours', hours);

        // Update flip clock for minutes
        updateFlipClock('countdown-minutes', minutes);

        // Update flip clock for seconds
        updateFlipClock('countdown-seconds', seconds);
    }
}

// Function to update flip clock value
function updateFlipClock(id, value) {
    const clock = document.getElementById(id);
    const front = clock.querySelector('.flip-clock-front');
    const back = clock.querySelector('.flip-clock-back');
    const valueStr = value.toString().padStart(2, '0');

    if (front.textContent !== valueStr) {
        front.textContent = valueStr;
        back.textContent = valueStr;

        // Trigger the flip animation
        clock.querySelector('.flip-clock-inner').classList.add('flip');

        setTimeout(() => {
            clock.querySelector('.flip-clock-inner').classList.remove('flip');
        }, 600); // match the animation duration
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
const lastUpdatedDate = "Tue, Jan 28, 2025";  // Set the date here (Day of the Week, Month, Day, Year)
const lastUpdatedTime = "03:34:00 PM";    // Set the time here (12-hour format)

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

// Back to top button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    
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
});

// Modern FAQ functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items first
            faqItems.forEach(faqItem => {
                // Add a closing animation class if it was active
                if (faqItem.classList.contains('active')) {
                    faqItem.classList.add('closing');
                    setTimeout(() => {
                        faqItem.classList.remove('closing');
                    }, 300); // Match this with your CSS transition time
                }
                faqItem.classList.remove('active');
            });
            
            // If the clicked item wasn't active before, open it
            if (!isActive) {
                item.classList.add('active');
                // Scroll the item into view if it's not fully visible
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
            }
        });
    });

    // Add keyboard navigation
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        
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
            }
        });
    });

    // Close FAQ when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.faq-item')) {
            faqItems.forEach(item => {
                if (item.classList.contains('active')) {
                    item.classList.add('closing');
                    setTimeout(() => {
                        item.classList.remove('active', 'closing');
                    }, 300);
                }
            });
        }
    });
});

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
