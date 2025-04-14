// displayShoutouts.js (Corrected with Useful Links + Social Links + Icons)

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
// Import needed Firestore functions: getFirestore, collection, getDocs, doc, getDoc, Timestamp, orderBy, query
import { getFirestore, collection, getDocs, doc, getDoc, Timestamp, orderBy, query } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// --- Initialize Firebase ---
let db;
let firebaseAppInitialized = false; // Flag to track initialization status
let profileDocRef; // Reference to the main profile/config document
let usefulLinksCollectionRef; // Reference for Useful Links
let socialLinksCollectionRef; // Reference for Social Links

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Assuming maintenance flag is stored with profile data
    profileDocRef = doc(db, "site_config", "mainProfile");
    usefulLinksCollectionRef = collection(db, "useful_links"); // Define Useful Links ref
    socialLinksCollectionRef = collection(db, "social_links"); // Define Social Links ref
    firebaseAppInitialized = true; // Set flag on successful initialization
    console.log("Firebase initialized for display.");
} catch (error) {
    console.error("Firebase initialization failed on index.html:", error);
    // Attempt to display a generic error on the page if Firebase fails
    const body = document.body;
    if (body) {
        body.innerHTML = '<p class="error" style="text-align: center; padding: 50px; color: red;">Could not connect to database services. Site unavailable.</p>';
    }
    // Set flag to false to prevent further execution
    firebaseAppInitialized = false;
}

