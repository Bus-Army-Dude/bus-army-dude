// displayShoutouts.js (Complete with President, Disabilities, Links & Business Hours Sections)

// Use the same Firebase config as in admin.js (Ensure this is correct)
const firebaseConfig = {
    apiKey: "AIzaSyCIZ0fri5V1E2si1xXpBPQQJqj1F_KuuG0", // Use your actual API key
    authDomain: "busarmydudewebsite.firebaseapp.com",
    projectId: "busarmydudewebsite",
    storageBucket: "busarmydudewebsite.firebasestorage.app",
    messagingSenderId: "42980404680",
    appId: "1:42980404680:web:f4f1e54789902a4295e4fd",
    measurementId: "G-DQPH8YL789" // Optional
};

// Import necessary Firebase functions (v9+ modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, Timestamp, orderBy, query, where } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"; // Added 'where'

// --- Initialize Firebase ---
let db;
let firebaseAppInitialized = false;
// Declare references in module scope (will be assigned after init)
let profileDocRef;
let presidentDocRef;
let usefulLinksCollectionRef;
let socialLinksCollectionRef;
let disabilitiesCollectionRef;
let shoutoutsMetaRef;
let businessInfoDocRef;
let holidaysCollectionRef;
let tempClosuresCollectionRef;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Assign references
    profileDocRef = doc(db, "site_config", "mainProfile");
    presidentDocRef = doc(db, "site_config", "currentPresident");
    usefulLinksCollectionRef = collection(db, "useful_links");
    socialLinksCollectionRef = collection(db, "social_links");
    disabilitiesCollectionRef = collection(db, "disabilities");
    shoutoutsMetaRef = doc(db, 'siteConfig', 'shoutoutsMetadata');
    // --- Assign Business Hours References ---
    businessInfoDocRef = doc(db, "site_config", "business_info");
    holidaysCollectionRef = collection(db, "holidays");
    tempClosuresCollectionRef = collection(db, "temporary_closures");

    firebaseAppInitialized = true;
    console.log("Firebase initialized for display.");
} catch (error) {
    console.error("Firebase initialization failed on index.html:", error);
    // Display error directly on the page if Firebase fails
    const body = document.body;
    if (body) { body.innerHTML = '<p class="error" style="background-color: red; color: white; text-align: center; padding: 50px; font-size: 1.2em;">Could not connect to database services. Site unavailable.</p>'; }
    firebaseAppInitialized = false;
}

// --- Helper Function to Format Timestamps ---
function formatFirestoreTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) { return 'N/A'; }
    try { const date = firestoreTimestamp.toDate(); return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch (error) { console.error("Error formatting timestamp:", error); return 'Invalid Date'; }
}

