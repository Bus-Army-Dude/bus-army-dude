// displayShoutouts.js (Corrected with Maintenance Wrapper, Useful Links, Social Links + Icons)

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
async function displayProfileData() {
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
    // Reference declared globally, assigned in DOMContentLoaded
    if (!firebaseAppInitialized || !db) {
        console.error("Useful Links load error: Firebase not ready.");
        if(usefulLinksContainerElement) usefulLinksContainerElement.innerHTML = '<p class="error" style="color: red;">Error loading links.</p>';
        return;
    }
    if (!usefulLinksContainerElement) {
        console.warn("Useful links container element not found.");
        return;
    }

    usefulLinksContainerElement.innerHTML = '<p>Loading links...</p>'; // Show loading state

    try {
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
    // References declared globally, assigned in DOMContentLoaded
    if (!firebaseAppInitialized || !db) {
        console.error("Social Links load error: Firebase not ready.");
        if (socialLinksContainerElement) socialLinksContainerElement.innerHTML = '<p class="error" style="color: red;">Error loading social links.</p>';
        return;
    }
    if (!socialLinksContainerElement) {
        console.warn("Social links container element not found.");
        return;
    }

    socialLinksContainerElement.innerHTML = '<p>Loading social links...</p>'; // Show loading state

    try {
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
                    // Text content will be added in a span below
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

// Function to Load and Display President Data on Homepage
async function displayPresidentData() {
    // Find the placeholder element in index.html
    const placeholderElement = document.getElementById('president-placeholder');
    if (!placeholderElement) {
        console.warn("President placeholder element (#president-placeholder) not found on homepage.");
        return; // Exit if placeholder doesn't exist
    }

    // Check Firebase status first
    // Use presidentDocRef which was defined and assigned earlier
    if (!firebaseAppInitialized || !db || !presidentDocRef) {
        console.error("President display error: Firebase not ready or presidentDocRef not defined.");
        placeholderElement.innerHTML = '<p class="error" style="text-align: center; color: red;">Could not load president information (DB Init Error).</p>';
        return;
    }

    // Show a temporary loading message inside the placeholder
    placeholderElement.innerHTML = '<p style="text-align: center; padding: 20px;">Loading president info...</p>';

    try {
        const docSnap = await getDoc(presidentDocRef); // Fetch data using presidentDocRef

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Fetched president data for homepage:", data);

            // Build the HTML using fetched data and original classes
            // Use default values like 'N/A' if a field is missing in Firestore
            const presidentHTML = `
                <section id="current-president" class="president-section">
                    <h2 class="section-title">Current U.S. President</h2>
                    <div class="president-info">
                        <img src="${data.imageUrl || 'images/default-president.jpg'}" alt="President ${data.name || 'N/A'}" class="president-photo" onerror="this.src='images/default-president.jpg'; this.alt='President Photo Missing';">
                        <div class="president-details">
                            <h3 class="president-name">${data.name || 'Name Not Available'}</h3>
                            <p><strong>Born:</strong> ${data.born || 'N/A'}</p>
                            <p><strong>Height:</strong> ${data.height || 'N/A'}</p>
                            <p><strong>Party:</strong> ${data.party || 'N/A'}</p>
                            <p class="presidential-term"><strong>Term:</strong> ${data.term || 'N/A'}</p>
                            <p><strong>VP:</strong> ${data.vp || 'N/A'}</p>
                        </div>
                    </div>
                </section>`;
            placeholderElement.innerHTML = presidentHTML; // Inject the generated HTML
        } else {
            // Handle case where the document doesn't exist in Firestore
            console.warn(`President document ('${presidentDocRef.path}') not found.`);
            placeholderElement.innerHTML = '<p style="text-align: center; padding: 20px;">President information is currently unavailable.</p>';
        }
    } catch (error) {
        // Handle errors during fetching or processing
        console.error("Error fetching/displaying president data:", error);
        placeholderElement.innerHTML = '<p class="error" style="text-align: center; color: red;">Error loading president information.</p>';
    }
}

// -------------

// --- Global variable declarations for DOM elements ---
// Defined globally, assigned values inside DOMContentLoaded
let maintenanceMessageElement;
let mainContentWrapper; // <<< Wrapper for all main content
let usefulLinksContainerElement; // Container for useful links
let socialLinksContainerElement; // Container for social links

// --- Run functions when the DOM is ready ---
document.addEventListener('DOMContentLoaded', async () => { // Make listener async
    console.log("DOM loaded. Checking Firebase status and maintenance mode...");

    // *** Assign values to globally declared variables HERE ***
    // Ensure these IDs/selectors match your index.html structure
    maintenanceMessageElement = document.getElementById('maintenanceModeMessage');
    mainContentWrapper = document.querySelector('.container'); // Assuming '.container' wraps main content, adjust if needed
    usefulLinksContainerElement = document.querySelector('.useful-links-section .links-container');
    socialLinksContainerElement = document.querySelector('.social-links-container'); // Use querySelector for robustness

    // --- Corrected Initial Check ---
    // Check ONLY if Firebase initialization failed. If it failed, the refs won't be valid anyway.
    if (!firebaseAppInitialized) {
        console.error("Firebase not ready (Initialization likely failed). Site cannot load.");
        // Display error message if Firebase didn't initialize
         if (maintenanceMessageElement) {
             maintenanceMessageElement.innerHTML = '<p class="error" style="text-align: center; padding: 50px; color: red;">Site cannot load due to a connection error or initialization failure.</p>';
             maintenanceMessageElement.style.display = 'block';
         } else { // Fallback
             // Avoid replacing the entire body if possible, maybe prepend an error banner
             const errorBanner = document.createElement('div');
             errorBanner.innerHTML = '<p class="error" style="text-align: center; padding: 20px; background-color: red; color: white; font-weight: bold;">Site cannot load due to a connection error or initialization failure.</p>';
             document.body.prepend(errorBanner);
             console.error("Maintenance message element not found, prepended error banner to body.");
         }
        // Try to hide main content wrapper even if selector failed earlier
        try {
            if (!mainContentWrapper) mainContentWrapper = document.querySelector('.container'); // Try querySelector again
            if (mainContentWrapper) mainContentWrapper.style.display = 'none';
        } catch(e) { console.error("Could not hide main content wrapper on error.")}
        return; // Stop execution
    }
    // --- END Corrected Initial Check ---

    // *** Maintenance Mode Check (Now we know Firebase *is* initialized) ***
    try {
        console.log("Checking maintenance mode status...");
        // We can safely access profileDocRef now because firebaseAppInitialized is true
        // Ensure profileDocRef was successfully assigned during initialization
        if (!profileDocRef) {
             throw new Error("profileDocRef is not defined even though Firebase initialized.");
        }
        const configSnap = await getDoc(profileDocRef);
        let maintenanceEnabled = false;

        if (configSnap.exists()) {
            maintenanceEnabled = configSnap.data()?.isMaintenanceModeEnabled || false;
        } else {
            console.warn("Site config document (mainProfile) not found, assuming maintenance mode is OFF.");
        }

        console.log("Maintenance mode enabled:", maintenanceEnabled);

        if (maintenanceEnabled) {
            // --- Maintenance Mode is ON ---
            console.log("Maintenance mode is active. Hiding main content.");

            // Hide the main content wrapper
            if (mainContentWrapper) {
                mainContentWrapper.style.display = 'none';
            } else {
                console.error("Critical Error: main-content-wrapper element (e.g., .container) not found in HTML!");
            }

            // Display maintenance message
            if (maintenanceMessageElement) {
                // Ensure the message content is set (it's predefined in your index.html)
                maintenanceMessageElement.style.display = 'block'; // Show the predefined message div
            } else {
                console.error("Critical Error: maintenanceModeMessage element not found in HTML!");
                 // Fallback just in case
                 const maintDiv = document.createElement('div');
                 maintDiv.id = 'maintenanceModeMessage';
                 maintDiv.style.cssText = 'display: block; background-color: red; color: white; text-align: center; padding: 20px;';
                 maintDiv.innerHTML = '<h2>Site is currently undergoing maintenance. Please check back later.</h2>';
                 document.body.prepend(maintDiv);
            }
            // Stop further script execution for loading content
            return;

        } else {
            // --- Maintenance Mode is OFF ---
            console.log("Maintenance mode is OFF. Loading site content.");

            // Show the main content wrapper
            if (mainContentWrapper) {
                mainContentWrapper.style.display = ''; // Use default display
            } else {
                console.error("Cannot show main content: main-content-wrapper element not found!");
            }

            // Hide maintenance message area if it exists
            if (maintenanceMessageElement) maintenanceMessageElement.style.display = 'none';

            // --- Load Profile, Shoutouts, Useful Links, Social Links, AND PRESIDENT INFO ---
            // Call functions to load content
            if (typeof displayProfileData === 'function') {
                displayProfileData();
            } else { console.error("displayProfileData function missing!"); }

            if (typeof loadAndDisplayShoutouts === 'function') {
                loadAndDisplayShoutouts();
            } else { console.error("loadAndDisplayShoutouts function missing!"); }

            if (typeof loadAndDisplayUsefulLinks === 'function') {
                if(usefulLinksContainerElement) { loadAndDisplayUsefulLinks(); }
                else { console.warn("Useful links container not found, skipping load."); }
            } else { console.error("loadAndDisplayUsefulLinks function missing!"); }

            if (typeof loadAndDisplaySocialLinks === 'function') {
                if (socialLinksContainerElement) { loadAndDisplaySocialLinks(); }
                else { console.warn("Social links container not found, skipping load."); }
            } else { console.error("loadAndDisplaySocialLinks function missing!"); }

            // --- Call to display President Data ---
            if (typeof displayPresidentData === 'function') {
                 displayPresidentData(); // Call the function to load president data
            } else { console.error("displayPresidentData function missing!"); }
            // ------------------------------------

        } // End of the 'else' block for maintenance mode OFF

    } catch (error) {
        console.error("Error during DOMContentLoaded execution (Maintenance check or content load):", error);
         if (maintenanceMessageElement) {
             maintenanceMessageElement.innerHTML = `<p class="error" style="text-align: center; padding: 50px; color: red;">Error loading site configuration or content: ${error.message}</p>`;
             maintenanceMessageElement.style.display = 'block';
         } else {
             // Fallback error display
             const errorBanner = document.createElement('div');
             errorBanner.innerHTML = `<p class="error" style="text-align: center; padding: 20px; background-color: red; color: white; font-weight: bold;">Error loading site configuration or content: ${error.message}</p>`;
             document.body.prepend(errorBanner);
         }
        if (mainContentWrapper) mainContentWrapper.style.display = 'none';
    }
    // *** END: Maintenance Mode Check / Content Load Block ***

}); // End DOMContentLoaded listener
