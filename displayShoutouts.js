// displayShoutouts.js (Complete with President & Disabilities Sections)

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
let disabilitiesCollectionRef; // Added declaration
let shoutoutsMetaRef; // For shoutout timestamps

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Assign references
    profileDocRef = doc(db, "site_config", "mainProfile");
    presidentDocRef = doc(db, "site_config", "currentPresident");
    usefulLinksCollectionRef = collection(db, "useful_links");
    socialLinksCollectionRef = collection(db, "social_links");
    disabilitiesCollectionRef = collection(db, "disabilities"); // Assign disabilities ref
    shoutoutsMetaRef = doc(db, 'siteConfig', 'shoutoutsMetadata'); // Assign shoutout meta ref
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

// --- Function to Load and Display Disabilities (NEW) ---
async function loadAndDisplayDisabilities() {
    const placeholderElement = document.getElementById('disabilities-list-placeholder'); if (!placeholderElement) { console.warn("Disabilities placeholder missing."); return; }
    placeholderElement.innerHTML = '<li>Loading...</li>'; // Loading message inside UL
    if (!firebaseAppInitialized || !db) { console.error("Disabilities load error: Firebase not ready."); placeholderElement.innerHTML = '<li>Error (DB Init Error).</li>'; return; } if (!disabilitiesCollectionRef) { console.error("Disabilities load error: Collection ref missing."); placeholderElement.innerHTML = '<li>Error (Config Error).</li>'; return; }
    try { const disabilityQuery = query(disabilitiesCollectionRef, orderBy("order", "asc")); const querySnapshot = await getDocs(disabilityQuery); placeholderElement.innerHTML = ''; // Clear loading
        if (querySnapshot.empty) { placeholderElement.innerHTML = '<li>No specific information available.</li>'; }
        else { querySnapshot.forEach((doc) => { const data = doc.data(); if (data.name && data.url) { const listItem = document.createElement('li'); const linkElement = document.createElement('a'); linkElement.href = data.url; linkElement.textContent = data.name; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; listItem.appendChild(linkElement); placeholderElement.appendChild(listItem); } else { console.warn("Skipping disability item:", doc.id); } }); } console.log(`Displayed ${querySnapshot.size} disability links.`);
    } catch (error) { console.error("Error loading disabilities:", error); if (error.code === 'failed-precondition') { placeholderElement.innerHTML = '<li>Error: DB config needed.</li>'; console.error("Missing Firestore index for disabilities (order)."); } else { placeholderElement.innerHTML = '<li>Could not load list.</li>'; } }
}

// --- Global variable declarations for DOM elements ---
let maintenanceMessageElement;
let mainContentWrapper;
let usefulLinksContainerElement;
let socialLinksContainerElement;

// --- Run functions when the DOM is ready ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM loaded. Checking Firebase status and maintenance mode...");
    maintenanceMessageElement = document.getElementById('maintenanceModeMessage'); mainContentWrapper = document.querySelector('.container'); usefulLinksContainerElement = document.querySelector('.useful-links-section .links-container'); socialLinksContainerElement = document.querySelector('.social-links-container');

    if (!firebaseAppInitialized) { console.error("Firebase not ready. Site cannot load."); if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = '<p class="error">Site cannot load (Connection Error).</p>'; maintenanceMessageElement.style.display = 'block'; } else { const eb = document.createElement('div'); eb.innerHTML = '<p class="error">Site cannot load (Connection Error).</p>'; document.body.prepend(eb); } if (mainContentWrapper) mainContentWrapper.style.display = 'none'; return; }

    try { console.log("Checking maintenance mode..."); if (!profileDocRef) { throw new Error("profileDocRef missing."); } const configSnap = await getDoc(profileDocRef); let maintenanceEnabled = configSnap.exists() ? (configSnap.data()?.isMaintenanceModeEnabled || false) : false; console.log("Maintenance mode:", maintenanceEnabled);
        if (maintenanceEnabled) { console.log("Maintenance mode ON."); if (mainContentWrapper) { mainContentWrapper.style.display = 'none'; } if (maintenanceMessageElement) { maintenanceMessageElement.style.display = 'block'; } else { console.error("Maintenance msg element missing!"); } return; }
        else { console.log("Maintenance mode OFF. Loading content."); if (mainContentWrapper) { mainContentWrapper.style.display = ''; } if (maintenanceMessageElement) { maintenanceMessageElement.style.display = 'none'; }
            // Load ALL dynamic content
            if (typeof displayProfileData === 'function') { displayProfileData(); } else { console.error("displayProfileData missing!"); }
            if (typeof displayPresidentData === 'function') { displayPresidentData(); } else { console.error("displayPresidentData missing!"); }
            if (typeof loadAndDisplayShoutouts === 'function') { loadAndDisplayShoutouts(); } else { console.error("loadAndDisplayShoutouts missing!"); }
            if (typeof loadAndDisplayUsefulLinks === 'function') { if(usefulLinksContainerElement) { loadAndDisplayUsefulLinks(); } else { console.warn("Useful links container missing."); } } else { console.error("loadAndDisplayUsefulLinks missing!"); }
            if (typeof loadAndDisplaySocialLinks === 'function') { if (socialLinksContainerElement) { loadAndDisplaySocialLinks(); } else { console.warn("Social links container missing."); } } else { console.error("loadAndDisplaySocialLinks missing!"); }
            if (typeof loadAndDisplayDisabilities === 'function') { loadAndDisplayDisabilities(); } else { console.error("loadAndDisplayDisabilities missing!"); } // Load Disabilities
        }
    } catch (error) { console.error("Error during DOMContentLoaded:", error); if (maintenanceMessageElement) { maintenanceMessageElement.innerHTML = `<p class="error">Error loading site: ${error.message}</p>`; maintenanceMessageElement.style.display = 'block'; } else { const eb = document.createElement('div'); eb.innerHTML = `<p class="error">Error loading site: ${error.message}</p>`; document.body.prepend(eb); } if (mainContentWrapper) mainContentWrapper.style.display = 'none'; }
}); // End DOMContentLoaded listener
