function getOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    console.log('User Agent:', userAgent);

    if (/Windows NT/i.test(userAgent)) {
        return 'Windows';
    }

    if (/Mac OS X/i.test(userAgent)) {
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'iOS';
        }
        return 'macOS';
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

    if (/Android/i.test(userAgent)) {
        const androidModelMatch = userAgent.match(/\((.*?)\)/);
        if (androidModelMatch && androidModelMatch.length > 1) {
            model = androidModelMatch[1].split(';')[1].trim();
        }
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        const iOSModelMatch = userAgent.match(/\((.*?)\)/);
        if (iOSModelMatch && iOSModelMatch.length > 1) {
            model = iOSModelMatch[1].split(';')[0].trim();
        }
    } else if (/Windows NT/i.test(userAgent)) {
        model = 'Windows PC';
    } else if (/Mac OS X/i.test(userAgent)) {
        model = 'Mac';
    } else if (/Linux/i.test(userAgent)) {
        model = 'Linux PC';
    }

    return model;
}

document.addEventListener('DOMContentLoaded', () => {
    const os = getOperatingSystem();
    const model = getDeviceModel();
    
    console.log(`Operating System: ${os}, Device Model: ${model}`);

    const deviceInfoElement = document.querySelector('.device-info');
    deviceInfoElement.textContent = `Operating System: ${os}, Device Model: ${model}`;
});
