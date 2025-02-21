function getDeviceModel() {
    const userAgent = navigator.userAgent;
    let model = 'unknown';

    // Detect iPhone models
    if (/iPhone/.test(userAgent)) {
        if (/iPhone.*17,1/i.test(userAgent)) model = 'iPhone 16 Pro';
        else if (/iPhone.*17,2/i.test(userAgent)) model = 'iPhone 16 Pro Max';
        else if (/iPhone.*17,3/i.test(userAgent)) model = 'iPhone 16E';
        else if (/iPhone.*17,4/i.test(userAgent)) model = 'iPhone 16';
        else if (/iPhone.*17,5/i.test(userAgent)) model = 'iPhone 16 Plus';
        else if (/iPhone.*16,1/i.test(userAgent)) model = 'iPhone 15';
        else if (/iPhone.*16,2/i.test(userAgent)) model = 'iPhone 15 Plus';
        else if (/iPhone.*16,3/i.test(userAgent)) model = 'iPhone 15 Pro';
        else if (/iPhone.*16,4/i.test(userAgent)) model = 'iPhone 15 Pro Max';
        else if (/iPhone.*15,4/i.test(userAgent)) model = 'iPhone SE (3rd Gen)';
        else if (/iPhone.*14,4/i.test(userAgent)) model = 'iPhone 14';
        else if (/iPhone.*14,5/i.test(userAgent)) model = 'iPhone 14 Plus';
        else if (/iPhone.*14,2/i.test(userAgent)) model = 'iPhone 14 Pro';
        else if (/iPhone.*14,3/i.test(userAgent)) model = 'iPhone 14 Pro Max';
        else if (/iPhone.*13,1/i.test(userAgent)) model = 'iPhone 13 Mini';
        else if (/iPhone.*13,2/i.test(userAgent)) model = 'iPhone 13';
        else if (/iPhone.*13,3/i.test(userAgent)) model = 'iPhone 13 Pro';
        else if (/iPhone.*13,4/i.test(userAgent)) model = 'iPhone 13 Pro Max';
        else model = 'Older iPhone';
    }

    // Detect iPad models
    if (/iPad/.test(userAgent)) {
        model = 'iPad';
        if (/iPad.*13,4/i.test(userAgent)) model = 'iPad Pro 12.9-inch (5th Gen)';
        if (/iPad.*13,1/i.test(userAgent)) model = 'iPad Pro 11-inch (3rd Gen)';
        if (/iPad.*13,2/i.test(userAgent)) model = 'iPad Air (4th Gen)';
        if (/iPad.*13,6/i.test(userAgent)) model = 'iPad (9th Gen)';
        if (/iPad.*14,4/i.test(userAgent)) model = 'iPad Mini (6th Gen)';
    }

    // Detect Mac models
    if (/Macintosh/i.test(userAgent)) {
        if (/MacBookPro.*18,1/i.test(userAgent)) model = 'MacBook Pro 13-inch (M1, 2020)';
        if (/MacBookPro.*18,3/i.test(userAgent)) model = 'MacBook Pro 16-inch (M1 Pro, 2021)';
        if (/MacBookAir.*8,1/i.test(userAgent)) model = 'MacBook Air M1 (2020)';
        if (/MacMini.*8,1/i.test(userAgent)) model = 'Mac Mini M1 (2020)';
        if (/iMac.*21,1/i.test(userAgent)) model = 'iMac 24-inch M1 (2021)';
        if (/iMac.*19,1/i.test(userAgent)) model = 'iMac 27-inch (2020)';
        if (/MacPro.*7,1/i.test(userAgent)) model = 'Mac Pro (2019)';
    }

    // Detect Android models
    if (/Android/i.test(userAgent)) {
        const androidModelMatch = userAgent.match(/\((.*?)\)/);
        if (androidModelMatch && androidModelMatch.length > 1) {
            const modelDetails = androidModelMatch[1].split(';');
            model = modelDetails[1] || 'Generic Android Device';
        }
    }

    // Detect Windows PCs
    if (/Windows/i.test(userAgent)) model = 'Windows Device';

    // Detect Linux devices
    if (/Linux/i.test(userAgent)) model = 'Linux Device';

    // Default
    return model;
}