// --- Helper Function to Format Timestamps ---
function formatFirestoreTimestamp(firestoreTimestamp) {
    if (!firestoreTimestamp || !(firestoreTimestamp instanceof Timestamp)) {
        return 'N/A';
    }
    try {
        const date = firestoreTimestamp.toDate();
        // Format date nicely
        return date.toLocaleString('en-US', { // Use appropriate locale
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    } catch (error) {
        console.error("Error formatting timestamp:", error);
        return 'Invalid Date';
    }
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
    // Use standard YouTube URL format (handle might be preferred over username)
    let safeUsername = account.username || '';
    let youtubeHandle = safeUsername.startsWith('@') ? safeUsername : `@${safeUsername}`;
    const channelUrl = account.username ? `https://youtube.com/$${encodeURIComponent(youtubeHandle)}` : '#'; // Link to # if no username/handle

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

// ======================================================
// === Profile Section Display Logic (Reads data) ===
// ======================================================
const profileUsernameElement = document.getElementById('profile-username-main');
const profilePicElement = document.getElementById('profile-pic-main');
const profileBioElement = document.getElementById('profile-bio-main');
const profileStatusElement = document.getElementById('profile-status-main');

// Define default values for profile elements
const defaultUsername = "Username";
const defaultBio = ""; // Default to empty bio
const defaultProfilePic = "images/default-profile.jpg"; // Make sure this path is correct
const defaultStatusEmoji = '❓'; // Question mark if status is unknown
// Define mapping for status values to emojis
const statusEmojis = {
    online: '🟢',
    idle: '🟡',
    offline: '⚪️',
    dnd: '🔴'
};

// Fetches profile data from Firestore and updates the corresponding HTML elements
async function displayProfileData() {
    if (!profileUsernameElement || !profilePicElement || !profileBioElement || !profileStatusElement) {
        console.warn("Profile display warning: One or more HTML elements missing.");
    }
    if (!firebaseAppInitialized || !db || !profileDocRef) {
        console.error("Profile Fetch Error: Firebase not ready. Cannot display profile.");
        if(profileBioElement) profileBioElement.textContent = "Error loading profile data.";
        if (profileUsernameElement) profileUsernameElement.textContent = defaultUsername;
        if (profilePicElement) profilePicElement.src = defaultProfilePic;
        if (profileStatusElement) profileStatusElement.textContent = defaultStatusEmoji;
        return;
    }

    console.log("Fetching profile data for homepage display from:", profileDocRef.path);
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
            console.log("Public profile section updated.");

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
        // Get grid elements safely
        const tGrid=document.querySelector('.creator-grid'); // Use querySelector for robustness
        const iGrid=document.querySelector('.instagram-creator-grid');
        const yGrid=document.querySelector('.youtube-creator-grid');
        if(tGrid)tGrid.innerHTML = '<p class="error" style="color: red;">Error: DB connection failed.</p>';
        if(iGrid)iGrid.innerHTML = '<p class="error" style="color: red;">Error: DB connection failed.</p>';
        if(yGrid)yGrid.innerHTML = '<p class="error" style="color: red;">Error: DB connection failed.</p>';
        return;
    }

    const tiktokGrid = document.querySelector('.creator-grid');
    const instagramGrid = document.querySelector('.instagram-creator-grid');
    const youtubeGrid = document.querySelector('.youtube-creator-grid');
    const tiktokTimestampEl = document.getElementById('tiktok-last-updated-timestamp');
    const instagramTimestampEl = document.getElementById('instagram-last-updated-timestamp');
    const youtubeTimestampEl = document.getElementById('youtube-last-updated-timestamp');

    if (tiktokGrid) tiktokGrid.innerHTML = '<p>Loading TikTok Creators...</p>';
    if (instagramGrid) instagramGrid.innerHTML = '<p>Loading Instagram Creators...</p>';
    if (youtubeGrid) youtubeGrid.innerHTML = '<p>Loading YouTube Creators...</p>';
    if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Last Updated: Loading...';
    if (instagramTimestampEl) instagramTimestampEl.textContent = 'Last Updated: Loading...';
    if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Last Updated: Loading...';

    try {
        const shoutoutsCol = collection(db, 'shoutouts');
        const shoutoutQuery = query(shoutoutsCol, orderBy("order", "asc"));
        console.log("Fetching shoutouts ordered by 'order'...");
        const querySnapshot = await getDocs(shoutoutQuery);
        console.log(`Found ${querySnapshot.size} total shoutout documents.`);

        const shoutouts = { tiktok: [], instagram: [], youtube: [] };

        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            // Later: if (data.isEnabled === false) return; // Add this check later if needed
            if (data.platform && shoutouts.hasOwnProperty(data.platform)) {
                 const accountData = {
                    id: docSnapshot.id,
                    username: data.username || null,
                    nickname: data.nickname || null,
                    profilePic: data.profilePic || null,
                    bio: data.bio || '',
                    followers: data.followers || 'N/A',
                    subscribers: data.subscribers || 'N/A',
                    isVerified: data.isVerified || false,
                    coverPhoto: data.coverPhoto || null,
                    platform: data.platform,
                    order: data.order !== undefined ? data.order : Infinity,
                 };
                shoutouts[data.platform].push(accountData);
            } else {
                console.warn(`Doc ${docSnapshot.id} missing/unknown platform: ${data.platform}`);
            }
        });

        // Fetch metadata for timestamps
        const metaRef = doc(db, 'siteConfig', 'shoutoutsMetadata');
        console.log("Attempting to fetch metadata from:", metaRef.path);
        const metaSnap = await getDoc(metaRef);
        const metadata = metaSnap.exists() ? metaSnap.data() : {};
        console.log("Metadata fetched:", metadata);

        // Render TikTok
        if (tiktokGrid) {
            if (shoutouts.tiktok.length > 0) {
                tiktokGrid.innerHTML = shoutouts.tiktok.map(renderTikTokCard).join('');
            } else {
                tiktokGrid.innerHTML = '<p>No TikTok creators featured currently.</p>';
            }
             if (tiktokTimestampEl) {
                tiktokTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_tiktok)}`;
             }
        } else { console.warn("TikTok grid element not found."); }

        // Render Instagram
        if (instagramGrid) {
            if (shoutouts.instagram.length > 0) {
                instagramGrid.innerHTML = shoutouts.instagram.map(renderInstagramCard).join('');
            } else {
                instagramGrid.innerHTML = '<p>No Instagram creators featured currently.</p>';
            }
             if (instagramTimestampEl) {
                 instagramTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_instagram)}`;
             }
        } else { console.warn("Instagram grid element not found."); }

        // Render YouTube
        if (youtubeGrid) {
            if (shoutouts.youtube.length > 0) {
                youtubeGrid.innerHTML = shoutouts.youtube.map(renderYouTubeCard).join('');
            } else {
                youtubeGrid.innerHTML = '<p>No YouTube creators featured currently.</p>';
            }
             if (youtubeTimestampEl) {
                youtubeTimestampEl.textContent = `Last Updated: ${formatFirestoreTimestamp(metadata.lastUpdatedTime_youtube)}`;
             }
        } else { console.warn("YouTube grid element not found."); }

         console.log("Shoutout sections updated based on fetched data.");

    } catch (error) {
        console.error("Error loading or processing shoutout data:", error);
        if (tiktokGrid) tiktokGrid.innerHTML = '<p class="error" style="color: red;">Error loading TikTok creators.</p>';
        if (instagramGrid) instagramGrid.innerHTML = '<p class="error" style="color: red;">Error loading Instagram creators.</p>';
        if (youtubeGrid) youtubeGrid.innerHTML = '<p class="error" style="color: red;">Error loading YouTube creators.</p>';
        if (tiktokTimestampEl) tiktokTimestampEl.textContent = 'Last Updated: Error';
        if (instagramTimestampEl) instagramTimestampEl.textContent = 'Last Updated: Error';
        if (youtubeTimestampEl) youtubeTimestampEl.textContent = 'Last Updated: Error';
    }
}

