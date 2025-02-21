function getOperatingSystem() {
    const userAgent = navigator.userAgent;
    let os = 'unknown';

    // Detect iOS/macOS
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        os = 'iOS';
    } else if (/Macintosh/i.test(userAgent)) {
        os = 'macOS';
    }

    // Detect Windows
    else if (/Windows NT/i.test(userAgent)) {
        os = 'Windows';
    }

    // Detect Linux
    else if (/Linux/i.test(userAgent)) {
        os = 'Linux';
    }

    // Detect Android
    else if (/Android/i.test(userAgent)) {
        os = 'Android';
    }

    return os;
}

// Update the content inside the .os-info element
document.getElementById("os").textContent = getOperatingSystem();
