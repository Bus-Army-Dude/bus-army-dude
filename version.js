// version.js
const VERSION_CONFIG = {
    userOS: 'macOS 15.3',
    supportedVersions: {
        iOS: [
            // iOS - Safari requires the latest major version
            '16.7.2', // Last iOS 16
            '17.0', '17.0.1', '17.0.2', '17.0.3', '17.1', '17.1.1', '17.1.2', '17.2', '17.2.1', '17.3'  // Current iOS versions
        ],
        iPadOS: [
            // iPadOS - Safari requires the latest major version
            '16.7.2', // Last iPadOS 16
            '17.0', '17.0.1', '17.0.2', '17.0.3', '17.1', '17.1.1', '17.1.2', '17.2', '17.2.1', '17.3'  // Current iPadOS versions
        ],
        macOS: [
            // macOS - Based on browser support
            '11.7.10',  // Big Sur (Oldest supported by Chrome/Firefox)
            '12.7.2',   // Monterey
            '13.6.3',   // Ventura
            '14.3',     // Sonoma (Current)
            '15.3'      // Your version
        ],
        Android: [
            // Android - Based on Chrome/Firefox support
            '11',    // Oldest supported by Chrome
            '12',
            '13',
            '14'     // Latest
        ],
        Windows: [
            // Windows - Based on browser support
            '10',    // Windows 10 (Build 19045)
            '11'     // Windows 11 (Build 22631)
        ],
        Linux: [
            // Major distributions supported by modern browsers
            'Ubuntu',    // 20.04 LTS and newer
            'Fedora',    // 37 and newer
            'Debian',    // 11 and newer
            'openSUSE',  // Leap 15.4 and newer
            'Red Hat',   // RHEL 8 and newer
            'CentOS'     // 8 and newer
        ],
        ChromeOS: [
            // ChromeOS - Latest LTS and stable channels
            '117', // LTS
            '118', // LTS
            '119', // Extended Stable
            '120', // Extended Stable
            '121'  // Current Stable
        ]
    }
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