// *** Function to Load and Display Useful Links on the Homepage ***
async function loadAndDisplayUsefulLinks() {
    // Check Firebase status first
    if (!firebaseAppInitialized || !db) {
        console.error("Useful Links load error: Firebase not ready.");
        if(usefulLinksContainerElement) usefulLinksContainerElement.innerHTML = '<p class="error" style="color: red;">Error loading links.</p>';
        return;
    }

    // Ensure the container element exists (it's assigned in DOMContentLoaded)
    if (!usefulLinksContainerElement) {
        console.warn("Useful links container element not found on homepage (was null in loadAndDisplayUsefulLinks).");
        return;
    }

    usefulLinksContainerElement.innerHTML = '<p>Loading links...</p>'; // Show loading state

    try {
        // Use the collection reference defined at the top
        const linkQuery = query(usefulLinksCollectionRef, orderBy("order", "asc")); // Order by 'order'
        const querySnapshot = await getDocs(linkQuery);

        usefulLinksContainerElement.innerHTML = ''; // Clear loading message

        if (querySnapshot.empty) {
            usefulLinksContainerElement.innerHTML = '<p>No useful links available right now.</p>';
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.label && data.url) {
                    const linkElement = document.createElement('a');
                    linkElement.href = data.url;
                    linkElement.textContent = data.label;
                    linkElement.target = '_blank'; // Open in new tab
                    linkElement.rel = 'noopener noreferrer'; // Security best practice
                    linkElement.className = 'link-button'; // Use a suitable class for styling

                    usefulLinksContainerElement.appendChild(linkElement);
                } else {
                    console.warn("Skipping useful link due to missing label or URL:", doc.id, data);
                }
            });
        }
        console.log(`Displayed ${querySnapshot.size} useful links.`);

    } catch (error) {
        console.error("Error loading or displaying useful links:", error);
        usefulLinksContainerElement.innerHTML = '<p class="error" style="color: red;">Could not load useful links.</p>';
    }
}

// --- Function to Load and Display Social Links on the Homepage ---
async function loadAndDisplaySocialLinks() {
    // Check Firebase status first
    if (!firebaseAppInitialized || !db) {
        console.error("Social Links load error: Firebase not ready.");
        if (socialLinksContainerElement) socialLinksContainerElement.innerHTML = '<p class="error" style="color: red;">Error loading social links.</p>';
        return;
    }

    // Ensure the container element exists (assigned in DOMContentLoaded)
    if (!socialLinksContainerElement) {
        console.warn("Social links container element not found on homepage. Make sure an element with ID 'social-links-container' exists.");
        return;
    }

    socialLinksContainerElement.innerHTML = '<p>Loading social links...</p>'; // Show loading state

    try {
        // Use the collection reference defined at the top
        const linkQuery = query(socialLinksCollectionRef, orderBy("order", "asc")); // Order by 'order'
        const querySnapshot = await getDocs(linkQuery);

        socialLinksContainerElement.innerHTML = ''; // Clear loading message

        if (querySnapshot.empty) {
            socialLinksContainerElement.innerHTML = '<p>No social links available right now.</p>';
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.label && data.url) {
                    const linkElement = document.createElement('a');
                    linkElement.href = data.url;
                    // linkElement.textContent = data.label; // Text is added in a span below
                    linkElement.target = '_blank';
                    linkElement.rel = 'noopener noreferrer';
                    linkElement.className = 'social-button'; // Use the class from your CSS

                    // --- Add Icon ---
                    if (data.iconClass) { // Check if iconClass exists in Firestore data
                        const iconElement = document.createElement('i');
                        iconElement.className = data.iconClass; // Use the class from Firestore
                        // Add the 'social-icon' class from your CSS for specific icon styling:
                        iconElement.classList.add('social-icon');
                        linkElement.appendChild(iconElement); // Add the icon first
                    }
                    // --- End Add Icon ---

                    // --- Add Text Label in a Span ---
                    const textElement = document.createElement('span');
                    textElement.textContent = data.label;
                    linkElement.appendChild(textElement); // Add the text after the icon
                    // --- End Add Text Label ---

                    socialLinksContainerElement.appendChild(linkElement);
                } else {
                    console.warn("Skipping social link due to missing label or URL:", doc.id, data);
                }
            });
        }
        console.log(`Displayed ${querySnapshot.size} social links.`);

    } catch (error) {
        console.error("Error loading or displaying social links:", error);
        socialLinksContainerElement.innerHTML = '<p class="error" style="color: red;">Could not load social links.</p>';
    }
}


