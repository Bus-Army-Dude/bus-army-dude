// displayShoutouts.js (Includes Profile Logic - Path Fix Attempt)

const firebaseConfig = {
    apiKey: "AIzaSyCIZ0fri5V1E2si1xXpBPQQJqj1F_KuuG0", // Use your actual API key
    authDomain: "busarmydudewebsite.firebaseapp.com",
    projectId: "busarmydudewebsite",
    storageBucket: "busarmydudewebsite.firebasestorage.app",
    messagingSenderId: "42980404680",
    appId: "1:42980404680:web:f4f1e54789902a4295e4fd",
    measurementId: "G-DQPH8YL789" // Optional
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, Timestamp, orderBy, query } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

let db;
let firebaseAppInitialized = false; // Flag to track initialization

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    firebaseAppInitialized = true; // Set flag on success
    console.log("Firebase initialized for display.");
} catch (error) {
    console.error("Firebase initialization failed on index.html:", error);
    // Error handling for UI (keep as is)
    const grids = document.querySelectorAll('.creator-grid, .instagram-creator-grid, .youtube-creator-grid');
    grids.forEach(grid => grid.innerHTML = '<p class="error">Could not load creator data. Failed to connect to database.</p>');
    const profileBio = document.getElementById('profile-bio-main');
    if (profileBio) profileBio.textContent = 'Error loading site data.';
}

// --- Helper Function to Format Timestamps ---
function formatFirestoreTimestamp(firestoreTimestamp) { /* ... unchanged ... */
    if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) { return 'N/A'; }
    try {
        const date = firestoreTimestamp.toDate();
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return date.toLocaleString('en-US', { timeZone: userTimeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    } catch (error) { console.error("Error formatting timestamp:", error); return 'Invalid Date'; }
}

// --- Functions to Render Shoutout Cards ---
function renderTikTokCard(account) { /* ... unchanged ... */ }
function renderInstagramCard(account) { /* ... unchanged ... */ }
function renderYouTubeCard(account) { /* ... unchanged, including potentially incorrect channelUrl ... */ }


// ======================================================
// === Profile Section Display Logic ===
// ======================================================
const profileUsernameElement = document.getElementById('profile-username-main');
const profilePicElement = document.getElementById('profile-pic-main');
const profileBioElement = document.getElementById('profile-bio-main');
const profileStatusElement = document.getElementById('profile-status-main');
const defaultUsername = "Username"; const defaultBio = ""; const defaultProfilePic = "path/to/default-profile.jpg"; const defaultStatusEmoji = '❓'; const statusEmojis = { online: '🟢', away: '🟡', offline: '🔴' };
let profileDocRef; // Define outside so it's accessible

async function displayProfileData() {
    if (!firebaseAppInitialized || !db) { console.error("Profile Fetch Error: Firebase not ready."); return; }
    if (!profileUsernameElement || !profilePicElement || !profileBioElement || !profileStatusElement) { console.error("Profile display error: HTML elements missing."); return; }
    if (!profileDocRef) profileDocRef = doc(db, "site_config", "mainProfile"); // Define ref if not already

    console.log("Fetching profile data from:", profileDocRef.path);
    try {
        const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data(); console.log("Profile data found:", data);
            profileUsernameElement.textContent = data.username || defaultUsername;
            profilePicElement.src = data.profilePicUrl || defaultProfilePic; profileBioElement.textContent = data.bio || defaultBio;
            const statusKey = data.status || 'offline'; profileStatusElement.textContent = statusEmojis[statusKey] || defaultStatusEmoji;
            console.log("Profile section updated.");
        } else {
            console.warn("Profile document ('/site_config/mainProfile') not found. Using defaults.");
            profileUsernameElement.textContent = defaultUsername; profilePicElement.src = defaultProfilePic; profileBioElement.textContent = defaultBio; profileStatusElement.textContent = statusEmojis['offline'];
        }
    } catch (error) { console.error("Error fetching/displaying profile data:", error); profileUsernameElement.textContent = defaultUsername; profilePicElement.src = defaultProfilePic; profileBioElement.textContent = "Error loading bio."; profileStatusElement.textContent = '❓'; }
}
// ======================================================
// === End Profile Section Display Logic ===
// ======================================================


