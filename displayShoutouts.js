// displayShoutouts.js (Checks Maintenance Mode - SPA-friendly message display)

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
let metaDocRef; // Ref for metadata AND maintenance flag

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
    showInitializationError();
}

// --- Function to display init error ---
function showInitializationError() {
     const mainContainer = document.querySelector('.container') || document.body;
     if (mainContainer) {
        mainContainer.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #dc3545; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; margin: 30px;">
                <h2>Site Error</h2>
                <p>Could not connect to the database. Please try again later.</p>
            </div>`;
     }
}

// --- UPDATED: Function to display maintenance message (SPA-friendly) ---
function showMaintenanceMessage() {
    const bodyElement = document.body;
    if (bodyElement) {
        bodyElement.innerHTML = ''; // Clear existing content
        const maintenanceDiv = document.createElement('div');
        maintenanceDiv.id = 'maintenance-message';
        maintenanceDiv.style.position = 'fixed';
        maintenanceDiv.style.top = '0';
        maintenanceDiv.style.left = '0';
        maintenanceDiv.style.width = '100vw';
        maintenanceDiv.style.height = '100vh';
        maintenanceDiv.style.backgroundColor = 'var(--bg-color, #0D0F12)'; // Use theme variable or default
        maintenanceDiv.style.color = 'var(--text-color, #E0E5EC)';
        maintenanceDiv.style.display = 'flex';
        maintenanceDiv.style.flexDirection = 'column';
        maintenanceDiv.style.justifyContent = 'center';
        maintenanceDiv.style.alignItems = 'center';
        maintenanceDiv.style.padding = '40px';
        maintenanceDiv.style.boxSizing = 'border-box';
        maintenanceDiv.style.zIndex = '9999';
        maintenanceDiv.style.textAlign = 'center';
        maintenanceDiv.style.overflowY = 'auto';

        maintenanceDiv.innerHTML = `
            <div style="max-width: 700px;">
                <h2 style="color: #e53935; margin-bottom: 20px;">We're Performing Some Upgrades!</h2>
                <p style="line-height: 1.6;">Our website is currently undergoing scheduled maintenance to improve your experience. We’re making some big updates, so things will be smoother, faster, and even better when we're done.</p>
                <p style="line-height: 1.6;">During this time, certain features may be temporarily unavailable, and you might not be able to access all parts of the site. But don’t worry, we’re working hard to get everything back up and running as quickly as possible.</p>
                <p style="line-height: 1.6;">Please check back soon, or follow our social media pages for updates on when we’ll be live again. We appreciate your patience and can’t wait to show you what’s new!</p>
                <p style="line-height: 1.6; margin-top: 20px;"><strong>Thank you for your understanding!</strong></p>
            </div>
        `;
        bodyElement.appendChild(maintenanceDiv);
    } else {
        alert("Site is currently undergoing maintenance.");
    }
    console.log("Site is in maintenance mode. Displaying maintenance message.");
}

// --- Helper Function to Format Timestamps ---
function formatFirestoreTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) { return 'N/A'; }
    try {
        const date = firestoreTimestamp.toDate();
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return date.toLocaleString('en-US', { timeZone: userTimeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    } catch (error) { console.error("Error formatting timestamp:", error); return 'Invalid Date'; }
}

// --- Functions to Render Shoutout Cards ---
function renderTikTokCard(account) { /* ... Keep existing ... */ return `<div>...</div>`; }
function renderInstagramCard(account) { /* ... Keep existing ... */ return `<div>...</div>`; }
function renderYouTubeCard(account) { /* ... Keep existing ... */ return `<div>...</div>`; }

// --- Profile Section Display Logic (Reads data) ---
// ... (Keep existing displayProfileData function and related constants/variables) ...
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

        // Fetch Shoutout Data
        const shoutoutsCol = collection(db, 'shoutouts');
        const shoutoutQuery = query(shoutoutsCol, orderBy("order", "asc"));
        const querySnapshot = await getDocs(shoutoutQuery);

        const shoutouts = { tiktok: [], instagram: [], youtube: [] };
        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            if (data.platform && shoutouts.hasOwnProperty(data.platform)) {
                 const accountData = { /* ... construct accountData ... */ };
                shoutouts[data.platform].push(accountData);
            } else { console.warn(`Doc ${docSnapshot.id} missing/unknown platform.`); }
        });

        // Render sections & timestamps...
        if (tiktokGrid) { /* ... render tiktok ... */ }
        if (tiktokTimestampEl) { tiktokTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_tiktok)}`; }

        if (instagramGrid) { /* ... render instagram ... */ }
        if (instagramTimestampEl) { instagramTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_instagram)}`; }

        if (youtubeGrid) { /* ... render youtube ... */ }
        if (youtubeTimestampEl) { youtubeTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_youtube)}`; }

        console.log("Shoutout sections updated.");

    } catch (error) { /* ... handle shoutout load error ... */ }
}

// --- Main function to check mode and load ---
async function checkMaintenanceModeAndLoad() {
    if (!firebaseAppInitialized || !db || !metaDocRef) {
        console.error("Cannot check maintenance mode: Firebase not ready.");
        showInitializationError();
        return;
    }
    console.log("Checking maintenance mode...");
    try {
        const metaSnap = await getDoc(metaDocRef);
        const maintenanceEnabled = metaSnap.exists() && metaSnap.data().maintenanceEnabled === true;

        if (maintenanceEnabled) {
            // If maintenance mode is ON, show the full-page message
            showMaintenanceMessage();
            return; // Stop further execution
        } else {
            // If maintenance mode is OFF, load normally
            console.log("Maintenance mode OFF. Loading site content.");
            await displayProfileData();
            await loadAndDisplayShoutouts();
        }
    } catch (error) {
        console.error("Error checking maintenance mode:", error);
        console.warn("Could not verify maintenance status, proceeding with normal load.");
        await displayProfileData();
        await loadAndDisplayShoutouts();
    }
}

// --- Run functions when the DOM is ready ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded. Initializing site load sequence...");
    checkMaintenanceModeAndLoad(); // Start by checking maintenance mode
});
