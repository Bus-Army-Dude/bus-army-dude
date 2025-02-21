function getOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    console.log('User Agent:', userAgent);

    if (/Windows NT/i.test(userAgent)) {
        return 'Windows';
    }

    if (/Mac OS X/i.test(userAgent)) {
        if (/iPad|iPhone|iPod/.test(userAgent)) {
            return 'iOS'; // If iPhone, iPad, or iPod detected, return iOS
        }
        return 'macOS'; // Otherwise, return macOS
    }

    if (/Android/i.test(userAgent)) {
        return 'Android';
    }

    if (/Linux/i.test(userAgent)) {
        return 'Linux';
    }

    return 'unknown';
}

function getDeviceModel() {
    const userAgent = navigator.userAgent;
    let model = 'unknown';

    // Check for iOS devices (iPhone, iPad, iPod)
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        // Detect iPhone models
        if (/iPhone.*17,1/i.test(userAgent)) model = 'iPhone 16 Pro';
        if (/iPhone.*17,2/i.test(userAgent)) model = 'iPhone 16 Pro Max';
        if (/iPhone.*17,3/i.test(userAgent)) model = 'iPhone 16E'; // iPhone 16E
        if (/iPhone.*17,4/i.test(userAgent)) model = 'iPhone 16'; // iPhone 16
        if (/iPhone.*17,5/i.test(userAgent)) model = 'iPhone 16 Plus'; // iPhone 16 Plus
        if (/iPhone.*16,1/i.test(userAgent)) model = 'iPhone 15';
        if (/iPhone.*16,2/i.test(userAgent)) model = 'iPhone 15 Plus';
        if (/iPhone.*16,3/i.test(userAgent)) model = 'iPhone 15 Pro';
        if (/iPhone.*16,4/i.test(userAgent)) model = 'iPhone 15 Pro Max';
        if (/iPhone.*14,4/i.test(userAgent)) model = 'iPhone 14';
        if (/iPhone.*14,5/i.test(userAgent)) model = 'iPhone 14 Plus';
        if (/iPhone.*14,2/i.test(userAgent)) model = 'iPhone 14 Pro';
        if (/iPhone.*14,3/i.test(userAgent)) model = 'iPhone 14 Pro Max';
        if (/iPhone.*13,1/i.test(userAgent)) model = 'iPhone 13 Mini';
        if (/iPhone.*13,2/i.test(userAgent)) model = 'iPhone 13';
        if (/iPhone.*13,3/i.test(userAgent)) model = 'iPhone 13 Pro';
        if (/iPhone.*13,4/i.test(userAgent)) model = 'iPhone 13 Pro Max';
        if (/iPhone.*12,1/i.test(userAgent)) model = 'iPhone 12 Mini';
        if (/iPhone.*12,3/i.test(userAgent)) model = 'iPhone 12';
        if (/iPhone.*12,5/i.test(userAgent)) model = 'iPhone 12 Pro';
        if (/iPhone.*12,8/i.test(userAgent)) model = 'iPhone 12 Pro Max';
        if (/iPhone.*11,2/i.test(userAgent)) model = 'iPhone XS';
        if (/iPhone.*11,4/i.test(userAgent)) model = 'iPhone XS Max';
        if (/iPhone.*11,6/i.test(userAgent)) model = 'iPhone XR';
        if (/iPhone.*10,3/i.test(userAgent)) model = 'iPhone X';
        if (/iPhone.*10,1/i.test(userAgent)) model = 'iPhone 8';
        if (/iPhone.*10,4/i.test(userAgent)) model = 'iPhone 8 Plus';
        if (/iPhone.*9,1/i.test(userAgent)) model = 'iPhone 7';
        if (/iPhone.*9,2/i.test(userAgent)) model = 'iPhone 7 Plus';
        if (/iPhone.*8,1/i.test(userAgent)) model = 'iPhone 6s';
        if (/iPhone.*8,2/i.test(userAgent)) model = 'iPhone 6s Plus';
        if (/iPhone.*7,1/i.test(userAgent)) model = 'iPhone 6 Plus';
        if (/iPhone.*7,2/i.test(userAgent)) model = 'iPhone 6';

        // Handle iPhone SE models
        if (/iPhone.*12,8/i.test(userAgent)) model = 'iPhone SE (2nd Generation)';
        if (/iPhone.*14,6/i.test(userAgent)) model = 'iPhone SE (3rd Generation)';
    }

    // Check for iPad
    if (/iPad/.test(userAgent)) {
        model = 'iPad';
    }

    // Check for MacOS Devices
    if (/Macintosh/i.test(userAgent)) {
        if (/MacBook Pro/i.test(userAgent)) model = 'MacBook Pro';
        if (/MacBook Air/i.test(userAgent)) model = 'MacBook Air';
        if (/Mac Mini/i.test(userAgent)) model = 'Mac Mini';
        if (/iMac/i.test(userAgent)) model = 'iMac';
        if (/Mac Pro/i.test(userAgent)) model = 'Mac Pro';
    }

    // Check for Android Devices
    if (/Android/i.test(userAgent)) {
        const androidModelMatch = userAgent.match(/\((.*?)\)/);
        if (androidModelMatch && androidModelMatch.length > 1) {
            const modelDetails = androidModelMatch[1].split(';');
            model = modelDetails[1] || 'Generic Android Device'; // Return model details
        }
    }

    // Check for Smart TVs or Wearable Devices
    if (/Smart-TV/i.test(userAgent)) {
        model = 'Smart TV';
    } else if (/Watch/i.test(userAgent)) {
        model = 'Wearable Device';
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