// --- Helper Function to Capitalize Strings ---
function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// --- Functions to Render Shoutout Cards ---
function renderTikTokCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const followers = account.followers || 'N/A'; const isVerified = account.isVerified || false; const profileUrl = username !== 'N/A' ? `https://tiktok.com/@${encodeURIComponent(username)}` : '#'; const verifiedBadge = isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''; return `<div class="creator-card"><img src="${profilePic}" alt="@${username}" class="creator-pic" onerror="this.src='images/default-profile.jpg'"><div class="creator-info"><div class="creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <p class="creator-username">@${username}</p> <p class="creator-bio">${bio}</p> <p class="follower-count">${followers} Followers</p> <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="visit-profile"> Visit Profile </a></div></div>`;}
function renderInstagramCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const followers = account.followers || 'N/A'; const isVerified = account.isVerified || false; const profileUrl = username !== 'N/A' ? `https://instagram.com/${encodeURIComponent(username)}` : '#'; const verifiedBadge = isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''; return `<div class="instagram-creator-card"><img src="${profilePic}" alt="${nickname}" class="instagram-creator-pic" onerror="this.src='images/default-profile.jpg'"><div class="instagram-creator-info"><div class="instagram-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <p class="instagram-creator-username">@${username}</p> <p class="instagram-creator-bio">${bio}</p> <p class="instagram-follower-count">${followers} Followers</p> <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="instagram-visit-profile"> Visit Profile </a></div></div>`;}
function renderYouTubeCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const subscribers = account.subscribers || 'N/A'; const coverPhoto = account.coverPhoto || null; const isVerified = account.isVerified || false; let safeUsername = username; if (username !== 'N/A' && !username.startsWith('@')) { safeUsername = `@${username}`; } const channelUrl = username !== 'N/A' ? `https://www.youtube.com/${encodeURIComponent(safeUsername)}` : '#'; const verifiedBadge = isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : ''; return `<div class="youtube-creator-card"> ${coverPhoto ? `<img src="${coverPhoto}" alt="${nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''} <img src="${profilePic}" alt="${nickname}" class="youtube-creator-pic" onerror="this.src='images/default-profile.jpg'"><div class="youtube-creator-info"><div class="youtube-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <div class="username-container"><p class="youtube-creator-username">@${username}</p></div> <p class="youtube-creator-bio">${bio}</p> <p class="youtube-subscriber-count">${subscribers} Subscribers</p> <a href="${channelUrl}" target="_blank" rel="noopener noreferrer" class="youtube-visit-profile"> Visit Channel </a></div></div>`;}

// --- Function to Load and Display Profile Data ---
async function displayProfileData() {
    // Get elements needed for this function
    const profileUsernameElement = document.getElementById('profile-username-main');
    const profilePicElement = document.getElementById('profile-pic-main');
    const profileBioElement = document.getElementById('profile-bio-main');
    const profileStatusElement = document.getElementById('profile-status-main');
    // Default values
    const defaultUsername = "Username"; const defaultBio = "Bio loading..."; const defaultProfilePic = "images/default-profile.jpg"; const defaultStatusEmoji = '❓'; const statusEmojis = { online: '🟢', idle: '🟡', offline: '⚪️', dnd: '🔴' };

    // Check if elements exist before proceeding
    if (!profileUsernameElement || !profilePicElement || !profileBioElement || !profileStatusElement) {
        console.warn("Profile display elements missing in index.html.");
        return; // Don't try to fetch if elements are missing
    }
    // Check if Firebase is ready
    if (!firebaseAppInitialized || !db || !profileDocRef) {
        console.error("Profile Fetch Error: Firebase not ready or profileDocRef missing.");
        profileBioElement.textContent = "Error loading profile.";
        profileUsernameElement.textContent = defaultUsername;
        profilePicElement.src = defaultProfilePic;
        profileStatusElement.textContent = defaultStatusEmoji;
        return;
    }

    // Fetch and display data
    try {
        const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            profileUsernameElement.textContent = data.username || defaultUsername;
            profilePicElement.src = data.profilePicUrl || defaultProfilePic;
            profileBioElement.textContent = data.bio || defaultBio;
            const statusKey = data.status || 'offline';
            profileStatusElement.textContent = statusEmojis[statusKey] || defaultStatusEmoji;
        } else {
            console.warn(`Profile document missing.`);
            profileUsernameElement.textContent = defaultUsername;
            profilePicElement.src = defaultProfilePic;
            profileBioElement.textContent = defaultBio;
            profileStatusElement.textContent = statusEmojis['offline'];
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        profileUsernameElement.textContent = defaultUsername;
        profilePicElement.src = defaultProfilePic;
        profileBioElement.textContent = "Error loading bio.";
        profileStatusElement.textContent = '❓';
    }
}

// --- Function to Load and Display Shoutouts ---
async function loadAndDisplayShoutouts() {
    if (!firebaseAppInitialized || !db) { console.error("Shoutout load error: Firebase not ready."); return; }
    const tiktokGrid = document.querySelector('.creator-grid'); const instagramGrid = document.querySelector('.instagram-creator-grid'); const youtubeGrid = document.querySelector('.youtube-creator-grid');
    const tiktokTimestampEl = document.getElementById('tiktok-last-updated-timestamp'); const instagramTimestampEl = document.getElementById('instagram-last-updated-timestamp'); const youtubeTimestampEl = document.getElementById('youtube-last-updated-timestamp');

    // Set loading states only if elements exist
    if (tiktokGrid) tiktokGrid.innerHTML = '<p>Loading...</p>'; if (instagramGrid) instagramGrid.innerHTML = '<p>Loading...</p>'; if (youtubeGrid) youtubeGrid.innerHTML = '<p>Loading...</p>';
    if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Last Updated: Loading...'; if (instagramTimestampEl) instagramTimestampEl.textContent = 'Last Updated: Loading...'; if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Last Updated: Loading...';

    try {
        const shoutoutsCol = collection(db, 'shoutouts');
        const shoutoutQuery = query(shoutoutsCol, orderBy("order", "asc"));
        const querySnapshot = await getDocs(shoutoutQuery);
        const shoutouts = { tiktok: [], instagram: [], youtube: [] };
        querySnapshot.forEach((docSnapshot) => { const data = docSnapshot.data(); if (data.platform && shoutouts.hasOwnProperty(data.platform)) { shoutouts[data.platform].push({ id: docSnapshot.id, ...data }); } else { console.warn(`Doc ${docSnapshot.id} missing/unknown platform: ${data.platform}`); } });

        let metadata = {};
        if(shoutoutsMetaRef) { try { const metaSnap = await getDoc(shoutoutsMetaRef); if(metaSnap.exists()) metadata = metaSnap.data(); } catch(e){console.warn("Could not fetch shoutout metadata:", e)} }

        if (tiktokGrid) { if (shoutouts.tiktok.length > 0) { tiktokGrid.innerHTML = shoutouts.tiktok.map(renderTikTokCard).join(''); } else { tiktokGrid.innerHTML = '<p>No TikTok creators featured.</p>'; } if (tiktokTimestampEl) { tiktokTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_tiktok)}`; } } else { console.warn("TikTok grid missing."); }
        if (instagramGrid) { if (shoutouts.instagram.length > 0) { instagramGrid.innerHTML = shoutouts.instagram.map(renderInstagramCard).join(''); } else { instagramGrid.innerHTML = '<p>No Instagram creators featured.</p>'; } if (instagramTimestampEl) { instagramTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_instagram)}`; } } else { console.warn("Instagram grid missing."); }
        if (youtubeGrid) { if (shoutouts.youtube.length > 0) { youtubeGrid.innerHTML = shoutouts.youtube.map(renderYouTubeCard).join(''); } else { youtubeGrid.innerHTML = '<p>No YouTube creators featured.</p>'; } if (youtubeTimestampEl) { youtubeTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_youtube)}`; } } else { console.warn("YouTube grid missing."); }
    } catch (error) {
        console.error("Error loading shoutout data:", error);
        if (tiktokGrid) tiktokGrid.innerHTML = '<p class="error">Error loading TikTok.</p>'; if (instagramGrid) instagramGrid.innerHTML = '<p class="error">Error loading Instagram.</p>'; if (youtubeGrid) youtubeGrid.innerHTML = '<p class="error">Error loading YouTube.</p>';
        if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Error'; if (instagramTimestampEl) instagramTimestampEl.textContent = 'Error'; if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Error';
    }
}

