document.addEventListener("DOMContentLoaded", function() {
    // Function to detect OS and its version
    function detectOSAndVersion() {
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;
        let os = "Unknown OS";
        let osVersion = "";
        let ntVersion = "";

        // --- Apple Mobile Devices ---
        if (!window.MSStream) {
            // iPadOS detection must come before macOS due to User-Agent string overlap
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
        // Check if OS is still unknown before attempting Android detection
        if (os === "Unknown OS" && /android/i.test(userAgent)) {
            os = "Android";
            const androidMatch = userAgent.match(/Android (\d+(\.\d+)*)/i);
            if (androidMatch && androidMatch[1]) {
                osVersion = androidMatch[1];
            }
        }
        // --- macOS ---
        // Check if OS is still unknown before attempting macOS detection
        else if (os === "Unknown OS" && /Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
            os = "macOS";
            const macOSMatch = userAgent.match(/Mac OS X (\d+([_.]\d+)*)/i);
            if (macOSMatch && macOSMatch[1]) {
                osVersion = macOSMatch[1].replace(/_/g, '.');
            }
        }
        // --- Windows ---
        // Check if OS is still unknown before attempting Windows detection
        else if (os === "Unknown OS" && /Win/.test(userAgent)) {
            os = "Windows";
            const windowsMatch = userAgent.match(/Windows NT (\d+\.\d+)/i);
            if (windowsMatch && windowsMatch[1]) {
                ntVersion = windowsMatch[1];
                switch (ntVersion) {
                    case "10.0":
                        osVersion = "10 / 11"; // Windows 10 and 11 both report NT 10.0
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
                    case "5.2": // Windows XP 64-bit
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
        // Check if OS is still unknown before attempting Linux detection
        else if (os === "Unknown OS" && /Linux/.test(userAgent)) {
            os = "Linux";
            // Linux versions are not reliably found in user agents without distro-specific parsing
            // For general "Linux" detection, we usually don't get a version.
        }

        let fullOsInfo = os;
        if (osVersion) {
            fullOsInfo += " " + osVersion;
        }

        // Use User-Agent Client Hints if available for more precise OS version (especially Windows 10 vs 11)
        // This only applies if the initial OS detection was successful and it's not an "Unknown OS" or "Windows Phone" (as WP is deprecated)
        if (navigator.userAgentData && (os !== "Unknown OS" && os !== "Windows Phone")) {
            navigator.userAgentData.getHighEntropyValues(["platform", "platformVersion"])
                .then(ua => {
                    let clientHintOS = os; // Start with the OS detected from user agent
                    let clientHintOSVersion = osVersion; // Start with the version detected from user agent

                    if (ua.platformVersion) {
                        const versionParts = ua.platformVersion.split('.');
                        // Client Hints often provide the full version, e.g., "15.5.0" for iOS, "10.0.19045" for Windows
                        // We often only care about major.minor for clarity in many cases.
                        clientHintOSVersion = versionParts.join('.'); // Use full version from Client Hints

                        if (clientHintOS === "Windows") {
                            const buildNumber = parseInt(versionParts[2], 10);
                            if (buildNumber >= 22000) {
                                clientHintOSVersion = "11 (Build " + versionParts.slice(2).join('.') + ")";
                            } else { // Assuming build number < 22000 for NT 10.0 is Windows 10
                                clientHintOSVersion = "10 (Build " + versionParts.slice(2).join('.') + ")";
                            }
                        } else if (clientHintOS === "macOS" || clientHintOS === "iOS" || clientHintOS === "iPadOS" || clientHintOS === "Android") {
                             // For these, the full version from platformVersion is usually fine or simplify
                            clientHintOSVersion = versionParts.slice(0, 2).join('.'); // e.g., "15.5.0" -> "15.5"
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
                    // Fallback to user agent parsed info if Client Hints fail
                    document.getElementById("os-info").textContent = fullOsInfo;
                });
        } else {
            // If User-Agent Client Hints are not supported or not applicable, use initial user agent parsed info
            document.getElementById("os-info").textContent = fullOsInfo;
        }
    }

    // Function to detect general device type (iPhone, iPad, Android Device, etc.)
    function detectDevice() {
        let userAgent = navigator.userAgent;

        // Prioritize specific Apple mobile devices
        if (/iPad/i.test(userAgent)) {
            return "iPad";
        } else if (/iPhone/i.test(userAgent)) {
            return "iPhone";
        } else if (/iPod/i.test(userAgent)) {
            return "iPod";
        }
        // Then other general categories
        else if (/Macintosh/i.test(userAgent)) {
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

    // Function to detect more specific device model
    function getDetailedDeviceModel() {
        if (navigator.userAgentData) {
            // Use User-Agent Client Hints for more reliable model detection
            // Requires HTTPS context for high-entropy values like 'model'
            navigator.userAgentData.getHighEntropyValues(["model"])
                .then(ua => {
                    const model = ua.model;
                    if (model && model !== "Unknown") { // Client Hints might return "Unknown" if not available
                        document.getElementById("model-info").textContent = model;
                    } else {
                        // Fallback to user agent parsing if Client Hints don't provide a specific model
                        console.log("Client Hints model unknown, falling back to user agent parsing.");
                        document.getElementById("model-info").textContent = parseModelFromUserAgent(navigator.userAgent);
                    }
                })
                .catch(error => {
                    console.warn("Could not retrieve device model via Client Hints:", error);
                    // Fallback to user agent parsing if Client Hints API call fails
                    document.getElementById("model-info").textContent = parseModelFromUserAgent(navigator.userAgent);
                });
        } else {
            // Fallback for browsers not supporting User-Agent Client Hints or non-secure contexts
            document.getElementById("model-info").textContent = parseModelFromUserAgent(navigator.userAgent);
        }
    }

    // Helper function to parse model from User-Agent string (less reliable and harder to maintain)
    function parseModelFromUserAgent(userAgent) {
        let deviceModel = "Not detected (UA)";

        // Android: Look for model info typically between 'Android' and 'Build/' or end of string
        // Examples: "Android 10; SM-G981B Build/QP1A.190711.020" -> SM-G981B
        // "Android 12; Pixel 6 Build/SD1A.210817.023" -> Pixel 6
        const androidMatch = userAgent.match(/Android[^;]+; ([^)]+)(?: Build)?\//);
        if (androidMatch && androidMatch[1]) {
            let modelCandidate = androidMatch[1].trim();
            // Clean up common patterns like "Build/" suffix
            if (modelCandidate.includes("Build/")) {
                 modelCandidate = modelCandidate.substring(0, modelCandidate.indexOf("Build/")).trim();
            }
            if (modelCandidate.includes(";")) { // Handles cases like "Mobile; SM-G981B"
                 modelCandidate = modelCandidate.split(';').pop().trim();
            }
            deviceModel = modelCandidate;
        }
        // iOS/iPadOS: User Agent usually just says "iPhone" or "iPad". Specific model is very rare.
        // Screen dimensions can sometimes *infer* a model, but it's not precise.
        // We'll just return "iPhone" or "iPad" as a general model here if no Client Hint
        else if (/iPad/.test(userAgent)) {
            deviceModel = "iPad (specific model unknown)";
        } else if (/iPhone/.test(userAgent)) {
            deviceModel = "iPhone (specific model unknown)";
        }
        // Windows Phone
        else if (/Windows Phone/.test(userAgent)) {
            // Windows Phone user agents sometimes contain model, e.g., "Lumia 950"
            const wpModelMatch = userAgent.match(/Windows Phone (?:OS )?[\d.]+\d?; ([^;)]+)/);
            if (wpModelMatch && wpModelMatch[1]) {
                deviceModel = wpModelMatch[1].trim();
            } else {
                deviceModel = "Windows Phone (specific model unknown)";
            }
        }
        // macOS: Usually just "Macintosh" or "MacIntel" in UA, no specific model.
        else if (/Macintosh|MacIntel/.test(userAgent)) {
            deviceModel = "Mac (specific model unknown)";
        }
        // Linux: Rarely contains specific hardware model in UA
        else if (/Linux/.test(userAgent)) {
            deviceModel = "Linux Device (specific model unknown)";
        }
        // Generic catch-all if no specific pattern matched
        else {
            deviceModel = "Unknown Device (UA fallback)";
        }

        return deviceModel;
    }


    // Apply detections to DOM elements when the page loads
    document.getElementById("device-info").textContent = detectDevice();
    detectOSAndVersion(); // This function will update "os-info"
    getDetailedDeviceModel(); // This function will update "model-info"
});
