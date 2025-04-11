// displayShoutouts.js (Now includes Profile Display Logic)

// Use the same Firebase config as in admin.js (or import if using firebase-init.js)
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
// Make sure all needed functions are imported: initializeApp, getFirestore, collection, getDocs, doc, getDoc, Timestamp, orderBy, query
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, Timestamp, orderBy, query } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// --- Initialize Firebase ---
let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized for display.");
} catch (error) {
    console.error("Firebase initialization failed on index.html:", error);
    // Display a generic error message to the user on the page?
    const grids = document.querySelectorAll('.creator-grid, .instagram-creator-grid, .youtube-creator-grid');
    grids.forEach(grid => grid.innerHTML = '<p class="error">Could not load creator data. Failed to connect to database.</p>');
    // Also affect profile section on error?
    const profileBio = document.getElementById('profile-bio-main');
    if (profileBio) profileBio.textContent = 'Error loading site data.';
}

// --- Helper Function to Format Timestamps ---
function formatFirestoreTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) {
        return 'N/A'; // Return 'N/A' or some default if the timestamp is invalid
    }
    try {
        const date = firestoreTimestamp.toDate(); // Convert Firebase Timestamp to JS Date
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return date.toLocaleString('en-US', { // Use appropriate locale
            timeZone: userTimeZone,
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
        });
    } catch (error) {
        console.error("Error formatting timestamp:", error);
        return 'Invalid Date';
    }
}

