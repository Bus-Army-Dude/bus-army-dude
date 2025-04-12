// displayShoutouts.js (Checks Maintenance Mode, Merged Version)

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
let firebaseAppInitialized = false;
let profileDocRef;
// Reference for Metadata Document (used for timestamps AND maintenance flag)
let metaDocRef;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Define refs after db init
    profileDocRef = doc(db, "site_config", "mainProfile"); // Path for profile
    metaDocRef = doc(db, "siteConfig", "shoutoutsMetadata"); // Path for metadata & maintenance flag
    firebaseAppInitialized = true;
    console.log("Firebase initialized for display.");
} catch (error) {
    console.error("Firebase initialization failed on index.html:", error);
    // Attempt to display a basic error even if init fails
    showInitializationError();
}

// --- Function to display init error ---
function showInitializationError() {
     const bodyElement = document.body;
     if (bodyElement) {
         // Avoid replacing entire body if possible, target a main container if exists
         const mainContainer = document.querySelector('.container') || document.body;
         mainContainer.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #dc3545; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; margin: 30px;">
                <h2>Site Error</h2>
                <p>Could not connect to the database. Please try again later.</p>
                <p><small>Error details logged to console.</small></p>
            </div>`;
     }
}

// --- Function to display maintenance message ---
function showMaintenanceMessage() {
    // Select main content containers (adjust selectors if your HTML is different)
    // Use querySelector for flexibility in case IDs change or aren't present
    const profileSection = document.querySelector('#profile-section-main, .profile-section'); // Example selectors
    const shoutoutsSection = document.querySelector('#shoutouts-section, .shoutouts-wrapper'); // Example selectors
    const mainContentArea = document.querySelector('main') || document.querySelector('.main-content') || document.body; // Target main area

    // Hide normal content sections if they exist
    if (profileSection) profileSection.style.display = 'none';
    if (shoutoutsSection) shoutoutsSection.style.display = 'none';
    // Add other sections like headers/footers if they should also be hidden:
    // const header = document.querySelector('header'); if (header) header.style.display = 'none';
    // const footer = document.querySelector('footer'); if (footer) footer.style.display = 'none';


    // Create and display maintenance message container
    const maintenanceDiv = document.createElement('div');
    maintenanceDiv.id = 'maintenance-message';
    maintenanceDiv.className = 'maintenance-container'; // For styling (ensure CSS exists)
    maintenanceDiv.innerHTML = `
        <h2>We're Performing Some Upgrades!</h2>
        <p>Our website is currently undergoing scheduled maintenance to improve your experience. We’re making some big updates, so things will be smoother, faster, and even better when we're done.</p>
        <p>During this time, certain features may be temporarily unavailable, and you might not be able to access all parts of the site. But don’t worry, we’re working hard to get everything back up and running as quickly as possible.</p>
        <p>Please check back soon, or follow our social media pages for updates on when we’ll be live again. We appreciate your patience and can’t wait to show you what’s new!</p>
        <p>Thank you for your understanding!</p>
    `;

    // Prepend to body or main container to ensure it's visible
    mainContentArea.prepend(maintenanceDiv);

    console.log("Site is in maintenance mode.");
}

// --- Helper Function to Format Timestamps ---
function formatFirestoreTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) {
        return 'N/A';
    }
    try {
        const date = firestoreTimestamp.toDate();
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return date.toLocaleString('en-US', {
            timeZone: userTimeZone, weekday: 'long', year: 'numeric',
            month: 'long', day: 'numeric', hour: 'numeric',
            minute: 'numeric', second: 'numeric', hour12: true
        });
    } catch (error) { console.error("Error formatting timestamp:", error); return 'Invalid Date'; }
}

// --- Functions to Render Shoutout Cards ---
function renderTikTokCard(account) {
 return `
      <div class="creator-card">
          <img src="${account.profilePic || 'images/default-profile.jpg'}" alt="@${account.username || 'N/A'}" class="creator-pic" onerror="this.src='images/default-profile.jpg'">
          <div class="creator-info">
              <div class="creator-header"><h3>${account.nickname || 'N/A'} ${account.isVerified ? '<img src="check.png" alt="Verified" class="verified-badge">' : ''}</h3></div>
              <p class="creator-username">@${account.username || 'N/A'}</p>
              <p class="creator-bio">${account.bio || ''}</p>
              <p class="follower-count">${account.followers || 'N/A'} Followers</p>
              <a href="https://tiktok.com/@${account.username || ''}" target="_blank" rel="noopener noreferrer" class="visit-profile"> Visit Profile </a>
          </div>
      </div>`;
}

function renderInstagramCard(account) {
 return `
      <div class="instagram-creator-card">
          <img src="${account.profilePic || 'images/default-profile.jpg'}" alt="${account.nickname || 'N/A'}" class="instagram-creator-pic" onerror="this.src='images/default-profile.jpg'">
          <div class="instagram-creator-info">
              <div class="instagram-creator-header"><h3>${account.nickname || 'N/A'} ${account.isVerified ? '<img src="instagramcheck.png" alt="Verified" class="instagram-verified-badge">' : ''}</h3></div>
              <p class="instagram-creator-username">@${account.username || 'N/A'}</p>
              <p class="instagram-creator-bio">${account.bio || ''}</p>
              <p class="instagram-follower-count">${account.followers || 'N/A'} Followers</p>
              <a href="https://instagram.com/${account.username || ''}" target="_blank" rel="noopener noreferrer" class="instagram-visit-profile"> Visit Profile </a>
          </div>
      </div>`;
}

function renderYouTubeCard(account) {
    const channelUrl = account.username ? `https://www.youtube.com/@${account.username}` : '#'; // Correct YouTube URL format
    return `
        <div class="youtube-creator-card">
            ${account.coverPhoto ? `<img src="${account.coverPhoto}" alt="${account.nickname || ''} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''}
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


// --- Profile Section Display Logic (Reads data) ---
const profileUsernameElement = document.getElementById('profile-username-main');
const profilePicElement = document.getElementById('profile-pic-main');
const profileBioElement = document.getElementById('profile-bio-main');
const profileStatusElement = document.getElementById('profile-status-main');
const defaultUsername = "Username";
const defaultBio = "";
const defaultProfilePic = "images/default-profile.jpg";
const defaultStatusEmoji = '❓';
const statusEmojis = { online: '🟢', away: '🟡', offline: '🔴' };

async function displayProfileData() {
    if (!profileUsernameElement || !profilePicElement || !profileBioElement || !profileStatusElement) { console.warn("Profile display element(s) missing."); }
    if (!firebaseAppInitialized || !db || !profileDocRef) { console.error("Profile Fetch Error: Firebase not ready."); /* Set defaults... */ return; }
    console.log("Fetching profile data for homepage from:", profileDocRef.path);
    try {
        const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) {
             const data = docSnap.data();
             if (profileUsernameElement) profileUsernameElement.textContent = data.username || defaultUsername;
             if (profilePicElement) profilePicElement.src = data.profilePicUrl || defaultProfilePic;
             if (profileBioElement) profileBioElement.textContent = data.bio || defaultBio;
             if (profileStatusElement) {
                 const statusKey = data.status || 'offline';
                 profileStatusElement.textContent = statusEmojis[statusKey] || defaultStatusEmoji;
             }
             console.log("Profile section updated.");
        } else { console.warn(`Profile document ('${profileDocRef.path}') not found.`); /* Set defaults... */ }
    } catch (error) { console.error("Error fetching/displaying profile data:", error); /* Set defaults... */ }
}

// --- Function to Load and Display Shoutouts (Reads data) ---
async function loadAndDisplayShoutouts() {
    if (!firebaseAppInitialized || !db) { console.error("Shoutout load error: Firebase not ready."); /* Show error in grids */ return; }

    const tiktokGrid = document.querySelector('.creator-grid');
    const instagramGrid = document.querySelector('.instagram-creator-grid');
    const youtubeGrid = document.querySelector('.youtube-creator-grid');
    const tiktokTimestampEl = document.getElementById('tiktok-last-updated-timestamp');
    const instagramTimestampEl = document.getElementById('lastUpdatedInstagram');
    const youtubeTimestampEl = document.getElementById('lastUpdatedYouTube');

    // Show loading state...
    if (tiktokGrid) tiktokGrid.innerHTML = '<p>Loading TikTok Creators...</p>';
    if (instagramGrid) instagramGrid.innerHTML = '<p>Loading Instagram Creators...</p>';
    if (youtubeGrid) youtubeGrid.innerHTML = '<p>Loading YouTube Creators...</p>';
    if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Last Updated: Loading...';
    if (instagramTimestampEl) instagramTimestampEl.textContent = 'Last Updated: Loading...';
    if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Last Updated: Loading...';


    try {
        // Fetch Metadata again here specifically for the timestamps
        const metaSnap = await getDoc(metaDocRef);
        const metadata = metaSnap.exists() ? metaSnap.data() : {};
        console.log("Timestamps metadata fetched for display:", metadata);

        // Fetch Shoutout Data
        const shoutoutsCol = collection(db, 'shoutouts');
        const shoutoutQuery = query(shoutoutsCol, orderBy("order", "asc"));
        console.log("Fetching shoutouts...");
        const querySnapshot = await getDocs(shoutoutQuery);
        console.log(`Found ${querySnapshot.size} shoutout documents.`);

        const shoutouts = { tiktok: [], instagram: [], youtube: [] };
        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            if (data.platform && shoutouts.hasOwnProperty(data.platform)) {
                 const accountData = {
                    id: docSnapshot.id, username: data.username || null,
                    nickname: data.nickname || null, profilePic: data.profilePic || null,
                    bio: data.bio || '', followers: data.followers || 'N/A',
                    subscribers: data.subscribers || 'N/A', isVerified: data.isVerified || false,
                    coverPhoto: data.coverPhoto || null, platform: data.platform,
                    order: data.order !== undefined ? data.order : Infinity
                 };
                shoutouts[data.platform].push(accountData);
            } else { console.warn(`Doc ${docSnapshot.id} missing/unknown platform: ${data.platform}`); }
        });

        // Render sections and update timestamps
        if (tiktokGrid) {
            if (shoutouts.tiktok.length > 0) tiktokGrid.innerHTML = shoutouts.tiktok.map(renderTikTokCard).join('');
            else tiktokGrid.innerHTML = '<p>No TikTok creators featured currently.</p>';
        }
        if (tiktokTimestampEl) tiktokTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_tiktok)}`;

        if (instagramGrid) {
            if (shoutouts.instagram.length > 0) instagramGrid.innerHTML = shoutouts.instagram.map(renderInstagramCard).join('');
            else instagramGrid.innerHTML = '<p>No Instagram creators featured currently.</p>';
        }
        if (instagramTimestampEl) instagramTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_instagram)}`;

        if (youtubeGrid) {
            if (shoutouts.youtube.length > 0) youtubeGrid.innerHTML = shoutouts.youtube.map(renderYouTubeCard).join('');
            else youtubeGrid.innerHTML = '<p>No YouTube creators featured currently.</p>';
        }
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