// --- Function to Load and Display Useful Links ---
async function loadAndDisplayUsefulLinks() {
    const usefulLinksContainerElement = document.querySelector('.useful-links-section .links-container');
    if (!firebaseAppInitialized || !db) { console.error("Useful Links load error: Firebase not ready."); if(usefulLinksContainerElement) usefulLinksContainerElement.innerHTML = '<p class="error">Error loading links.</p>'; return; }
    if (!usefulLinksContainerElement) { console.warn("Useful links container missing."); return; }
    if(!usefulLinksCollectionRef) { console.error("Useful Links load error: Collection reference missing."); usefulLinksContainerElement.innerHTML = '<p class="error">Config error.</p>'; return;}
    usefulLinksContainerElement.innerHTML = '<p>Loading links...</p>';
    try {
        const linkQuery = query(usefulLinksCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(linkQuery);
        usefulLinksContainerElement.innerHTML = '';
        if (querySnapshot.empty) { usefulLinksContainerElement.innerHTML = '<p>No useful links available.</p>'; }
        else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.label && data.url) { const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.textContent = data.label; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; linkElement.className = 'link-button'; usefulLinksContainerElement.appendChild(linkElement); } else { console.warn("Skipping useful link:", doc.id); } }); }
        console.log(`Displayed ${querySnapshot.size} useful links.`);
    } catch (error) { console.error("Error loading useful links:", error); usefulLinksContainerElement.innerHTML = '<p class="error">Could not load links.</p>'; }
}

