document.addEventListener("DOMContentLoaded", function() {
    // Function to detect OS and its version
    function detectOSAndVersion() {
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;
        let os = "Unknown OS";
        let osVersion = "";

        // --- Apple Mobile Devices ---
        if (!window.MSStream) { // Exclude old Internet Explorer on Windows Phone
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
                // Important: Browsers often cap reported macOS version at 10.15.x
            }
        }
        // --- Windows ---
        else if (os === "Unknown OS" && /Win/.test(userAgent)) {
            os = "Windows";
            const windowsMatch = userAgent.match(/Windows NT (\d+\.\d+)/i);
            if (windowsMatch && windowsMatch[1]) {
                const ntVersion = windowsMatch[1];
                switch (ntVersion) {
                    case "10.0":
                        osVersion = "10 / 11"; // NT 10.0 can be Win 10 or 11.
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
                os = "Windows Phone"; // Keep this specific check if needed
                const wpMatch = userAgent.match(/Windows Phone (\d+\.\d+)/i);
                 if (wpMatch && wpMatch[1]) {
                    osVersion = wpMatch[1];
                }
            }
        }
        // --- Linux ---
        else if (os === "Unknown OS" && /Linux/.test(userAgent)) {
            os = "Linux";
            // Linux version is often not detailed consistently.
        }

        let fullOsInfo = os;
        if (osVersion) {
            fullOsInfo += " " + osVersion;
        }

        // Attempt to use User-Agent Client Hints (if available and OS was detected by UA string first)
        if (navigator.userAgentData && (os !== "Unknown OS" && os !== "Windows Phone" /* Example: avoid for very old/specific UA that wouldn't use Client Hints */)) {
            navigator.userAgentData.getHighEntropyValues(["platform", "platformVersion"])
                .then(ua => {
                    let clientHintOS = os; // Start with UA detected OS
                    let clientHintOSVersion = osVersion;

                    if (ua.platform) {
                        // Override OS if client hints provide a more direct name
                        // For example, ua.platform might be "iOS", "Android", "macOS", "Windows"
                        // It's unlikely to say "iPadOS" directly, it would likely still report "iOS" as the platform.
                        // The primary distinction for iPadOS comes from the userAgent string's "iPad" token.
                        // So, we mostly rely on the `ua.platformVersion`.
                    }

                    if (ua.platformVersion) {
                        let detailedVersion = ua.platformVersion;
                        clientHintOSVersion = detailedVersion; // Default to using the platformVersion directly

                        if (os === "Windows") { // Refine for Windows if NT version was initially more generic
                            const parts = detailedVersion.split('.');
                            if (parts.length >= 3) {
                                const buildNumber = parseInt(parts[2], 10);
                                if (buildNumber >= 22000) { // Heuristic for Windows 11
                                    clientHintOSVersion = "11 (Build " + parts.slice(2).join('.') + ")";
                                } else if (ntVersion === "10.0") { // If UA said NT 10.0 and build < 22000
                                    clientHintOSVersion = "10 (Build " + parts.slice(2).join('.') + ")";
                                }
                            }
                        } else if (os === "macOS" || os === "iOS" || os === "iPadOS") {
                             // For Apple OSs, platformVersion is usually quite clean e.g., "14.5.0" or "17.5.1"
                             clientHintOSVersion = detailedVersion;
                        } else if (os === "Android") {
                             clientHintOSVersion = detailedVersion;
                        }
                    }

                    fullOsInfo = clientHintOS; // os (iPadOS/iOS) is determined by UA
                    if (clientHintOSVersion) {
                        fullOsInfo += " " + clientHintOSVersion;
                    }
                    document.getElementById("os-info").textContent = fullOsInfo;
                })
                .catch(error => {
                    console.warn("Could not retrieve detailed OS version via User-Agent Client Hints:", error);
                    document.getElementById("os-info").textContent = fullOsInfo; // Fallback to UA parsing
                });
        } else {
            document.getElementById("os-info").textContent = fullOsInfo;
        }
    }

    // Function to detect device model (simplified)
    function detectDevice() {
        let userAgent = navigator.userAgent;

        if (/iPad/i.test(userAgent)) {
            return "iPad"; // Correctly identify as iPad
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

    // Set the detected values after DOM is fully loaded
    document.getElementById("device-info").textContent = detectDevice();
    detectOSAndVersion();
});
