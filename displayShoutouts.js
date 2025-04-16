// displayShoutouts.js (Complete with President, Disabilities, & Business Info Sections)

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
import { getFirestore, collection, getDocs, doc, getDoc, Timestamp, orderBy, query } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// --- Initialize Firebase ---
let db;
let firebaseAppInitialized = false;
// Declare references in module scope
let profileDocRef;
let presidentDocRef;
let usefulLinksCollectionRef;
let socialLinksCollectionRef;
let disabilitiesCollectionRef;
let shoutoutsMetaRef;
let businessInfoDocRef; // <<<--- ADDED Reference Declaration

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
    businessInfoDocRef = doc(db, "site_config", "businessInfo"); // <<<--- ADDED Reference Assignment
    firebaseAppInitialized = true;
    console.log("Firebase initialized for display.");
} catch (error) {
    console.error("Firebase initialization failed on index.html:", error);
    const body = document.body;
    if (body) { body.innerHTML = '<p class="error" style="text-align: center; padding: 50px; color: red;">Could not connect to database services. Site unavailable.</p>'; }
    firebaseAppInitialized = false;
}

// --- Helper Function to Format Timestamps ---
function formatFirestoreTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) { return 'N/A'; }
    try { const date = firestoreTimestamp.toDate(); return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch (error) { console.error("Error formatting timestamp:", error); return 'Invalid Date'; }
}

// --- Functions to Render Shoutout Cards ---
function renderTikTokCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const followers = account.followers || 'N/A'; const isVerified = account.isVerified || false; const profileUrl = username !== 'N/A' ? `https://tiktok.com/@${encodeURIComponent(username)}` : '#'; const verifiedBadge = isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''; return `<div class="creator-card"><img src="${profilePic}" alt="@${username}" class="creator-pic" onerror="this.src='images/default-profile.jpg'"><div class="creator-info"><div class="creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <p class="creator-username">@${username}</p> <p class="creator-bio">${bio}</p> <p class="follower-count">${followers} Followers</p> <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="visit-profile"> Visit Profile </a></div></div>`;}
function renderInstagramCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const followers = account.followers || 'N/A'; const isVerified = account.isVerified || false; const profileUrl = username !== 'N/A' ? `https://instagram.com/${encodeURIComponent(username)}` : '#'; const verifiedBadge = isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''; return `<div class="instagram-creator-card"><img src="${profilePic}" alt="${nickname}" class="instagram-creator-pic" onerror="this.src='images/default-profile.jpg'"><div class="instagram-creator-info"><div class="instagram-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <p class="instagram-creator-username">@${username}</p> <p class="instagram-creator-bio">${bio}</p> <p class="instagram-follower-count">${followers} Followers</p> <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="instagram-visit-profile"> Visit Profile </a></div></div>`;}
function renderYouTubeCard(account) { const profilePic = account.profilePic || 'images/default-profile.jpg'; const username = account.username || 'N/A'; const nickname = account.nickname || 'N/A'; const bio = account.bio || ''; const subscribers = account.subscribers || 'N/A'; const coverPhoto = account.coverPhoto || null; const isVerified = account.isVerified || false; let safeUsername = username; if (username !== 'N/A' && !username.startsWith('@')) { safeUsername = `@${username}`; } const channelUrl = username !== 'N/A' ? `https://youtube.com/$${encodeURIComponent(safeUsername)}` : '#'; const verifiedBadge = isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : ''; return `<div class="youtube-creator-card"> ${coverPhoto ? `<img src="${coverPhoto}" alt="${nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''} <img src="${profilePic}" alt="@${username}" class="youtube-creator-pic" onerror="this.src='images/default-profile.jpg'"><div class="youtube-creator-info"><div class="youtube-creator-header"><h3>${nickname} ${verifiedBadge}</h3></div> <div class="username-container"><p class="youtube-creator-username">@${username}</p></div> <p class="youtube-creator-bio">${bio}</p> <p class="youtube-subscriber-count">${subscribers} Subscribers</p> <a href="${channelUrl}" target="_blank" rel="noopener noreferrer" class="youtube-visit-profile"> Visit Channel </a></div></div>`;}

// --- Function to Load and Display Profile Data ---
async function displayProfileData() {
    const profileUsernameElement = document.getElementById('profile-username-main');
    const profilePicElement = document.getElementById('profile-pic-main');
    const profileBioElement = document.getElementById('profile-bio-main');
    const profileStatusElement = document.getElementById('profile-status-main');
    const defaultUsername = "Username"; const defaultBio = ""; const defaultProfilePic = "images/default-profile.jpg"; const defaultStatusEmoji = '❓'; const statusEmojis = { online: '🟢', idle: '🟡', offline: '⚪️', dnd: '🔴' };

    if (!profileUsernameElement || !profilePicElement || !profileBioElement || !profileStatusElement) { console.warn("Profile display elements missing."); }
    if (!firebaseAppInitialized || !db || !profileDocRef) { console.error("Profile Fetch Error: Firebase not ready/ref missing."); if(profileBioElement) profileBioElement.textContent = "Error loading profile."; if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername; if (profilePicElement) profilePicElement.src = defaultProfilePic; if (profileStatusElement) profileStatusElement.textContent = defaultStatusEmoji; return; }

    try { const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) { const data = docSnap.data(); if (profileUsernameElement) profileUsernameElement.textContent = data.username || defaultUsername; if (profilePicElement) profilePicElement.src = data.profilePicUrl || defaultProfilePic; if (profileBioElement) profileBioElement.textContent = data.bio || defaultBio; if (profileStatusElement) { const statusKey = data.status || 'offline'; profileStatusElement.textContent = statusEmojis[statusKey] || defaultStatusEmoji; } }
        else { console.warn(`Profile document missing.`); if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername; if (profilePicElement) profilePicElement.src = defaultProfilePic; if (profileBioElement) profileBioElement.textContent = defaultBio; if (profileStatusElement) profileStatusElement.textContent = statusEmojis['offline']; }
    } catch (error) { console.error("Error fetching profile:", error); if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername; if (profilePicElement) profilePicElement.src = defaultProfilePic; if (profileBioElement) profileBioElement.textContent = "Error loading bio."; if (profileStatusElement) profileStatusElement.textContent = '❓'; }
}