// --- Function to Load and Display Social Links ---
async function loadAndDisplaySocialLinks() {
    const socialLinksContainerElement = document.querySelector('.social-links-container');
    if (!firebaseAppInitialized || !db) { console.error("Social Links load error: Firebase not ready."); if (socialLinksContainerElement) socialLinksContainerElement.innerHTML = '<p class="error">Error loading socials.</p>'; return; }
    if (!socialLinksContainerElement) { console.warn("Social links container missing."); return; }
    if (!socialLinksCollectionRef) { console.error("Social Links load error: Collection reference missing."); socialLinksContainerElement.innerHTML = '<p class="error">Config error.</p>'; return;}
    socialLinksContainerElement.innerHTML = '<p>Loading socials...</p>';
    try {
        const linkQuery = query(socialLinksCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(linkQuery);
        socialLinksContainerElement.innerHTML = '';
        if (querySnapshot.empty) { socialLinksContainerElement.innerHTML = '<p>No social links available.</p>'; }
        else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.label && data.url) { const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; linkElement.className = 'social-button'; /* Icon logic removed, add back if needed */ const textElement = document.createElement('span'); textElement.textContent = data.label; linkElement.appendChild(textElement); socialLinksContainerElement.appendChild(linkElement); } else { console.warn("Skipping social link:", doc.id); } }); }
        console.log(`Displayed ${querySnapshot.size} social links.`);
    } catch (error) { console.error("Error loading social links:", error); socialLinksContainerElement.innerHTML = '<p class="error">Could not load socials.</p>'; }
}

// --- Function to Load and Display President Data ---
async function displayPresidentData() {
    const placeholderElement = document.getElementById('president-placeholder');
    if (!placeholderElement) { console.warn("President placeholder missing."); return; }
    placeholderElement.innerHTML = '<p style="text-align: center; padding: 20px;">Loading president info...</p>';
    if (!firebaseAppInitialized || !db || !presidentDocRef) { console.error("President display error: Firebase or Ref missing."); placeholderElement.innerHTML = '<p class="error">Could not load president info.</p>'; return; }
    try {
        const docSnap = await getDoc(presidentDocRef);
        if (docSnap.exists()) { const data = docSnap.data(); const presidentHTML = `<section id="current-president" class="president-section"><h2 class="section-title">Current U.S. President</h2><div class="president-info"><img src="${data.imageUrl || 'images/default-president.jpg'}" alt="President ${data.name || 'N/A'}" class="president-photo" onerror="this.src='images/default-president.jpg'; this.alt='Photo Missing';"><div class="president-details"><h3 class="president-name">${data.name || 'N/A'}</h3><p><strong>Born:</strong> ${data.born || 'N/A'}</p><p><strong>Height:</strong> ${data.height || 'N/A'}</p><p><strong>Party:</strong> ${data.party || 'N/A'}</p><p class="presidential-term"><strong>Term:</strong> ${data.term || 'N/A'}</p><p><strong>VP:</strong> ${data.vp || 'N/A'}</p></div></div></section>`; placeholderElement.innerHTML = presidentHTML; }
        else { console.warn(`President document missing.`); placeholderElement.innerHTML = '<p style="text-align: center; padding: 20px;">President info unavailable.</p>'; }
    } catch (error) { console.error("Error fetching president data:", error); placeholderElement.innerHTML = `<p class="error">Error loading president info: ${error.message}</p>`; }
}

// --- Function to Load and Display Disabilities ---
async function loadAndDisplayDisabilities() {
    const placeholderElement = document.getElementById('disabilities-list-placeholder');
    if (!placeholderElement) { console.warn("Disabilities placeholder missing."); return; }
    placeholderElement.innerHTML = '<li>Loading...</li>';
    if (!firebaseAppInitialized || !db || !disabilitiesCollectionRef) { console.error("Disabilities load error: Firebase or Ref missing."); placeholderElement.innerHTML = '<li>Error loading list.</li>'; return; }
    try {
        const disabilityQuery = query(disabilitiesCollectionRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(disabilityQuery);
        placeholderElement.innerHTML = '';
        if (querySnapshot.empty) { placeholderElement.innerHTML = '<li>No specific information available.</li>'; }
        else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.name && data.url) { const listItem = document.createElement('li'); const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.textContent = data.name; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; listItem.appendChild(linkElement); placeholderElement.appendChild(listItem); } else { console.warn("Skipping disability item:", doc.id); } }); }
        console.log(`Displayed ${querySnapshot.size} disability links.`);
    } catch (error) { console.error("Error loading disabilities:", error); if (error.code === 'failed-precondition') { placeholderElement.innerHTML = '<li>Error: DB index needed.</li>'; console.error("Missing Firestore index for disabilities (order)."); } else { placeholderElement.innerHTML = '<li>Could not load list.</li>'; } }
}


