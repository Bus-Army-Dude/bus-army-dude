// displayShoutouts.js (Handles Profile, Dynamic Social Links, Shoutouts - Fixed Local Sort & Paths)

const firebaseConfig = {
    apiKey: "AIzaSyCIZ0fri5V1E2si1xXpBPQQJqj1F_KuuG0", // Your API key
    authDomain: "busarmydudewebsite.firebaseapp.com",
    projectId: "busarmydudewebsite",
    storageBucket: "busarmydudewebsite.firebasestorage.app",
    messagingSenderId: "42980404680",
    appId: "1:42980404680:web:f4f1e54789902a4295e4fd",
    measurementId: "G-DQPH8YL789" // Optional
};

// Import necessary Firebase functions (v9+ modular SDK)
// NOTE: orderBy and query are removed as we now sort locally
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// --- Initialize Firebase ---
let db;
let firebaseAppInitialized = false;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    firebaseAppInitialized = true;
    console.log("Firebase initialized for display.");
} catch (error) {
    console.error("Firebase initialization failed on index.html:", error);
    // Display error messages
    const grids = document.querySelectorAll('.creator-grid, .instagram-creator-grid, .youtube-creator-grid, #social-links-container-main');
    grids.forEach(grid => { if(grid) grid.innerHTML = '<p class="error">DB Connection Error.</p>'; });
    const profileBio = document.getElementById('profile-bio-main'); if (profileBio) profileBio.textContent = 'Error loading site data.';
    const profileUsernameElement = document.getElementById('profile-username-main'); if (profileUsernameElement) profileUsernameElement.textContent = "Username";
    const profilePicElement = document.getElementById('profile-pic-main'); if (profilePicElement) profilePicElement.src = "path/to/default-profile.jpg"; // Default path
    const profileStatusElement = document.getElementById('profile-status-main'); if (profileStatusElement) profileStatusElement.textContent = '❓';
}

// --- Helper Function to Format Timestamps ---
function formatFirestoreTimestamp(firestoreTimestamp) {
     if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) { return 'N/A'; }
     try {
         const date = firestoreTimestamp.toDate(); const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
         return date.toLocaleString('en-US', { timeZone: userTimeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
     } catch (error) { console.error("Error formatting timestamp:", error); return 'Invalid Date'; }
 }

// --- Functions to Render Shoutout Cards ---
// (Keep your renderTikTokCard, renderInstagramCard, renderYouTubeCard functions here)
function renderTikTokCard(account) { /* ... */ }
function renderInstagramCard(account) { /* ... */ }
function renderYouTubeCard(account) { /* ... */ }


// ======================================================
// === Profile Section Display Logic ===
// ======================================================
const profileUsernameElement = document.getElementById('profile-username-main');
const profilePicElement = document.getElementById('profile-pic-main');
const profileBioElement = document.getElementById('profile-bio-main');
const profileStatusElement = document.getElementById('profile-status-main');
const defaultUsername = "Username"; const defaultBio = "";
const defaultProfilePic = "images/default-profile.jpg"; // <<< --- UPDATE THIS ACTUAL PATH!!
const defaultStatusEmoji = '❓'; const statusEmojis = { online: '🟢', away: '🟡', offline: '🔴' };
let profileDocRef;

async function displayProfileData() {
    if (!firebaseAppInitialized || !db) { console.error("Profile Fetch Error: Firebase not ready."); return; }
    if (!profileUsernameElement && !profilePicElement && !profileBioElement && !profileStatusElement) { console.warn("Profile elements not found."); return; }
    if (!profileDocRef) profileDocRef = doc(db, "site_config", "mainProfile"); // Uses 'site_config'

    console.log("Fetching profile data from:", profileDocRef.path);
    try {
        const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data(); console.log("Profile data found:", data);
            if (profileUsernameElement) profileUsernameElement.textContent = data.username || defaultUsername;
            if (profilePicElement) profilePicElement.src = data.profilePicUrl || defaultProfilePic;
            if (profileBioElement) profileBioElement.textContent = data.bio || defaultBio;
            if (profileStatusElement) { const statusKey = data.status || 'offline'; profileStatusElement.textContent = statusEmojis[statusKey] || defaultStatusEmoji; }
            console.log("Profile section updated.");
        } else {
            console.warn(`Profile document ('${profileDocRef.path}') not found. Using defaults.`);
            if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername; if (profilePicElement) profilePicElement.src = defaultProfilePic; if (profileBioElement) profileBioElement.textContent = defaultBio; if (profileStatusElement) profileStatusElement.textContent = statusEmojis['offline'];
        }
    } catch (error) { console.error("Error fetching/displaying profile data:", error); /* ... set defaults ... */ }
}
// ======================================================
// === END Profile Section Display Logic ===
// ======================================================