// --- Function to Load and Display Shoutouts ---
async function loadAndDisplayShoutouts() {
    if (!firebaseAppInitialized || !db) { console.error("Shoutout load error: Firebase not ready."); /* ... error display ... */ return; }
    const tiktokGrid = document.querySelector('.creator-grid'); const instagramGrid = document.querySelector('.instagram-creator-grid'); const youtubeGrid = document.querySelector('.youtube-creator-grid'); const tiktokTimestampEl = document.getElementById('tiktok-last-updated-timestamp'); const instagramTimestampEl = document.getElementById('instagram-last-updated-timestamp'); const youtubeTimestampEl = document.getElementById('youtube-last-updated-timestamp');
    if (tiktokGrid) tiktokGrid.innerHTML = '<p>Loading...</p>'; if (instagramGrid) instagramGrid.innerHTML = '<p>Loading...</p>'; if (youtubeGrid) youtubeGrid.innerHTML = '<p>Loading...</p>'; if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Last Updated: Loading...'; if (instagramTimestampEl) instagramTimestampEl.textContent = 'Last Updated: Loading...'; if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Last Updated: Loading...';
    try {
        const shoutoutsCol = collection(db, 'shoutouts'); const shoutoutQuery = query(shoutoutsCol, orderBy("order", "asc")); const querySnapshot = await getDocs(shoutoutQuery); const shoutouts = { tiktok: [], instagram: [], youtube: [] };
        querySnapshot.forEach((docSnapshot) => { const data = docSnapshot.data(); if (data.platform && shoutouts.hasOwnProperty(data.platform)) { shoutouts[data.platform].push({ id: docSnapshot.id, ...data }); } else { console.warn(`Doc ${docSnapshot.id} missing/unknown platform: ${data.platform}`); } });
        let metadata = {}; if(shoutoutsMetaRef) { try { const metaSnap = await getDoc(shoutoutsMetaRef); if(metaSnap.exists()) metadata = metaSnap.data(); } catch(e){console.warn("Could not fetch shoutout metadata:", e)} }
        if (tiktokGrid) { if (shoutouts.tiktok.length > 0) { tiktokGrid.innerHTML = shoutouts.tiktok.map(renderTikTokCard).join(''); } else { tiktokGrid.innerHTML = '<p>No TikTok creators featured.</p>'; } if (tiktokTimestampEl) { tiktokTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_tiktok)}`; } } else { console.warn("TikTok grid missing."); }
        if (instagramGrid) { if (shoutouts.instagram.length > 0) { instagramGrid.innerHTML = shoutouts.instagram.map(renderInstagramCard).join(''); } else { instagramGrid.innerHTML = '<p>No Instagram creators featured.</p>'; } if (instagramTimestampEl) { instagramTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_instagram)}`; } } else { console.warn("Instagram grid missing."); }
        if (youtubeGrid) { if (shoutouts.youtube.length > 0) { youtubeGrid.innerHTML = shoutouts.youtube.map(renderYouTubeCard).join(''); } else { youtubeGrid.innerHTML = '<p>No YouTube creators featured.</p>'; } if (youtubeTimestampEl) { youtubeTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_youtube)}`; } } else { console.warn("YouTube grid missing."); }
    } catch (error) { console.error("Error loading shoutout data:", error); if (tiktokGrid) tiktokGrid.innerHTML = '<p class="error">Error loading TikTok.</p>'; if (instagramGrid) instagramGrid.innerHTML = '<p class="error">Error loading Instagram.</p>'; if (youtubeGrid) youtubeGrid.innerHTML = '<p class="error">Error loading YouTube.</p>'; if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Error'; if (instagramTimestampEl) instagramTimestampEl.textContent = 'Error'; if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Error'; }
}

// --- Function to Load and Display Useful Links ---
async function loadAndDisplayUsefulLinks() {
    if (!firebaseAppInitialized || !db) { console.error("Useful Links load error: Firebase not ready."); if(usefulLinksContainerElement) usefulLinksContainerElement.innerHTML = '<p class="error">Error loading links.</p>'; return; } if (!usefulLinksContainerElement) { console.warn("Useful links container missing."); return; } if(!usefulLinksCollectionRef) { console.error("Useful Links load error: Collection reference missing."); usefulLinksContainerElement.innerHTML = '<p class="error">Config error.</p>'; return;}
    usefulLinksContainerElement.innerHTML = '<p>Loading links...</p>';
    try { const linkQuery = query(usefulLinksCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(linkQuery); usefulLinksContainerElement.innerHTML = ''; if (querySnapshot.empty) { usefulLinksContainerElement.innerHTML = '<p>No useful links available.</p>'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.label && data.url) { const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.textContent = data.label; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; linkElement.className = 'link-button'; usefulLinksContainerElement.appendChild(linkElement); } else { console.warn("Skipping useful link:", doc.id); } }); } console.log(`Displayed ${querySnapshot.size} useful links.`);
    } catch (error) { console.error("Error loading useful links:", error); usefulLinksContainerElement.innerHTML = '<p class="error">Could not load links.</p>'; }
}

// --- Function to Load and Display Social Links ---
async function loadAndDisplaySocialLinks() {
    if (!firebaseAppInitialized || !db) { console.error("Social Links load error: Firebase not ready."); if (socialLinksContainerElement) socialLinksContainerElement.innerHTML = '<p class="error">Error loading socials.</p>'; return; } if (!socialLinksContainerElement) { console.warn("Social links container missing."); return; } if (!socialLinksCollectionRef) { console.error("Social Links load error: Collection reference missing."); socialLinksContainerElement.innerHTML = '<p class="error">Config error.</p>'; return;}
    socialLinksContainerElement.innerHTML = '<p>Loading socials...</p>';
    try { const linkQuery = query(socialLinksCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(linkQuery); socialLinksContainerElement.innerHTML = ''; if (querySnapshot.empty) { socialLinksContainerElement.innerHTML = '<p>No social links available.</p>'; } else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.label && data.url) { const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; linkElement.className = 'social-button'; if (data.iconClass) { const iconElement = document.createElement('i'); iconElement.className = data.iconClass + ' social-icon'; linkElement.appendChild(iconElement); } const textElement = document.createElement('span'); textElement.textContent = data.label; linkElement.appendChild(textElement); socialLinksContainerElement.appendChild(linkElement); } else { console.warn("Skipping social link:", doc.id); } }); } console.log(`Displayed ${querySnapshot.size} social links.`);
    } catch (error) { console.error("Error loading social links:", error); socialLinksContainerElement.innerHTML = '<p class="error">Could not load socials.</p>'; }
}

// --- Function to Load and Display President Data ---
async function displayPresidentData() {
    const placeholderElement = document.getElementById('president-placeholder'); if (!placeholderElement) { console.warn("President placeholder missing."); return; }
    placeholderElement.innerHTML = '<p style="text-align: center; padding: 20px;">Loading president info...</p>';
    if (!firebaseAppInitialized || !db) { console.error("President display error: Firebase not ready."); placeholderElement.innerHTML = '<p class="error">Could not load (DB Init Error).</p>'; return; } if (!presidentDocRef) { console.error("President display error: presidentDocRef missing."); placeholderElement.innerHTML = '<p class="error">Could not load (Config Error).</p>'; return; }
    try { const docSnap = await getDoc(presidentDocRef);
        if (docSnap.exists()) { const data = docSnap.data(); const presidentHTML = `<section id="current-president" class="president-section"><h2 class="section-title">Current U.S. President</h2><div class="president-info"><img src="${data.imageUrl || 'images/default-president.jpg'}" alt="President ${data.name || 'N/A'}" class="president-photo" onerror="this.src='images/default-president.jpg'; this.alt='Photo Missing';"><div class="president-details"><h3 class="president-name">${data.name || 'N/A'}</h3><p><strong>Born:</strong> ${data.born || 'N/A'}</p><p><strong>Height:</strong> ${data.height || 'N/A'}</p><p><strong>Party:</strong> ${data.party || 'N/A'}</p><p class="presidential-term"><strong>Term:</strong> ${data.term || 'N/A'}</p><p><strong>VP:</strong> ${data.vp || 'N/A'}</p></div></div></section>`; placeholderElement.innerHTML = presidentHTML; }
        else { console.warn(`President document missing.`); placeholderElement.innerHTML = '<p style="text-align: center; padding: 20px;">President info unavailable.</p>'; }
    } catch (error) { console.error("Error fetching president data:", error); placeholderElement.innerHTML = `<p class="error">Error loading president info: ${error.message}</p>`; }
}

// --- Function to Load and Display Disabilities ---
async function loadAndDisplayDisabilities() {
    const placeholderElement = document.getElementById('disabilities-list-placeholder'); if (!placeholderElement) { console.warn("Disabilities placeholder missing."); return; }
    placeholderElement.innerHTML = '<li>Loading...</li>'; // Loading message inside UL
    if (!firebaseAppInitialized || !db) { console.error("Disabilities load error: Firebase not ready."); placeholderElement.innerHTML = '<li>Error (DB Init Error).</li>'; return; } if (!disabilitiesCollectionRef) { console.error("Disabilities load error: Collection ref missing."); placeholderElement.innerHTML = '<li>Error (Config Error).</li>'; return; }
    try { const disabilityQuery = query(disabilitiesCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(disabilityQuery); placeholderElement.innerHTML = ''; // Clear loading
        if (querySnapshot.empty) { placeholderElement.innerHTML = '<li>No specific information available.</li>'; }
        else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.name && data.url) { const listItem = document.createElement('li'); const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.textContent = data.name; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; listItem.appendChild(linkElement); placeholderElement.appendChild(listItem); } else { console.warn("Skipping disability item:", doc.id); } }); } console.log(`Displayed ${querySnapshot.size} disability links.`);
    } catch (error) { console.error("Error loading disabilities:", error); if (error.code === 'failed-precondition') { placeholderElement.innerHTML = '<li>Error: DB config needed.</li>'; console.error("Missing Firestore index for disabilities (order)."); } else { placeholderElement.innerHTML = '<li>Could not load list.</li>'; } }
}


// ========================================================
// START NEW Business Information Display Function
// ========================================================
// --- Function to Load and Display Business Info (ATTEMPTS Timezone Conversion for Display - CORRECTED SYNTAX) ---
async function loadAndDisplayBusinessInfo() {
    // Get references to the display elements in index.html
    const hoursContainer = document.getElementById('hours-container');
    const holidayAlertDiv = document.getElementById('holiday-alert');
    const holidayNameSpan = document.getElementById('holiday-name');
    const holidayHoursSpan = document.getElementById('holiday-hours');
    const openStatusSpan = document.getElementById('open-status');
    const temporaryAlertDiv = document.getElementById('temporary-alert');
    const temporaryReasonSpan = document.getElementById('temporary-reason');
    const temporaryHoursSpan = document.getElementById('temporary-hours');
    const userTimezoneSpan = document.getElementById('user-timezone');
    const hoursHeading = document.querySelector('.business-info h2');

    // Initial states while loading
    if (hoursContainer) hoursContainer.innerHTML = '<p>Loading hours...</p>';
    if (openStatusSpan) { openStatusSpan.textContent = 'Loading...'; openStatusSpan.className = ''; }
    if (holidayAlertDiv) holidayAlertDiv.style.display = 'none';
    if (temporaryAlertDiv) temporaryAlertDiv.style.display = 'none';
    if (hoursHeading) hoursHeading.textContent = 'Business Hours';

    // --- Check for Luxon library ---
    if (typeof luxon === 'undefined' || typeof luxon.DateTime === 'undefined') {
        console.error("Luxon library is not loaded. Please include it (e.g., via CDN or npm install). Timezone conversions for hours display will fail.");
        // Optionally display an error to the user or fall back to non-converted times
        if (hoursContainer) hoursContainer.innerHTML = '<p class="error">Error loading time library.</p>';
        if (openStatusSpan) { openStatusSpan.textContent = 'Error'; openStatusSpan.className = 'closed'; }
        // We could return here, or try to proceed without hours conversion
        // For now, we'll let it proceed but expect errors in the hours loop.
    }

    // Display User's Timezone
    let visitorTimezone = 'N/A';
    try {
        visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (!visitorTimezone) { // Fallback if detection fails but doesn't error
            visitorTimezone = "UTC"; // Or a sensible default
            console.warn("Could not detect user timezone, falling back to", visitorTimezone);
        }
        if (userTimezoneSpan) userTimezoneSpan.textContent = visitorTimezone;
    } catch (e) {
        console.error("Could not get user timezone, falling back to N/A.", e);
        visitorTimezone = "N/A"; // Ensure it's set for later checks if needed
        if (userTimezoneSpan) userTimezoneSpan.textContent = "N/A";
    }

    // Check Firebase readiness (assuming these vars are defined elsewhere)
     if (typeof firebaseAppInitialized === 'undefined' || !firebaseAppInitialized || typeof db === 'undefined' || !db || typeof businessInfoDocRef === 'undefined' || !businessInfoDocRef) {
        console.error("Business Info load error: Firebase not ready or ref missing.");
        if (hoursContainer) hoursContainer.innerHTML = '<p class="error">Error loading info (DB).</p>';
        if (openStatusSpan) { openStatusSpan.textContent = 'Error'; openStatusSpan.className = 'closed'; }
        return;
    }

    // Main try block for fetching and displaying data
    try {
        const docSnap = await getDoc(businessInfoDocRef); // Make sure getDoc is imported/available
        let data = {};
        if (docSnap.exists()) {
            data = docSnap.data();
            console.log("Loaded business info data:", data);
        } else {
            console.warn("Business info document not found in Firestore.");
            if (hoursContainer) hoursContainer.innerHTML = '<p>Business hours not available.</p>';
            if (openStatusSpan) { openStatusSpan.textContent = 'Unavailable'; openStatusSpan.className = 'closed'; }
            return; // Stop if no data
        }

        const businessTimezone = data.businessTimezone || "America/New_York"; // Default if not set
        const now = new Date(); // Use native Date for current moment timestamp

        // Determine Current Day Name IN VISITOR'S TIMEZONE (for highlighting)
        let currentVisitorDayName = 'N/A';
        if (visitorTimezone !== 'N/A') {
             try {
                const visitorDayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: visitorTimezone });
                currentVisitorDayName = visitorDayFormatter.format(now).toLowerCase();
             } catch (dayError) {
                 console.error("Error formatting visitor day name:", dayError);
                 // currentVisitorDayName remains 'N/A'
             }
        }


        // === Display Business Hours (Converted to Visitor Timezone using Luxon) & Highlight ===
        if (hoursContainer) {
            const hoursData = data.hours || {};
            hoursContainer.innerHTML = ''; // Clear loading
            const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

            // Check again if Luxon is loaded before entering the loop that depends on it
            const isLuxonReady = typeof luxon !== 'undefined' && typeof luxon.DateTime !== 'undefined';

            daysOrder.forEach(day => {
                const dayHours = hoursData[day];
                let hoursText = 'Closed'; // Default text

                if (dayHours && dayHours.open && dayHours.close && isLuxonReady && visitorTimezone !== 'N/A') {
                    // Only attempt conversion if Luxon is ready and we have a visitor timezone
                    try {
                        // 1. Get a reference point for today's date in the business timezone context
                        const nowInBizZone = luxon.DateTime.now().setZone(businessTimezone);

                        // 2. Create Luxon DateTime objects representing open/close times *in business zone*
                        let openInBizZone = luxon.DateTime.fromFormat(dayHours.open, 'HH:mm', { zone: businessTimezone })
                                                        .set({ year: nowInBizZone.year, month: nowInBizZone.month, day: nowInBizZone.day });
                        let closeInBizZone = luxon.DateTime.fromFormat(dayHours.close, 'HH:mm', { zone: businessTimezone })
                                                         .set({ year: nowInBizZone.year, month: nowInBizZone.month, day: nowInBizZone.day });

                         // Basic validation check after parsing
                        if (!openInBizZone.isValid || !closeInBizZone.isValid) {
                            throw new Error(`Invalid time format for ${day}: open='${dayHours.open}', close='${dayHours.close}'`);
                        }

                        // 3. Handle overnight closing times robustly
                        if (closeInBizZone <= openInBizZone) {
                            closeInBizZone = closeInBizZone.plus({ days: 1 });
                        }

                        // 4. Convert these specific points in time to the visitor's timezone
                        const openInVisitorZone = openInBizZone.setZone(visitorTimezone);
                        const closeInVisitorZone = closeInBizZone.setZone(visitorTimezone);

                         // Check validity after zone conversion too
                         if (!openInVisitorZone.isValid || !closeInVisitorZone.isValid) {
                            throw new Error(`Invalid date after timezone conversion for ${day}`);
                         }

                        // 5. Format the converted times for display in H:MM AM/PM format
                        const timeFormat = 'h:mm a'; // Luxon format string for 9:00 AM / 5:00 PM
                        const openLocalStr = openInVisitorZone.toFormat(timeFormat);
                        const closeLocalStr = closeInVisitorZone.toFormat(timeFormat);

                        hoursText = `${openLocalStr} - ${closeLocalStr}`;

                    } catch (formatError) {
                        console.error(`Error converting/formatting time for ${day} using Luxon:`, formatError);
                        // Fallback: Show original time + business zone, or just an error message
                        // hoursText = `${formatTime(dayHours.open)} - ${formatTime(dayHours.close)} (${businessTimezone.split('/')[1].replace('_',' ')})`;
                        hoursText = "Time Error"; // Simpler error message
                    }
                } else if (dayHours && dayHours.open && dayHours.close) {
                     // If Luxon or visitorTimezone is not available, display original times (using your helper)
                     // Or just show a generic message indicating conversion isn't possible
                     console.warn(`Cannot convert hours for ${day}. Luxon ready: ${isLuxonReady}, Visitor Zone: ${visitorTimezone}`);
                     hoursText = formatTimeRange(dayHours.open, dayHours.close); // Use your helper for basic AM/PM format
                     // Optionally add the business timezone identifier
                     // hoursText += ` (${businessTimezone.split('/').pop().replace('_', ' ')})`;
                }
                // If dayHours is missing or times are missing, hoursText remains 'Closed'

                // Create and append the paragraph element
                const formattedDay = day.charAt(0).toUpperCase() + day.slice(1);
                const p = document.createElement('p');
                p.classList.add('hours-row');
                if (day === currentVisitorDayName) { // Check against the name derived from visitor's zone
                    p.classList.add('current-day');
                }
                p.innerHTML = `<strong>${formattedDay}:</strong> <span>${hoursText}</span>`;
                hoursContainer.appendChild(p);
            }); // End daysOrder.forEach

            if (hoursHeading) { hoursHeading.textContent = `Business Hours`; } // Keep title simple

        } else { console.warn("Hours container missing"); }

        // --- Handle Alerts (same as your original code) ---
        let isHolidayClosed = false;
        if (holidayAlertDiv && holidayNameSpan && holidayHoursSpan) {
            if (data.holidayActive && (data.holidayName || data.holidayHours)) {
                 holidayNameSpan.textContent = data.holidayName || '';
                 holidayHoursSpan.textContent = data.holidayHours || '';
                 holidayAlertDiv.style.display = 'block';
                 if (data.holidayHours?.toLowerCase().includes('closed')) isHolidayClosed = true;
            } else { holidayAlertDiv.style.display = 'none'; }
        }
         if (temporaryAlertDiv && temporaryReasonSpan && temporaryHoursSpan) {
              if (data.temporaryActive && (data.temporaryReason || data.temporaryHours)) {
                   temporaryReasonSpan.textContent = data.temporaryReason || '';
                   temporaryHoursSpan.textContent = data.temporaryHours || '';
                   temporaryAlertDiv.style.display = 'block';
              } else { temporaryAlertDiv.style.display = 'none'; }
         }

        // --- Determine and Display Status (Based on Business Timezone - same as your original code) ---
        if (openStatusSpan) {
            let finalStatus = "Unavailable";
            let finalStatusClass = "closed";

            if (data.temporaryActive && data.temporaryReason) {
                finalStatus = "Temporarily Unavailable"; finalStatusClass = "temporarily-unavailable";
            } else if (isHolidayClosed) {
                 finalStatus = "Closed (Holiday)"; finalStatusClass = "closed";
            } else if (data.statusOverride === 'Force Open') {
                finalStatus = "Open"; finalStatusClass = "open";
            } else if (data.statusOverride === 'Force Closed') {
                finalStatus = "Closed"; finalStatusClass = "closed";
            } else { // Calculate automatically
                console.log(`Attempting automatic status calculation... Now: ${now.toISOString()}, Business Zone: ${businessTimezone}`);
                try { // Inner try for status calculation
                    const formatterOptions = { timeZone: businessTimezone, weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false };
                    const formatter = new Intl.DateTimeFormat('en-CA', formatterOptions); // Use locale like en-CA for reliable HH:mm
                    const parts = formatter.formatToParts(now).reduce((acc, part) => { if (part.type !== 'literal') acc[part.type] = part.value; return acc; }, {});

                    // Handle potential undefined parts or formatting issues
                    const currentBusinessDayName = parts.weekday?.toLowerCase();
                    let currentHour = parts.hour;
                    const currentMinute = parts.minute;

                    if (!currentBusinessDayName || currentHour == null || currentMinute == null) {
                        throw new Error(`Could not determine current business time parts: ${JSON.stringify(parts)}`);
                    }

                    // Normalize hour '24' to '00' for comparison
                    if (currentHour === '24') currentHour = '00';
                    // Ensure two digits for comparison
                    currentHour = currentHour.padStart(2,'0');
                    const businessNowTimeStr = `${currentHour}:${currentMinute}`;

                    const todaysHours = data.hours ? data.hours[currentBusinessDayName] : null;

                    if (todaysHours && todaysHours.open && todaysHours.close) {
                        const openStr = todaysHours.open; // Assumes HH:MM format
                        const closeStr = todaysHours.close; // Assumes HH:MM format
                        console.log(`Comparing Business Time ${businessNowTimeStr} with ${openStr}-${closeStr} for day ${currentBusinessDayName}`);
                        let isOpen = false;

                        // String comparison works for HH:MM format
                        if (closeStr > openStr) { // Same day opening hours (e.g., 09:00 - 17:00)
                           isOpen = (businessNowTimeStr >= openStr && businessNowTimeStr < closeStr);
                        } else if (closeStr < openStr) { // Overnight hours (e.g., 21:00 - 05:00)
                            isOpen = (businessNowTimeStr >= openStr || businessNowTimeStr < closeStr);
                         } // Note: if openStr === closeStr, it implies 24 hours? Or an error? Assuming closed here.

                        if (isOpen) { finalStatus = "Open"; finalStatusClass = "open"; }
                        else { finalStatus = "Closed"; finalStatusClass = "closed"; }
                        console.log(`Calculated Status: ${finalStatus}`);
                    } else {
                        console.log(`No regular hours found for ${currentBusinessDayName} or hours missing open/close.`);
                        finalStatus = "Closed"; finalStatusClass = "closed";
                    }
                } catch(calcError) { // Inner catch for status calculation
                    console.error("Error during automatic status calculation:", calcError);
                    finalStatus = "Status Unavailable";
                    finalStatusClass = "closed";
                } // END Inner try-catch for calculation
            }
            openStatusSpan.textContent = finalStatus;
            openStatusSpan.className = finalStatusClass;
        } // END if (openStatusSpan)

    // This is the CATCH block for the main TRY block
    } catch (error) {
        console.error("Error fetching/displaying business info:", error);
        if (hoursContainer) hoursContainer.innerHTML = '<p class="error">Could not load info.</p>';
        if (openStatusSpan) { openStatusSpan.textContent = 'Error'; openStatusSpan.className = 'closed'; }
    } // END main try-catch block
} // END loadAndDisplayBusinessInfo function


// --- Helper Function to format HH:MM time to AM/PM ---
// (Keep this as it might be useful for fallbacks or other parts)
function formatTime(timeString) {
    if (!timeString || !timeString.includes(':')) return timeString;
    try {
        const parts = timeString.split(':');
        let hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        if (isNaN(hours) || isNaN(minutes)) return timeString; // Added validation

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
    } catch (e) {
        console.error("Error formatting time:", timeString, e);
        return timeString;
    }
}

// --- Helper function to format HH:MM range to AM/PM range ---
// (Keep this as it might be useful for fallbacks)
function formatTimeRange(openStr, closeStr) {
    const openFormatted = formatTime(openStr);
    const closeFormatted = formatTime(closeStr);
    // Avoid showing "Invalid Date - Invalid Date" if formatTime failed
    if (openFormatted === openStr && closeFormatted === closeStr) {
        return `${openStr} - ${closeStr}`; // Return original if formatting failed
    }
    return `${openFormatted} - ${closeFormatted}`;
}

// ========================================================
// END Business Information Display Function
// ========================================================

// --- Global variable declarations for DOM elements used in DOMContentLoaded ---
let maintenanceMessageElement;
let mainContentWrapper;
let usefulLinksContainerElement;
let socialLinksContainerElement;
// Note: other elements like president-placeholder are accessed directly in their functions

// --- Run functions when the DOM is ready ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM loaded. Checking Firebase status and maintenance mode...");
    maintenanceMessageElement = document.getElementById('maintenanceModeMessage');
    mainContentWrapper = document.querySelector('.container'); // Assuming .container wraps main content
    usefulLinksContainerElement = document.querySelector('.useful-links-section .links-container'); // Make sure these selectors are correct for index.html
    socialLinksContainerElement = document.querySelector('.social-links-container'); // Make sure this selector is correct for index.html

    if (!firebaseAppInitialized) {
        console.error("Firebase not ready. Site cannot load.");
        // Display error prominently if Firebase fails
        if (maintenanceMessageElement) {
            maintenanceMessageElement.innerHTML = '<p class="error">Site cannot load (Connection Error).</p>';
            maintenanceMessageElement.style.display = 'block';
        } else { // Fallback if specific element doesn't exist
            const eb = document.createElement('div');
            eb.style.cssText = "background:red; color:white; padding:20px; text-align:center; font-weight:bold;";
            eb.innerHTML = '<p>Site cannot load (Connection Error).</p>';
            document.body.prepend(eb);
        }
        if (mainContentWrapper) mainContentWrapper.style.display = 'none'; // Hide main content
        return; // Stop execution
    }

    try {
        console.log("Checking maintenance mode...");
        if (!profileDocRef) { throw new Error("profileDocRef missing for maintenance check."); } // Ensure ref exists
        const configSnap = await getDoc(profileDocRef);
        // Default to false if document or field doesn't exist
        let maintenanceEnabled = configSnap.exists() ? (configSnap.data()?.isMaintenanceModeEnabled || false) : false;
        console.log("Maintenance mode:", maintenanceEnabled);

        if (maintenanceEnabled) {
            console.log("Maintenance mode ON.");
            if (mainContentWrapper) { mainContentWrapper.style.display = 'none'; } // Hide main content
            if (maintenanceMessageElement) {
                maintenanceMessageElement.style.display = 'block'; // Show maintenance message
            } else {
                console.error("Maintenance message element missing!");
            }
            // Stop loading other content if in maintenance mode
            return;
        } else {
            console.log("Maintenance mode OFF. Loading content.");
            if (mainContentWrapper) { mainContentWrapper.style.display = ''; } // Ensure content visible
            if (maintenanceMessageElement) { maintenanceMessageElement.style.display = 'none'; } // Hide maintenance message

            // Load ALL dynamic content
            // Use checks to ensure functions exist before calling
            if (typeof displayProfileData === 'function') { displayProfileData(); } else { console.error("displayProfileData missing!"); }
            if (typeof displayPresidentData === 'function') { displayPresidentData(); } else { console.error("displayPresidentData missing!"); }
            if (typeof loadAndDisplayShoutouts === 'function') { loadAndDisplayShoutouts(); } else { console.error("loadAndDisplayShoutouts missing!"); }
            if (typeof loadAndDisplayUsefulLinks === 'function') { if(usefulLinksContainerElement) { loadAndDisplayUsefulLinks(); } else { console.warn("Useful links container missing in index.html."); } } else { console.error("loadAndDisplayUsefulLinks missing!"); }
            if (typeof loadAndDisplaySocialLinks === 'function') { if (socialLinksContainerElement) { loadAndDisplaySocialLinks(); } else { console.warn("Social links container missing in index.html."); } } else { console.error("loadAndDisplaySocialLinks missing!"); }
            if (typeof loadAndDisplayDisabilities === 'function') { loadAndDisplayDisabilities(); } else { console.error("loadAndDisplayDisabilities missing!"); }
            if (typeof loadAndDisplayBusinessInfo === 'function') { loadAndDisplayBusinessInfo(); } else { console.error("loadAndDisplayBusinessInfo missing!"); } // <<<--- Already Correctly Added

        }
    } catch (error) {
        console.error("Error during DOMContentLoaded initialization:", error);
        // Display a general error message if the initial load fails
         if (maintenanceMessageElement) {
            maintenanceMessageElement.innerHTML = `<p class="error">Error loading site configuration: ${error.message}</p>`;
            maintenanceMessageElement.style.display = 'block';
        } else {
             const eb = document.createElement('div');
             eb.style.cssText = "background:red; color:white; padding:20px; text-align:center; font-weight:bold;";
            eb.innerHTML = `<p class="error">Error loading site configuration: ${error.message}</p>`;
            document.body.prepend(eb);
        }
        if (mainContentWrapper) mainContentWrapper.style.display = 'none'; // Hide content on error
    }
}); // End DOMContentLoaded listener