// ==================================================
// === NEW Business Hours Functions ===
// ==================================================

// --- Helper function to convert time from stored format to user's timezone display using Luxon ---
function convertTimeToTimezoneBH(timeStr, targetTimezone) {
    // Check for "Closed" or invalid input first
    if (!timeStr || typeof timeStr !== 'string' || timeStr.trim().toUpperCase() === 'CLOSED') {
        return "Closed";
    }

    const sourceTimezone = 'America/New_York'; // Your source timezone (EST/EDT)
    const timeStrClean = timeStr.trim().toUpperCase();

    let formatString; // Luxon format string based on input
    let parsedTime;

    // Determine input format (12hr vs 24hr)
    if (timeStrClean.includes("AM") || timeStrClean.includes("PM")) {
        formatString = "h:mm a"; // Format like "10:00 AM"
    } else if (/^\d{1,2}:\d{2}$/.test(timeStrClean)) {
        formatString = "H:mm"; // Format like "14:00" (24-hour)
    } else {
        console.warn("Could not determine time format for conversion:", timeStr);
        return "Invalid Time";
    }

    try {
        // Ensure Luxon is loaded (it's attached to the window object from the CDN script)
        if (typeof luxon === 'undefined' || typeof luxon.DateTime === 'undefined') {
             console.error("Luxon library not loaded!");
             return "Error: Lib Missing";
        }
        const { DateTime } = luxon; // Destructure for easier use

        // Parse the time string using the determined format and source timezone
        // This tells Luxon "this time string represents a time in America/New_York"
        parsedTime = DateTime.fromFormat(timeStrClean, formatString, { zone: sourceTimezone });

        if (!parsedTime.isValid) {
            console.warn(`Luxon failed to parse time "<span class="math-inline">\{timeStrClean\}" with format "</span>{formatString}"`);
            return "Invalid Time";
        }

        // Convert the parsed time to the user's target timezone
        const convertedTime = parsedTime.setZone(targetTimezone);

        // Format the converted time for display (e.g., "10:00 AM")
        return convertedTime.toFormat('h:mm a');

    } catch (e) {
        console.error("Error converting time using Luxon:", timeStr, targetTimezone, e);
        return "Error";
    }
}

