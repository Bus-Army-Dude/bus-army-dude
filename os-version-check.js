function detectDetailedDevice() {
    const ua = navigator.userAgent;
    console.log("User Agent:", ua);  // Log the user agent string for debugging
    let deviceInfo = '';

    const supportedOSVersions = {
        "Windows": ["10", "11", "Windows Server 2016", "Windows Server 2019", "Windows Server 2022"],
        "macOS": ["11.0", "11.0.1", "11.1", "11.2", "11.2.1", "11.2.2", "11.2.3", "11.3", "11.3.1", "11.4", "11.5", "11.5.1", "11.5.2", "11.6", "11.6.1", "11.6.2", "11.6.3", "11.6.4", "11.6.5", "11.6.6", "11.6.7", "11.6.8", "11.7", "11.7.1", "11.7.2", "11.7.3", "11.7.4", "11.7.5", "11.7.6", "11.7.7", "11.7.8", "11.7.9", "11.7.10", "12.0", "12.0.1", "12.1", "12.2", "12.2.1", "12.3", "12.3.1", "12.4", "12.5", "12.5.1", "12.6", "12.6.1", "12.6.2", "12.6.3", "12.6.4", "12.6.5", "12.6.6", "12.6.7", "12.6.8", "12.6.9", "12.7", "12.7.1", "12.7.2", "12.7.3", "12.7.4", "12.7.5", "12.7.6", "13.0", "13.0.1", "13.1", "13.2", "13.2.1", "13.3", "13.3.1", "13.3.1 (a)", "13.4", "13.4.1", "13.4.1 (a)", "13.4.1 (c)", "13.5", "13.5.1", "13.5.2", "13.6", "13.6.1", "13.6.2", "13.6.3", "13.6.4", "13.6.5", "13.6.6", "13.6.7", "13.6.8", "13.6.9", "13.7", "13.7.1", "13.7.2", "13.7.3", "14.0", "14.1", "14.1.1", "14.1.2", "14.2", "14.2.1", "14.3", "14.3.1", "14.4", "14.4.1", "14.5", "14.6", "14.6.1", "14.7", "14.7.1", "14.7.2", "14.7.3", "15.0", "15.0.1", "15.1", "15.1.1", "15.2", "15.3"],
        "ChromeOS": ["96", "97", "98", "99", "100"], // ChromeOS 96 and later
        "Android": ["8.0", "8.1", "9", "10", "11", "12", "12.1", "13", "14", "15", "16 beta 1"], // Oreo and later
        "Linux": ["Ubuntu 18.04", "Ubuntu 20.04", "Ubuntu 22.04", "Debian 10", "Debian 11", "openSUSE 15.5", "Fedora 39"], // Ubuntu 18.04+, Debian 10+, openSUSE 15.5+, Fedora 39+
        "iOS": ["15", "15.0.1", "15.0.2", "15.1", "15.1.1", "15.2", "15.2.1", "15.3", "15.3.1", "15.4", "15.4.1", "15.5", "15.6", "15.6.1", "15.7", "15.7.1", "15.7.2", "15.7.3", "15.7.4", "15.7.5", "15.7.6", "15.7.7", "15.7.8", "15.7.9", "15.8", "15.8.1", "15.8.2", "15.8.3", "16", "16.0.1", "16.0.2", "16.0.3", "16.1", "16.1.1", "16.1.2", "16.2", "16.3", "16.3.1", "16.4", "16.4.1", "16.5", "16.5.1", "16.6", "16.6.1", "16.7", "16.7.1", "16.7.2", "16.7.3", "16.7.4", "16.7.5", "16.7.6", "16.7.7", "16.7.8", "16.7.9", "16.7.10", "17", "17.0.1", "17.0.2", "17.0.3", "17.1", "17.1.1", "17.1.2", "17.2", "17.2.1", "17.3", "17.3.1", "17.4", "17.4.1", "17.5", "17.5.1", "17.6", "17.6.1", "17.7", "17.7.1", "17.7.2", "18", "18.0.1", "18.1", "18.1.1", "18.2", "18.2.1", "18.3"],
        "iPadOS": ["16.1", "16.1.1", "16.2", "16.3", "16.3.1", "16.4", "16.4.1", "16.5", "16.5.1", "16.6", "16.6.1", "16.7", "16.7.1", "16.7.2", "16.7.3", "16.7.4", "16.7.5", "16.7.6", "16.7.7", "16.7.8", "16.7.9", "16.7.10", "17", "17.0.1", "17.0.2", "17.0.3", "17.1", "17.1.1", "17.1.2", "17.2", "17.3", "17.3.1", "17.4", "17.4.1", "17.5", "17.5.1", "17.6", "17.6.1", "17.7", "17.7.1", "17.7.2", "17.7.3", "17.7.4", "18", "18.0.1", "18.1", "18.1.1", "18.2", "18.2.1", "18.3"]
    };

    const getOSVersion = (platform) => {
        switch (platform) {
            case 'Windows':
                return (ua.match(/Windows NT (\d+\.\d+)/) || [])[1];
            case 'macOS':
                return (ua.match(/Mac OS X (\d+[_\.\d]+)/) || [])[1]?.replace(/_/g, '.');
            case 'ChromeOS':
                return (ua.match(/CrOS\s.*?\sChrome\/(\d+)/) || [])[1];
            case 'Android':
                return (ua.match(/Android\s([0-9.]+)/) || [])[1];
            case 'iOS':
                return (ua.match(/iPhone OS (\d+[_\d]+)/) || [])[1]?.replace(/_/g, '.');
            case 'iPadOS':
                return (ua.match(/iPadOS (\d+[_\d]+)/) || [])[1]?.replace(/_/g, '.');
            case 'Linux':
                if (ua.includes("Ubuntu")) return "Ubuntu " + (ua.match(/Ubuntu\/([0-9.]+)/) || [])[1];
                if (ua.includes("Debian")) return "Debian " + (ua.match(/Debian\/([0-9.]+)/) || [])[1];
                if (ua.includes("Fedora")) return "Fedora " + (ua.match(/Fedora\/([0-9.]+)/) || [])[1];
                if (ua.includes("openSUSE")) return "openSUSE " + (ua.match(/openSUSE\/([0-9.]+)/) || [])[1];
                return "Linux";
            default:
                return "Unknown";
        }
    };

    const platform = (() => {
        if (/Windows NT/.test(ua)) return 'Windows';
        if (/Mac OS X/.test(ua)) return 'macOS';
        if (/CrOS/.test(ua)) return 'ChromeOS';
        if (/Android/.test(ua)) return 'Android';
        if (/iPhone/.test(ua)) return 'iOS';
        if (/iPad/.test(ua)) return 'iPadOS';
        if (/Linux/.test(ua)) return 'Linux';
        return 'Unknown';
    })();

    const version = getOSVersion(platform);
    deviceInfo = `${platform} ${version}`;
    console.log("Detected OS:", deviceInfo);  // Log the detected OS information

    const isSupported = supportedOSVersions[platform]?.some(supportedVersion => version.startsWith(supportedVersion));
    console.log("Is Supported:", isSupported);  // Log whether the OS version is supported

    return { deviceInfo, isSupported };
}

const { deviceInfo, isSupported } = detectDetailedDevice();

const deviceInfoDiv = document.querySelector('.device-info');
if (deviceInfoDiv) {
    if (isSupported) {
        deviceInfoDiv.textContent = `Your operating system version (${deviceInfo}) is supported.`;
    } else {
        deviceInfoDiv.textContent = `Your operating system version (${deviceInfo}) is not supported. Please upgrade to a supported version.`;
    }
} else {
    console.error('Element with class "device-info" not found.');
}
