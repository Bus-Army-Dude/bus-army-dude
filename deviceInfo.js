function getOperatingSystem() {
    const userAgent = navigator.userAgent;
    let os = 'unknown';

    // Detect iOS devices (iPhone, iPad, iPod)
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        os = 'iOS';
    }
    // Detect macOS devices
    else if (/Macintosh/i.test(userAgent)) {
        os = 'macOS';
    }
    // Detect Windows
    else if (/Windows NT/i.test(userAgent)) {
        os = 'Windows';
    }
    // Detect Android
    else if (/Android/i.test(userAgent)) {
        os = 'Android';
    }
    // Detect Linux (but exclude Android)
    else if (/Linux/i.test(userAgent) && !/Android/i.test(userAgent)) {
        os = 'Linux'; // Make sure it's not Android
    }
    
    return os;
}

document.addEventListener('DOMContentLoaded', () => {
    const os = getOperatingSystem(); // This function gets the OS
    const osInfoElement = document.querySelector('.os-info');

    if (osInfoElement) {
        // Set the content of the element to just the OS name
        osInfoElement.textContent = `Operating System: ${os}`;
    }
});

