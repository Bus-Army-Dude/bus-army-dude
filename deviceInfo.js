function getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        return 'Android';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS';
    }

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

    return model;
}

window.onload = () => {
    const os = getMobileOperatingSystem();
    const osVersion = getOSVersion();
    const model = getDeviceModel();
    
    const deviceInfoElement = document.querySelector('.device-info');
    deviceInfoElement.textContent = `Operating System: ${os} ${osVersion}, Device Model: ${model}`;
};
