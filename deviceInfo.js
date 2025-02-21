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
        // Check for Xbox Series X
        if (/Xbox Series X/i.test(userAgent)) {
            os = 'Xbox Series X';
        }
        // Check for Xbox Series S
        else if (/Xbox Series S/i.test(userAgent)) {
            os = 'Xbox Series S';
        }
        // Check for Xbox One
        else if (/Xbox One/i.test(userAgent)) {
            os = 'Xbox One';
        }
        // Check for Xbox One S
        else if (/Xbox One S/i.test(userAgent)) {
            os = 'Xbox One S';
        }
        // Check for Xbox One X
        else if (/Xbox One X/i.test(userAgent)) {
            os = 'Xbox One X';
        }
        else {
            os = 'Windows'; // Default to Windows for non-Xbox PCs
        }
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
