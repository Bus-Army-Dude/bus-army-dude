document.addEventListener("DOMContentLoaded", function() {
    // Function to detect OS and its version
    function detectOSAndVersion() {
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;
        let os = "Unknown OS";
        let osVersion = "";
        let ntVersion = "";

        // --- Apple Mobile Devices ---
        if (!window.MSStream) {
            if (/iPad/i.test(userAgent)) {
                os = "iPadOS";
                const osMatch = userAgent.match(/OS (\d+([_.]\d+)*)/i);
                if (osMatch && osMatch[1]) {
                    osVersion = osMatch[1].replace(/_/g, '.');
                }
            } else if (/iPhone|iPod/.test(userAgent)) {
                os = "iOS";
                const osMatch = userAgent.match(/OS (\d+([_.]\d+)*)/i);
                if (osMatch && osMatch[1]) {
                    osVersion = osMatch[1].replace(/_/g, '.');
                }
            }
        }

        // --- Android ---
        if (os === "Unknown OS" && /android/i.test(userAgent)) {
            os = "Android";
            const androidMatch = userAgent.match(/Android (\d+(\.\d+)*)/i);
            if (androidMatch && androidMatch[1]) {
                osVersion = androidMatch[1];
            }
        }
        // --- macOS ---
        else if (os === "Unknown OS" && /Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
            os = "macOS";
            const macOSMatch = userAgent.match(/Mac OS X (\d+([_.]\d+)*)/i);
            if (macOSMatch && macOSMatch[1]) {
                osVersion = macOSMatch[1].replace(/_/g, '.');
            }
        }
        // --- Windows ---
        else if (os === "Unknown OS" && /Win/.test(userAgent)) {
            os = "Windows";
            const windowsMatch = userAgent.match(/Windows NT (\d+\.\d+)/i);
            if (windowsMatch && windowsMatch[1]) {
                ntVersion = windowsMatch[1];
                switch (ntVersion) {
                    case "10.0":
                        osVersion = "10 / 11";
                        break;
                    case "6.3":
                        osVersion = "8.1";
                        break;
                    case "6.2":
                        osVersion = "8";
                        break;
                    case "6.1":
                        osVersion = "7";
                        break;
                    case "6.0":
                        osVersion = "Vista";
                        break;
                    case "5.1":
                    case "5.2":
                        osVersion = "XP";
                        break;
                    default:
                        osVersion = "NT " + ntVersion;
                        break;
                }
            } else if (userAgent.indexOf("Windows Phone") !== -1) {
                os = "Windows Phone";
                const wpMatch = userAgent.match(/Windows Phone (\d+\.\d+)/i);
                if (wpMatch && wpMatch[1]) {
                    osVersion = wpMatch[1];
                }
            }
        }
        // --- Linux ---
        else if (os === "Unknown OS" && /Linux/.test(userAgent)) {
            os = "Linux";
        }

        let fullOsInfo = os;
        if (osVersion) {
            fullOsInfo += " " + osVersion;
        }

        // Use User-Agent Client Hints if available
        if (navigator.userAgentData && (os !== "Unknown OS" && os !== "Windows Phone")) {
            navigator.userAgentData.getHighEntropyValues(["platform", "platformVersion"])
                .then(ua => {
                    let clientHintOS = os;
                    let clientHintOSVersion = osVersion;

                    if (ua.platformVersion) {
                        const versionParts = ua.platformVersion.split('.');
                        // Keep only major + minor version (e.g., "15.5.0" => "15.5")
                        clientHintOSVersion = versionParts.slice(0, 2).join('.');

                        if (os === "Windows") {
                            const buildNumber = parseInt(versionParts[2], 10);
                            if (buildNumber >= 22000) {
                                clientHintOSVersion = "11 (Build " + versionParts.slice(2).join('.') + ")";
                            } else if (ntVersion === "10.0") {
                                clientHintOSVersion = "10 (Build " + versionParts.slice(2).join('.') + ")";
                            }
                        }
                    }

                    fullOsInfo = clientHintOS;
                    if (clientHintOSVersion) {
                        fullOsInfo += " " + clientHintOSVersion;
                    }

                    document.getElementById("os-info").textContent = fullOsInfo;
                })
                .catch(error => {
                    console.warn("Could not retrieve detailed OS version via Client Hints:", error);
                    document.getElementById("os-info").textContent = fullOsInfo;
                });
        } else {
            document.getElementById("os-info").textContent = fullOsInfo;
        }
    }

    // Detect device model
    function detectDevice() {
        let userAgent = navigator.userAgent;

        if (/iPad/i.test(userAgent)) {
            return "iPad";
        } else if (/iPhone/i.test(userAgent)) {
            return "iPhone";
        } else if (/iPod/i.test(userAgent)) {
            return "iPod";
        } else if (/Macintosh/i.test(userAgent)) {
            return "Mac";
        } else if (/Android/i.test(userAgent)) {
            return "Android Device";
        } else if (/Windows/i.test(userAgent)) {
            return "Windows Device";
        } else if (/Linux/.test(userAgent)) {
            return "Linux Device";
        } else {
            return "Unknown Device";
        }
    }

    // Apply detections to DOM
    document.getElementById("device-info").textContent = detectDevice();
    detectOSAndVersion();
});