// --- Function to check current open status ---
function checkOpenStatus(dayOfWeek, todayDateStr, fetchedRegularHours, fetchedHoliday, fetchedTempClosures) {
    const nowUser = new Date();
    const nowEST = new Date(nowUser.toLocaleString('en-US', { timeZone: 'America/New_York' })); // Use standard timezone ID
    const currentHourEST = nowEST.getHours(); // 0-23
    const currentMinuteEST = nowEST.getMinutes();
    const currentTotalMinutesEST = currentHourEST * 60 + currentMinuteEST;

    let effectiveOpenStr, effectiveCloseStr;
    let reason = "Regular Hours";
    let hoursTodayStr = "Closed";

    // 1. Check for Holiday
    if (fetchedHoliday) {
        reason = `Holiday: ${fetchedHoliday.name}`;
        hoursTodayStr = fetchedHoliday.hours || "Closed";
        if (hoursTodayStr.toLowerCase() === 'closed') return { status: "Closed", reason: reason, hoursToday: "Closed" };
        const parts = hoursTodayStr.split(" - ");
        if (parts.length === 2) { effectiveOpenStr = parts[0].trim(); effectiveCloseStr = parts[1].trim(); }
        else { console.warn("Could not parse holiday hours range:", hoursTodayStr); return { status: "Closed", reason: `${reason} (Invalid hours format)`, hoursToday: hoursTodayStr }; }
    } else {
        // 2. Use Regular Hours
        const dayKeyOpen = `${dayOfWeek}_open`; const dayKeyClose = `${dayOfWeek}_close`;
        effectiveOpenStr = fetchedRegularHours?.[dayKeyOpen]; effectiveCloseStr = fetchedRegularHours?.[dayKeyClose];
        hoursTodayStr = (effectiveOpenStr && effectiveOpenStr.toLowerCase() !== 'closed' && effectiveCloseStr && effectiveCloseStr.toLowerCase() !== 'closed') ? `${effectiveOpenStr} - ${effectiveCloseStr}` : "Closed";
        if (!effectiveOpenStr || effectiveOpenStr.toLowerCase() === 'closed' || !effectiveCloseStr || effectiveCloseStr.toLowerCase() === 'closed') { return { status: "Closed", reason: reason, hoursToday: "Closed" }; }
    }

    // Helper to parse time string (HH:MM AM/PM or HH:MM 24hr) into total minutes from midnight
    const parseTimeToMinutesEST = (timeStr) => {
        if (!timeStr || typeof timeStr !== 'string') return -1;
        timeStr = timeStr.trim().toUpperCase();
        if (timeStr === 'CLOSED') return -1;
        const timeRegex12hr = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i; const timeRegex24hr = /^(\d{1,2}):(\d{2})$/;
        let hours = -1, minutes = -1;
        if (timeRegex12hr.test(timeStr)) { const match = timeStr.match(timeRegex12hr); hours = parseInt(match[1], 10); minutes = parseInt(match[2], 10); const period = match[3].toUpperCase(); if (period === 'PM' && hours !== 12) hours += 12; if (period === 'AM' && hours === 12) hours = 0; }
        else if (timeRegex24hr.test(timeStr)) { const match = timeStr.match(timeRegex24hr); hours = parseInt(match[1], 10); minutes = parseInt(match[2], 10); }
        else { console.warn("Invalid time format for parsing:", timeStr); return -1; }
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return -1;
        return hours * 60 + minutes;
    };

    const openMinutes = parseTimeToMinutesEST(effectiveOpenStr);
    const closeMinutes = parseTimeToMinutesEST(effectiveCloseStr);
    if (openMinutes === -1 || closeMinutes === -1) { return { status: "Closed", reason: reason, hoursToday: hoursTodayStr }; }

    // 3. Check for Temporary Closures
    let activeTempClosure = null;
    if (fetchedTempClosures && fetchedTempClosures.length > 0) {
         activeTempClosure = fetchedTempClosures.find(closure => {
            const fromMinutes = parseTimeToMinutesEST(closure.startTime); // startTime is HH:MM (24hr)
            const toMinutes = parseTimeToMinutesEST(closure.endTime);     // endTime is HH:MM (24hr)
            if(fromMinutes === -1 || toMinutes === -1) return false;
            // Handle overnight closure (e.g. 10 PM - 2 AM)
            if (toMinutes < fromMinutes) {
                return (currentTotalMinutesEST >= fromMinutes) || (currentTotalMinutesEST < toMinutes);
            } else { // Same day closure
                return currentTotalMinutesEST >= fromMinutes && currentTotalMinutesEST < toMinutes;
            }
        });
    }
    if (activeTempClosure) { return { status: "Temporarily Unavailable", reason: activeTempClosure.reason, hoursToday: hoursTodayStr, tempClosureDetails: activeTempClosure }; }

    // 4. Check if within Regular/Holiday Open Hours
    let isOpen;
    if (closeMinutes < openMinutes) { isOpen = (currentTotalMinutesEST >= openMinutes) || (currentTotalMinutesEST < closeMinutes); } // Overnight
    else { isOpen = currentTotalMinutesEST >= openMinutes && currentTotalMinutesEST < closeMinutes; } // Same day

    return isOpen ? { status: "Open", reason: reason, hoursToday: hoursTodayStr } : { status: "Closed", reason: reason, hoursToday: hoursTodayStr };
}