// ======================================================
// === Dynamic Social Links Display Logic (Uses Local Sort) ===
// ======================================================
const socialLinksContainer = document.getElementById('social-links-container-main');
const platformIconMap = { /* ... Keep your icon map ... */ }; const defaultIconClass = 'fas fa-link';

async function displaySocialLinks() {
    if (!firebaseAppInitialized || !db) { console.error("Social Links Fetch Error: Firebase not ready."); return; }
    if (!socialLinksContainer) { console.error("Social Links container missing."); return; }
    console.log("Fetching dynamic social links (local sort)..."); socialLinksContainer.innerHTML = '<p>Loading...</p>';

    try {
        const linksColRef = collection(db, "site_config", "mainProfile", "socialLinks");
        // ** Fetching WITHOUT Firestore orderBy **
        const querySnapshot = await getDocs(linksColRef);
        console.log(`Found ${querySnapshot.size} social link documents to sort locally.`);

        socialLinksContainer.innerHTML = ''; let count = 0;
        const links = []; querySnapshot.forEach(doc => { if (doc.exists()) links.push(doc.data()); });
        // ** Sort locally by 'order' field **
        links.sort((a,b) => (a.order ?? Infinity) - (b.order ?? Infinity));

        links.forEach((linkData) => { // Loop through sorted array
            count++; const platformName = linkData.platformName; const url = linkData.url;
            if (url && platformName) {
                const lowerPlatformName = platformName.toLowerCase(); const iconClass = platformIconMap[lowerPlatformName] || defaultIconClass;
                const linkElement = document.createElement('a'); linkElement.href = url; linkElement.className = 'social-button'; linkElement.target = '_blank'; linkElement.rel = 'noopener noreferrer'; linkElement.setAttribute('aria-label', platformName);
                const iconElement = document.createElement('i'); iconElement.className = `${iconClass} social-icon`;
                const spanElement = document.createElement('span'); spanElement.textContent = platformName;
                linkElement.appendChild(iconElement); linkElement.appendChild(spanElement); socialLinksContainer.appendChild(linkElement);
            } else { console.warn(`Social link data invalid:`, linkData); }
        });
        if (count === 0) { socialLinksContainer.innerHTML = ''; /* Or <p>No links</p> */ } console.log(`Displayed ${count} social links.`);
    } catch (error) { console.error("Error fetching/displaying social links:", error); socialLinksContainer.innerHTML = '<p class="error">Error loading links.</p>'; }
}
// ======================================================
// === END Dynamic Social Links Display Logic ===
// ======================================================