// --- Functions to Render Shoutout Cards ---
function renderTikTokCard(account) { /* ... unchanged ... */ }
function renderInstagramCard(account) { /* ... unchanged ... */ }
function renderYouTubeCard(account) { /* ... unchanged ... */
     // NOTE: You might want to fix this URL construction later
     const channelUrl = `https://youtube.com/@${account.username}`; // More standard URL
     // ... rest of your YouTube card rendering ...
      return `
        <div class="youtube-creator-card">
            ${account.coverPhoto ? `<img src="${account.coverPhoto}" alt="${account.nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''}
            <img src="${account.profilePic || 'images/default-profile.jpg'}" alt="@${account.username}" class="youtube-creator-pic" onerror="this.src='images/default-profile.jpg'">
            <div class="youtube-creator-info">
                <div class="youtube-creator-header">
                    <h3>${account.nickname || 'N/A'} ${account.isVerified ? '<img src="youtubecheck.png" alt="Verified" class="youtube-verified-badge">' : ''}</h3>
                </div>
                 <div class="username-container">
                     <p class="youtube-creator-username">@${account.username || 'N/A'}</p>
                 </div>
                <p class="youtube-creator-bio">${account.bio || ''}</p>
                <p class="youtube-subscriber-count">${account.subscribers || 'N/A'} Subscribers</p>
                <a href="${channelUrl}" target="_blank" rel="noopener noreferrer" class="youtube-visit-profile"> Visit Channel </a>
            </div>
        </div>
     `;
 }


// ======================================================
// === ADDED START: Profile Section Display Logic ===
// ======================================================

// --- Select Profile Elements ---
const profileUsernameElement = document.getElementById('profile-username-main');
const profilePicElement = document.getElementById('profile-pic-main');
const profileBioElement = document.getElementById('profile-bio-main');
const profileStatusElement = document.getElementById('profile-status-main');

// --- Profile Defaults ---
const defaultUsername = "Username"; // Fallback text
const defaultBio = "";            // Fallback text
const defaultProfilePic = "path/to/default-profile.jpg"; // <<< --- IMPORTANT: UPDATE THIS PATH!!
const defaultStatusEmoji = '❓'; // Fallback status
const statusEmojis = { online: '🟢', away: '🟡', offline: '🔴' }; // Status map

// --- Profile Firestore Reference ---
// Uses the 'db' instance initialized above
const profileDocRef = doc(db, "site_config", "mainProfile"); // Ensure this path matches admin.js

// --- Function to Fetch and Display Profile Data ---
async function displayProfileData() {
    // Check if elements exist (helps catch typos in IDs)
    if (!profileUsernameElement || !profilePicElement || !profileBioElement || !profileStatusElement) {
        console.error("Profile display error: One or more HTML elements not found. Check IDs in index.html:",
            { user: !!profileUsernameElement, pic: !!profilePicElement, bio: !!profileBioElement, status: !!profileStatusElement }
        );
        return; // Don't proceed if elements are missing
    }
     if (!db) { // Check if db is available
        console.error("Profile display error: Firestore 'db' instance not available!");
        profileBioElement.textContent = "Error loading profile (DB Init)."; // Show error
        return;
    }

    console.log("Fetching profile data for homepage from:", profileDocRef.path);
    try {
        // Fetch the single document ONCE on page load
        const docSnap = await getDoc(profileDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Profile data found:", data);

            // Update the HTML elements with data from Firestore or defaults
            profileUsernameElement.textContent = data.username || defaultUsername;
            profilePicElement.src = data.profilePicUrl || defaultProfilePic;
            profileBioElement.textContent = data.bio || defaultBio;

            const statusKey = data.status || 'offline'; // Default to offline status
            profileStatusElement.textContent = statusEmojis[statusKey] || defaultStatusEmoji;

            console.log("Profile section updated.");

        } else {
            console.warn("Profile document ('/site_config/mainProfile') not found. Displaying defaults.");
            // Set defaults if the document doesn't exist in Firestore
            profileUsernameElement.textContent = defaultUsername;
            profilePicElement.src = defaultProfilePic;
            profileBioElement.textContent = defaultBio;
            profileStatusElement.textContent = statusEmojis['offline'];
        }
    } catch (error) {
         console.error("Error fetching/displaying profile data:", error);
         // Set defaults or error messages on error
         profileUsernameElement.textContent = defaultUsername;
         profilePicElement.src = defaultProfilePic; // Or an error image path
         profileBioElement.textContent = "Error loading bio.";
         profileStatusElement.textContent = '❓';
    }
}

// ======================================================
// === ADDED END: Profile Section Display Logic ===
// ======================================================


// --- Function to Load and Display Shoutouts ---
async function loadAndDisplayShoutouts() {
    if (!db) {
        console.error("Shoutout load error: Firestore database instance is not available.");
        // Clear loading messages if db failed
         const tiktokGrid = document.querySelector('.creator-grid');
         const instagramGrid = document.querySelector('.instagram-creator-grid');
         const youtubeGrid = document.querySelector('.youtube-creator-grid');
         if (tiktokGrid) tiktokGrid.innerHTML = '<p class="error">Error loading creators (DB Init).</p>';
         if (instagramGrid) instagramGrid.innerHTML = '<p class="error">Error loading creators (DB Init).</p>';
         if (youtubeGrid) youtubeGrid.innerHTML = '<p class="error">Error loading creators (DB Init).</p>';
        return;
    }

    // Get references to containers and timestamp elements
    const tiktokGrid = document.querySelector('.creator-grid');
    const instagramGrid = document.querySelector('.instagram-creator-grid');
    const youtubeGrid = document.querySelector('.youtube-creator-grid');
    const tiktokTimestampEl = document.getElementById('tiktok-last-updated-timestamp');
    const instagramTimestampEl = document.getElementById('lastUpdatedInstagram');
    const youtubeTimestampEl = document.getElementById('lastUpdatedYouTube');

    // Show loading state
    if (tiktokGrid) tiktokGrid.innerHTML = '<p>Loading TikTok Creators...</p>';
    if (instagramGrid) instagramGrid.innerHTML = '<p>Loading Instagram Creators...</p>';
    if (youtubeGrid) youtubeGrid.innerHTML = '<p>Loading YouTube Creators...</p>';

    try {
        // 1. Fetch Shoutout Data
        const shoutoutsCol = collection(db, 'shoutouts');
        const shoutoutQuery = query(shoutoutsCol, orderBy("order", "asc"));
        const querySnapshot = await getDocs(shoutoutQuery);

        const shoutouts = { tiktok: [], instagram: [], youtube: [] };
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.platform && shoutouts.hasOwnProperty(data.platform)) {
                shoutouts[data.platform].push({ id: doc.id, ...data });
            } else { console.warn(`Doc ${doc.id} has missing/unknown platform: ${data.platform}`); }
        });

        // 2. Fetch Metadata
        // *** UPDATED: Using site_config consistently ***
        const metaRef = doc(db, 'site_config', 'shoutoutsMetadata');
        const metaSnap = await getDoc(metaRef);
        const metadata = metaSnap.exists() ? metaSnap.data() : {};

        // 3. Render TikTok
        if (tiktokGrid) {
            // --- Optional: TikTok Region Check --- (Keep logic if needed)
             if (shoutouts.tiktok.length > 0) {
                 tiktokGrid.innerHTML = shoutouts.tiktok.map(renderTikTokCard).join('');
             } else {
                 tiktokGrid.innerHTML = '<p>No TikTok creators featured currently.</p>';
             }
        }
        if (tiktokTimestampEl) tiktokTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_tiktok)}`;

        // 4. Render Instagram
        if (instagramGrid) {
             if (shoutouts.instagram.length > 0) {
                 instagramGrid.innerHTML = shoutouts.instagram.map(renderInstagramCard).join('');
             } else {
                 instagramGrid.innerHTML = '<p>No Instagram creators featured currently.</p>';
             }
        }
        if (instagramTimestampEl) instagramTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_instagram)}`;

        // 5. Render YouTube
        if (youtubeGrid) {
             if (shoutouts.youtube.length > 0) {
                 youtubeGrid.innerHTML = shoutouts.youtube.map(renderYouTubeCard).join('');
             } else {
                 youtubeGrid.innerHTML = '<p>No YouTube creators featured currently.</p>';
             }
        }
        if (youtubeTimestampEl) youtubeTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_youtube)}`;

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
    // Ensure db is potentially ready before calling (slight delay might not be needed if init is fast)
    // A safer pattern might check db inside the functions or use promises/await if init were async exported
    if (db) {
        loadAndDisplayShoutouts(); // Load shoutouts
        displayProfileData(); // <<< --- ADDED CALL to load profile data
    } else {
        // If db wasn't ready immediately, maybe retry or rely on error messages set by init catch block
        console.error("DB not ready when DOMContentLoaded fired.");
    }
});