// --- Function to Load and Display Business Hours Info ---
async function loadAndDisplayBusinessInfo() {
    if (!firebaseAppInitialized) { console.error("Business Hours: Firebase not ready."); return; }

    const userTimezoneElement = document.getElementById("user-timezone");
    const hoursContainer = document.getElementById("hours-container");
    const statusElement = document.getElementById("open-status");
    const holidayAlertElement = document.getElementById("holiday-alert");
    const holidayNameElement = document.getElementById("holiday-name");
    const holidayHoursElement = document.getElementById("holiday-hours");
    const tempAlertElement = document.getElementById("temporary-alert");
    const tempReasonElement = document.getElementById("temporary-reason");
    const tempHoursElement = document.getElementById("temporary-hours");

    if (!userTimezoneElement || !hoursContainer || !statusElement || !holidayAlertElement || !tempAlertElement) { console.warn("One or more business info display elements missing."); return; }

    userTimezoneElement.textContent = 'Loading...'; hoursContainer.innerHTML = '<p>Loading hours...</p>'; statusElement.textContent = 'Loading...';
    holidayAlertElement.style.display = 'none'; tempAlertElement.style.display = 'none';

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    userTimezoneElement.textContent = userTimezone;

    const currentDate = new Date();
    const currentDay = currentDate.toLocaleString("en-US", { weekday: "long", timeZone: userTimezone }).toLowerCase();
    const todayDateStr = currentDate.toLocaleDateString("en-CA", { timeZone: 'America/New_York' }); // Get today's date in EST/EDT for querying

    let regularHours = null; let todaysHoliday = null; let todaysTempClosures = [];
    try {
        const results = await Promise.all([
            getDoc(businessInfoDocRef),
            getDocs(query(holidaysCollectionRef, where("date", "==", todayDateStr))),
            getDocs(query(tempClosuresCollectionRef, where("date", "==", todayDateStr)))
        ]);
        const businessInfoSnap = results[0]; const holidaySnapshot = results[1]; const closureSnapshot = results[2];
        if (businessInfoSnap.exists()) { regularHours = businessInfoSnap.data(); } else { console.warn("Business info document not found."); regularHours = {}; }
        if (!holidaySnapshot.empty) { todaysHoliday = holidaySnapshot.docs[0].data(); }
        closureSnapshot.forEach(doc => { todaysTempClosures.push(doc.data()); });
        console.log("Fetched Business Data:", { regularHours, todaysHoliday, todaysTempClosures });
    } catch (error) { console.error("Error fetching business data:", error); if (hoursContainer) hoursContainer.innerHTML = '<p class="error">Could not load hours.</p>'; if (statusElement) statusElement.textContent = 'Error'; return; }

    // Render Weekly Hours
    hoursContainer.innerHTML = ""; const daysOrder = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    daysOrder.forEach(day => {
        const openKey = `${day}_open`; const closeKey = `${day}_close`;
        const openTimeEST = regularHours?.[openKey] || "Closed"; const closeTimeEST = regularHours?.[closeKey] || "Closed";
        const convertedOpen = convertTimeToTimezoneBH(openTimeEST, userTimezone);
        const convertedClose = (closeTimeEST.toLowerCase() === 'closed') ? "" : convertTimeToTimezoneBH(closeTimeEST, userTimezone);
        const dayElement = document.createElement("div"); dayElement.classList.add("hours-row"); if (day === currentDay) { dayElement.classList.add("current-day"); }
        dayElement.innerHTML = `<strong>${capitalize(day)}:</strong> <span>${convertedOpen}${convertedOpen !== 'Closed' && convertedClose ? ' - ' + convertedClose : ''}</span>`;
        hoursContainer.appendChild(dayElement);
    });

    // Check Status and Display Alerts
    const openStatusResult = checkOpenStatus(currentDay, todayDateStr, regularHours, todaysHoliday, todaysTempClosures);

    if (statusElement) { statusElement.textContent = openStatusResult.status; statusElement.className = ''; statusElement.classList.add(openStatusResult.status.toLowerCase().replace(/\s+/g, "-")); }
    if (holidayAlertElement && todaysHoliday) { holidayNameElement.textContent = todaysHoliday.name; holidayHoursElement.textContent = todaysHoliday.hours; holidayAlertElement.style.display = "block"; } else if (holidayAlertElement) { holidayAlertElement.style.display = "none"; }
    if (tempAlertElement && openStatusResult.status === "Temporarily Unavailable" && openStatusResult.tempClosureDetails) {
         const tempClosure = openStatusResult.tempClosureDetails;
         tempReasonElement.textContent = tempClosure.reason;
         const convertedStart = convertTimeToTimezoneBH(tempClosure.startTime, userTimezone); const convertedEnd = convertTimeToTimezoneBH(tempClosure.endTime, userTimezone);
         tempHoursElement.textContent = `${convertedStart} - ${convertedEnd}`;
         tempAlertElement.style.display = "block";
    } else if (tempAlertElement) { tempAlertElement.style.display = "none"; }
}