// --- Function to Load and Display Shoutouts (Uses Local Sort) ---
async function loadAndDisplayShoutouts() {
    if (!firebaseAppInitialized || !db) { console.error("Shoutout load error: Firebase not ready."); /* ... */ return; }
    const tiktokGrid = document.querySelector('.creator-grid'); const instagramGrid = document.querySelector('.instagram-creator-grid'); const youtubeGrid = document.querySelector('.youtube-creator-grid');
    const tiktokTimestampEl = document.getElementById('tiktok-last-updated-timestamp'); const instagramTimestampEl = document.getElementById('lastUpdatedInstagram'); const youtubeTimestampEl = document.getElementById('lastUpdatedYouTube');

    if (tiktokGrid) tiktokGrid.innerHTML = '<p>Loading TikTok...</p>'; if (instagramGrid) instagramGrid.innerHTML = '<p>Loading Instagram...</p>'; if (youtubeGrid) youtubeGrid.innerHTML = '<p>Loading YouTube...</p>';

    try {
        // 1. Fetch Shoutout Data (Using LOCAL SORT)
        const shoutoutsCol = collection(db, 'shoutouts');
        console.log("Fetching shoutouts (NO Firestore ordering)...");
        const querySnapshot = await getDocs(shoutoutsCol); // Fetch without orderBy
        console.log(`Found ${querySnapshot.size} shoutout documents to sort locally.`);

        const shoutouts = { tiktok: [], instagram: [], youtube: [] };
        querySnapshot.forEach((doc) => { const data = doc.data(); if (data.platform && shoutouts.hasOwnProperty(data.platform)) { shoutouts[data.platform].push({ id: doc.id, ...data }); } else { console.warn(`Doc ${doc.id} missing/unknown platform: ${data.platform}`); } });

        // Sort locally AFTER fetching
        for (const platform in shoutouts) { shoutouts[platform].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity)); }
        console.log("Sorted shoutouts locally.");

        // 2. Fetch Metadata
        // *** Using 'site_config'. VERIFY this path in your Firestore! Change if needed. ***
        const metaRef = doc(db, 'site_config', 'shoutoutsMetadata');
        console.log("Attempting to fetch metadata from:", metaRef.path);
        const metaSnap = await getDoc(metaRef);
        const metadata = metaSnap.exists() ? metaSnap.data() : {};
        console.log("Metadata fetched:", metadata);

        // 3. Render Sections
         if (tiktokGrid) { if (shoutouts.tiktok.length > 0) { tiktokGrid.innerHTML = shoutouts.tiktok.map(renderTikTokCard).join(''); } else { tiktokGrid.innerHTML = '<p>No TikTok creators featured.</p>'; } } if (tiktokTimestampEl) tiktokTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_tiktok)}`;
         if (instagramGrid) { if (shoutouts.instagram.length > 0) { instagramGrid.innerHTML = shoutouts.instagram.map(renderInstagramCard).join(''); } else { instagramGrid.innerHTML = '<p>No Instagram creators featured.</p>'; } } if (instagramTimestampEl) instagramTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_instagram)}`;
         if (youtubeGrid) { if (shoutouts.youtube.length > 0) { youtubeGrid.innerHTML = shoutouts.youtube.map(renderYouTubeCard).join(''); } else { youtubeGrid.innerHTML = '<p>No YouTube creators featured.</p>'; } } if (youtubeTimestampEl) youtubeTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_youtube)}`;

         console.log("Shoutout sections updated.");

    } catch (error) {
        console.error("Error loading shoutout data:", error); // <<< CHECK THIS ERROR IN CONSOLE
        /* ... display errors in HTML ... */
        if (tiktokGrid) tiktokGrid.innerHTML = '<p class="error">Error loading TikTok creators.</p>'; if (instagramGrid) instagramGrid.innerHTML = '<p class="error">Error loading Instagram creators.</p>'; if (youtubeGrid) youtubeGrid.innerHTML = '<p class="error">Error loading YouTube creators.</p>'; if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Last Updated: Error'; if (instagramTimestampEl) instagramTimestampEl.textContent = 'Last Updated: Error'; if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Last Updated: Error';
    }
}

// --- Run functions when the DOM is ready ---
document.addEventListener('DOMContentLoaded', () => {
    if (firebaseAppInitialized) { // Check flag
        console.log("DOM loaded, Firebase ready, calling display functions.");
        displayProfileData();       // Load profile data
        displaySocialLinks();     // Load dynamic social links
        loadAndDisplayShoutouts(); // Load shoutouts (uses local sort)
    } else {
        console.error("DOM loaded, but Firebase initialization failed earlier.");
    }
});
