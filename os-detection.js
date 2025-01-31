function detectDetailedDevice() {
    try {
        const parser = new UAParser();
        const result = parser.getResult();
        const osName = result.os.name || 'Unknown OS';
        let osVersion = result.os.version || 'Unknown version';
        let deviceInfo = `${osName} ${osVersion}`;

        console.log("Parsed OS:", osName);
        console.log("Parsed OS Version:", osVersion);

        // Special handling for macOS versions
        if (osName === "Mac OS") {
            if (osVersion.startsWith("10.")) {
                let [major, minor] = osVersion.split('.').slice(1).map(Number);
                if (major >= 15) {
                    osVersion = `${major}.${minor}`;
                } else {
                    major = major - 9 + 11; // Adjust for macOS 11 and later
                    osVersion = `${major}.${minor}`;
                }
            }
            console.log("Adjusted macOS Version:", osVersion);
            deviceInfo = `macOS ${osVersion}`;
        }

        // Handle other OS versions
        if (osName === "iOS") {
            osVersion = navigator.userAgent.match(/OS (\d+(_\d+)*) like Mac OS X/)?.[1]?.replace(/_/g, '.') || osVersion;
            deviceInfo = `iPhone (iOS ${osVersion})`;
        } else if (osName === "iPadOS") {
            osVersion = navigator.userAgent.match(/OS (\d+(_\d+)*) like Mac OS X/)?.[1]?.replace(/_/g, '.') || osVersion;
            deviceInfo = `iPad (iPadOS ${osVersion})`;
        } else if (osName === "Android") {
            osVersion = navigator.userAgent.match(/Android\s*([\d.]+)/)?.[1] || osVersion;
            deviceInfo = `Android ${osVersion}`;
        } else if (osName === "Windows") {
            osVersion = navigator.userAgent.match(/Windows NT\s*([\d.]+)/)?.[1] || osVersion;
            deviceInfo = `Windows ${osVersion}`;
        } else if (osName === "Chrome OS") {
            osVersion = navigator.userAgent.match(/CrOS\s*([\d.]+)/)?.[1] || osVersion;
            deviceInfo = `Chrome OS ${osVersion}`;
        } else if (osName === "Linux") {
            osVersion = "Unknown"; // Linux distributions vary widely, so version detection is more complex
            deviceInfo = `Linux ${osVersion}`;
        }

        // Display the detected OS and version
        document.querySelector('.device-info').innerHTML = `OS Name: ${osName}, OS Version: ${osVersion}`;

        // Log result to the console
        console.log(deviceInfo);
    } catch (error) {
        console.error("Error detecting OS:", error);
        document.querySelector('.device-info').innerHTML = `Error detecting OS: ${error.message}`;
    }
}

// Call the function to detect the OS version after the window has loaded
window.addEventListener('load', detectDetailedDevice);
