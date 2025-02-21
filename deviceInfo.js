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
        // More comprehensive Android device matching
        const androidModelMatch = userAgent.match(/\((.*?)\)/);
        if (androidModelMatch && androidModelMatch.length > 1) {
            const modelDetails = androidModelMatch[1].split(';');
            if (modelDetails.length > 2) {
                model = modelDetails[2].trim(); // Try extracting 3rd item (model details)
            } else if (modelDetails.length > 1) {
                model = modelDetails[1].trim(); // Fallback to 2nd item
            } else {
                model = modelDetails[0].trim(); // Just in case
            }

            // Detect if it's a TV or wearable device
            if (/Smart-TV/i.test(userAgent)) {
                model += ' (Smart TV)';
            } else if (/Watch/i.test(userAgent)) {
                model += ' (Wearable)';
            }
        }
        if (model === 'unknown') {
            console.warn('Unknown Android device detected:', userAgent);
            model = 'Generic Android Device'; // Fallback if model still unknown
        }
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        // More detailed matching for iOS devices
        const iOSModelMatch = userAgent.match(/(iPhone|iPad|iPod).*?([0-9]+),([0-9]+)/);
        if (iOSModelMatch) {
            const deviceType = iOSModelMatch[1];
            const modelNumber = `${iOSModelMatch[2]},${iOSModelMatch[3]}`;
            model = `${deviceType} ${modelNumber}`;
        } else if (/iPad/i.test(userAgent)) {
            model = 'iPad';
        } else if (/iPhone/i.test(userAgent)) {
            model = 'iPhone';
        } else if (/iPod/i.test(userAgent)) {
            model = 'iPod';
        } else {
            console.warn('Unknown iOS device detected:', userAgent);
            model = 'Generic iOS Device'; // Fallback if no match
        }

        // Handle cases for Apple Watch and Apple TV
        if (/Watch/i.test(userAgent)) {
            model = 'Apple Watch';
        } else if (/AppleTV/i.test(userAgent)) {
            model = 'Apple TV';
        }
    } else if (/Windows NT/i.test(userAgent)) {
        model = 'Windows PC';
    } else if (/Mac OS X/i.test(userAgent)) {
        model = 'Mac';
    } else if (/Linux/i.test(userAgent)) {
        model = 'Linux PC';
    } else {
        console.warn('Unknown device detected:', userAgent);
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
