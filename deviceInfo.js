function getOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows
    if (/Windows NT/i.test(userAgent)) {
        return 'Windows';
    }

    // macOS
    if (/Macintosh/i.test(userAgent)) {
        if (/Mac OS X/i.test(userAgent)) {
            return 'macOS';
        }
        return 'Mac'; // Catch-all for macOS-like devices
    }

    // iOS - iPhone, iPad, iPod
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        return 'iOS';
    }

    // Android
    if (/Android/i.test(userAgent)) {
        return 'Android';
    }

    // Linux
    if (/Linux/i.test(userAgent)) {
        return 'Linux';
    }

    return 'Unknown';
}

function getDeviceModel() {
    const userAgent = navigator.userAgent;
    let model = 'Unknown Device';

    // iOS Devices (iPhone, iPad, iPod)
    if (/iPhone/i.test(userAgent)) {
        if (/iPhone.*16,1/i.test(userAgent)) model = 'iPhone 16 Pro';
        else if (/iPhone.*16,2/i.test(userAgent)) model = 'iPhone 16 Pro Max';
        else if (/iPhone.*16,3/i.test(userAgent)) model = 'iPhone 16E';
        else if (/iPhone.*16,4/i.test(userAgent)) model = 'iPhone 16';
        else if (/iPhone.*16,5/i.test(userAgent)) model = 'iPhone 16 Plus';
        else if (/iPhone.*15/i.test(userAgent)) model = 'iPhone 15';
        else if (/iPhone.*14/i.test(userAgent)) model = 'iPhone 14';
        else if (/iPhone.*13/i.test(userAgent)) model = 'iPhone 13';
        else if (/iPhone.*12/i.test(userAgent)) model = 'iPhone 12';
        else model = 'iPhone (Unknown Model)';
    } 
    else if (/iPad/i.test(userAgent)) {
        model = 'iPad';
    } 
    else if (/iPod/i.test(userAgent)) {
        model = 'iPod';
    }

    // Android Devices
    else if (/Android/i.test(userAgent)) {
        const androidMatch = userAgent.match(/Android\s([0-9\.]*)/);
        if (androidMatch) {
            model = `Android ${androidMatch[1]}`;
        } else {
            model = 'Android Device';
        }
    }

    // macOS Devices (MacBook, Mac Mini, etc.)
    else if (/Mac/i.test(userAgent)) {
        if (/MacBook Pro/i.test(userAgent)) model = 'MacBook Pro';
        else if (/MacBook Air/i.test(userAgent)) model = 'MacBook Air';
        else if (/Mac Mini/i.test(userAgent)) model = 'Mac Mini';
        else model = 'macOS Device';
    }

    // Windows Devices
    else if (/Windows NT/i.test(userAgent)) {
        model = 'Windows Device';
    }

    // Linux Devices
    else if (/Linux/i.test(userAgent)) {
        model = 'Linux Device';
    }

    return model;
}

document.addEventListener('DOMContentLoaded', () => {
    const os = getOperatingSystem();
    const model = getDeviceModel();

    console.log(`Operating System: ${os}, Device Model: ${model}`);

    const deviceInfoElement = document.querySelector('.device-info');
    if (deviceInfoElement) {
        deviceInfoElement.textContent = `Operating System: ${os}, Device Model: ${model}`;
    }
});
