// Function to detect OS
function detectOS() {
    let userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let os;

    if (/windows phone/i.test(userAgent)) {
        os = "Windows Phone";
    } else if (/android/i.test(userAgent)) {
        os = "Android";
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        os = "iOS";
    } else if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
        os = "macOS";
    } else if (/Win/.test(userAgent)) {
        os = "Windows";
    } else if (/Linux/.test(userAgent)) {
        os = "Linux";
    } else {
        os = "Unknown OS";
    }

    document.getElementById("os-info").textContent = os;
}

// Function to detect device model
function detectDevice() {
    let userAgent = navigator.userAgent;

    if (/iPhone/i.test(userAgent)) {
        return "iPhone";
    } else if (/iPad/i.test(userAgent)) {
        return "iPad";
    } else if (/Macintosh/i.test(userAgent)) {
        return "Mac";
    } else if (/Android/i.test(userAgent)) {
        return "Android Device";
    } else if (/Windows/i.test(userAgent)) {
        return "Windows Device";
    } else {
        return "Unknown Device";
    }
}

// Set the detected values
document.getElementById("device-info").textContent = detectDevice();
detectOS();