// --- Run functions when the DOM is ready ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM loaded. Checking Firebase status and maintenance mode...");

    // --- Get common DOM elements ---
    const maintenanceMessageElement = document.getElementById('maintenanceModeMessage');
    const mainContentWrapper = document.getElementById('main-content-wrapper'); // Use ID from index.html

    // Check Firebase initialization status FIRST
    if (!firebaseAppInitialized) {
        console.error("Firebase not ready. Site cannot load.");
        if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = '<p class="error" style="text-align: center; padding: 20px; color: red;">Site cannot load (Connection Error).</p>'; maintenanceMessageElement.style.display = 'block'; }
        else { const eb = document.createElement('div'); eb.innerHTML = '<p class="error" style="background-color: red; color: white; padding: 20px; text-align: center;">Site cannot load (Connection Error).</p>'; document.body.prepend(eb); }
        if (mainContentWrapper) mainContentWrapper.style.display = 'none';
        return; // Stop execution
    }

    // --- Try checking maintenance mode and loading content ---
    try {
        console.log("Checking maintenance mode...");
        if (!profileDocRef) { throw new Error("Profile document reference (profileDocRef) is not initialized."); }
        const configSnap = await getDoc(profileDocRef);
        let maintenanceEnabled = configSnap.exists() ? (configSnap.data()?.isMaintenanceModeEnabled || false) : false;
        console.log("Maintenance mode:", maintenanceEnabled);

        if (maintenanceEnabled) {
            // Maintenance Mode is ON
            console.log("Maintenance mode ON.");
            if (mainContentWrapper) mainContentWrapper.style.display = 'none';
            if (maintenanceMessageElement) { maintenanceMessageElement.style.display = 'block'; }
            else { console.error("Maintenance message element (#maintenanceModeMessage) missing!"); if (!document.querySelector('.maintenance-fallback')) { const fb = document.createElement('div'); fb.className = 'maintenance-fallback'; fb.innerHTML = '<p style="background-color: red; color: white; padding: 20px; text-align: center;">Site is currently undergoing maintenance.</p>'; document.body.prepend(fb); } }
            return; // Stop loading other content
        } else {
            // Maintenance Mode is OFF - Proceed to load content
            console.log("Maintenance mode OFF. Loading content.");
            if (mainContentWrapper) mainContentWrapper.style.display = '';
            if (maintenanceMessageElement) maintenanceMessageElement.style.display = 'none';

            // --- Load ALL dynamic content ---
            const loadPromises = [
                displayProfileData(),
                displayPresidentData(),
                loadAndDisplayShoutouts(),
                loadAndDisplayUsefulLinks(),
                loadAndDisplaySocialLinks(),
                loadAndDisplayDisabilities(),
                loadAndDisplayBusinessInfo() // Load business info
            ];
            const results = await Promise.allSettled(loadPromises);
            results.forEach((result, index) => { if (result.status === 'rejected') { console.error(`Error loading dynamic content section ${index}:`, result.reason); }});
        }
    } catch (error) { // Catch errors during maintenance check or initial loading setup
        console.error("Error during DOMContentLoaded initialization or maintenance check:", error);
        if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = `<p class="error" style="text-align: center; padding: 20px; color: red;">Error loading site configuration: ${error.message}</p>`; maintenanceMessageElement.style.display = 'block'; }
        else { if (!document.querySelector('.config-error-fallback')) { const eb = document.createElement('div'); eb.className = 'config-error-fallback'; eb.innerHTML = `<p style="background-color: orange; color: black; padding: 20px; text-align: center;">Error loading site configuration: ${error.message}</p>`; document.body.prepend(eb); } }
        if (mainContentWrapper) mainContentWrapper.style.display = 'none';
    }
}); // End DOMContentLoaded listener
