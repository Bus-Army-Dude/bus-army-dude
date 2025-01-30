// version.js
const VERSION_CONFIG = {
    version: 'v1.11.0',
    build: '2025.1.27',
    userLogin: 'BusArmyDude',
    currentUTC: '2025-01-30 18:43:31',
    supportedVersions: {
        iOS: ['15.0', '15.0.1', '15.0.2', '15.1', '15.1.1', '15.2', '15.2.1', '15.3'],
        iPadOS: ['16.1', '16.1.1', '16.2', '16.3', '16.3.1', '16.4', '16.4.1', '16.5', '16.5.1'],
        macOS: ['15.0', '15.0.1', '15.1', '15.1.1', '15.2', '15.3'],
        Android: ['12', '12.1', '13', '14', '15', '16 beta 1'],
        Windows: ['10', '11'],
        Linux: ['Ubuntu', 'CentOS', 'Debian', 'Fedora'],
        ChromeOS: ['132', '133', '134', '135', '136', '137', '138']
    }
};

// Mapping macOS versions to marketing names
const macOSVersionMap = {
    '10.15': '15',
    '11': '11',
    '12': '12',
    '13': '13',
    '14': '14',
    '15': '15'
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeVersionSystem();
});

function initializeVersionSystem() {
    // Set static information
    setVersionElement('.version-number', VERSION_CONFIG.version);
    setVersionElement('.build-number', VERSION_CONFIG.build);
    setVersionElement('.user-login', VERSION_CONFIG.userLogin);
    setVersionElement('.device-info', detectDetailedDevice());
    
    // Start time updates
    updateVersionTimes();
    startVersionRefreshCountdown();
    setInterval(updateVersionTimes, 1000);
}

function setVersionElement(selector, content) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = content;
    }
}

function detectDetailedDevice() {
    const ua = navigator.userAgent;
    
    // iOS/iPadOS Detection
    if (ua.includes('iPhone') || ua.includes('iPad')) {
        const match = ua.match(/OS (\d+_\d+(_\d+)?)/);
        if (match) {
            const version = match[1].replace(/_/g, '.');
            return `${ua.includes('iPad') ? 'iPadOS' : 'iOS'} ${version}`;
        }
    }
    // macOS Detection
    else if (ua.includes('Mac OS X')) {
        const match = ua.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
        if (match) {
            const version = match[1].replace(/_/g, '.');
            const majorVersion = version.split('.')[0];
            const minorVersion = version.split('.')[1];
            const mappedVersion = macOSVersionMap[majorVersion + '.' + minorVersion] || majorVersion;
            const finalVersion = version.split('.').slice(2).join('.');
            const fullVersion = finalVersion ? `${mappedVersion}.${finalVersion}` : mappedVersion;
            // Check if the fullVersion is in the supported versions list
            if (VERSION_CONFIG.supportedVersions.macOS.includes(fullVersion)) {
                return `macOS ${fullVersion}`;
            } else {
                return `macOS ${mappedVersion}`;
            }
        }
    }
    // ChromeOS Detection
    else if (ua.includes('CrOS')) {
        const match = ua.match(/CrOS\s+[^\s]+\s+(\d+\.\d+\.\d+)/);
        if (match) {
            const version = match[1].split('.')[0]; // Use only the major version
            if (VERSION_CONFIG.supportedVersions.ChromeOS.includes(version)) {
                return `ChromeOS ${version}`;
            }
        }
    }
    // Android Detection
    else if (ua.includes('Android')) {
        const match = ua.match(/Android (\d+(\.\d+)*)/);
        if (match) return `Android ${match[1]}`;
    }
    // Windows Detection
    else if (ua.includes('Windows')) {
        if (ua.includes('Windows NT 10.0')) {
            return parseInt(ua.match(/build\s*(\d+)/)[1]) >= 22000 ? 'Windows 11' : 'Windows 10';
        }
    }
    // Linux Detection
    else if (ua.includes('Linux')) {
        for (const distro of VERSION_CONFIG.supportedVersions.Linux) {
            if (ua.includes(distro)) return `${distro} Linux`;
        }
        return 'Linux';
    }
    return 'Unknown Operating System';
}

function updateVersionTimes() {
    const now = new Date();
    
    // Update UTC time
    setVersionElement('.utc-time', now.toISOString().replace('T', ' ').slice(0, 19));
    
    // Update local time
    setVersionElement('.update-time', now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short'
    }));
}

function startVersionRefreshCountdown() {
    const refreshInterval = 5 * 60; // 5 minutes in seconds
    let timeLeft = refreshInterval;
    
    function updateVersionRefreshCountdown() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        setVersionElement('.version-countdown', 
            `Page refreshing in: ${minutes}m ${seconds}s`);
        
        if (timeLeft === 0) {
            smoothVersionReload();
        } else {
            timeLeft--;
        }
    }
    
    updateVersionRefreshCountdown();
    setInterval(updateVersionRefreshCountdown, 1000);
}

function smoothVersionReload() {
    document.body.style.opacity = '0';
    setTimeout(() => location.reload(), 500);
}
