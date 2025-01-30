// version.js
const CONFIG = {
    version: 'v1.11.0',
    build: '2025.1.27',
    userLogin: 'BusArmyDude',
    currentUTC: '2025-01-30 18:30:07',
    supportedVersions: {
        iOS: {
            '15': ['15.0', '15.0.1', '15.0.2', '15.1', '15.1.1', '15.2', '15.2.1', '15.3', '15.3.1', '15.4', '15.4.1', '15.5', '15.6', '15.6.1', '15.7', '15.7.1', '15.7.2', '15.7.3', '15.7.4', '15.7.5', '15.7.6', '15.7.7', '15.7.8', '15.7.9', '15.8', '15.8.1', '15.8.2', '15.8.3'],
            '16': ['16.0.1', '16.0.2', '16.0.3', '16.1', '16.1.1', '16.1.2', '16.2', '16.3', '16.3.1', '16.4', '16.4.1', '16.5', '16.5.1', '16.6', '16.6.1', '16.7', '16.7.1', '16.7.2', '16.7.3', '16.7.4', '16.7.5', '16.7.6', '16.7.7', '16.7.8', '16.7.9', '16.7.10'],
            '17': ['17.0.1', '17.0.2', '17.0.3', '17.1', '17.1.1', '17.1.2', '17.2', '17.2.1', '17.3', '17.3.1', '17.4', '17.4.1', '17.5', '17.5.1', '17.6', '17.6.1', '17.7', '17.7.1', '17.7.2'],
            '18': ['18.0.1', '18.1', '18.1.1', '18.2', '18.2.1', '18.3']
        },
        iPadOS: {
            '16': ['16.1', '16.1.1', '16.2', '16.3', '16.3.1', '16.4', '16.4.1', '16.5', '16.5.1', '16.6', '16.6.1', '16.7', '16.7.1', '16.7.2', '16.7.3', '16.7.4', '16.7.5', '16.7.6', '16.7.7', '16.7.8', '16.7.9', '16.7.10'],
            '17': ['17.0.1', '17.0.2', '17.0.3', '17.1', '17.1.1', '17.1.2', '17.2', '17.3', '17.3.1', '17.4', '17.4.1', '17.5', '17.5.1', '17.6', '17.6.1', '17.7', '17.7.1', '17.7.2', '17.7.3', '17.7.4'],
            '18': ['18.0.1', '18.1', '18.1.1', '18.2', '18.2.1', '18.3']
        },
        macOS: {
            '11': ['11.0', '11.0.1', '11.1', '11.2', '11.2.1', '11.2.2', '11.2.3', '11.3', '11.3.1', '11.4', '11.5', '11.5.1', '11.5.2', '11.6', '11.6.1', '11.6.2', '11.6.3', '11.6.4', '11.6.5', '11.6.6', '11.6.7', '11.6.8', '11.7', '11.7.1', '11.7.2', '11.7.3', '11.7.4', '11.7.5', '11.7.6', '11.7.7', '11.7.8', '11.7.9', '11.7.10'],
            '12': ['12.0', '12.0.1', '12.1', '12.2', '12.2.1', '12.3', '12.3.1', '12.4', '12.5', '12.5.1', '12.6', '12.6.1', '12.6.2', '12.6.3', '12.6.4', '12.6.5', '12.6.6', '12.6.7', '12.6.8', '12.6.9', '12.7', '12.7.1', '12.7.2', '12.7.3', '12.7.4', '12.7.5', '12.7.6'],
            '13': ['13.0', '13.0.1', '13.1', '13.2', '13.2.1', '13.3', '13.3.1', '13.4', '13.4.1', '13.5', '13.5.1', '13.5.2', '13.6', '13.6.1', '13.6.2', '13.6.3', '13.6.4', '13.6.5', '13.6.6', '13.6.7', '13.6.8', '13.6.9', '13.7', '13.7.1', '13.7.2', '13.7.3'],
            '14': ['14.0', '14.1', '14.1.1', '14.1.2', '14.2', '14.2.1', '14.3', '14.3.1', '14.4', '14.4.1', '14.5', '14.6', '14.6.1', '14.7', '14.7.1', '14.7.2', '14.7.3'],
            '15': ['15.0', '15.0.1', '15.1', '15.1.1', '15.2', '15.3']
        },
        Android: {
            '12': ['12', '12.1'],
            '13': ['13'],
            '14': ['14'],
            '15': ['15'],
            '16': ['16 beta 1']
        },
        Windows: ['10', '11'],
        Linux: ['Ubuntu', 'CentOS', 'Debian', 'Fedora']
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeVersionInfo();
    startVersionTimeUpdates();
});

function initializeVersionInfo() {
    // Set static information
    document.querySelector('.version-number').textContent = CONFIG.version;
    document.querySelector('.build-number').textContent = CONFIG.build;
    document.querySelector('.user-login').textContent = CONFIG.userLogin;
    document.querySelector('.device-info').textContent = detectDetailedDevice();
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
            return `macOS ${version}`;
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
        for (const distro of CONFIG.supportedVersions.Linux) {
            if (ua.includes(distro)) return `${distro} Linux`;
        }
        return 'Linux';
    }
    return 'Unknown Operating System';
}

function startVersionTimeUpdates() {
    updateVersionTimes();
    startVersionCountdown();
    setInterval(updateVersionTimes, 1000);
}

function updateVersionTimes() {
    const now = new Date();
    
    // Update UTC time
    document.querySelector('.utc-time').textContent = 
        now.toISOString().replace('T', ' ').slice(0, 19);
    
    // Update local time
    document.querySelector('.update-time').textContent = 
        now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZoneName: 'short'
        });
}

function startVersionCountdown() {
    const refreshInterval = 5 * 60; // 5 minutes in seconds
    let timeLeft = refreshInterval;
    
    function updateVersionCountdown() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.querySelector('.version-countdown').textContent = 
            `Page refreshing in: ${minutes}m ${seconds}s`;
        
        if (timeLeft === 0) {
            location.reload();
        } else {
            timeLeft--;
        }
    }
    
    updateVersionCountdown();
    setInterval(updateVersionCountdown, 1000);
}