// --- Global variable declarations for DOM elements ---
// These will be assigned values inside DOMContentLoaded
let profileSectionElement;
let shoutoutsSectionElement; // This might represent multiple sections now
let maintenanceMessageElement;
let usefulLinksContainerElement; // Declaration for the useful links container
let socialLinksContainerElement; // Declaration for the social links container

// --- Run functions when the DOM is ready ---
document.addEventListener('DOMContentLoaded', async () => { // Make listener async
    console.log("DOM loaded. Checking Firebase status and maintenance mode...");

    // *** Assign values to globally declared variables HERE, right after DOM is loaded ***
    // Adjust IDs/Selectors if needed based on your index (3).html structure
    profileSectionElement = document.querySelector('.profile-section'); // Example selector
    // Find all shoutout sections if needed, or the main container
    shoutoutsSectionElement = document.querySelector('.shoutouts-section'); // Example selector for the first one
    maintenanceMessageElement = document.getElementById('maintenanceModeMessage'); // Use the correct ID from index(3).html
    usefulLinksContainerElement = document.querySelector('.useful-links-section .links-container'); // Select existing container
    // >>> IMPORTANT: Assign the element for social links. Create this element in index(3).html first! <<<
    socialLinksContainerElement = document.getElementById('social-links-container'); // <<< ASSUMED ID - Add this div to index(3).html

    // Check Firebase initialization status first
    if (!firebaseAppInitialized || !db || !profileDocRef) {
        console.error("Firebase not ready. Site cannot load.");
        // Display error message if Firebase didn't initialize
         if (maintenanceMessageElement) {
             maintenanceMessageElement.innerHTML = '<p class="error" style="text-align: center; padding: 50px; color: red;">Site cannot load due to a connection error.</p>';
             maintenanceMessageElement.style.display = 'block';
         } else { // Fallback
             document.body.innerHTML = '<p class="error" style="text-align: center; padding: 50px; color: red;">Site cannot load due to a connection error.</p>';
         }
         // Hide main content areas if they exist
        if (profileSectionElement) profileSectionElement.style.display = 'none';
        // Hide all shoutout sections
        document.querySelectorAll('.shoutouts-section').forEach(el => el.style.display = 'none');
        // Hide useful links section
        if (usefulLinksContainerElement && usefulLinksContainerElement.closest('.useful-links-section')) {
            usefulLinksContainerElement.closest('.useful-links-section').style.display = 'none';
        }
         // Hide social links section (assuming a parent structure)
        if (socialLinksContainerElement && socialLinksContainerElement.parentElement) { // Hide parent if it exists
             socialLinksContainerElement.parentElement.style.display = 'none';
         }
        return; // Stop execution
    }

    // *** Maintenance Mode Check ***
    try {
        console.log("Checking maintenance mode status...");
        const configSnap = await getDoc(profileDocRef);
        let maintenanceEnabled = false;

        if (configSnap.exists()) {
            maintenanceEnabled = configSnap.data()?.isMaintenanceModeEnabled || false;
        } else {
            console.warn("Site config document not found, assuming maintenance mode is OFF.");
        }

        console.log("Maintenance mode enabled:", maintenanceEnabled);

        if (maintenanceEnabled) {
            // --- Maintenance Mode is ON ---
            console.log("Maintenance mode is active. Hiding main content.");
            // Hide main content sections
            if (profileSectionElement) profileSectionElement.style.display = 'none';
            document.querySelectorAll('.shoutouts-section').forEach(el => el.style.display = 'none'); // Hide shoutouts
            if (usefulLinksContainerElement && usefulLinksContainerElement.closest('.useful-links-section')) { // Hide useful links
                 usefulLinksContainerElement.closest('.useful-links-section').style.display = 'none';
            }
            if (socialLinksContainerElement && socialLinksContainerElement.parentElement) { // Hide social links parent
                  socialLinksContainerElement.parentElement.style.display = 'none';
            }
             // Hide other sections as needed (e.g., President, Countdown, FAQ etc.) based on their IDs/Classes

            // Display maintenance message
            if (maintenanceMessageElement) {
                // The message content is already in index(3).html, just need to show it
                maintenanceMessageElement.style.display = 'block';
            } else { // Fallback if the element wasn't found
                 const maintDiv = document.createElement('div');
                 maintDiv.id = 'maintenanceModeMessage'; // Assign the ID for consistency
                 maintDiv.style.cssText = 'display: block; background-color: red; color: white; text-align: center; padding: 20px;'; // Basic styling
                 maintDiv.innerHTML = '<h2>Site is currently undergoing maintenance. Please check back later.</h2>'; // Simple message
                 document.body.prepend(maintDiv); // Add to top
            }
            return; // Stop execution

        } else {
            // --- Maintenance Mode is OFF ---
            console.log("Maintenance mode is OFF. Loading site content.");
            // Ensure main content areas are visible (adjust selectors as needed)
             if (profileSectionElement) profileSectionElement.style.display = ''; // Use default display
             document.querySelectorAll('.shoutouts-section').forEach(el => el.style.display = ''); // Show shoutouts
             if (usefulLinksContainerElement && usefulLinksContainerElement.closest('.useful-links-section')) { // Show useful links
                 usefulLinksContainerElement.closest('.useful-links-section').style.display = '';
             }
             if (socialLinksContainerElement && socialLinksContainerElement.parentElement) { // Show social links parent
                  socialLinksContainerElement.parentElement.style.display = '';
             }
              // Show other sections if they were hidden

            // Hide maintenance message area if it exists
             if (maintenanceMessageElement) maintenanceMessageElement.style.display = 'none';

            // --- Load Profile, Shoutouts, Useful Links, AND Social Links ---
            if (typeof displayProfileData === 'function') {
                displayProfileData();
            } else { console.error("displayProfileData function missing!"); }

            if (typeof loadAndDisplayShoutouts === 'function') {
                loadAndDisplayShoutouts();
            } else { console.error("loadAndDisplayShoutouts function missing!"); }

            if (typeof loadAndDisplayUsefulLinks === 'function') {
                 loadAndDisplayUsefulLinks();
            } else { console.error("loadAndDisplayUsefulLinks function missing!"); }

            // *** Call the new function to load social links ***
            if (typeof loadAndDisplaySocialLinks === 'function') {
                 loadAndDisplaySocialLinks();
            } else { console.error("loadAndDisplaySocialLinks function missing!"); }

        } // End of the 'else' block for maintenance mode OFF

    } catch (error) {
        console.error("Error checking maintenance mode or loading site content:", error);
        // Display a generic error message if the config check fails
         if (maintenanceMessageElement) {
             maintenanceMessageElement.innerHTML = '<p class="error" style="text-align: center; padding: 50px; color: red;">Error loading site configuration. Please try again later.</p>';
             maintenanceMessageElement.style.display = 'block';
         } else {
             document.body.innerHTML = '<p class="error" style="text-align: center; padding: 50px; color: red;">Error loading site configuration. Please try again later.</p>';
         }
        // Hide main content areas on error
        if (profileSectionElement) profileSectionElement.style.display = 'none';
        document.querySelectorAll('.shoutouts-section').forEach(el => el.style.display = 'none'); // Hide shoutouts
        if (usefulLinksContainerElement && usefulLinksContainerElement.closest('.useful-links-section')) { // Hide useful links
            usefulLinksContainerElement.closest('.useful-links-section').style.display = 'none';
        }
        if (socialLinksContainerElement && socialLinksContainerElement.parentElement) { // Hide social links parent
             socialLinksContainerElement.parentElement.style.display = 'none';
         }
    }
    // *** END: Maintenance Mode Check ***

}); // End DOMContentLoaded listener