// --- Main function to check mode and load ---
async function checkMaintenanceModeAndLoad() {
    if (!firebaseAppInitialized || !db || !metaDocRef) {
        console.error("Cannot check maintenance mode: Firebase not ready.");
        showInitializationError(); // Show init error if check cannot proceed
        return;
    }

    console.log("Checking maintenance mode...");
    try {
        const metaSnap = await getDoc(metaDocRef);
        const maintenanceEnabled = metaSnap.exists() && metaSnap.data().maintenanceEnabled === true;

        if (maintenanceEnabled) {
            showMaintenanceMessage(); // Show maintenance message and stop
            return;
        } else {
            // Maintenance mode OFF, load normally
            console.log("Maintenance mode OFF. Loading site content.");
            // Use await here if you want profile to fully load before shoutouts start loading
            await displayProfileData();
            await loadAndDisplayShoutouts();
        }
    } catch (error) {
        console.error("Error checking maintenance mode:", error);
        // Proceed with normal load on error, assuming site is NOT in maintenance
        console.warn("Could not verify maintenance status, proceeding with normal load.");
        await displayProfileData();
        await loadAndDisplayShoutouts();
    }
}


// --- Run functions when the DOM is ready ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded. Initializing site load sequence...");
    // Call the main function that handles the maintenance check first
    checkMaintenanceModeAndLoad();
});
