document.addEventListener("DOMContentLoaded", function() {
    // Function to detect OS and version
    function detectOS() {
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;
        let os = "Unknown OS";
        let osVersion = "Unknown Version";

        // Debug: Print full User-Agent for debugging
        console.log("User-Agent: ", userAgent);

        // Check for iOS
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            os = "iOS";
            const match = userAgent.match(/OS (\d+_\d+_\d+)/);
            if (match) {
                osVersion = match[1].replace(/_/g, ".");
            }
        }
        // Check for Android
        else if (/android/i.test(userAgent)) {
            os = "Android";
            const match = userAgent.match(/Android (\d+\.\d+(\.\d+)?)/);
            if (match) {
                osVersion = match[1];
            }
        }
        // Check for macOS
        else if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
            os = "macOS";
            const match = userAgent.match(/Mac OS X (\d+_\d+_\d+)/);
            if (match) {
                osVersion = match[1].replace(/_/g, ".");
            } else {
                const matchAlt = userAgent.match(/Mac OS (\d+\.\d+)/);
                if (matchAlt) {
                    osVersion = matchAlt[1];
                }
            }
        }
        // Check for Windows
        else if (/Windows NT/.test(userAgent)) {
            os = "Windows";
            const match = userAgent.match(/Windows NT (\d+\.\d+)/);
            if (match) {
                osVersion = match[1];
            }
        }
        // Check for Linux
        else if (/Linux/.test(userAgent)) {
            os = "Linux";
            osVersion = "N/A";
        }

        // Output detected OS info for debugging
        console.log(`Detected OS: ${os}, Version: ${osVersion}`);

        document.getElementById("os-info").textContent = `${os} ${osVersion}`;
        checkOSVersion(os, osVersion);
    }

    // Function to check if the user's OS version is the latest
    function checkOSVersion(os, userVersion) {
        const latestVersions = {
            "iOS": "18.4",         // Latest iOS version supported by browsers
            "Android": "14.0",     // Latest Android version supported by browsers
            "macOS": "15.4",       // Latest macOS version supported by browsers
            "Windows": "10.0",     // Latest Windows version supported by browsers
            "Linux": "latest"      // Use a general "latest" marker for Linux
        };

        // If the user's OS is outdated
        if (os === "iOS" && compareVersions(userVersion, latestVersions.iOS) < 0) {
            alert("You need the latest version of iOS to use this website.");
            window.location.href = "https://www.apple.com/ios/ios-18-preview"; // Redirect to iOS update page
        } else if (os === "Android" && compareVersions(userVersion, latestVersions.Android) < 0) {
            alert("You need the latest version of Android to use this website.");
            window.location.href = "https://www.android.com/versions"; // Redirect to Android update page
        } else if (os === "macOS" && compareVersions(userVersion, latestVersions.macOS) < 0) {
            alert("You need the latest version of macOS to use this website.");
            window.location.href = "https://www.apple.com/macos"; // Redirect to macOS update page
        } else if (os === "Windows" && compareVersions(userVersion, latestVersions.Windows) < 0) {
            alert("You need the latest version of Windows to use this website.");
            window.location.href = "https://www.microsoft.com/en-us/software-download/windows10"; // Redirect to Windows update page
        }
    }

    // Version comparison function (e.g., 14.0 vs 13.2)
    function compareVersions(v1, v2) {
        const v1Parts = v1.split('.').map(num => parseInt(num, 10));
        const v2Parts = v2.split('.').map(num => parseInt(num, 10));

        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const v1Part = v1Parts[i] || 0;
            const v2Part = v2Parts[i] || 0;
            if (v1Part < v2Part) return -1;
            if (v1Part > v2Part) return 1;
        }
        return 0;
    }

    // Run the OS detection and version check
    detectOS();
});
