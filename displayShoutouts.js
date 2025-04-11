// displayShoutouts.js (Includes Profile Display Logic - Reads data)

// Use the same Firebase config as in admin.js
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
let firebaseAppInitialized = false; // Flag to track initialization status

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    firebaseAppInitialized = true; // Set flag on successful initialization
    console.log("Firebase initialized for display.");
} catch (error) {
    console.error("Firebase initialization failed on index.html:", error);
    // Display error messages for both sections if init fails
    const grids = document.querySelectorAll('.creator-grid, .instagram-creator-grid, .youtube-creator-grid');
    grids.forEach(grid => { if(grid) grid.innerHTML = '<p class="error">DB Connection Error.</p>'; });
    const profileBio = document.getElementById('profile-bio-main');
    if (profileBio) profileBio.textContent = 'Error loading site data.';
    // Set other profile defaults on error
    const profileUsernameElement = document.getElementById('profile-username-main');
    const profilePicElement = document.getElementById('profile-pic-main');
    const profileStatusElement = document.getElementById('profile-status-main');
    if (profileUsernameElement) profileUsernameElement.textContent = "Username";
    if (profilePicElement) profilePicElement.src = "path/to/default-profile.jpg"; // Use default path
    if (profileStatusElement) profileStatusElement.textContent = '❓';
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
function renderTikTokCard(account) {
 return `
      <div class="creator-card">
          <img src="${account.profilePic || 'images/default-profile.jpg'}" alt="@${account.username}" class="creator-pic" onerror="this.src='images/default-profile.jpg'">
          <div class="creator-info">
              <div class="creator-header"><h3>${account.nickname || 'N/A'} ${account.isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''}</h3></div>
              <p class="creator-username">@${account.username || 'N/A'}</p>
              <p class="creator-bio">${account.bio || ''}</p>
              <p class="follower-count">${account.followers || 'N/A'} Followers</p>
              <a href="https://tiktok.com/@${account.username}" target="_blank" rel="noopener noreferrer" class="visit-profile"> Visit Profile </a>
          </div>
      </div>`;
}
function renderInstagramCard(account) {
 return `
      <div class="instagram-creator-card">
          <img src="${account.profilePic || 'images/default-profile.jpg'}" alt="${account.nickname}" class="instagram-creator-pic" onerror="this.src='images/default-profile.jpg'">
          <div class="instagram-creator-info">
              <div class="instagram-creator-header"><h3>${account.nickname || 'N/A'} ${account.isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''}</h3></div>
              <p class="instagram-creator-username">@${account.username || 'N/A'}</p>
              <p class="instagram-creator-bio">${account.bio || ''}</p>
              <p class="instagram-follower-count">${account.followers || 'N/A'} Followers</p>
              <a href="https://instagram.com/${account.username}" target="_blank" rel="noopener noreferrer" class="instagram-visit-profile"> Visit Profile </a>
          </div>
      </div>`;
}
function renderYouTubeCard(account) {
    // Ensure the username exists before creating the URL
    const channelUrl = account.username ? `https://www.youtube.com/@${account.username}` : '#'; // Link to # if no username
    return `
        <div class="youtube-creator-card">
            ${account.coverPhoto ? `<img src="${account.coverPhoto}" alt="${account.nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''}
            <img src="${account.profilePic || 'images/default-profile.jpg'}" alt="@${account.username || 'N/A'}" class="youtube-creator-pic" onerror="this.src='images/default-profile.jpg'">
            <div class="youtube-creator-info">
                <div class="youtube-creator-header"><h3>${account.nickname || 'N/A'} ${account.isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : ''}</h3></div>
                <div class="username-container"><p class="youtube-creator-username">@${account.username || 'N/A'}</p></div>
                <p class="youtube-creator-bio">${account.bio || ''}</p>
                <p class="youtube-subscriber-count">${account.subscribers || 'N/A'} Subscribers</p>
                <a href="${channelUrl}" target="_blank" rel="noopener noreferrer" class="youtube-visit-profile"> Visit Channel </a>
            </div>
        </div>`;
}


// ======================================================
// === Profile Section Display Logic (Reads data) ===
// ======================================================

const profileUsernameElement = document.getElementById('profile-username-main');
const profilePicElement = document.getElementById('profile-pic-main');
const profileBioElement = document.getElementById('profile-bio-main');
const profileStatusElement = document.getElementById('profile-status-main');

const defaultUsername = "Username";
const defaultBio = "";
const defaultProfilePic = "images/default-profile.jpg"; // <<< --- MAKE SURE THIS PATH IS CORRECT
const defaultStatusEmoji = '❓';
const statusEmojis = { online: '🟢', away: '🟡', offline: '🔴' };

// Profile Firestore Reference (Assumes db is initialized)
let profileDocRef;
if (db) { // Only define if db was successfully initialized
    profileDocRef = doc(db, "site_config", "mainProfile");
}

async function displayProfileData() {
    if (!profileUsernameElement || !profilePicElement || !profileBioElement || !profileStatusElement) {
        console.warn("Profile display warning: One or more HTML elements missing. Check IDs in index.html.");
    }
    if (!db || !firebaseAppInitialized || !profileDocRef) { // Check flag, db instance, and ref
        console.error("Profile Fetch Error: Firebase not ready or profileDocRef not defined.");
        if(profileBioElement) profileBioElement.textContent = "Error loading profile (DB Init).";
         // Set defaults if firebase isn't ready
        if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername;
        if (profilePicElement) profilePicElement.src = defaultProfilePic;
        if (profileBioElement) profileBioElement.textContent = defaultBio; // Clear potential error message
        if (profileStatusElement) profileStatusElement.textContent = statusEmojis['offline'];
        return; // Don't try to fetch if DB isn't ready
    }

    console.log("Fetching profile data for homepage from:", profileDocRef.path);
    try {
        const docSnap = await getDoc(profileDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Profile data found:", data);

            if (profileUsernameElement) profileUsernameElement.textContent = data.username || defaultUsername;
            if (profilePicElement) profilePicElement.src = data.profilePicUrl || defaultProfilePic;
            if (profileBioElement) profileBioElement.textContent = data.bio || defaultBio;
            if (profileStatusElement) {
                const statusKey = data.status || 'offline';
                profileStatusElement.textContent = statusEmojis[statusKey] || defaultStatusEmoji;
            }
            console.log("Profile section updated.");

        } else {
            console.warn(`Profile document ('${profileDocRef.path}') not found. Displaying defaults.`);
            if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername;
            if (profilePicElement) profilePicElement.src = defaultProfilePic;
            if (profileBioElement) profileBioElement.textContent = defaultBio;
            if (profileStatusElement) profileStatusElement.textContent = statusEmojis['offline'];
        }
    } catch (error) {
          console.error("Error fetching/displaying profile data:", error);
         if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername;
         if (profilePicElement) profilePicElement.src = defaultProfilePic;
         if (profileBioElement) profileBioElement.textContent = "Error loading bio.";
         if (profileStatusElement) profileStatusElement.textContent = '❓';
    }
}
// ======================================================
// === END: Profile Section Display Logic ===
// ======================================================


// --- Function to Load and Display Shoutouts (Reads data) ---
async function loadAndDisplayShoutouts() {
    if (!firebaseAppInitialized || !db) {
        console.error("Shoutout load error: Firebase not ready.");
        const tGrid=document.querySelector('.creator-grid'), iGrid=document.querySelector('.instagram-creator-grid'), yGrid=document.querySelector('.youtube-creator-grid');
        if(tGrid)tGrid.innerHTML = '<p class="error">Error: DB connection failed.</p>'; if(iGrid)iGrid.innerHTML = '<p class="error">Error: DB connection failed.</p>'; if(yGrid)yGrid.innerHTML = '<p class="error">Error: DB connection failed.</p>';
        return;
    }

    const tiktokGrid = document.querySelector('.creator-grid'); const instagramGrid = document.querySelector('.instagram-creator-grid'); const youtubeGrid = document.querySelector('.youtube-creator-grid');
    const tiktokTimestampEl = document.getElementById('tiktok-last-updated-timestamp'); const instagramTimestampEl = document.getElementById('lastUpdatedInstagram'); const youtubeTimestampEl = document.getElementById('lastUpdatedYouTube');

    if (tiktokGrid) tiktokGrid.innerHTML = '<p>Loading TikTok...</p>'; if (instagramGrid) instagramGrid.innerHTML = '<p>Loading Instagram...</p>'; if (youtubeGrid) youtubeGrid.innerHTML = '<p>Loading YouTube...</p>';
    if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Last Updated: Loading...'; if (instagramTimestampEl) instagramTimestampEl.textContent = 'Last Updated: Loading...'; if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Last Updated: Loading...';


    try {
        // 1. Fetch Shoutout Data
        const shoutoutsCol = collection(db, 'shoutouts');
        const shoutoutQuery = query(shoutoutsCol, orderBy("order", "asc")); // Assumes 'order' field exists for sorting
        console.log("Fetching shoutouts with query...");
        const querySnapshot = await getDocs(shoutoutQuery);
        console.log(`Found ${querySnapshot.size} shoutout documents.`);

        const shoutouts = { tiktok: [], instagram: [], youtube: [] };
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.platform && shoutouts.hasOwnProperty(data.platform)) {
                 // Add null checks for potentially missing fields before pushing
                 const accountData = {
                    id: doc.id,
                    username: data.username || null,
                    nickname: data.nickname || null,
                    profilePic: data.profilePic || null,
                    bio: data.bio || '', // Default to empty string if null/undefined
                    followers: data.followers || 'N/A',
                    subscribers: data.subscribers || 'N/A', // For YouTube
                    isVerified: data.isVerified || false,
                    coverPhoto: data.coverPhoto || null, // For YouTube
                    platform: data.platform,
                    order: data.order || 0 // Default order if missing
                 };
                shoutouts[data.platform].push(accountData);
            } else {
                console.warn(`Doc ${doc.id} missing/unknown platform: ${data.platform}`);
            }
        });

        // 2. Fetch Metadata
        const metaRef = doc(db, 'siteConfig', 'shoutoutsMetadata');
        console.log("Attempting to fetch metadata from:", metaRef.path);
        const metaSnap = await getDoc(metaRef);
        const metadata = metaSnap.exists() ? metaSnap.data() : {};
        console.log("Metadata fetched:", metadata);

        // 3. Render TikTok
        if (tiktokGrid) { if (shoutouts.tiktok.length > 0) { tiktokGrid.innerHTML = shoutouts.tiktok.map(renderTikTokCard).join(''); } else { tiktokGrid.innerHTML = '<p>No TikTok creators featured.</p>'; } }
        if (tiktokTimestampEl) tiktokTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_tiktok)}`;

        // 4. Render Instagram
        if (instagramGrid) { if (shoutouts.instagram.length > 0) { instagramGrid.innerHTML = shoutouts.instagram.map(renderInstagramCard).join(''); } else { instagramGrid.innerHTML = '<p>No Instagram creators featured.</p>'; } }
        if (instagramTimestampEl) instagramTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_instagram)}`;

        // 5. Render YouTube
        if (youtubeGrid) { if (shoutouts.youtube.length > 0) { youtubeGrid.innerHTML = shoutouts.youtube.map(renderYouTubeCard).join(''); } else { youtubeGrid.innerHTML = '<p>No YouTube creators featured.</p>'; } }
        if (youtubeTimestampEl) youtubeTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_youtube)}`;

         console.log("Shoutout sections updated.");

    } catch (error) {
        console.error("Error loading shoutout data:", error);
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
    console.log("DOM loaded. Checking Firebase status...");
    // We need to ensure Firebase is initialized before trying to use 'db'
    // The initialization happens above, but we check the flag here.

    // A small delay can sometimes help ensure Firebase initialization completes
    // This is a workaround, ideally Firebase promises should handle this.
    setTimeout(() => {
        if (firebaseAppInitialized) {
            console.log("Firebase ready, calling display functions.");
            displayProfileData();      // Load profile data FIRST
            loadAndDisplayShoutouts(); // Load shoutouts SECOND
        } else {
            // This case is handled by the init catch block and the checks
            // at the start of the display/load functions, but log redundancy is okay.
            console.error("DOM loaded, but Firebase initialization seems to have failed. Cannot load data.");
        }
    }, 100); // 100ms delay as a safety net, adjust if needed

});