// --- Function to Load and Display Shoutouts ---
async function loadAndDisplayShoutouts() {
    if (!firebaseAppInitialized || !db) { // Check flag and db instance
        console.error("Shoutout load error: Firebase not ready.");
        const tiktokGrid = document.querySelector('.creator-grid'); const instagramGrid = document.querySelector('.instagram-creator-grid'); const youtubeGrid = document.querySelector('.youtube-creator-grid');
        if (tiktokGrid) tiktokGrid.innerHTML = '<p class="error">Error: Database connection failed.</p>'; if (instagramGrid) instagramGrid.innerHTML = '<p class="error">Error: Database connection failed.</p>'; if (youtubeGrid) youtubeGrid.innerHTML = '<p class="error">Error: Database connection failed.</p>';
        return;
    }

    const tiktokGrid = document.querySelector('.creator-grid'); const instagramGrid = document.querySelector('.instagram-creator-grid'); const youtubeGrid = document.querySelector('.youtube-creator-grid');
    const tiktokTimestampEl = document.getElementById('tiktok-last-updated-timestamp'); const instagramTimestampEl = document.getElementById('lastUpdatedInstagram'); const youtubeTimestampEl = document.getElementById('lastUpdatedYouTube');

    if (tiktokGrid) tiktokGrid.innerHTML = '<p>Loading TikTok Creators...</p>'; if (instagramGrid) instagramGrid.innerHTML = '<p>Loading Instagram Creators...</p>'; if (youtubeGrid) youtubeGrid.innerHTML = '<p>Loading YouTube Creators...</p>';

    try {
        // 1. Fetch Shoutout Data
        const shoutoutsCol = collection(db, 'shoutouts');
        const shoutoutQuery = query(shoutoutsCol, orderBy("order", "asc"));
        const querySnapshot = await getDocs(shoutoutQuery);

        const shoutouts = { tiktok: [], instagram: [], youtube: [] };
        querySnapshot.forEach((doc) => { const data = doc.data(); if (data.platform && shoutouts.hasOwnProperty(data.platform)) { shoutouts[data.platform].push({ id: doc.id, ...data }); } else { console.warn(`Doc ${doc.id} missing/unknown platform: ${data.platform}`); } });

        // 2. Fetch Metadata
        // *** FIX ATTEMPT: Trying 'siteConfig' path based on user's original rules ***
        // *** If this doesn't work, change back to 'site_config' AND CHECK FIRESTORE CONSOLE FOR EXACT PATH ***
        const metaRef = doc(db, 'siteConfig', 'shoutoutsMetadata'); // Changed 'site_config' to 'siteConfig'
        console.log("Attempting to fetch metadata from:", metaRef.path); // Log path being used
        const metaSnap = await getDoc(metaRef);
        const metadata = metaSnap.exists() ? metaSnap.data() : {};
        console.log("Metadata fetched:", metadata); // Log fetched metadata

        // 3. Render TikTok
        if (tiktokGrid) { if (shoutouts.tiktok.length > 0) { tiktokGrid.innerHTML = shoutouts.tiktok.map(renderTikTokCard).join(''); } else { tiktokGrid.innerHTML = '<p>No TikTok creators featured.</p>'; } }
        if (tiktokTimestampEl) tiktokTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_tiktok)}`;

        // 4. Render Instagram
        if (instagramGrid) { if (shoutouts.instagram.length > 0) { instagramGrid.innerHTML = shoutouts.instagram.map(renderInstagramCard).join(''); } else { instagramGrid.innerHTML = '<p>No Instagram creators featured.</p>'; } }
        if (instagramTimestampEl) instagramTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_instagram)}`;

        // 5. Render YouTube
        if (youtubeGrid) { if (shoutouts.youtube.length > 0) { youtubeGrid.innerHTML = shoutouts.youtube.map(renderYouTubeCard).join(''); } else { youtubeGrid.innerHTML = '<p>No YouTube creators featured.</p>'; } }
        if (youtubeTimestampEl) youtubeTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_youtube)}`;

    } catch (error) {
        // Log the specific error to the console *before* setting the generic message
        console.error("Error loading shoutout data:", error); // <<< THIS IS THE IMPORTANT LOG
        if (tiktokGrid) tiktokGrid.innerHTML = '<p class="error">Error loading TikTok creators.</p>';
        if (instagramGrid) instagramGrid.innerHTML = '<p class="error">Error loading Instagram creators.</p>';
        if (youtubeGrid) youtubeGrid.innerHTML = '<p class="error">Error loading YouTube creators.</p>';
        if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Last Updated: Error';
        if (instagramTimestampEl) instagramTimestampEl.textContent = 'Last Updated: Error';
        if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Last Updated: Error';
    }
}

// --- Run functions when the DOM is ready ---
document.addEventListener('DOMContentLoaded', () => {
    // Only proceed if Firebase initialized successfully
    if (firebaseAppInitialized) {
        console.log("DOM loaded, calling display functions.");
        loadAndDisplayShoutouts(); // Load shoutouts
        displayProfileData();    // Load profile data
    } else {
        console.error("DOM loaded, but Firebase initialization failed earlier. Cannot load data.");
    }
});
