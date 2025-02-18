function getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    console.log('User Agent:', userAgent);

    if (/android/i.test(userAgent)) {
        console.log('Detected Android OS');
        return 'Android';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        console.log('Detected iOS');
        return 'iOS';
    }

    console.log('OS unknown');
    return 'unknown';
}

function getOSVersion() {
    const userAgent = navigator.userAgent;
    let version = 'unknown';

    if (getMobileOperatingSystem() === 'Android') {
        const versionMatch = userAgent.match(/Android\s*([0-9.]+)/);
        if (versionMatch && versionMatch.length > 1) {
            version = versionMatch[1];
        }
    } else if (getMobileOperatingSystem() === 'iOS') {
        const versionMatch = userAgent.match(/OS (\d+[_\.\d]+)/);
        if (versionMatch && versionMatch.length > 1) {
            version = versionMatch[1].replace(/_/g, '.');
        }
    }

    console.log('Detected OS Version:', version);
    return version;
}

function getDeviceModel() {
    const userAgent = navigator.userAgent;
    let model = 'unknown';

    if (getMobileOperatingSystem() === 'Android') {
        const androidModelMatch = userAgent.match(/\((.*?)\)/);
        if (androidModelMatch && androidModelMatch.length > 1) {
            model = androidModelMatch[1].split(';')[1].trim();
        }
    } else if (getMobileOperatingSystem() === 'iOS') {
        const iOSModelMatch = userAgent.match(/\((.*?)\)/);
        if (iOSModelMatch && iOSModelMatch.length > 1) {
            model = iOSModelMatch[1].split(';')[0].trim();
        }
    }

    console.log('Detected Device Model:', model);
    return model;
}

document.addEventListener('DOMContentLoaded', () => {
    const os = getMobileOperatingSystem();
    const osVersion = getOSVersion();
    const model = getDeviceModel();
    
    console.log(`Operating System: ${os}, OS Version: ${osVersion}, Device Model: ${model}`);

    const deviceInfoElement = document.querySelector('.device-info');
    deviceInfoElement.textContent = `Operating System: ${os} ${osVersion}, Device Model: ${model}`;
});
