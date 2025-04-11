// displayShoutouts.js (Handles Profile, Dynamic Social Links, Shoutouts)

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
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// Added collection, orderBy, query for dynamic social links ordering
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
    // Display error messages for sections if init fails
    const grids = document.querySelectorAll('.creator-grid, .instagram-creator-grid, .youtube-creator-grid, #social-links-container-main');
    grids.forEach(grid => { if(grid) grid.innerHTML = '<p class="error">DB Connection Error.</p>'; });
    const profileBio = document.getElementById('profile-bio-main');
    if (profileBio) profileBio.textContent = 'Error loading site data.';
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
    // Consider fixing this URL based on actual YouTube handles/channel IDs
    const channelUrl = `https://www.youtube.com/@${account.username}`;
     return `
       <div class="youtube-creator-card">
           ${account.coverPhoto ? `<img src="${account.coverPhoto}" alt="${account.nickname} Cover Photo" class="youtube-cover-photo" onerror="this.style.display='none'">` : ''}
           <img src="${account.profilePic || 'images/default-profile.jpg'}" alt="@${account.username}" class="youtube-creator-pic" onerror="this.src='images/default-profile.jpg'">
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
// === Profile Section Display Logic ===
// ======================================================
const profileUsernameElement = document.getElementById('profile-username-main');
const profilePicElement = document.getElementById('profile-pic-main');
const profileBioElement = document.getElementById('profile-bio-main');
const profileStatusElement = document.getElementById('profile-status-main');
const defaultUsername = "Username"; const defaultBio = ""; const defaultProfilePic = "images/default-profile.jpg"; /* <<< UPDATE PATH! */ const defaultStatusEmoji = '❓'; const statusEmojis = { online: '🟢', away: '🟡', offline: '🔴' };
let profileDocRef;

async function displayProfileData() {
    if (!firebaseAppInitialized || !db) { console.error("Profile Fetch Error: Firebase not ready."); return; }
    if (!profileUsernameElement && !profilePicElement && !profileBioElement && !profileStatusElement) { console.warn("Profile elements not found."); return; } // Exit if no profile elements found
    if (!profileDocRef) profileDocRef = doc(db, "site_config", "mainProfile");

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
    } catch (error) { console.error("Error fetching/displaying profile data:", error); if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername; if (profilePicElement) profilePicElement.src = defaultProfilePic; if (profileBioElement) profileBioElement.textContent = "Error loading bio."; if (profileStatusElement) profileStatusElement.textContent = '❓'; }
}
// ======================================================
// === END Profile Section Display Logic ===
// ======================================================


// ======================================================
// === Dynamic Social Links Display Logic ===
// ======================================================
const socialLinksContainer = document.getElementById('social-links-container-main');

// --- Map Platform Names (lowercase) to Font Awesome Classes ---
// Add more platforms and their corresponding FA classes as needed
const platformIconMap = {
    'tiktok': 'fab fa-tiktok',
    'snapchat': 'fab fa-snapchat-ghost',
    'twitter': 'fab fa-x-twitter',
    'x (twitter)': 'fab fa-x-twitter',
    'x': 'fab fa-x-twitter',
    'threads': 'fab fa-threads',
    'twitch': 'fab fa-twitch',
    'facebook': 'fab fa-facebook',
    'steam': 'fab fa-steam',
    'discord': 'fab fa-discord',
    'instagram': 'fab fa-instagram',
    'amazon music': 'fab fa-amazon',
    'amazon': 'fab fa-amazon',
    'youtube': 'fab fa-youtube',
    'website': 'fas fa-globe', // Example for general website
    'link': 'fas fa-link',     // Generic fallback
    // Add other platforms you might use...
    'linkedin': 'fab fa-linkedin',
    'github': 'fab fa-github',
    'spotify': 'fab fa-spotify',
    'patreon': 'fab fa-patreon'
};
const defaultIconClass = 'fas fa-link'; // Fallback icon if name not in map

async function displaySocialLinks() {
    if (!firebaseAppInitialized || !db) { console.error("Social Links Fetch Error: Firebase not ready."); return; }
    if (!socialLinksContainer) { console.error("Social Links container '#social-links-container-main' not found."); return; }

    console.log("Fetching dynamic social links...");
    socialLinksContainer.innerHTML = '<p>Loading social links...</p>'; // Loading message

    try {
        // Reference the subcollection
        const linksColRef = collection(db, "site_config", "mainProfile", "socialLinks");
        // Query to order by the 'order' field you save in admin.js
        const linksQuery = query(linksColRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(linksQuery);

        socialLinksContainer.innerHTML = ''; // Clear loading message
        let count = 0;
        querySnapshot.forEach((doc) => {
            count++;
            const linkData = doc.data();
            const platformName = linkData.platformName;
            const url = linkData.url;

            // Only proceed if essential data exists
            if (url && platformName) {
                // Determine icon class from map, using lowercase name for matching
                const lowerPlatformName = platformName.toLowerCase();
                const iconClass = platformIconMap[lowerPlatformName] || defaultIconClass;

                // Create the link element dynamically
                const linkElement = document.createElement('a');
                linkElement.href = url;
                linkElement.className = 'social-button'; // Use your styling class from index.html
                linkElement.target = '_blank'; // Open in new tab
                linkElement.rel = 'noopener noreferrer';
                linkElement.setAttribute('aria-label', platformName); // Accessibility

                const iconElement = document.createElement('i');
                // Apply the mapped classes + your base class
                iconElement.className = `${iconClass} social-icon`;

                const spanElement = document.createElement('span');
                spanElement.textContent = platformName;

                linkElement.appendChild(iconElement);
                linkElement.appendChild(spanElement);
                socialLinksContainer.appendChild(linkElement);
            } else {
                console.warn(`Social link document ${doc.id} is missing url or platformName.`);
            }
        });

        if (count === 0) {
            socialLinksContainer.innerHTML = ''; // Keep it empty if no links
            // Optionally add a message:
            // socialLinksContainer.innerHTML = '<p>No social links available.</p>';
        }
        console.log(`Displayed ${count} social links.`);

    } catch (error) {
        console.error("Error fetching/displaying social links:", error);
        socialLinksContainer.innerHTML = '<p class="error">Error loading social links.</p>';
    }
}
// ======================================================
// === END Dynamic Social Links Display Logic ===
// ======================================================


// --- Function to Load and Display Shoutouts ---
async function loadAndDisplayShoutouts() {
    if (!firebaseAppInitialized || !db) { console.error("Shoutout load error: Firebase not ready."); /*...*/ return; }

    const tiktokGrid = document.querySelector('.creator-grid'); const instagramGrid = document.querySelector('.instagram-creator-grid'); const youtubeGrid = document.querySelector('.youtube-creator-grid');
    const tiktokTimestampEl = document.getElementById('tiktok-last-updated-timestamp'); const instagramTimestampEl = document.getElementById('lastUpdatedInstagram'); const youtubeTimestampEl = document.getElementById('lastUpdatedYouTube');

    if (tiktokGrid) tiktokGrid.innerHTML = '<p>Loading TikTok...</p>'; if (instagramGrid) instagramGrid.innerHTML = '<p>Loading Instagram...</p>'; if (youtubeGrid) youtubeGrid.innerHTML = '<p>Loading YouTube...</p>';

    try {
        // 1. Fetch Shoutout Data (Using LOCAL SORT as index workaround)
        const shoutoutsCol = collection(db, 'shoutouts');
        console.log("Fetching shoutouts (NO Firestore ordering)...");
        const querySnapshot = await getDocs(shoutoutsCol); // Fetch without orderBy
        console.log(`Found ${querySnapshot.size} shoutout documents to sort locally.`);

        const shoutouts = { tiktok: [], instagram: [], youtube: [] };
        querySnapshot.forEach((doc) => { const data = doc.data(); if (data.platform && shoutouts.hasOwnProperty(data.platform)) { shoutouts[data.platform].push({ id: doc.id, ...data }); } else { console.warn(`Doc ${doc.id} missing/unknown platform: ${data.platform}`); } });

        // Sort locally AFTER fetching
        for (const platform in shoutouts) {
             shoutouts[platform].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
        }
        console.log("Sorted shoutouts locally.");

        // 2. Fetch Metadata (Using 'siteConfig' based on your working version)
        const metaRef = doc(db, 'siteConfig', 'shoutoutsMetadata'); // VERIFY THIS PATH!
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
        console.error("Error loading shoutout data:", error); // <<< CHECK THIS ERROR IN CONSOLE
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
    if (firebaseAppInitialized) { // Check flag
        console.log("DOM loaded, Firebase ready, calling display functions.");
        displayProfileData();       // Load profile data
        displaySocialLinks();     // <<< Load dynamic social links
        loadAndDisplayShoutouts(); // Load shoutouts
    } else {
        console.error("DOM loaded, but Firebase initialization failed earlier. Cannot load data.");
    }
});
